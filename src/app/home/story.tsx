"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { skinScale } from "@/components/meter";
import { SCALE_MAX } from "@/lib/cast";
import { hexToLab } from "@/lib/color";
import { ScrollTrigger, useGSAP } from "./motion";

const W = 1080;
const H = 1350;
const SKIN = hexToLab("#504944");
const PATCHES = [
  { x: 259, y: 833, r: 76, stroke: "var(--wax)" },
  { x: 830, y: 746, r: 76, stroke: "var(--paper)" },
];
const ANCHORS = [
  [262, 478],
  [512, 520],
  [768, 452],
];
const MASKS = ["acne", "age_spot", "redness"];
const SHELF = [
  { name: "Clearweight Gel 40", dE: 0.7, note: "Measured on your face" },
  { name: "Tinted Mineral 45 Rich", dE: 1.4, note: "Predicted" },
  { name: "Halfway Hybrid 50", dE: 3.0, note: "Predicted" },
];

type Step = { name: string; body: string };

const show = (on: boolean) => `transition-opacity duration-700 ease-[var(--ease-out-strong)] ${on ? "opacity-100" : "opacity-0"}`;

function Tiles({ x, y, r }: { x: number; y: number; r: number }) {
  const s = (2 * r) / 5;
  return (
    <g>
      {Array.from({ length: 25 }, (_, i) => (
        <rect
          key={i}
          x={x - r + (i % 5) * s}
          y={y - r + Math.floor(i / 5) * s}
          width={s}
          height={s}
          fill="oklch(1 0 0 / 0.08)"
          stroke="white"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
}

export function Story({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      root.current?.querySelectorAll("[data-step]").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (self) => self.isActive && setStep(i) });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid gap-x-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="sticky top-0 z-10 -mx-5 bg-paper px-5 pt-3 pb-4 sm:-mx-8 sm:px-8 lg:top-[max(24px,calc(50vh-min(42vh,390px)))] lg:mx-0 lg:self-start lg:bg-transparent lg:p-0">
        <figure
          role="img"
          aria-label={`Step ${step + 1} of ${steps.length}: ${steps[step].name}`}
          className="relative mx-auto aspect-[4/5] h-[46vh] overflow-hidden rounded-[24px] bg-slide shadow-lift lg:h-auto lg:max-h-[min(84vh,780px)] lg:w-full"
        >
          <Image src="/replay/elder/bare.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 50vh" className="object-cover" />
          <div className={`absolute inset-0 ${show(step === 0)}`}>
            {MASKS.map((m) => (
              <div
                key={m}
                className="absolute inset-0"
                style={{
                  background: "var(--wax)",
                  maskImage: `url(/replay/elder/bare-${m}.png)`,
                  maskSize: "100% 100%",
                  opacity: 0.55,
                }}
              />
            ))}
          </div>
          <div className={`absolute inset-0 ${show(step >= 1)}`}>
            <Image src="/replay/elder/film.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 50vh" className="object-cover" />
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
            <g className={show(step >= 1)}>
              <path d="M 449 225 L 604 1339" stroke="var(--wax)" strokeWidth="5" strokeLinecap="round" />
              {PATCHES.map((p, i) => (
                <circle key={p.x} cx={p.x} cy={p.y} r={p.r + 8} fill="none" stroke={p.stroke} strokeWidth="4" strokeDasharray={i ? "12 9" : undefined} />
              ))}
            </g>
            <g className={show(step === 2)}>
              {PATCHES.map((p) => (
                <Tiles key={p.x} {...p} />
              ))}
              {ANCHORS.map(([x, y]) => (
                <g key={x} stroke="white" strokeWidth="3">
                  <circle cx={x} cy={y} r="34" fill="none" />
                  <path d={`M ${x - 52} ${y} h 30 M ${x + 22} ${y} h 30 M ${x} ${y - 52} v 30 M ${x} ${y + 22} v 30`} />
                </g>
              ))}
            </g>
          </svg>
          <div
            className={`absolute inset-x-4 bottom-4 rounded-[16px] bg-paper p-4 shadow-lift transition-[opacity,translate] duration-700 ease-[var(--ease-out-strong)] ${step === 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <p className="label">Her shelf</p>
            <ol className="mt-3 grid gap-3">
              {SHELF.map((s) => (
                <li key={s.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3">
                  <span className="truncate text-[17px] font-medium">{s.name}</span>
                  <span className="figure text-[16px]">{s.dE.toFixed(1)}</span>
                  <span className="relative col-span-2 mt-1.5 h-2 rounded-full" style={{ background: skinScale(SKIN) }}>
                    <span className="absolute -inset-y-1 w-[3px] -translate-x-1/2 rounded-full bg-ink" style={{ left: `${(s.dE / SCALE_MAX) * 100}%` }} />
                  </span>
                  <span className="col-span-2 mt-1 text-[13px] text-graphite">{s.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </figure>
      </div>
      <ol className="lg:py-[18vh]">
        {steps.map((s, i) => (
          <li
            key={s.name}
            data-step
            className={`py-10 transition-opacity duration-500 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center ${step === i ? "" : "lg:opacity-35"}`}
          >
            <p className="figure text-[15px] font-medium text-wax-ink">0{i + 1}</p>
            <h3 className="mt-3 text-[clamp(30px,3.6vw,48px)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">{s.name}</h3>
            <p className="mt-5 max-w-[40ch] text-[19px] leading-[1.55] text-ink-soft text-pretty">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
