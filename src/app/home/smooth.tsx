"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { ScrollTrigger, calm, gsap } from "./motion";

export function Smooth() {
  useEffect(() => {
    if (calm()) return;
    const lenis = new Lenis({ lerp: 0.12 });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
