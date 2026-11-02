"use client";

import { type Cast, mean, measureCast } from "./cast.ts";
import { type Lab, hexToLab } from "./color.ts";
import {
  type Flags,
  type GhostMap,
  type Offset,
  type Photo,
  type Reading,
  type Side,
  ghostMap,
  lightShift,
  markFlags,
  photoOf,
  placePatches,
  posture,
  readPair,
} from "./measure.ts";

export type Bare = { photo: Photo; flags: Flags | null; offset: Offset; tone: Lab; skin: Lab };

export const checkCheeks = (photo: Photo) => void readPair(photo, photo, "left", placePatches(photo.g, null), null);

export async function bareOf(photo: Photo, masks: string[], toneHex: string): Promise<Bare> {
  const flags = masks.length ? await markFlags(masks, photo.g) : null;
  const offset = placePatches(photo.g, flags);
  const probe = readPair(photo, photo, "left", offset, flags);
  return { photo, flags, offset, tone: hexToLab(toneHex), skin: mean([...probe.bare.treated, ...probe.bare.control]) };
}

export const LIGHT_LIMIT = 0.06;
export const TURN_LIMIT = 0.12;

export type Gate = { light: number; turn: number; reason: string | null };

export function gateOf(bare: Photo, swiped: Photo): Gate {
  const light = lightShift(bare, swiped);
  const turn = posture(swiped).yaw - posture(bare).yaw;
  const reason = !(Math.abs(light) <= LIGHT_LIMIT)
    ? "The light moved to one side since the bare photo. Face the same window and take it again."
    : Math.abs(turn) > TURN_LIMIT
      ? "Your head is turned more than in the bare photo. Look straight at the camera and take it again."
      : null;
  return { light, turn, reason };
}

export type Test = { photo: Photo; gate: Gate; reading: Reading; cast: Cast; map: GhostMap };

export function testSwipe(bare: Bare, swiped: Photo, treated: Side): Test {
  const gate = gateOf(bare.photo, swiped);
  const reading = readPair(bare.photo, swiped, treated, bare.offset, bare.flags);
  return { photo: swiped, gate, reading, cast: measureCast(reading.bare, reading.swiped), map: ghostMap(bare.photo, swiped, reading, treated) };
}

const LINEAR = Float32Array.from({ length: 256 }, (_, i) => {
  const c = i / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
});
const toByte = (v: number) => Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));

async function urlOf(width: number, height: number, data: Uint8ClampedArray<ArrayBuffer>) {
  const canvas = new OffscreenCanvas(width, height);
  canvas.getContext("2d")!.putImageData(new ImageData(data, width, height), 0, 0);
  return URL.createObjectURL(await canvas.convertToBlob({ type: "image/jpeg", quality: 0.93 }));
}

export function filmRender(photo: Photo, hex: string, coverage: number) {
  const film = [1, 3, 5].map((i) => LINEAR[parseInt(hex.slice(i, i + 2), 16)]);
  const out = new Uint8ClampedArray(photo.rgba);
  for (let i = 0; i < out.length; i += 4) {
    const o = (coverage * photo.inside[i + 3]) / 255;
    if (!o) continue;
    for (let c = 0; c < 3; c++) out[i + c] = toByte(LINEAR[out[i + c]] * (1 - o) + film[c] * o);
  }
  return urlOf(photo.g.width, photo.g.height, out);
}

export const PLANT_HEX = "#ffffff";
export const PLANT_COVERAGE = 0.06;

export type Plant = { truth: Cast; found: Test };

export async function plant(bare: Bare, render: string, treated: Side): Promise<Plant> {
  const { g, rgba } = bare.photo;
  const patch = readPair(bare.photo, bare.photo, treated, bare.offset, null).patches.bare[treated];
  const canvas = new OffscreenCanvas(g.width, g.height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const glow = ctx.createRadialGradient(patch.x, patch.y, patch.r * 1.4, patch.x, patch.y, patch.r * 2.4);
  glow.addColorStop(0, "#000");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, g.width, g.height);
  ctx.globalCompositeOperation = "source-in";
  const img = await createImageBitmap(await (await fetch(render)).blob());
  ctx.drawImage(img, 0, 0, g.width, g.height);
  img.close();
  const film = ctx.getImageData(0, 0, g.width, g.height).data;
  const GAIN = [0.93 * 1.03, 0.93, 0.93 * 0.97];
  const dimBare = new Uint8ClampedArray(rgba.length);
  const dimPlanted = new Uint8ClampedArray(rgba.length);
  for (let i = 0; i < rgba.length; i += 4) {
    const a = film[i + 3] / 255;
    for (let c = 0; c < 3; c++) {
      const skin = LINEAR[rgba[i + c]];
      dimBare[i + c] = toByte(skin * GAIN[c]);
      dimPlanted[i + c] = toByte((skin * (1 - a) + LINEAR[film[i + c]] * a) * GAIN[c]);
    }
    dimBare[i + 3] = dimPlanted[i + 3] = 255;
  }
  const [dark, lit] = await Promise.all([urlOf(g.width, g.height, dimBare).then(photoOf), urlOf(g.width, g.height, dimPlanted).then(photoOf)]);
  if (dark) URL.revokeObjectURL(dark.image);
  if (!dark || !lit) throw new Error("The planted photo lost the face. Try again.");
  const truth = readPair(dark, lit, treated, bare.offset, bare.flags);
  return { truth: measureCast(truth.bare, truth.swiped), found: testSwipe(bare, lit, treated) };
}
