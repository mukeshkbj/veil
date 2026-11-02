"use client";

import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { type Lab, rgbToLab } from "./color.ts";
import { type Sides, mean } from "./cast.ts";

let landmarker: Promise<FaceLandmarker> | null = null;

function getLandmarker() {
  landmarker ??= (async () => {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const fileset = await FilesetResolver.forVisionTasks("/mediapipe");
    return FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: "/mediapipe/face_landmarker.task" },
      runningMode: "IMAGE",
      numFaces: 1,
    });
  })();
  landmarker.catch(() => (landmarker = null));
  return landmarker;
}

export async function landmarksOf(source: HTMLCanvasElement) {
  const lm = await getLandmarker();
  return lm.detect(source).faceLandmarks[0] ?? null;
}

export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("An image did not load. Check your connection and try again."));
    img.src = src;
  });

const OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109,
];
const MIDLINE = [10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 164, 0, 17, 18, 200, 199, 175, 152];
const CHEEK = { left: [50, 101, 118, 205], right: [280, 330, 347, 425] };

type Point = { x: number; y: number };

export type Geometry = {
  width: number;
  height: number;
  oval: [number, number][];
  mid: { a: number; b: number };
  yaw: number;
  cheeks: { left: Point; right: Point };
  faceWidth: number;
  browY: number;
  points: [number, number][];
};

export async function detect(img: HTMLImageElement): Promise<Geometry | null> {
  const lm = await getLandmarker();
  const [points] = lm.detect(img).faceLandmarks;
  if (!points) return null;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const px = (p: NormalizedLandmark): [number, number] => [p.x * w, p.y * h];
  const centre = (ids: number[]) => ({
    x: ids.reduce((s, i) => s + points[i].x * w, 0) / ids.length,
    y: ids.reduce((s, i) => s + points[i].y * h, 0) / ids.length,
  });
  const [lx] = px(points[234]);
  const [rx] = px(points[454]);
  const [nx] = px(points[1]);
  return {
    width: w,
    height: h,
    oval: OVAL.map((i) => px(points[i])),
    mid: fitLine(MIDLINE.map((i) => px(points[i]))),
    yaw: (nx - (lx + rx) / 2) / ((rx - lx) / 2),
    cheeks: { left: centre(CHEEK.left), right: centre(CHEEK.right) },
    faceWidth: rx - lx,
    browY: points[9].y * h,
    points: points.map(px),
  };
}

function fitLine(pts: [number, number][]) {
  const n = pts.length;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  let num = 0;
  let den = 0;
  for (const [x, y] of pts) {
    num += (y - my) * (x - mx);
    den += (y - my) ** 2;
  }
  const a = den ? num / den : 0;
  return { a, b: mx - a * my };
}

export const midX = (g: Geometry, y: number) => g.mid.a * y + g.mid.b;

export function pixels(src: CanvasImageSource, width: number, height: number) {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height).data;
}

function ovalMask(g: Geometry) {
  const canvas = new OffscreenCanvas(g.width, g.height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.beginPath();
  g.oval.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
  return ctx.getImageData(0, 0, g.width, g.height).data;
}

export type Photo = { image: string; img: HTMLImageElement; g: Geometry; rgba: Uint8ClampedArray; inside: Uint8ClampedArray };

export async function photoOf(image: string): Promise<Photo | null> {
  const img = await loadImage(image);
  const g = await detect(img);
  if (!g) return null;
  return { image, img, g, rgba: pixels(img, g.width, g.height), inside: ovalMask(g) };
}

export function posture(p: Photo) {
  const light = { left: 0, right: 0 };
  const count = { left: 0, right: 0 };
  const { g, rgba, inside } = p;
  for (let y = 0; y < Math.min(g.height, g.browY); y++) {
    const m = midX(g, y);
    for (let x = 0; x < g.width; x++) {
      const i = (y * g.width + x) * 4;
      if (inside[i + 3] < 128) continue;
      const side = x < m ? "left" : "right";
      count[side]++;
      light[side] += 0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2];
    }
  }
  if (count.left < 50 || count.right < 50) throw new Error("Your forehead is out of frame. Fit your whole face in the photo.");
  const l = light.left / count.left;
  const r = light.right / count.right;
  return { lightBalance: (l - r) / ((l + r) / 2), yaw: p.g.yaw };
}

export type Side = "left" | "right";
export type Offset = { u: number; v: number };
export type Patch = { x: number; y: number; r: number };

const PATCH = 0.085;
const MAP = 3.2;
const GRID = 5;

export function patchOf(g: Geometry, side: Side, off: Offset): Patch {
  const c = g.cheeks[side];
  const r = PATCH * g.faceWidth;
  const sign = side === "left" ? 1 : -1;
  return { x: c.x + sign * off.u * r, y: c.y + off.v * r, r };
}

export type Flags = (x: number, y: number) => boolean;

export async function markFlags(masks: string[], g: Geometry): Promise<Flags> {
  const layers = await Promise.all(masks.map(async (m) => pixels(await loadImage(m), g.width, g.height)));
  const opaque = layers.map((d) => {
    for (let i = 3; i < d.length; i += 4 * 97) if (d[i] < 255) return false;
    return true;
  });
  return (x, y) => {
    const i = (Math.round(y) * g.width + Math.round(x)) * 4;
    return layers.some((d, k) => (opaque[k] ? d[i] : d[i + 3]) > 70);
  };
}

export function flaggedShare(g: Geometry, patch: Patch, flags: Flags) {
  let hit = 0;
  let n = 0;
  for (let y = patch.y - patch.r; y <= patch.y + patch.r; y += 3)
    for (let x = patch.x - patch.r; x <= patch.x + patch.r; x += 3) {
      if ((x - patch.x) ** 2 + (y - patch.y) ** 2 > patch.r ** 2 || x < 0 || y < 0 || x >= g.width || y >= g.height) continue;
      n++;
      if (flags(x, y)) hit++;
    }
  return n ? hit / n : 1;
}

export function placePatches(g: Geometry, flags: Flags | null): Offset {
  if (!flags) return { u: 0, v: 0 };
  const options: Offset[] = [];
  for (const v of [-0.4, 0, 0.4, 0.8]) for (const u of [-0.5, 0, 0.5]) options.push({ u, v });
  const cost = (o: Offset) => flaggedShare(g, patchOf(g, "left", o), flags) + flaggedShare(g, patchOf(g, "right", o), flags) + 0.3 * Math.hypot(o.u, o.v);
  return options.reduce((best, o) => (cost(o) < cost(best) ? o : best));
}

function sampleTiles(p: Photo, patch: Patch, skip: Flags | null): (Lab | null)[] {
  const { g, rgba, inside } = p;
  const step = (2 * patch.r) / GRID;
  const tiles: (Lab | null)[] = [];
  for (let ty = 0; ty < GRID; ty++)
    for (let tx = 0; tx < GRID; tx++) {
      const sum = { r: 0, g: 0, b: 0, n: 0 };
      const x0 = patch.x - patch.r + tx * step;
      const y0 = patch.y - patch.r + ty * step;
      for (let y = Math.floor(y0); y < y0 + step; y++)
        for (let x = Math.floor(x0); x < x0 + step; x++) {
          if (x < 0 || y < 0 || x >= g.width || y >= g.height) continue;
          if ((x - patch.x) ** 2 + (y - patch.y) ** 2 > patch.r ** 2) continue;
          const i = (y * g.width + x) * 4;
          if (inside[i + 3] < 128 || skip?.(x, y)) continue;
          sum.r += rgba[i];
          sum.g += rgba[i + 1];
          sum.b += rgba[i + 2];
          sum.n++;
        }
      tiles.push(sum.n > step * step * 0.3 ? rgbToLab(sum.r / sum.n, sum.g / sum.n, sum.b / sum.n) : null);
    }
  return tiles;
}

const relay = (from: Patch, to: Patch, flags: Flags | null): Flags | null =>
  flags && ((x, y) => flags(from.x + ((x - to.x) / to.r) * from.r, from.y + ((y - to.y) / to.r) * from.r));

type Pt = [number, number];
const ANCHORS = [105, 168, 334];

function similarity(src: Pt[], dst: Pt[]) {
  const n = src.length;
  const centre = (pts: Pt[]) => pts.reduce(([sx, sy], [x, y]) => [sx + x / n, sy + y / n], [0, 0]);
  const [fx, fy] = centre(src);
  const [tx, ty] = centre(dst);
  let dot = 0;
  let cross = 0;
  let norm = 0;
  src.forEach(([x, y], i) => {
    const [u, v] = dst[i];
    dot += (x - fx) * (u - tx) + (y - fy) * (v - ty);
    cross += (x - fx) * (v - ty) - (y - fy) * (u - tx);
    norm += (x - fx) ** 2 + (y - fy) ** 2;
  });
  const c = dot / norm;
  const s = cross / norm;
  return (p: Patch): Patch => ({ x: tx + c * (p.x - fx) - s * (p.y - fy), y: ty + s * (p.x - fx) + c * (p.y - fy), r: p.r * Math.hypot(c, s) });
}

function match(bare: Photo, swiped: Photo, [x, y]: Pt, guess: Pt): Pt {
  const half = Math.round(bare.g.faceWidth * 0.07);
  const reach = Math.round(bare.g.faceWidth * 0.05);
  const fits = (p: Photo, cx: number, cy: number) => cx - half >= 0 && cy - half >= 0 && cx + half < p.g.width && cy + half < p.g.height;
  const grid: Pt[] = [];
  for (let v = -half; v <= half; v += 3) for (let u = -half; u <= half; u += 3) grid.push([u, v]);
  const window = (p: Photo, cx: number, cy: number) => {
    const xs = grid.map(([u, v]) => {
      const i = (Math.round(cy + v) * p.g.width + Math.round(cx + u)) * 4;
      return 0.2126 * p.rgba[i] + 0.7152 * p.rgba[i + 1] + 0.0722 * p.rgba[i + 2];
    });
    const m = xs.reduce((a, b) => a + b, 0) / xs.length;
    const d = xs.map((v) => v - m);
    const norm = Math.hypot(...d);
    return d.map((v) => v / norm);
  };
  if (!fits(bare, x, y)) return guess;
  const a = window(bare, x, y);
  const score = (cx: number, cy: number) => (fits(swiped, cx, cy) ? window(swiped, cx, cy).reduce((sum, v, i) => sum + v * a[i], 0) : -1);
  let best: Pt = [Math.round(guess[0]), Math.round(guess[1])];
  let top = score(...best);
  for (const [span, step] of [
    [reach, 3],
    [3, 1],
  ]) {
    const [bx, by] = best;
    for (let dy = -span; dy <= span; dy += step) {
      for (let dx = -span; dx <= span; dx += step) {
        const value = score(bx + dx, by + dy);
        if (value > top) [top, best] = [value, [bx + dx, by + dy]];
      }
    }
  }
  return top > 0.5 ? best : guess;
}

function register(bare: Photo, swiped: Photo) {
  const guess = similarity(bare.g.points, swiped.g.points);
  const src = ANCHORS.map((i) => bare.g.points[i]);
  const dst = src.map(([x, y]) => {
    const p = guess({ x, y, r: 0 });
    return match(bare, swiped, [x, y], [p.x, p.y]);
  });
  return similarity(src, dst);
}

function discLight(p: Photo, d: Patch) {
  let sum = 0;
  let n = 0;
  for (let y = Math.max(0, Math.round(d.y - d.r)); y <= Math.min(p.g.height - 1, d.y + d.r); y++) {
    for (let x = Math.max(0, Math.round(d.x - d.r)); x <= Math.min(p.g.width - 1, d.x + d.r); x++) {
      const i = (y * p.g.width + x) * 4;
      if ((x - d.x) ** 2 + (y - d.y) ** 2 > d.r ** 2 || p.inside[i + 3] < 128) continue;
      sum += 0.2126 * p.rgba[i] + 0.7152 * p.rgba[i + 1] + 0.0722 * p.rgba[i + 2];
      n++;
    }
  }
  return n ? sum / n : Number.NaN;
}

export function lightShift(bare: Photo, swiped: Photo) {
  const { g } = bare;
  const y = g.browY - g.faceWidth * 0.09;
  const discs = [-1, 1].map((k) => ({ x: midX(g, y) + k * g.faceWidth * 0.17, y, r: g.faceWidth * 0.07 }));
  const move = register(bare, swiped);
  const balance = (p: Photo, [l, r]: Patch[]) => {
    const [a, b] = [discLight(p, l), discLight(p, r)];
    return (a - b) / ((a + b) / 2);
  };
  return balance(swiped, discs.map(move)) - balance(bare, discs);
}

export type Reading = { bare: Sides; swiped: Sides; patches: { bare: Record<Side, Patch>; swiped: Record<Side, Patch> } };

export function readPair(bare: Photo, swiped: Photo, treated: Side, offset: Offset, flags: Flags | null): Reading {
  const control: Side = treated === "left" ? "right" : "left";
  const pb = { left: patchOf(bare.g, "left", offset), right: patchOf(bare.g, "right", offset) };
  const move = register(bare, swiped);
  const ps = { left: move(pb.left), right: move(pb.right) };
  const result: Reading = { bare: { treated: [], control: [] }, swiped: { treated: [], control: [] }, patches: { bare: pb, swiped: ps } };
  for (const [side, key] of [
    [treated, "treated"],
    [control, "control"],
  ] as const) {
    const before = sampleTiles(bare, pb[side], flags);
    const after = sampleTiles(swiped, ps[side], relay(pb[side], ps[side], flags));
    before.forEach((b, i) => {
      const a = after[i];
      if (!b || !a) return;
      result.bare[key].push(b);
      result.swiped[key].push(a);
    });
    if (result.bare[key].length < 6) throw new Error("A cheek is hidden or out of frame. Pull your hair back and face the camera.");
  }
  return result;
}

export type GhostMap = { x: number; y: number; size: number; values: Float32Array };

export function ghostMap(bare: Photo, swiped: Photo, reading: Reading, treated: Side): GhostMap {
  const shift = mean(reading.swiped.control).L - mean(reading.bare.control).L;
  const from = reading.patches.bare[treated];
  const to = reading.patches.swiped[treated];
  const R = to.r * MAP;
  const size = Math.ceil(2 * R);
  const values = new Float32Array(size * size).fill(Number.NaN);
  const L = (p: Photo, x: number, y: number) => {
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (xi < 0 || yi < 0 || xi >= p.g.width || yi >= p.g.height) return Number.NaN;
    const i = (yi * p.g.width + xi) * 4;
    if (p.inside[i + 3] < 128) return Number.NaN;
    return rgbToLab(p.rgba[i], p.rgba[i + 1], p.rgba[i + 2]).L;
  };
  for (let j = 0; j < size; j++)
    for (let i = 0; i < size; i++) {
      const x = to.x - R + i;
      const y = to.y - R + j;
      if ((x - to.x) ** 2 + (y - to.y) ** 2 > R * R) continue;
      if (treated === "left" ? x > midX(swiped.g, y) : x < midX(swiped.g, y)) continue;
      const bx = from.x + ((x - to.x) / to.r) * from.r;
      const by = from.y + ((y - to.y) / to.r) * from.r;
      values[j * size + i] = L(swiped, x, y) - (L(bare, bx, by) + shift);
    }
  return { x: to.x - R, y: to.y - R, size, values };
}
