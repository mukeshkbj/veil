"use client";

import { useEffect, useId, useRef } from "react";
import { type GhostMap, type Patch, type Photo, type Side, loadImage, midX } from "@/lib/measure";
import { cheek } from "@/lib/format";

type Props = {
  photo: Photo;
  image?: string | null;
  treated?: Side | null;
  patches?: Record<Side, Patch> | null;
  map?: GhostMap | null;
  className?: string;
};

const MAP_FULL = 14;

function paintMap(ctx: CanvasRenderingContext2D, map: GhostMap) {
  const step = Math.max(8, Math.round(map.size / 44));
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--wax").trim();
  for (let y = 0; y + step <= map.size; y += step)
    for (let x = 0; x + step <= map.size; x += step) {
      let sum = 0;
      let n = 0;
      for (let j = y; j < y + step; j++)
        for (let i = x; i < x + step; i++) {
          const v = map.values[j * map.size + i];
          if (Number.isNaN(v)) continue;
          sum += v;
          n++;
        }
      const v = n > (step * step) / 2 ? sum / n : 0;
      if (v < 1) continue;
      ctx.beginPath();
      ctx.arc(map.x + x + step / 2, map.y + y + step / 2, step * 0.42 * Math.min(1, Math.sqrt(v / MAP_FULL)), 0, Math.PI * 2);
      ctx.fill();
    }
}

export function Face({ photo, image = null, treated = null, patches = null, map = null, className = "" }: Props) {
  const base = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLCanvasElement>(null);
  const filterId = useId().replace(/:/g, "");
  const g = photo.g;
  const src = image ?? photo.image;

  useEffect(() => {
    let alive = true;
    loadImage(src)
      .then((img) => {
        const ctx = base.current?.getContext("2d");
        if (alive && ctx) ctx.drawImage(img, 0, 0, g.width, g.height);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [src, g]);

  useEffect(() => {
    const ctx = layer.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, g.width, g.height);
    if (map) paintMap(ctx, map);
  }, [map, g]);

  const top = g.oval.reduce((m, p) => Math.min(m, p[1]), g.height) - g.height * 0.05;
  const bottom = g.oval.reduce((m, p) => Math.max(m, p[1]), 0) + g.height * 0.04;
  const stroke = g.width * 0.0042;
  const control: Side | null = treated && (treated === "left" ? "right" : "left");
  const text = g.width * 0.021;

  return (
    <div
      role="img"
      aria-label={treated ? `Face photo with sunscreen on the ${cheek(treated)}${map ? ", cast map shown" : ""}` : "Face photo"}
      className={`relative overflow-hidden bg-slide ${className}`}
      style={{ aspectRatio: `${g.width} / ${g.height}` }}
    >
      <canvas key={src} ref={base} width={g.width} height={g.height} className="absolute inset-0 size-full animate-[fade_320ms_var(--ease-out-strong)]" />
      <canvas
        ref={layer}
        width={g.width}
        height={g.height}
        className={`absolute inset-0 size-full transition-opacity duration-300 ${map ? "opacity-100" : "opacity-0"}`}
      />
      <svg viewBox={`0 0 ${g.width} ${g.height}`} className="pointer-events-none absolute inset-0 size-full" aria-hidden>
        <defs>
          <filter id={filterId} x="-20%" y="0" width="140%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale={stroke * 1.6} />
          </filter>
        </defs>
        <path
          d={`M ${midX(g, top)} ${top} L ${midX(g, bottom)} ${bottom}`}
          stroke="var(--wax)"
          strokeWidth={stroke}
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          pathLength={1}
          className="[stroke-dasharray:1] animate-[draw_900ms_var(--ease-out-strong)_both]"
        />
        {patches && treated && control && (
          <g className="animate-[fade_400ms_200ms_var(--ease-out-strong)_both]">
            {[treated, control].map((side) => {
              const p = patches[side];
              const swiped = side === treated;
              return (
                <g key={side}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.r}
                    fill="none"
                    stroke={swiped ? "var(--wax)" : "var(--paper)"}
                    strokeWidth={stroke * 0.8}
                    strokeDasharray={swiped ? undefined : `${stroke * 2.4} ${stroke * 2}`}
                  />
                  <text
                    x={p.x}
                    y={p.y + p.r + text * 1.5}
                    textAnchor="middle"
                    fontSize={text}
                    fill={swiped ? "var(--wax)" : "var(--paper)"}
                    className="font-medium"
                    letterSpacing={text * 0.08}
                    paintOrder="stroke"
                    stroke="oklch(0 0 0 / 0.35)"
                    strokeWidth={text * 0.12}
                  >
                    {swiped ? "Swiped" : "Bare"}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
