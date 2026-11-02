"use client";

import { useState } from "react";

const W = 1080;
const H = 1350;
const SIZE = 340;
const TALL = SIZE * 1.25;

type Face = { id: string; depth: string; cheek: number[] };

function crop(id: string, file: string, [cx, cy]: number[]) {
  return {
    backgroundImage: `url(/replay/${id}/${file}.jpg)`,
    backgroundSize: `${(W / SIZE) * 100}% auto`,
    backgroundPosition: `${((cx - SIZE / 2) / (W - SIZE)) * 100}% ${((cy - TALL / 2) / (H - TALL)) * 100}%`,
  };
}

export function Cheek({ face }: { face: Face }) {
  const [bare, setBare] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={bare}
      aria-label={`${face.depth} skin cheek. Show it without sunscreen`}
      onClick={() => setBare(!bare)}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-slide shadow-lift transition-transform duration-150 ease-out active:scale-[0.98]"
    >
      <span
        className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.04]"
        style={crop(face.id, "film", face.cheek)}
      />
      <span
        className="absolute inset-0 opacity-0 transition-[opacity,scale] duration-500 ease-[var(--ease-out-strong)] group-aria-pressed:opacity-100 [@media(hover:hover)]:group-hover:scale-[1.04] [@media(hover:hover)]:group-hover:opacity-100"
        style={crop(face.id, "bare", face.cheek)}
      />
      <span className="label absolute bottom-3 left-3 rounded-full bg-paper/85 px-2.5 py-1 !text-ink backdrop-blur-sm">
        <span className="group-aria-pressed:hidden [@media(hover:hover)]:group-hover:hidden">Swiped</span>
        <span className="hidden group-aria-pressed:inline [@media(hover:hover)]:group-hover:inline">Bare</span>
      </span>
    </button>
  );
}
