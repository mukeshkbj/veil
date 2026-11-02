"use client";

import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { landmarksOf } from "@/lib/measure";

const RATIO = 4 / 5;
const PROBE = 360;

type Check = { ready: boolean; say: string };

const luma = (d: Uint8ClampedArray, w: number, cx: number, cy: number, r: number) => {
  let sum = 0;
  let n = 0;
  for (let y = Math.round(cy - r); y <= cy + r; y++) {
    for (let x = Math.round(cx - r); x <= cx + r; x++) {
      if (x < 0 || y < 0 || x >= w || (x - cx) ** 2 + (y - cy) ** 2 > r * r) continue;
      const i = (y * w + x) * 4;
      if (i >= d.length) continue;
      sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      n++;
    }
  }
  return n ? sum / n : 0;
};

function judge(p: NormalizedLandmark[] | null, frame: ImageData): Check {
  if (!p) return { ready: false, say: "Bring your face into the oval" };
  const { width: w, height: h, data } = frame;
  const at = (i: number) => ({ x: p[i].x * w, y: p[i].y * h });
  const [l, r, nose] = [at(234), at(454), at(1)];
  const fw = r.x - l.x;
  if (fw / w < 0.4) return { ready: false, say: "Come a little closer" };
  if (fw / w > 0.8) return { ready: false, say: "Move back a little" };
  if (Math.abs(nose.x / w - 0.5) > 0.12 || Math.abs(nose.y / h - 0.5) > 0.14) return { ready: false, say: "Centre your face in the oval" };
  if (Math.abs((nose.x - (at(133).x + at(362).x) / 2) / (fw / 2)) > 0.15) return { ready: false, say: "Look straight at the camera" };
  const y = (at(105).y + at(334).y) / 2 - fw * 0.09;
  const mid = (at(105).x + at(334).x) / 2;
  const [a, b] = [-1, 1].map((k) => luma(data, w, mid + k * fw * 0.17, y, fw * 0.07));
  if ((a + b) / 2 < 22) return { ready: false, say: "Too dark. Face a window" };
  if (Math.abs(a - b) / ((a + b) / 2) > 0.14) return { ready: false, say: "Light from one side. Turn to face the window" };
  return { ready: true, say: "Hold still" };
}

function crop(video: HTMLVideoElement, width: number) {
  const { videoWidth: vw, videoHeight: vh } = video;
  const [sw, sh] = vw / vh > RATIO ? [vh * RATIO, vh] : [vw, vw / RATIO];
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(width / RATIO);
  canvas.getContext("2d", { willReadFrequently: true })!.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export const hasCamera = () => typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

export function Viewfinder({ label, onShot, onClose, onFail }: { label: string; onShot: (b: Blob) => void; onClose: () => void; onFail: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const shutter = useRef<HTMLButtonElement>(null);
  const [check, setCheck] = useState<Check | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer = 0;
    let gone = false;
    const look = async () => {
      const v = video.current;
      if (gone || !v) return;
      if (v.readyState >= 2 && !document.hidden) {
        const probe = crop(v, PROBE);
        const frame = probe.getContext("2d")!.getImageData(0, 0, probe.width, probe.height);
        const next = judge(await landmarksOf(probe).catch(() => null), frame);
        if (!gone) setCheck(next);
      }
      timer = window.setTimeout(look, 220);
    };
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1440 }, height: { ideal: 1800 } }, audio: false })
      .then((s) => {
        if (gone) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        video.current!.srcObject = s;
        shutter.current?.focus();
        look();
      })
      .catch(onFail);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      gone = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
      html.style.overflow = "";
    };
  }, [onFail]);

  const shoot = () => {
    const v = video.current;
    if (!v || v.readyState < 2) return;
    crop(v, Math.min(1440, v.videoHeight * RATIO)).toBlob((b) => b && onShot(b), "image/jpeg", 0.92);
  };

  const ready = check?.ready ?? false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key !== "Tab") return;
        const stops = [...e.currentTarget.querySelectorAll("button")];
        const at = stops.indexOf(document.activeElement as HTMLButtonElement);
        e.preventDefault();
        stops[(at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[oklch(0.14_0.01_250)] p-4 text-white animate-[fade_200ms_var(--ease-out-strong)]"
    >
      <div className="relative aspect-[4/5] w-full max-w-[min(480px,calc((100dvh-180px)*0.8))] overflow-hidden rounded-[28px] bg-black">
        <video ref={video} autoPlay playsInline muted className="absolute inset-0 size-full -scale-x-100 object-cover" />
        <svg viewBox="0 0 400 500" className="absolute inset-0 size-full" aria-hidden>
          <path
            d="M0 0H400V500H0Z M200 70C292 70 330 150 330 240C330 352 270 430 200 430C130 430 70 352 70 240C70 150 108 70 200 70Z"
            fill="oklch(0 0 0 / 0.45)"
            fillRule="evenodd"
          />
          <path
            d="M200 70C292 70 330 150 330 240C330 352 270 430 200 430C130 430 70 352 70 240C70 150 108 70 200 70Z"
            fill="none"
            stroke={ready ? "white" : "var(--wax)"}
            strokeWidth="3"
            strokeDasharray={ready ? undefined : "10 10"}
            className="transition-[stroke] duration-200"
          />
        </svg>
        <p
          aria-live="polite"
          className="absolute inset-x-0 top-5 mx-auto w-fit max-w-[calc(100%-32px)] rounded-full bg-black/55 px-4 py-2 text-center text-[14px] font-medium backdrop-blur-sm"
        >
          {check?.say ?? "Starting the camera…"}
        </p>
      </div>
      <div className="grid w-full max-w-[480px] grid-cols-[1fr_auto_1fr] items-center">
        <button type="button" onClick={onClose} className="justify-self-start rounded-full px-4 py-3 text-[15px] text-white/75 hover:text-white">
          Cancel
        </button>
        <button
          ref={shutter}
          type="button"
          onClick={shoot}
          aria-label={ready ? "Take the photo" : "Take the photo anyway"}
          className="grid size-[76px] place-items-center rounded-full border-[3px] border-white transition-transform duration-150 active:scale-95 focus-visible:outline-white"
        >
          <span className={`size-[60px] rounded-full transition-colors duration-200 ${ready ? "bg-white" : "bg-white/35"}`} />
        </button>
        <span className="justify-self-end pr-2 text-right text-[12px] leading-snug text-white/60">{ready ? "Ready" : "You can still shoot"}</span>
      </div>
    </div>
  );
}
