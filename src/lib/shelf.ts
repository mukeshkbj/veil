import { type Lab, deltaE00, hexToLab, labToHex, mixLight } from "./color.ts";
import { type Verdict, verdictOf } from "./cast.ts";

export type Kind = "mineral" | "tinted" | "chemical" | "hybrid";

export type Shade = { name: string; hex: string };

export type Sunscreen = {
  id: string;
  name: string;
  kind: Kind;
  spf: number;
  price: number;
  filters: string;
  film: Shade[];
  opacity: number;
  spread: number;
  ironOxide: boolean;
};

const white = (hex: string): Shade[] => [{ name: "Untinted", hex }];

export const SHELF: Sunscreen[] = [
  {
    id: "bare-zinc",
    name: "Bare Zinc 50",
    kind: "mineral",
    spf: 50,
    price: 24,
    filters: "Zinc oxide 25%",
    film: white("#f3f0eb"),
    opacity: 0.07,
    spread: 0.02,
    ironOxide: false,
  },
  {
    id: "daylight",
    name: "Daylight Mineral 30",
    kind: "mineral",
    spf: 30,
    price: 32,
    filters: "Zinc oxide 12%, titanium dioxide 4%",
    film: white("#f1eee9"),
    opacity: 0.045,
    spread: 0.015,
    ironOxide: false,
  },
  {
    id: "halfway",
    name: "Halfway Hybrid 50",
    kind: "hybrid",
    spf: 50,
    price: 28,
    filters: "Zinc oxide 8%, avobenzone 3%",
    film: white("#efece7"),
    opacity: 0.025,
    spread: 0.01,
    ironOxide: false,
  },
  {
    id: "clearweight",
    name: "Clearweight Gel 40",
    kind: "chemical",
    spf: 40,
    price: 36,
    filters: "Avobenzone 3%, homosalate 8%, octisalate 5%",
    film: white("#f4f2ee"),
    opacity: 0.008,
    spread: 0.004,
    ironOxide: false,
  },
  {
    id: "tint-five",
    name: "Tinted Mineral 45",
    kind: "tinted",
    spf: 45,
    price: 38,
    filters: "Zinc oxide 18%, iron oxides",
    film: [
      { name: "Light", hex: "#e3c1a6" },
      { name: "Medium", hex: "#c4906b" },
      { name: "Tan", hex: "#a06b4a" },
      { name: "Deep", hex: "#6e4a36" },
      { name: "Rich", hex: "#47362c" },
    ],
    opacity: 0.25,
    spread: 0.07,
    ironOxide: true,
  },
  {
    id: "tint-three",
    name: "Glow Tint 30",
    kind: "tinted",
    spf: 30,
    price: 30,
    filters: "Titanium dioxide 9%, iron oxides",
    film: [
      { name: "Fair", hex: "#ecd0bb" },
      { name: "Light", hex: "#dcb497" },
      { name: "Medium", hex: "#c2906d" },
    ],
    opacity: 0.25,
    spread: 0.07,
    ironOxide: true,
  },
  {
    id: "bronze",
    name: "Universal Bronze 40",
    kind: "tinted",
    spf: 40,
    price: 34,
    filters: "Zinc oxide 15%, iron oxides",
    film: [{ name: "One shade", hex: "#8c5c40" }],
    opacity: 0.22,
    spread: 0.06,
    ironOxide: true,
  },
  {
    id: "beach-stick",
    name: "Beach Zinc Stick 50",
    kind: "mineral",
    spf: 50,
    price: 16,
    filters: "Zinc oxide 25%, in wax",
    film: white("#f6f4f0"),
    opacity: 0.1,
    spread: 0.03,
    ironOxide: false,
  },
];

export const sunscreenById = (id: string) => SHELF.find((s) => s.id === id) ?? SHELF[0];

export const listed = (id: string) => SHELF.some((s) => s.id === id);

export type Swipe = { productId: string; shade: string; dE: number };

export type Prediction = {
  product: Sunscreen;
  shade: Shade;
  dE: number;
  range: [number, number];
  verdict: Verdict;
  measured: boolean;
};

const castOf = (skin: Lab, film: Lab, opacity: number) => deltaE00(skin, mixLight(skin, film, Math.max(0, opacity)));

function bestShade(skin: Lab, p: Sunscreen) {
  return p.film.reduce((best, s) => (castOf(skin, hexToLab(s.hex), p.opacity) < castOf(skin, hexToLab(best.hex), p.opacity) ? s : best));
}

export function solveOpacity(skin: Lab, film: Lab, dE: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (castOf(skin, film, m) < dE) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

export const calibrates = (s: Swipe) => listed(s.productId) && s.dE >= 2;

export function doseFactor(skin: Lab, swipes: Swipe[]) {
  const logs = swipes.filter(calibrates).flatMap((s) => {
    const p = sunscreenById(s.productId);
    const shade = p.film.find((f) => f.name === s.shade) ?? p.film[0];
    const opacity = solveOpacity(skin, hexToLab(shade.hex), s.dE);
    return opacity > 0.95 ? [] : [Math.log(opacity / p.opacity)];
  });
  if (!logs.length) return 1;
  return Math.min(4, Math.max(0.25, Math.exp(logs.reduce((a, b) => a + b, 0) / logs.length)));
}

export function predictShelf(skin: Lab, swipes: Swipe[]): Prediction[] {
  const dose = doseFactor(skin, swipes);
  const narrow = swipes.some(calibrates) ? 0.6 : 1;
  return SHELF.map((product) => {
    const swipe = swipes.find((s) => s.productId === product.id);
    const shade = swipe ? (product.film.find((f) => f.name === swipe.shade) ?? product.film[0]) : bestShade(skin, product);
    const film = hexToLab(shade.hex);
    if (swipe) return { product, shade, dE: swipe.dE, range: [swipe.dE, swipe.dE] as [number, number], verdict: verdictOf(swipe.dE), measured: true };
    const opacity = product.opacity * dose;
    const spread = product.spread * dose * narrow * 1.64;
    const dE = castOf(skin, film, opacity);
    const range: [number, number] = [castOf(skin, film, opacity - spread), castOf(skin, film, opacity + spread)];
    return { product, shade, dE, range: [Math.min(...range), Math.max(...range)] as [number, number], verdict: verdictOf(dE), measured: false };
  }).sort((x, y) => x.dE - y.dE);
}

export type Advice = { kind: "settled"; pick: Prediction } | { kind: "swipe"; next: Prediction; rival: Prediction };

export function nextSwipe(ranked: Prediction[]): Advice {
  const vanished = ranked.find((p) => p.measured && p.verdict === "invisible");
  if (vanished) return { kind: "settled", pick: vanished };
  const [first, second] = ranked;
  const overlap = second && first.range[1] >= second.range[0];
  if (!overlap || (first.measured && second.measured)) return { kind: "settled", pick: first };
  const open = [first, second].filter((p) => !p.measured);
  const next = open.reduce((a, b) => (b.range[1] - b.range[0] > a.range[1] - a.range[0] ? b : a));
  return { kind: "swipe", next, rival: next === first ? second : first };
}

const ZINC = hexToLab("#f3f0eb");

export const castColor = (skin: Lab, dE: number) => labToHex(mixLight(skin, ZINC, solveOpacity(skin, ZINC, dE)));
