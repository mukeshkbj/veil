"use client";

import { SplitText } from "gsap/SplitText";
import { ScrollTrigger, calm, gsap, useGSAP } from "./motion";

gsap.registerPlugin(SplitText);

const ease = "power3.out";

export function Choreo() {
  useGSAP(() => {
    if (calm()) return;
    const at = (el: Element) => ({ trigger: el, start: "top 88%", once: true });

    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "words",
        mask: "words",
        aria: "auto",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self.words, { yPercent: 110, duration: 0.9, ease, stagger: 0.05, delay: Number(el.dataset.split) || 0, scrollTrigger: at(el) });
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease, delay: Number(el.dataset.rise) || 0, scrollTrigger: at(el) });
    });

    gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((el) => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power2.out",
        delay: Number(el.dataset.grow) || 0,
        scrollTrigger: at(el),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      const digits = el.textContent?.split(".")[1]?.length ?? 0;
      const v = { n: 0 };
      el.textContent = (0).toFixed(digits);
      gsap.to(v, { n: end, duration: 1.4, ease: "power2.out", scrollTrigger: at(el), onUpdate: () => (el.textContent = v.n.toFixed(digits)) });
    });

    ScrollTrigger.refresh();
  });
  return null;
}
