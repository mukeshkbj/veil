import type { Side } from "./measure.ts";

export const cheek = (side: Side) => (side === "left" ? "right cheek" : "left cheek");

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export const signed = (v: number, digits = 1) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(digits)}`;

export const one = (v: number) => v.toFixed(1);
