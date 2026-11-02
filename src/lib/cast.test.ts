import assert from "node:assert/strict";
import { test } from "node:test";
import { type Lab, deltaE00, labToLinear, linearToLab, mix } from "./color.ts";
import { depthOf, measureCast } from "./cast.ts";

const ZINC: Lab = { L: 92, a: 0, b: 2 };
const DEEP: Lab = { L: 38, a: 12, b: 18 };
const FAIR: Lab = { L: 72, a: 11, b: 15 };

function tiles(center: Lab, spread: number, seed: number): Lab[] {
  let s = seed;
  const next = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648 - 0.5) * 2 * spread;
  return Array.from({ length: 16 }, () => ({ L: center.L + next(), a: center.a + next() / 3, b: center.b + next() / 3 }));
}

const relight = (xs: Lab[], gains: [number, number, number]) =>
  xs.map((x) => linearToLab(labToLinear(x).map((v, i) => v * gains[i]) as [number, number, number]));

test("a light change that hits both cheeks is not a cast", () => {
  const bare = { treated: tiles(DEEP, 1, 1), control: tiles(DEEP, 1, 2) };
  const warmer: [number, number, number] = [1.3, 1.18, 1.02];
  const cast = measureCast(bare, { treated: relight(bare.treated, warmer), control: relight(bare.control, warmer) });
  assert.equal(cast.verdict, "invisible");
  assert.ok(cast.dE < 0.5);
});

test("a planted zinc film is recovered at its true size under the new light", () => {
  const bare = { treated: tiles(DEEP, 1, 3), control: tiles(DEEP, 1, 4) };
  const dimmer: [number, number, number] = [0.86, 0.8, 0.72];
  const filmed = bare.treated.map((x) => mix(x, ZINC, 0.3));
  const swiped = { treated: relight(filmed, dimmer), control: relight(bare.control, dimmer) };
  const cast = measureCast(bare, swiped);
  const [lit, litFilm] = relight([DEEP, mix(DEEP, ZINC, 0.3)], dimmer);
  const truth = deltaE00(lit, litFilm);
  assert.ok(Math.abs(cast.dE - truth) < 1.5, `${cast.dE} vs ${truth}`);
  assert.equal(cast.verdict, "ghost");
  assert.ok(cast.whiteCast > 0 && cast.chromaLoss > 0);
  assert.ok(cast.interval[0] < cast.dE && cast.dE < cast.interval[1]);
});

test("the same film reads weaker on fair skin than on deep skin", () => {
  const run = (skin: Lab) => {
    const bare = { treated: tiles(skin, 1, 5), control: tiles(skin, 1, 6) };
    return measureCast(bare, { treated: bare.treated.map((x) => mix(x, ZINC, 0.3)), control: bare.control }).dE;
  };
  assert.ok(run(DEEP) > 2 * run(FAIR));
});

test("noisy patches widen the interval and are flagged as unclear", () => {
  const bare = { treated: tiles(DEEP, 9, 7), control: tiles(DEEP, 9, 8) };
  const cast = measureCast(bare, { treated: tiles(DEEP, 9, 9), control: tiles(DEEP, 9, 10) });
  assert.equal(cast.clear, false);
});

test("skin depth follows the individual typology angle", () => {
  assert.equal(depthOf(FAIR).name, "Very light");
  assert.equal(depthOf(DEEP).name, "Dark");
  assert.equal(depthOf({ L: 45, a: 12, b: 20 }).name, "Brown");
});
