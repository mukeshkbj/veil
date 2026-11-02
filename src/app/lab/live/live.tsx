"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Face } from "@/components/face";
import { Wordmark } from "@/components/mark";
import type { Lab } from "@/lib/color";
import { type Photo, type Side, photoOf, posture } from "@/lib/measure";
import { type Prediction, SHELF, type Swipe, listed, sunscreenById } from "@/lib/shelf";
import { type Bare, PLANT_COVERAGE, PLANT_HEX, type Plant, type Test, bareOf, checkCheeks, plant, testSwipe } from "@/lib/veil";
import { Viewfinder, hasCamera } from "./viewfinder";
import { Bench, FacePanel, Proof, Reading, Shelf, Trace, Verdict, type Swiped, type View, coverageOf, productLabel } from "../report";

const KEY = "veil:shelf";
const CHANGED = "veil:changed";
const OTHER = "other";
const RUB_SECONDS = 30;

type Saved = { skin: Lab; tone: Lab; swipes: Swipe[]; at: number };
type Session = { bare: Bare; fileId: string; masks: string[] };
type Pick = { productId: string; shade: string };

function subscribe(onChange: () => void) {
  addEventListener("storage", onChange);
  addEventListener(CHANGED, onChange);
  return () => {
    removeEventListener("storage", onChange);
    removeEventListener(CHANGED, onChange);
  };
}

function stored() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function save(value: Saved | null) {
  try {
    if (value) localStorage.setItem(KEY, JSON.stringify(value));
    else localStorage.removeItem(KEY);
  } catch {
    return;
  }
  dispatchEvent(new Event(CHANGED));
}

function useSaved() {
  const raw = useSyncExternalStore(subscribe, stored, () => null);
  try {
    const saved = raw ? (JSON.parse(raw) as Saved) : null;
    return saved?.skin && saved.tone && Array.isArray(saved.swipes) && saved.swipes.length ? saved : null;
  } catch {
    return null;
  }
}

async function shrink(file: Blob) {
  const bitmap = await createImageBitmap(file);
  try {
    if (Math.min(bitmap.width, bitmap.height) < 480) throw new Error("The photo is too small. Use the camera at full resolution.");
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = new OffscreenCanvas(Math.round(bitmap.width * scale), Math.round(bitmap.height * scale));
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  } finally {
    bitmap.close();
  }
}

async function shoot(file: Blob) {
  const blob = await shrink(file);
  const url = URL.createObjectURL(blob);
  try {
    const photo = await photoOf(url);
    if (!photo) throw new Error("No face found. Fit your whole face in the frame and look at the camera.");
    posture(photo);
    return { blob, photo };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

async function send<T>(path: string, body: FormData | object): Promise<T> {
  const res = await fetch(
    path,
    body instanceof FormData ? { method: "POST", body } : { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } },
  );
  const json = await res.json().catch(() => ({ error: "The server did not answer. Try again." }));
  if (!res.ok) throw new Error(json.error ?? "Something went wrong. Try again.");
  return json as T;
}

export function Live() {
  const [live, setLive] = useState<boolean | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((s: { live: boolean }) => setLive(s.live))
      .catch(() => setLive(false));
  }, []);

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col px-5 pb-16 sm:px-8">
      <header className="flex items-center justify-between py-5">
        <Wordmark />
        <Link href="/lab" className="text-[14px] text-ink-soft transition-colors duration-150 hover:text-ink">
          Sample tests
        </Link>
      </header>
      <main className="mt-6 flex-1">
        {live === null && <p className="text-[14px] text-graphite">Checking for a YouCam key…</p>}
        {live === false && <NoKey />}
        {live && (session ? <Swiping session={session} /> : <BareStep onReady={setSession} />)}
      </main>
    </div>
  );
}

function NoKey() {
  return (
    <section className="max-w-[620px]">
      <h1 className="text-[clamp(30px,4vw,44px)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">This server has no YouCam key.</h1>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-soft text-pretty">
        Live mode sends your bare photo to YouCam for skin analysis and skin tone analysis. To turn it on, the person running this server adds a key and
        restarts it.
      </p>
      <ol className="mt-7 divide-y divide-rule border-y border-rule text-[15px]">
        <li className="py-4">Create an API key in the YouCam API console.</li>
        <li className="py-4">
          Add <code className="figure rounded bg-slide px-1.5 py-0.5 text-[13px]">YOUCAM_API_KEY=your-key</code> to{" "}
          <code className="figure rounded bg-slide px-1.5 py-0.5 text-[13px]">.env.local</code>.
        </li>
        <li className="py-4">Restart the server and open this page again.</li>
      </ol>
      <Link
        href="/lab"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
      >
        Open the sample tests
      </Link>
    </section>
  );
}

function Capture({ label, hint, busy, onFile }: { label: string; hint: string; busy: string | null; onFile: (b: Blob) => void }) {
  const [open, setOpen] = useState(false);
  const [noCamera, setNoCamera] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    setTimeout(() => opener.current?.focus());
  };
  const fail = useCallback(() => {
    setOpen(false);
    setNoCamera(true);
  }, []);
  const tile = `group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-1.5 rounded-[22px] bg-ink p-5 text-left text-paper transition-transform duration-150 ease-out has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-wax ${busy ? "cursor-progress" : "active:scale-[0.98]"}`;
  const input = (
    <input
      ref={file}
      type="file"
      accept="image/jpeg,image/png"
      capture="user"
      className="sr-only"
      aria-disabled={Boolean(busy)}
      onClick={(e) => busy && e.preventDefault()}
      onChange={(e) => {
        const picked = e.target.files?.[0];
        e.target.value = "";
        if (picked) onFile(picked);
      }}
    />
  );
  const face = (
    <>
      <span className="text-[18px] font-medium tracking-[-0.01em]" aria-live="polite">
        {busy ?? label}
      </span>
      <span
        aria-hidden
        className="row-span-2 grid size-14 place-items-center rounded-full bg-paper text-ink transition-transform duration-200 group-hover:scale-105"
      >
        {busy ? (
          <span className="size-3 animate-pulse rounded-full bg-wax motion-reduce:animate-none" />
        ) : (
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M3 9.5A2.5 2.5 0 0 1 5.5 7h1.6l1.4-2h7l1.4 2h1.6A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        )}
      </span>
      <span className="text-[14px] leading-relaxed text-paper/65">{hint}</span>
    </>
  );
  if (noCamera)
    return (
      <>
        <label aria-busy={Boolean(busy)} className={tile}>
          {input}
          {face}
        </label>
        <p className="mt-3 text-[13px] text-graphite">The camera did not open here, so this uses your photo library or camera app.</p>
      </>
    );
  return (
    <>
      <button
        ref={opener}
        type="button"
        aria-busy={Boolean(busy)}
        aria-disabled={Boolean(busy)}
        onClick={() => !busy && (hasCamera() ? setOpen(true) : file.current?.click())}
        className={`${tile} focus-visible:outline-offset-2`}
      >
        {face}
      </button>
      <label className="mt-3 inline-block cursor-pointer rounded text-[13px] text-ink-soft underline decoration-rule underline-offset-4 hover:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-wax">
        {input}
        Or upload a photo
      </label>
      {open && (
        <Viewfinder
          label={label}
          onShot={(b) => {
            close();
            onFile(b);
          }}
          onClose={close}
          onFail={fail}
        />
      )}
    </>
  );
}

function BareStep({ onReady }: { onReady: (s: Session) => void }) {
  const saved = useSaved();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Photo | null>(null);

  const take = async (file: Blob) => {
    setError(null);
    try {
      setBusy("Finding your face…");
      const { blob, photo } = await shoot(file);
      setPreview(photo);
      checkCheeks(photo);
      setBusy("YouCam is reading your skin…");
      const form = new FormData();
      form.set("photo", blob, "bare.jpg");
      const result = await send<{ fileId: string; masks: string[]; tone: { skin: string } }>("/api/analyze", form);
      onReady({ bare: await bareOf(photo, result.masks, result.tone.skin), fileId: result.fileId, masks: result.masks });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-16">
      <div className={preview ? "max-lg:order-last" : "max-lg:hidden"}>
        {preview ? <Face photo={preview} className="rounded-[20px] shadow-lift" /> : <Placeholder />}
      </div>
      <section className="max-w-[560px]">
        <Steps at={0} />
        <h1 className="mt-5 text-[clamp(34px,4.6vw,52px)] font-semibold leading-[1.0] tracking-[-0.045em] text-balance">Start with bare skin.</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft text-pretty">
          Face a window, hold the phone at arm’s length and look straight at it. Hair off your cheeks, no makeup. This photo is the reference every swipe is
          measured against.
        </p>
        <div className="mt-8">
          <Capture
            label="Take the bare photo"
            hint="YouCam finds spots and redness to keep out of the reading, and reads your skin tone. 29 units."
            busy={busy}
            onFile={take}
          />
          {error && (
            <p role="alert" className="mt-3 text-[14px] leading-relaxed text-wax-ink">
              {error}
            </p>
          )}
        </div>
        <p className="mt-5 text-[13px] leading-relaxed text-graphite">
          Only the bare photo goes to YouCam. Swipes are measured in this browser. Veil keeps no photos, and this browser keeps only the numbers.
        </p>
        {saved && <LastTime saved={saved} />}
      </section>
    </div>
  );
}

const STEPS = ["Bare photo", "Swipe", "Reading"];

function Steps({ at }: { at: number }) {
  return (
    <ol aria-label={`Step ${at + 1} of ${STEPS.length}`} className="grid grid-cols-3 gap-2">
      {STEPS.map((name, i) => (
        <li key={name} aria-current={i === at ? "step" : undefined}>
          <span className={`block h-1 rounded-full ${i <= at ? "bg-ink" : "bg-rule"}`} />
          <span className={`label mt-2 block ${i === at ? "!text-ink" : ""}`}>{name}</span>
        </li>
      ))}
    </ol>
  );
}

function Placeholder() {
  return <div className="aspect-[4/5] rounded-[20px] bg-slide" />;
}

function LastTime({ saved }: { saved: Saved }) {
  const [confirm, setConfirm] = useState(false);
  const day = new Date(saved.at).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return (
    <div className="mt-16 border-t border-rule pt-8 [&>section]:mt-8">
      <p className="text-[15px] text-ink-soft">
        Your shelf from {day}, from {saved.swipes.length} {saved.swipes.length === 1 ? "swipe" : "swipes"}. Take it to the shop.
      </p>
      <Shelf skin={saved.skin} tone={saved.tone} swipes={saved.swipes} selected={null} onSelect={null} onSwipe={null} swiping={false} />
      <div className="mt-6">
        {confirm ? (
          <span className="flex flex-wrap items-center gap-3 text-[14px] text-ink-soft">
            Forget this shelf on this browser?
            <button type="button" onClick={() => save(null)} className="rounded-full bg-wax-ink px-4 py-2 text-[13px] font-medium text-paper">
              Forget it
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="rounded-full px-4 py-2 text-[13px] text-ink-soft hover:text-ink">
              Keep it
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="text-[13px] text-graphite underline decoration-rule underline-offset-4 hover:text-ink-soft"
          >
            Forget this shelf
          </button>
        )}
      </div>
    </div>
  );
}

function Swiping({ session }: { session: Session }) {
  const { bare, fileId, masks } = session;
  const [swipes, setSwipes] = useState<Swiped[]>([]);
  const [treated, setTreated] = useState<Side | null>(null);
  const [asking, setAsking] = useState<Pick | null>({ productId: SHELF[0].id, shade: SHELF[0].film[0].name });
  const [view, setView] = useState<View>("swiped");
  const [tryOn, setTryOn] = useState<{ id: string; label: string; image: string | null } | null>(null);
  const [planted, setPlanted] = useState<{ busy: boolean; result: Plant | null; error: string | null }>({ busy: false, result: null, error: null });
  const [retest, setRetest] = useState<Test | null>(null);
  const [white, setWhite] = useState<string | null>(null);
  const renders = useRef(new Map<string, Promise<string>>());

  const render = (hex: string, coverage: number) => {
    const key = `${hex}:${coverage.toFixed(3)}`;
    const hit = renders.current.get(key);
    if (hit) return hit;
    const job = send<{ image: string }>("/api/render", { fileId, hex, coverage: Math.min(1, coverage) }).then((r) => r.image);
    renders.current.set(key, job);
    job.catch(() => renders.current.delete(key));
    return job;
  };

  useEffect(() => {
    if (!swipes.length) return;
    save({ skin: bare.skin, tone: bare.tone, swipes: swipes.map((s) => ({ productId: s.productId, shade: s.shade, dE: s.test.cast.dE })), at: Date.now() });
  }, [swipes, bare]);

  if (asking) {
    return (
      <SwipeStep
        bare={bare}
        pick={asking}
        treated={treated}
        again={swipes.length > 0}
        onDone={(pick, side, test) => {
          setTreated(side);
          setSwipes((s) => [...s.filter((x) => x.productId !== pick.productId), { ...pick, test }]);
          setAsking(null);
          setTryOn(null);
          setView("swiped");
          scrollTo({ top: 0 });
          requestAnimationFrame(() => document.getElementById("reading")?.focus({ preventScroll: true }));
        }}
        onCancel={swipes.length ? () => setAsking(null) : null}
      />
    );
  }

  const latest = swipes.at(-1)!;
  const side = treated!;

  const select = async (p: Prediction | null) => {
    if (!p) return setTryOn(null);
    const label = `${p.product.name}${p.product.film.length > 1 ? `, ${p.shade.name}` : ""}`;
    setTryOn({ id: p.product.id, label, image: null });
    try {
      const image = await render(p.shade.hex, coverageOf(bare.skin, p));
      setTryOn((t) => (t?.id === p.product.id ? { ...t, image } : t));
    } catch {
      setTryOn((t) => (t?.id === p.product.id ? null : t));
    }
  };

  const runPlant = async () => {
    setPlanted({ busy: true, result: null, error: null });
    try {
      const film = await render(PLANT_HEX, PLANT_COVERAGE);
      setWhite(film);
      setPlanted({ busy: false, result: await plant(bare, film, side), error: null });
    } catch (e) {
      setPlanted({ busy: false, result: null, error: (e as Error).message });
    }
  };

  return (
    <Bench
      lead={<Verdict swiped={latest} treated={side} />}
      face={
        <FacePanel
          bare={bare}
          swiped={latest}
          treated={side}
          view={view}
          onView={(v) => {
            setTryOn(null);
            setView(v);
          }}
          tryOn={tryOn}
          note={
            tryOn && (
              <button
                type="button"
                onClick={() => setTryOn(null)}
                className="text-[13px] text-ink-soft underline decoration-rule underline-offset-4 hover:text-ink"
              >
                Back to the swipe
              </button>
            )
          }
        />
      }
    >
      <Reading swiped={latest} />
      <Shelf
        skin={bare.skin}
        tone={bare.tone}
        swipes={swipes.map((s) => ({ productId: s.productId, shade: s.shade, dE: s.test.cast.dE }))}
        selected={tryOn?.id ?? null}
        onSelect={select}
        swiping={false}
        onSwipe={(next) => setAsking({ productId: next.product.id, shade: next.shade.name })}
      />
      <p className="mt-6 text-[14px] text-ink-soft">
        Testing something else?{" "}
        <button
          type="button"
          onClick={() => setAsking({ productId: OTHER, shade: "Untinted" })}
          className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
        >
          Swipe another sunscreen
        </button>
      </p>
      <Trace bare={bare} masks={masks} render={white} replay={false} />
      <Proof
        plant={planted.result}
        retest={retest}
        action={
          <div className="mt-8 flex flex-wrap items-start gap-3">
            <button
              type="button"
              onClick={runPlant}
              disabled={planted.busy}
              className="rounded-full border border-rule px-5 py-3 text-[14px] font-medium transition-colors duration-150 hover:border-graphite disabled:opacity-50"
            >
              {planted.busy ? "Planting and measuring…" : "Plant a cast (1 unit)"}
            </button>
            <RetestButton bare={bare} side={side} onTest={setRetest} />
            {planted.error && (
              <p role="alert" className="w-full text-[13px] text-wax-ink">
                {planted.error}
              </p>
            )}
          </div>
        }
      />
    </Bench>
  );
}

function RetestButton({ bare, side, onTest }: { bare: Bare; side: Side; onTest: (t: Test) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <label className="inline-block cursor-pointer rounded-full border border-rule px-5 py-3 text-[14px] font-medium transition-colors duration-150 hover:border-graphite has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-wax">
        <input
          type="file"
          accept="image/jpeg,image/png"
          capture="user"
          className="sr-only"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setBusy(true);
            setError(null);
            try {
              onTest(testSwipe(bare, (await shoot(file)).photo, side));
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
        {busy ? "Measuring…" : "Wash it off, take a bare photo (free)"}
      </label>
      {error && (
        <p role="alert" className="mt-2 text-[13px] text-wax-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function SwipeStep({
  bare,
  pick: initial,
  treated,
  again,
  onDone,
  onCancel,
}: {
  bare: Bare;
  pick: Pick;
  treated: Side | null;
  again: boolean;
  onDone: (pick: Pick, side: Side, test: Test) => void;
  onCancel: (() => void) | null;
}) {
  const [pick, setPick] = useState(initial);
  const [shot, setShot] = useState<Photo | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const product = listed(pick.productId) ? sunscreenById(pick.productId) : null;

  const take = async (file: Blob) => {
    setError(null);
    setBusy("Finding your face…");
    try {
      const { photo } = await shoot(file);
      if (treated) finish(photo, treated);
      else setShot(photo);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const finish = (photo: Photo, side: Side) => {
    try {
      const test = testSwipe(bare, photo, side);
      if (test.gate.reason) {
        URL.revokeObjectURL(photo.image);
        setShot(null);
        setError(test.gate.reason);
        return;
      }
      onDone(pick, side, test);
    } catch (e) {
      setShot(null);
      setError((e as Error).message);
    }
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-16">
      <div className={shot ? "" : "max-lg:hidden"}>
        {shot ? (
          <figure>
            <Face photo={shot} className="rounded-[20px] shadow-lift" />
            <figcaption className="mt-4">
              <p className="text-[15px] font-medium">In this photo, which cheek has the sunscreen?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["left", "right"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => finish(shot, s)}
                    className="rounded-full bg-slide px-4 py-3 text-[14px] font-medium transition-transform duration-150 hover:bg-rule active:scale-[0.97]"
                  >
                    The {s} one
                  </button>
                ))}
              </div>
            </figcaption>
          </figure>
        ) : (
          <Face photo={bare.photo} className="rounded-[20px] shadow-lift" />
        )}
      </div>
      <section className="max-w-[560px]">
        <Steps at={1} />
        <h1 className="mt-5 text-[clamp(34px,4.6vw,52px)] font-semibold leading-[1.0] tracking-[-0.045em] text-balance">
          {again ? "Wash it off. Swipe the next one." : "Swipe one cheek only."}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft text-pretty">
          {again
            ? "Rinse the last swipe away and pat dry. Then put a pea-sized amount on the same cheek. The other cheek stays bare, so it can tell Veil how the light changed."
            : "Put a pea-sized amount on one cheek and leave the other bare. The bare cheek tells Veil how the light changed between photos, so only the sunscreen is left."}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block">
            <span className="text-[13px] text-ink-soft">Sunscreen</span>
            <select
              value={pick.productId}
              onChange={(e) => {
                const p = listed(e.target.value) ? sunscreenById(e.target.value) : null;
                setPick({ productId: e.target.value, shade: p ? p.film[0].name : "Untinted" });
              }}
              className="mt-1.5 block w-full rounded-xl bg-slide px-4 py-3 text-[16px]"
            >
              {SHELF.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value={OTHER}>One that is not listed</option>
            </select>
          </label>
          {product && product.film.length > 1 && (
            <label className="block">
              <span className="text-[13px] text-ink-soft">Shade</span>
              <select
                value={pick.shade}
                onChange={(e) => setPick({ ...pick, shade: e.target.value })}
                className="mt-1.5 block w-full rounded-xl bg-slide px-4 py-3 text-[16px]"
              >
                {product.film.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>

        <RubTimer />

        <div className="mt-6">
          <Capture
            label="Take the swiped photo"
            hint="Same window, same distance, same camera as the bare photo. Measured in this browser, free."
            busy={busy}
            onFile={take}
          />
          {error && (
            <p role="alert" className="mt-3 text-[14px] leading-relaxed text-wax-ink">
              {error}
            </p>
          )}
        </div>
        <p className="mt-4 text-[13px] text-graphite">Testing: {productLabel(pick)}</p>
        {onCancel && (
          <button type="button" onClick={onCancel} className="mt-6 text-[13px] text-graphite underline decoration-rule underline-offset-4 hover:text-ink-soft">
            Back to the results
          </button>
        )}
      </section>
    </div>
  );
}

function RubTimer() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (left === null || left <= 0) return;
    const id = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  const done = left === 0;
  const running = left !== null && !done;
  return (
    <div className="mt-6 flex items-center gap-4 rounded-[20px] bg-slide px-5 py-4">
      <svg viewBox="0 0 36 36" className="size-10 shrink-0 -rotate-90" aria-hidden>
        <circle cx="18" cy="18" r="15" className="fill-none stroke-rule" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15"
          pathLength={RUB_SECONDS}
          className="fill-none stroke-ink transition-[stroke-dashoffset] duration-1000 ease-linear"
          strokeWidth="3"
          strokeDasharray={RUB_SECONDS}
          strokeDashoffset={left === null ? RUB_SECONDS : left}
        />
      </svg>
      <p className="flex-1 text-[14px] leading-relaxed text-ink-soft">
        {left === null
          ? "Rub it in for 30 seconds, the way you would every morning."
          : done
            ? "Done. Let it settle for a minute, then take the photo."
            : `Keep rubbing. ${left} seconds left.`}
      </p>
      <span className="sr-only" aria-live="polite">
        {left === RUB_SECONDS ? "Timer started, 30 seconds." : done ? "Done. Let it settle, then take the photo." : ""}
      </span>
      <button
        type="button"
        aria-disabled={running}
        onClick={() => !running && setLeft(RUB_SECONDS)}
        className={`min-w-16 rounded-full px-4 py-2 text-[13px] font-medium transition-transform duration-150 ${running ? "figure text-ink" : "bg-paper shadow-lift active:scale-[0.97]"}`}
      >
        {running ? `${left}s` : done ? "Again" : "Start"}
      </button>
    </div>
  );
}
