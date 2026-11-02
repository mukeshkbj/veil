export type Lab = { L: number; a: number; b: number };

const lin = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const gamma = (v: number) => {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, c)) * 255);
};

const WHITE = { x: 0.95047, y: 1, z: 1.08883 };
const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
const fInv = (t: number) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));

export type Linear = [number, number, number];

export function linearToLab([R, G, B]: Linear): Lab {
  const x = f((0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / WHITE.x);
  const y = f((0.2126729 * R + 0.7151522 * G + 0.072175 * B) / WHITE.y);
  const z = f((0.0193339 * R + 0.119192 * G + 0.9503041 * B) / WHITE.z);
  return { L: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

export const rgbToLab = (r: number, g: number, bl: number) => linearToLab([lin(r), lin(g), lin(bl)]);

export function labToLinear({ L, a, b }: Lab): Linear {
  const fy = (L + 16) / 116;
  const X = fInv(fy + a / 500) * WHITE.x;
  const Y = fInv(fy) * WHITE.y;
  const Z = fInv(fy - b / 200) * WHITE.z;
  return [3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z, -0.969266 * X + 1.8760108 * Y + 0.041556 * Z, 0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z];
}

export const labToRgb = (lab: Lab) => labToLinear(lab).map(gamma) as [number, number, number];

export const labToHex = (lab: Lab) =>
  `#${labToRgb(lab)
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;

export function hexToLab(hex: string): Lab {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return rgbToLab((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

export const chroma = ({ a, b }: Lab) => Math.hypot(a, b);

export const ita = ({ L, b }: Lab) => (Math.atan2(L - 50, b) * 180) / Math.PI;

export const mix = (from: Lab, to: Lab, t: number): Lab => ({
  L: from.L + (to.L - from.L) * t,
  a: from.a + (to.a - from.a) * t,
  b: from.b + (to.b - from.b) * t,
});

export function mixLight(from: Lab, to: Lab, t: number): Lab {
  const a = labToLinear(from);
  const b = labToLinear(to);
  return linearToLab([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Linear);
}

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function deltaE00(p: Lab, q: Lab): number {
  const C1 = Math.hypot(p.a, p.b);
  const C2 = Math.hypot(q.a, q.b);
  const Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1 = p.a * (1 + G);
  const a2 = q.a * (1 + G);
  const c1 = Math.hypot(a1, p.b);
  const c2 = Math.hypot(a2, q.b);
  const h1 = c1 === 0 ? 0 : (deg(Math.atan2(p.b, a1)) + 360) % 360;
  const h2 = c2 === 0 ? 0 : (deg(Math.atan2(q.b, a2)) + 360) % 360;
  const dL = q.L - p.L;
  const dC = c2 - c1;
  let dh = 0;
  if (c1 * c2 !== 0) {
    dh = h2 - h1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(c1 * c2) * Math.sin(rad(dh / 2));
  const Lm = (p.L + q.L) / 2;
  const cm = (c1 + c2) / 2;
  let hm = h1 + h2;
  if (c1 * c2 !== 0) {
    if (Math.abs(h1 - h2) <= 180) hm = (h1 + h2) / 2;
    else hm = h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2;
  }
  const T = 1 - 0.17 * Math.cos(rad(hm - 30)) + 0.24 * Math.cos(rad(2 * hm)) + 0.32 * Math.cos(rad(3 * hm + 6)) - 0.2 * Math.cos(rad(4 * hm - 63));
  const dTheta = 30 * Math.exp(-(((hm - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(cm ** 7 / (cm ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2);
  const Sc = 1 + 0.045 * cm;
  const Sh = 1 + 0.015 * cm * T;
  const Rt = -Math.sin(rad(2 * dTheta)) * Rc;
  return Math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh));
}
