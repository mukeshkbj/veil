"use client";

import Image from "next/image";
import { type KeyboardEvent, type PointerEvent, useRef } from "react";
import { skinScale } from "@/components/meter";
import { SCALE_MAX, verdictOf, wordOf } from "@/lib/cast";
import { hexToLab } from "@/lib/color";
import { calm, gsap, useGSAP } from "./motion";

const W = 1080;
const H = W * 0.6;
const FOCUS = 0.72;
const SLOPE = 155 / 1114;
const PIVOT = 833 - (1350 - H) * FOCUS;
const REST = 0.49;
const TILT = (Math.atan(SLOPE) * 180) / Math.PI;
const TOP = ((SLOPE * PIVOT) / W) * 100;
const BOTTOM = ((SLOPE * (H - PIVOT)) / W) * 100;
const COVER = { objectPosition: `50% ${FOCUS * 100}%` };

type Props = { id: string; skin: string; dE: number; product: string };

export function Split({ id, skin, dE, product }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const grip = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const state = useRef({ p: REST, dragging: false, follow: null as ((p: number) => void) | null });

  const place = (p: number) => {
    const v = Math.min(0.94, Math.max(0.06, p));
    state.current.p = v;
    root.current?.style.setProperty("--p", v.toFixed(4));
    grip.current?.setAttribute("aria-valuenow", String(Math.round(v * 100)));
  };

  useGSAP(
    () => {
      const proxy = { p: REST };
      state.current.follow = gsap.quickTo(proxy, "p", { duration: 0.35, ease: "power3.out", onUpdate: () => place(proxy.p) }) as (p: number) => void;
      if (calm()) return;
      const shown = { v: 0 };
      gsap
        .timeline({ delay: 0.5, defaults: { ease: "power3.inOut" }, scrollTrigger: { trigger: root.current, start: "top 70%", once: true } })
        .to(proxy, { p: 0.06, duration: 1.1, onUpdate: () => place(proxy.p) })
        .to(proxy, { p: REST, duration: 1.4, onUpdate: () => place(proxy.p) }, "+=0.25")
        .from(card.current, { y: 28, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
        .to(shown, { v: dE, duration: 1.1, ease: "power2.out", onUpdate: () => number.current && (number.current.textContent = shown.v.toFixed(1)) }, "<")
        .from(marker.current, { left: "0%", duration: 1.1, ease: "power2.out" }, "<")
        .from(hint.current, { autoAlpha: 0, x: -6, duration: 0.5, ease: "power2.out" }, "-=0.3");
    },
    { scope: root },
  );

  const at = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    return (x - SLOPE * (y - PIVOT)) / W;
  };

  const touch = () => {
    if (state.current.dragging) return;
    gsap.killTweensOf(hint.current);
    gsap.to(hint.current, { autoAlpha: 0, duration: 0.2 });
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" && !state.current.dragging) return;
    touch();
    state.current.follow?.(at(e));
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    touch();
    state.current.dragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    state.current.follow?.(at(e));
  };

  const up = () => {
    state.current.dragging = false;
  };

  const leave = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") state.current.follow?.(REST);
  };

  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -0.03, ArrowRight: 0.03, ArrowDown: -0.03, ArrowUp: 0.03 }[e.key];
    const jump = { Home: 0.06, End: 0.94 }[e.key];
    if (step === undefined && jump === undefined) return;
    e.preventDefault();
    touch();
    state.current.follow?.(jump ?? state.current.p + step!);
  };

  const pct = `${(Math.min(dE, SCALE_MAX) / SCALE_MAX) * 100}%`;

  return (
    <figure className="relative">
      <div
        ref={root}
        onPointerMove={move}
        onPointerDown={down}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={leave}
        style={{ "--p": REST } as React.CSSProperties}
        className="relative aspect-[5/3] cursor-ew-resize touch-pan-y overflow-hidden rounded-[28px] bg-slide shadow-lift select-none"
      >
        <Image src={`/replay/${id}/film.jpg`} alt="" fill priority sizes="(min-width: 1200px) 1136px, 100vw" className="object-cover" style={COVER} draggable={false} />
        <div
          className="absolute inset-0"
          style={{ clipPath: `polygon(calc(var(--p) * 100% - ${TOP}%) 0, 100% 0, 100% 100%, calc(var(--p) * 100% + ${BOTTOM}%) 100%)` }}
        >
          <Image src={`/replay/${id}/bare.jpg`} alt="" fill priority sizes="(min-width: 1200px) 1136px, 100vw" className="object-cover" style={COVER} draggable={false} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[3%] h-[106%] w-[3px] rounded-full bg-wax"
          style={{
            left: "calc(var(--p) * 100%)",
            transform: `translateX(-50%) rotate(${-TILT}deg)`,
            transformOrigin: `50% ${((PIVOT / H) * 100 + 3) / 1.06}%`,
          }}
        />
        <span
          aria-hidden
          className="label pointer-events-none absolute top-5 rounded-full bg-ink/70 px-2.5 py-1 !text-paper backdrop-blur-sm"
          style={{ left: 16, opacity: "clamp(0, (var(--p) - 0.2) * 10, 1)" }}
        >
          Swiped
        </span>
        <span
          aria-hidden
          className="label pointer-events-none absolute top-5 rounded-full bg-paper/80 px-2.5 py-1 !text-ink backdrop-blur-sm"
          style={{ right: 16, opacity: "clamp(0, (0.8 - var(--p)) * 10, 1)" }}
        >
          Bare
        </span>
        <div
          ref={grip}
          role="slider"
          tabIndex={0}
          aria-label="Split between the swiped photo and the bare photo"
          aria-valuemin={6}
          aria-valuemax={94}
          aria-valuenow={Math.round(REST * 100)}
          aria-valuetext="Drag left to see her cheek without sunscreen"
          onKeyDown={key}
          className="absolute grid size-12 -translate-1/2 place-items-center rounded-full bg-wax text-ink shadow-[0_6px_24px_-6px_oklch(0.5_0.12_70/0.6)] transition-transform duration-150 hover:scale-105 focus-visible:outline-white active:scale-95"
          style={{ left: "calc(var(--p) * 100%)", top: `${(PIVOT / H) * 100}%` }}
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
            <path d="M9 7 4 12l5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            ref={hint}
            data-intro
            aria-hidden
            className="label pointer-events-none absolute left-[calc(100%+10px)] rounded-full bg-paper px-2.5 py-1 whitespace-nowrap !text-ink shadow-lift"
          >
            Drag the line
          </span>
        </div>
      </div>
      <figcaption
        ref={card}
        data-intro
        className="pointer-events-none mt-4 w-full text-ink sm:absolute sm:right-8 sm:bottom-7 sm:mt-0 sm:w-[min(420px,40%)] sm:text-right sm:text-white sm:[text-shadow:0_2px_24px_oklch(0_0_0/0.35)]"
      >
        <p className="text-[15px] font-medium sm:text-[17px]">
          {product} on her right cheek · <span ref={number} className="figure">{dE.toFixed(1)}</span> ΔE00
        </p>
        <p className="mt-1 text-[clamp(56px,8vw,128px)] font-semibold leading-[0.86] tracking-[-0.055em]">{wordOf(verdictOf(dE))}.</p>
        <div
          className="relative mt-4 h-2.5 rounded-full shadow-[inset_0_0_0_1px_oklch(1_0_0/0.25)]"
          style={{ background: skinScale(hexToLab(skin)) }}
          aria-hidden
        >
          <span
            ref={marker}
            className="absolute -inset-y-1.5 w-[3px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_2px_oklch(0_0_0/0.25)]"
            style={{ left: pct }}
          />
        </div>
        <p className="mt-2 text-[13px] font-medium opacity-80">Painted in her own skin colour</p>
      </figcaption>
    </figure>
  );
}
