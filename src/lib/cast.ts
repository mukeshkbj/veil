import { type Lab, chroma, deltaE00, ita, labToLinear, linearToLab } from "./color.ts";

export type Sides = { treated: Lab[]; control: Lab[] };

export type Verdict = "invisible" | "faint" | "visible" | "ghost";

export const BANDS: { verdict: Verdict; below: number; word: string }[] = [
  { verdict: "invisible", below: 1.5, word: "Invisible" },
  { verdict: "faint", below: 3, word: "Faint" },
  { verdict: "visible", below: 6, word: "Visible" },
  { verdict: "ghost", below: Number.POSITIVE_INFINITY, word: "Ghost" },
];

export const SCALE_MAX = 12;
const UNCLEAR_WIDTH = 4;
const SURE_SEEN = 3;
const RESAMPLES = 400;

export type Cast = {
  bare: Lab;
  expected: Lab;
  actual: Lab;
  dE: number;
  dL: number;
  chromaLoss: number;
  whiteCast: number;
  interval: [number, number];
  verdict: Verdict;
  clear: boolean;
};

export const mean = (xs: Lab[]): Lab => {
  const n = xs.length;
  return { L: xs.reduce((s, x) => s + x.L, 0) / n, a: xs.reduce((s, x) => s + x.a, 0) / n, b: xs.reduce((s, x) => s + x.b, 0) / n };
};

export const verdictOf = (dE: number) => BANDS.find((b) => dE < b.below)!.verdict;

export const wordOf = (v: Verdict) => BANDS.find((b) => b.verdict === v)!.word;

function core(bare: Sides, swiped: Sides) {
  const t0 = mean(bare.treated);
  const c0 = mean(bare.control);
  const c1 = mean(swiped.control);
  const actual = mean(swiped.treated);
  const [l0, l1, lt] = [c0, c1, t0].map(labToLinear);
  const expected = linearToLab([0, 1, 2].map((i) => (lt[i] * l1[i]) / l0[i]) as [number, number, number]);
  return { bare: t0, expected, actual, dE: deltaE00(expected, actual) };
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const pick = (xs: Lab[], idx: number[]) => idx.map((i) => xs[i]);

export function measureCast(bare: Sides, swiped: Sides, seed = 1): Cast {
  const { bare: t0, expected, actual, dE } = core(bare, swiped);
  const next = rng(seed);
  const draw = (n: number) => Array.from({ length: n }, () => Math.floor(next() * n));
  const draws: number[] = [];
  for (let i = 0; i < RESAMPLES; i++) {
    const t = draw(bare.treated.length);
    const c = draw(bare.control.length);
    draws.push(
      core({ treated: pick(bare.treated, t), control: pick(bare.control, c) }, { treated: pick(swiped.treated, t), control: pick(swiped.control, c) }).dE,
    );
  }
  draws.sort((x, y) => x - y);
  const interval: [number, number] = [draws[Math.floor(RESAMPLES * 0.05)], draws[Math.floor(RESAMPLES * 0.95)]];
  const dL = actual.L - expected.L;
  return {
    bare: t0,
    expected,
    actual,
    dE,
    dL,
    chromaLoss: chroma(expected) - chroma(actual),
    whiteCast: dL / (100 - expected.L),
    interval,
    verdict: verdictOf(dE),
    clear: interval[1] - interval[0] <= UNCLEAR_WIDTH || verdictOf(interval[0]) === verdictOf(interval[1]) || interval[0] >= SURE_SEEN,
  };
}

export const DEPTHS = [
  { above: 55, name: "Very light" },
  { above: 41, name: "Light" },
  { above: 28, name: "Intermediate" },
  { above: 10, name: "Tan" },
  { above: -30, name: "Brown" },
  { above: Number.NEGATIVE_INFINITY, name: "Dark" },
] as const;

export type Depth = (typeof DEPTHS)[number]["name"];

export const depthOf = (skin: Lab): { angle: number; name: Depth } => {
  const angle = ita(skin);
  return { angle, name: DEPTHS.find((d) => angle > d.above)!.name };
};
