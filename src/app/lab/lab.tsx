"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/mark";
import { depthOf } from "@/lib/cast";
import { hexToLab } from "@/lib/color";
import { type Photo, type Side, photoOf } from "@/lib/measure";
import { type Prediction, sunscreenById } from "@/lib/shelf";
import { type Bare, type Gate, PLANT_COVERAGE, PLANT_HEX, type Plant, type Test, bareOf, filmRender, gateOf, plant, testSwipe } from "@/lib/veil";
import { Bench, FacePanel, Proof, Reading, type Recorded, Shelf, Trace, Verdict, type Swiped, type View, coverageOf } from "./report";

type Film = { photo: string; productId: string; hex: string; opacity: number };
type Subject = {
  id: string;
  credit: string;
  license: string;
  source: string;
  treated: Side;
  bare: string;
  masks: string[];
  tone: string;
  swipes: Film[];
  retake: string;
  retest: string;
};

const ORDER = ["elder", "portrait", "market", "freckles"];

const shadeOf = (f: Film) => sunscreenById(f.productId).film.find((s) => s.hex === f.hex)?.name ?? "Untinted";

const at = (s: Subject, file: string) => `/replay/${s.id}/${file}`;

type Session = {
  subject: Subject;
  bare: Bare;
  swipes: Swiped[];
  retake: { photo: Photo; gate: Gate } | null;
  plant: Plant | null;
  retest: Test | null;
  recorded: Recorded | null;
};

async function load(path: string) {
  const photo = await photoOf(path);
  if (!photo) throw new Error(`No face found in ${path}.`);
  return photo;
}

function useSubjects() {
  const [subjects, setSubjects] = useState<(Subject & { skin: string })[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const list = (await (await fetch("/replay/manifest.json")).json()) as Subject[];
      const sorted = ORDER.map((id) => list.find((s) => s.id === id)!).filter(Boolean);
      const tones = await Promise.all(sorted.map(async (s) => (await (await fetch(at(s, s.tone))).json()).color.skin_color as string));
      setSubjects(sorted.map((s, i) => ({ ...s, skin: tones[i] })));
    })().catch(() => setError("The sample tests did not load. Reload the page to try again."));
  }, []);
  return { subjects, error };
}

function useSession(subject: (Subject & { skin: string }) | null) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subject) return;
    let alive = true;
    const update = (f: (s: Session) => Session) => alive && setSession((s) => (s && s.subject.id === subject.id ? f(s) : s));
    (async () => {
      setSession(null);
      setError(null);
      const bare = await bareOf(
        await load(at(subject, subject.bare)),
        subject.masks.map((m) => at(subject, m)),
        subject.skin,
      );
      const recorded = await fetch(at(subject, "calls.json"))
        .then((r) => (r.ok ? (r.json() as Promise<Recorded>) : null))
        .catch(() => null);
      const first = subject.swipes[0];
      const test = testSwipe(bare, await load(at(subject, first.photo)), subject.treated);
      if (!alive) return;
      setSession({ subject, bare, swipes: [{ productId: first.productId, shade: shadeOf(first), test }], retake: null, plant: null, retest: null, recorded });
      const retake = await load(at(subject, subject.retake));
      update((s) => ({ ...s, retake: { photo: retake, gate: gateOf(bare.photo, retake) } }));
      const retest = testSwipe(bare, await load(at(subject, subject.retest)), subject.treated);
      update((s) => ({ ...s, retest }));
      const film = await filmRender(bare.photo, PLANT_HEX, PLANT_COVERAGE);
      const planted = await plant(bare, film, subject.treated).finally(() => URL.revokeObjectURL(film));
      update((s) => ({ ...s, plant: planted }));
    })().catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [subject]);

  const swipeNext = async (next: Prediction) => {
    if (!session) return;
    const film = session.subject.swipes.find((f) => f.productId === next.product.id);
    if (!film) {
      setError(`This sample has no recorded swipe of ${next.product.name}.`);
      return;
    }
    try {
      const test = testSwipe(session.bare, await load(at(session.subject, film.photo)), session.subject.treated);
      setSession((s) =>
        s?.subject.id === session.subject.id ? { ...s, swipes: [...s.swipes, { productId: film.productId, shade: shadeOf(film), test }] } : s,
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return { session, error, swipeNext };
}

export function Lab() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { subjects, error: listError } = useSubjects();
  const subject = subjects?.find((s) => s.id === params.get("s")) ?? subjects?.[0] ?? null;
  const { session, error: sessionError, swipeNext } = useSession(subject);
  const error = listError ?? sessionError;
  const [aboutOpen, setAboutOpen] = useState(false);

  const choose = (id: string) => {
    const q = new URLSearchParams(params);
    q.set("s", id);
    router.replace(`${pathname}?${q}`, { scroll: false });
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col px-5 pb-16 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 py-5">
        <Wordmark />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAboutOpen((o) => !o)}
            aria-expanded={aboutOpen}
            className="label rounded-full px-3 py-2 transition-colors duration-150 hover:bg-slide hover:text-ink"
          >
            Replay data
          </button>
          <Link
            href="/lab/live"
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
          >
            Use my camera
          </Link>
        </div>
      </header>

      {aboutOpen && (
        <p className="mb-6 max-w-[70ch] animate-[rise_200ms_var(--ease-out-strong)] rounded-2xl bg-slide px-5 py-4 text-[14px] leading-relaxed text-ink-soft">
          These samples are licensed portraits with sunscreen painted on by a local filter, not real sunscreen. A local approximator stands in for YouCam skin
          analysis, skin tone analysis and makeup try-on, in the same shapes the API returns. The face finding, light check, cast measurement, shelf and
          self-tests are the same code that runs on your camera. The products are a sample shop.
        </p>
      )}

      {subjects && (
        <nav aria-label="Sample faces" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          {subjects.map((s, i) => {
            const depth = depthOf(hexToLab(s.skin));
            const on = s.id === subject?.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                aria-pressed={on}
                className={`flex shrink-0 items-center gap-3 rounded-2xl py-2 pr-4 pl-2 text-left transition-colors duration-150 ${on ? "bg-slide" : "hover:bg-slide/60"}`}
              >
                <span aria-hidden className="size-8 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)]" style={{ background: s.skin }} />
                <span>
                  <span className={`block text-[13px] font-medium ${on ? "text-ink" : "text-ink-soft"}`}>Sample {i + 1}</span>
                  <span className="block text-[12px] text-graphite">{depth.name} skin</span>
                </span>
              </button>
            );
          })}
        </nav>
      )}

      <main className="mt-8 flex-1">
        {error && (
          <p role="alert" className="mb-6 text-[15px] text-wax-ink">
            {error}
          </p>
        )}
        {session ? <Report session={session} swipeNext={swipeNext} /> : !error && <Loading />}
      </main>

      {session && (
        <footer className="mt-20 border-t border-rule pt-5 text-[12px] text-graphite">
          Photo: {session.subject.credit}, {session.subject.license},{" "}
          <a href={session.subject.source} className="underline decoration-rule underline-offset-2 hover:text-ink-soft">
            Wikimedia Commons
          </a>
          . Cropped, with sunscreen painted on by a filter for this demo.
        </footer>
      )}
    </div>
  );
}

function Report({ session, swipeNext }: { session: Session; swipeNext: (p: Prediction) => Promise<void> }) {
  const { bare, swipes, subject } = session;
  const [view, setView] = useState<View>("swiped");
  const [tryOn, setTryOn] = useState<{ id: string; label: string; image: string | null } | null>(null);
  const [swiping, setSwiping] = useState(false);
  const latest = swipes.at(-1)!;

  const select = async (p: Prediction | null) => {
    if (!p) return setTryOn(null);
    const label = `${p.product.name}${p.product.film.length > 1 ? `, ${p.shade.name}` : ""}`;
    setTryOn({ id: p.product.id, label, image: null });
    try {
      const image = await filmRender(bare.photo, p.shade.hex, coverageOf(bare.skin, p));
      setTryOn((t) => (t?.id === p.product.id ? { ...t, image } : (URL.revokeObjectURL(image), t)));
    } catch {
      setTryOn((t) => (t?.id === p.product.id ? null : t));
    }
  };

  const shown = tryOn?.id !== "retake" ? tryOn?.image : null;
  useEffect(() => () => void (shown && URL.revokeObjectURL(shown)), [shown]);

  const refused = session.retake;

  return (
    <Bench
      lead={<Verdict swiped={latest} treated={subject.treated} />}
      face={
        <FacePanel
          bare={bare}
          swiped={latest}
          treated={subject.treated}
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
      {refused && (
        <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
          One earlier photo of this swipe was refused, because the light balance on the forehead had moved{" "}
          <span className="figure text-ink">{(Math.abs(refused.gate.light) * 100).toFixed(0)}%</span>.{" "}
          <button
            type="button"
            onClick={() => setTryOn({ id: "retake", label: "lit from one side", image: refused.photo.image })}
            className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
          >
            See it
          </button>
        </p>
      )}
      {swipes.length > 1 && (
        <ul className="mt-8 border-t border-rule">
          {swipes.map((s) => (
            <li key={s.productId} className="flex items-baseline justify-between gap-4 border-b border-rule py-3 text-[14px]">
              <span className="text-ink-soft">{sunscreenById(s.productId).name}</span>
              <span className="figure text-ink">{s.test.cast.dE.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      )}
      <Shelf
        skin={bare.skin}
        tone={bare.tone}
        swipes={swipes.map((s) => ({ productId: s.productId, shade: s.shade, dE: s.test.cast.dE }))}
        selected={tryOn?.id ?? null}
        onSelect={select}
        swiping={swiping}
        onSwipe={async (next) => {
          setSwiping(true);
          setTryOn(null);
          await swipeNext(next).finally(() => setSwiping(false));
          setView("swiped");
          scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        }}
      />
      <Trace bare={bare} masks={subject.masks.map((m) => at(subject, m))} render={at(subject, "vto-white.jpg")} replay recorded={session.recorded} />
      <Proof plant={session.plant} retest={session.retest} />
      <Sweep current={subject.id} />
    </Bench>
  );
}

const SWEEP = [
  { id: "elder", skin: "Dark", planted: 9.7, found: 9.7, quiet: 0.1 },
  { id: "portrait", skin: "Tan", planted: 6.9, found: 6.9, quiet: 0.2 },
  { id: "market", skin: "Intermediate", planted: 5.1, found: 5.0, quiet: 0.2 },
  { id: "freckles", skin: "Light", planted: 3.6, found: 3.6, quiet: 0.0 },
];

function Sweep({ current }: { current: string }) {
  return (
    <div className="mt-10">
      <h3 className="text-[16px] font-medium">All four samples</h3>
      <table className="mt-3 w-full text-left text-[14px]">
        <thead className="label">
          <tr className="border-b border-ink">
            <th className="py-2 font-normal">Sample</th>
            <th className="py-2 text-right font-normal">Planted</th>
            <th className="py-2 text-right font-normal">Found</th>
            <th className="py-2 text-right font-normal">No sunscreen</th>
          </tr>
        </thead>
        <tbody className="figure">
          {SWEEP.map((r, i) => (
            <tr key={r.id} aria-current={r.id === current || undefined} className={`border-b border-rule ${r.id === current ? "text-ink" : "text-ink-soft"}`}>
              <td className="py-2.5 font-sans">
                Sample {i + 1}, {r.skin.toLowerCase()}
              </td>
              <td className="py-2.5 text-right">{r.planted.toFixed(1)}</td>
              <td className="py-2.5 text-right">{r.found.toFixed(1)}</td>
              <td className="py-2.5 text-right">{r.quiet.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 max-w-[62ch] text-[12px] leading-relaxed text-graphite">
        ΔE00, measured by this page. Every planted cast is found within 0.1, and every bare retest reads Invisible. The bands follow published colour
        thresholds: about 0.8 ΔE00 is the point where half of observers see a difference and 1.8 where half reject it (Paravina et al., 2015). So Invisible ends
        at 1.5 and Faint at 3. Above about 5, observers see two different colours (Mokrzycki and Tatol, 2011), so Ghost starts at 6.
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-16">
      <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-slide" />
      <div className="space-y-4 pt-2">
        <div className="h-3 w-48 rounded-full bg-slide" />
        <div className="h-24 w-72 animate-pulse rounded-2xl bg-slide" />
        <p className="text-[13px] text-graphite">Finding the face, placing a patch on each cheek, reading the swipe.</p>
      </div>
    </div>
  );
}
