import assert from "node:assert/strict";
import { test } from "node:test";
import { deltaE00, hexToLab, ita, labToHex, rgbToLab } from "./color.ts";

const close = (a: number, b: number, tol = 1e-4) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test("CIEDE2000 matches Sharma, Wu and Dalal reference pairs", () => {
  const pairs: [number, number, number, number, number, number, number][] = [
    [50, 2.6772, -79.7751, 50, 0, -82.7485, 2.0425],
    [50, -1.3802, -84.2814, 50, 0, -82.7485, 1.0],
    [50, 0, 0, 50, -1, 2, 2.3669],
    [50, 2.5, 0, 56, -27, -3, 31.903],
    [60.2574, -34.0099, 36.2677, 60.4626, -34.1751, 39.4387, 1.2644],
    [22.7233, 20.0904, -46.694, 23.0331, 14.973, -42.5619, 2.0373],
    [90.8027, -2.0831, 1.441, 91.1528, -1.6435, 0.0447, 1.4441],
  ];
  for (const [L1, a1, b1, L2, a2, b2, expected] of pairs) close(deltaE00({ L: L1, a: a1, b: b1 }, { L: L2, a: a2, b: b2 }), expected);
});

test("sRGB white and black land on the ends of L*", () => {
  close(rgbToLab(255, 255, 255).L, 100, 0.01);
  close(rgbToLab(0, 0, 0).L, 0, 0.01);
});

test("hex survives a round trip through Lab", () => {
  for (const hex of ["#b9947c", "#5a3b2c", "#f2e6dc", "#000000", "#ffffff"]) assert.equal(labToHex(hexToLab(hex)), hex);
});

test("ITA orders light skin above dark skin", () => {
  assert.ok(ita(hexToLab("#f1d3c0")) > 41);
  assert.ok(ita(hexToLab("#5a3b2c")) < -30);
});
