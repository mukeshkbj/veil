"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";
import { Face } from "@/components/face";
import { CastMeter, RangeBar, SplitSwatch } from "@/components/meter";
import { type Cast, type Verdict, depthOf, mean, wordOf } from "@/lib/cast";
import { type Lab, hexToLab, labToHex } from "@/lib/color";
import { cheek, money, one, signed } from "@/lib/format";
import { type Offset, type Side, flaggedShare, patchOf } from "@/lib/measure";
import { type Advice, type Prediction, type Swipe, calibrates, listed, nextSwipe, predictShelf, solveOpacity, sunscreenById } from "@/lib/shelf";
import { type Bare, LIGHT_LIMIT, PLANT_COVERAGE, type Plant, TURN_LIMIT, type Test } from "@/lib/veil";

export type Swiped = { productId: string; shade: string; test: Test };

const LINES: Record<Verdict, string> = {
  invisible: "Nobody would see it. The swiped cheek matches the bare one as closely as a camera can tell.",
  faint: "You might catch it in a mirror in daylight. Someone across a table would not.",
  visible: "Someone across a table would see an ashy layer on that cheek.",
  ghost: "It reads as a grey mask. Anyone in the room would see it.",
};

export const productLabel = (s: { productId: string; shade: string }) =>
  listed(s.productId) ? `${sunscreenById(s.productId).name}${sunscreenById(s.productId).film.length > 1 ? `, ${s.shade}` : ""}` : "Your sunscreen";

export function Bench({ lead, face, children }: { lead: ReactNode; face: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-0">
      <div className="min-w-0 max-w-[620px] lg:col-start-2">{lead}</div>
      <div className="lg:sticky lg:top-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">{face}</div>
      <div className="min-w-0 max-w-[620px] lg:col-start-2">{children}</div>
    </div>
  );
}

export type View = "bare" | "swiped" | "map";

const VIEWS: { id: View; name: string }[] = [
  { id: "bare", name: "Bare" },
  { id: "swiped", name: "Swiped" },
  { id: "map", name: "Cast map" },
];

export function FacePanel({
  bare,
  swiped,
  treated,
  view,
  onView,
  tryOn,
  note,
}: {
  bare: Bare;
  swiped: Swiped;
  treated: Side;
  view: View;
  onView: (v: View) => void;
  tryOn: { id: string; label: string; image: string | null } | null;
  note: ReactNode;
}) {
  const { test } = swiped;
  const onBare = view === "bare";
  return (
    <figure>
      <Face
        photo={onBare || tryOn ? bare.photo : test.photo}
        image={tryOn?.image ?? null}
        treated={tryOn ? null : treated}
        patches={tryOn ? null : onBare ? test.reading.patches.bare : test.reading.patches.swiped}
        map={!tryOn && view === "map" ? test.map : null}
        className="rounded-[20px] shadow-lift"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {tryOn ? (
          <p className="text-[13px] text-ink-soft">
            {tryOn.image ? (
              <>
                {tryOn.id === "retake" ? "Refused" : "Try-on"}: <span className="font-medium text-ink">{tryOn.label}</span>
              </>
            ) : (
              <>Rendering {tryOn.label}…</>
            )}
          </p>
        ) : (
          <div role="group" aria-label="Photo" className="inline-flex rounded-full bg-slide p-1">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={view === v.id}
                onClick={() => onView(v.id)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-150 ${view === v.id ? "bg-paper text-ink shadow-lift" : "text-ink-soft hover:text-ink"}`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        {note}
      </div>
      {view === "map" && !tryOn && (
        <figcaption className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-ink-soft">
          Each red dot marks skin that is lighter than it should be after the light change. Bigger dots mean more film.
        </figcaption>
      )}
    </figure>
  );
}

const darker = (cast: Cast) => cast.verdict !== "invisible" && cast.dL < 0;

export function Verdict({ swiped, treated }: { swiped: Swiped; treated: Side }) {
  const { cast } = swiped.test;
  return (
    <header>
      <p className="label">
        {productLabel(swiped)} · {cheek(treated)}
      </p>
      <h1 id="reading" tabIndex={-1} className="mt-3 outline-none text-[clamp(64px,9vw,120px)] font-semibold leading-[0.88] tracking-[-0.05em]">
        {cast.clear ? `${wordOf(cast.verdict)}.` : "Unclear."}
      </h1>
      <p className="mt-5 max-w-[48ch] text-[18px] leading-[1.5] text-ink-soft text-pretty">
        {cast.clear
          ? darker(cast)
            ? "It shows as a darker patch, not a white cast. This shade is too deep for your skin."
            : LINES[cast.verdict]
          : "The tiles on each cheek disagree too much to call it. Take both photos again by a window, with your hair off your face."}
      </p>
    </header>
  );
}

export function Reading({ swiped }: { swiped: Swiped }) {
  const { cast } = swiped.test;
  return (
    <section aria-labelledby="reading">
      <div className="lg:mt-9">
        <CastMeter skin={cast.bare} cast={cast} />
        <p className="mt-3 text-[13px] leading-relaxed text-graphite">The scale is painted in your own cheek colour, from bare skin to a heavy white cast.</p>
      </div>
      <Figures cast={cast} />
      <Gate swiped={swiped} />
    </section>
  );
}

function Figures({ cast }: { cast: Cast }) {
  const rows = [
    {
      name: "Colour difference",
      value: one(cast.dE),
      unit: "ΔE00",
      note: `90% range ${one(cast.interval[0])} to ${one(cast.interval[1])}`,
    },
    darker(cast)
      ? { name: "Darker by", value: one(-cast.dL), unit: "L*", note: "Lightness below where the cheek should be" }
      : { name: "Lighter by", value: signed(cast.dL), unit: "L*", note: "Lightness above where the cheek should be" },
    {
      name: "Greyer by",
      value: one(Math.max(0, cast.chromaLoss)),
      unit: "C*",
      note: "Colour the film took out of your skin",
    },
    {
      name: "White cast score",
      value: (Math.round(cast.whiteCast * 100) / 100 || 0).toFixed(2),
      unit: "WCS",
      note: "ΔL* over the room left to white",
    },
  ];
  return (
    <div className="mt-10 grid gap-x-10 gap-y-6 border-t border-rule pt-7 sm:grid-cols-[auto_minmax(0,1fr)]">
      <div className="flex items-center gap-4 sm:row-span-2 sm:flex-col sm:items-start">
        <SplitSwatch left={cast.expected} right={cast.actual} size={88} />
        <p className="max-w-[22ch] text-[13px] leading-relaxed text-ink-soft">Left half: where your cheek should be in this light. Right half: where it is.</p>
      </div>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:row-span-2">
        {rows.map((r) => (
          <div key={r.name}>
            <dt className="text-[13px] text-ink-soft">{r.name}</dt>
            <dd className="mt-1">
              <span className="figure text-[26px] leading-none font-medium text-ink">{r.value}</span>
              <span className="figure ml-1.5 text-[12px] text-graphite">{r.unit}</span>
            </dd>
            <dd className="mt-1.5 text-[12px] leading-snug text-graphite">{r.note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Gate({ swiped }: { swiped: Swiped }) {
  const { gate, reading } = swiped.test;
  const shift = mean(reading.swiped.control).L - mean(reading.bare.control).L;
  return (
    <p className="mt-8 rounded-2xl bg-slide px-5 py-4 text-[14px] leading-relaxed text-ink-soft">
      Your bare cheek is the control. Between the photos the room light changed it by <span className="figure text-ink">{signed(shift)} L*</span>, and Veil took
      that out of the swiped side. Light balance moved <span className="figure text-ink">{(Math.abs(gate.light) * 100).toFixed(1)}%</span> (limit{" "}
      {LIGHT_LIMIT * 100}%) and head turn <span className="figure text-ink">{Math.abs(gate.turn).toFixed(2)}</span> (limit {TURN_LIMIT}).
    </p>
  );
}

export function coverageOf(skin: Lab, p: Prediction) {
  return solveOpacity(skin, hexToLab(p.shade.hex), p.dE);
}

export function Shelf({
  skin,
  tone,
  swipes,
  selected,
  onSelect,
  onSwipe,
  swiping,
}: {
  skin: Lab;
  tone: Lab;
  swipes: Swipe[];
  selected: string | null;
  onSelect: ((p: Prediction | null) => void) | null;
  onSwipe: ((next: Prediction) => void) | null;
  swiping: boolean;
}) {
  const ranked = predictShelf(skin, swipes);
  const advice = nextSwipe(ranked);
  const depth = depthOf(tone);
  const calibrated = swipes.filter(calibrates).length;
  return (
    <section aria-labelledby="shelf" className="mt-24">
      <h2 id="shelf" className="text-[clamp(30px,3.8vw,48px)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
        What disappears on your skin
      </h2>
      <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-ink-soft text-pretty">
        YouCam skin tone analysis reads your skin as <span className="text-ink">{depth.name.toLowerCase()}</span> (ITA {Math.round(depth.angle)}°). Each
        prediction mixes a product’s film into your measured cheek colour,{" "}
        {calibrated ? `scaled by how thickly your ${calibrated === 1 ? "swipe" : "swipes"} went on.` : "at a typical amount."}
      </p>
      <Agent advice={advice} onSwipe={onSwipe} swiping={swiping} />
      <ol className="mt-8 border-t border-rule">
        {ranked.map((p) => (
          <ShelfRow key={p.product.id} p={p} skin={skin} selected={selected === p.product.id} onSelect={onSelect} />
        ))}
      </ol>
      <p className="mt-4 text-[12px] leading-relaxed text-graphite">
        Hollow dots are predictions with their 90% range. Solid dots are measured on your face.{onSelect && " Tap a product to try it on."}
      </p>
    </section>
  );
}

function ShelfRow({ p, skin, selected, onSelect }: { p: Prediction; skin: Lab; selected: boolean; onSelect: ((p: Prediction | null) => void) | null }) {
  const grid =
    "-mx-3 grid w-[calc(100%+24px)] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 rounded-xl px-3 py-4 text-left sm:grid-cols-[minmax(0,1.1fr)_minmax(120px,1fr)_96px]";
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span aria-hidden className="size-5 shrink-0 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)]" style={{ background: p.shade.hex }} />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium">{p.product.name}</span>
          <span className="block truncate text-[12px] text-graphite">
            {p.product.film.length > 1 ? `${p.shade.name} · ` : ""}
            {p.product.kind} · SPF {p.product.spf} · {money(p.product.price)}
          </span>
        </span>
      </span>
      <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
        <RangeBar skin={skin} value={p.dE} range={p.range} measured={p.measured} />
      </span>
      <span className="row-start-1 text-right sm:row-start-auto">
        <span className={`block text-[14px] ${p.verdict === "invisible" ? "font-medium text-ink" : "text-ink-soft"}`}>{wordOf(p.verdict)}</span>
        <span className="figure block text-[12px] text-graphite">
          {p.measured ? "measured " : ""}
          {one(p.dE)}
        </span>
      </span>
    </>
  );
  return (
    <li className="border-b border-rule">
      {onSelect ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onSelect(selected ? null : p)}
          className={`${grid} transition-colors duration-150 ${selected ? "bg-slide" : "hover:bg-slide/60"}`}
        >
          {body}
        </button>
      ) : (
        <div className={grid}>{body}</div>
      )}
    </li>
  );
}

function Agent({ advice, onSwipe, swiping }: { advice: Advice; onSwipe: ((next: Prediction) => void) | null; swiping: boolean }) {
  const [bagged, setBagged] = useState(false);
  if (advice.kind === "swipe") {
    const { next, rival } = advice;
    return (
      <div className="mt-8 rounded-[20px] bg-ink px-6 py-6 text-paper">
        <p className="text-[17px] leading-snug text-pretty">
          {next.product.name}
          {next.product.film.length > 1 ? ` in ${next.shade.name}` : ""} and {rival.product.name} could both vanish on you. Their ranges overlap, so a
          prediction cannot choose. One swipe of {next.product.name} on the same cheek will.
        </p>
        {onSwipe && (
          <button
            type="button"
            onClick={() => onSwipe(next)}
            disabled={swiping}
            className="mt-5 rounded-full bg-paper px-5 py-2.5 text-[14px] font-medium text-ink transition-transform duration-150 active:scale-[0.97] disabled:opacity-60"
          >
            {swiping ? "Measuring the swipe…" : `Swipe ${next.product.name}`}
          </button>
        )}
      </div>
    );
  }
  const { pick } = advice;
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-ink px-6 py-6 text-paper">
      <div className="min-w-0">
        <p className="label !text-paper/60">{pick.measured ? "Measured on your face" : "Best prediction"}</p>
        <p className="mt-2 text-[22px] leading-tight font-medium tracking-[-0.01em]">
          {pick.product.name}
          {pick.product.film.length > 1 ? `, ${pick.shade.name}` : ""}
        </p>
        <p className="mt-1 text-[14px] text-paper/70">
          {wordOf(pick.verdict)} on your skin · SPF {pick.product.spf} · {money(pick.product.price)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {!pick.measured && onSwipe && (
          <button
            type="button"
            onClick={() => onSwipe(pick)}
            disabled={swiping}
            className="rounded-full px-5 py-3 text-[14px] font-medium text-paper shadow-[inset_0_0_0_1px_oklch(1_0_0/0.25)] transition-transform duration-150 active:scale-[0.97] disabled:opacity-60"
          >
            {swiping ? "Measuring…" : "Confirm with a swipe"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setBagged((b) => !b)}
          className="rounded-full bg-wax-ink px-5 py-3 text-[14px] font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
        >
          {bagged ? "In your bag" : "Add to bag"}
        </button>
      </div>
    </div>
  );
}

const CALLS = [
  { path: "/v2.0/file", job: "Uploads the bare photo. Swipes stay in the browser." },
  { path: "/v2.1/task/skin-analysis", job: "Spot, redness and acne masks. The cheek patches move off them." },
  { path: "/v2.0/task/skin-tone-analysis", job: "Skin colour. It sets the cast scale and ranks the shelf." },
  { path: "/v2.0/task/makeup-vto", job: "Foundation try-on. It previews a product and plants the self-test cast." },
];

export type Recorded = { at: string; calls: { path: string; ms: number }[] };

export function Trace({
  bare,
  masks,
  render,
  replay,
  recorded = null,
}: {
  bare: Bare;
  masks: string[];
  render: string | null;
  replay: boolean;
  recorded?: Recorded | null;
}) {
  const { g } = bare.photo;
  const flags = bare.flags;
  const share = (o: Offset) => (flags ? (flaggedShare(g, patchOf(g, "left", o), flags) + flaggedShare(g, patchOf(g, "right", o), flags)) / 2 : 0);
  const before = share({ u: 0, v: 0 });
  const after = share(bare.offset);
  const moved = bare.offset.u !== 0 || bare.offset.v !== 0;
  const depth = depthOf(bare.tone);
  const hex = labToHex(bare.tone);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const took = (path: string) => recorded?.calls.find((c) => c.path === path)?.ms;
  return (
    <section aria-labelledby="trace" className="mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="trace" className="text-[clamp(30px,3.8vw,48px)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
          What YouCam returned
        </h2>
        {replay && <span className="label rounded-full bg-slide px-2.5 py-1">{recorded ? "Recorded" : "Replay"}</span>}
      </div>
      <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-ink-soft text-pretty">
        Three YouCam results decide where Veil looks, what colour it compares against and what each product looks like on you.
        {replay &&
          (recorded
            ? ` These are real YouCam responses for this photo, recorded on ${new Date(recorded.at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
            : " This sample replays a local stand-in that answers in the same shapes as the API.")}
      </p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <figure>
          <div className="relative overflow-hidden rounded-2xl bg-slide" style={{ aspectRatio: `${g.width} / ${g.height}` }}>
            <Image src={bare.photo.image} alt="The bare photo with flagged skin marked in red" fill unoptimized className="object-cover" />
            {masks.map((m) => (
              <div
                key={m}
                aria-hidden
                className="absolute inset-0 bg-wax opacity-85"
                style={{ maskImage: `url(${m})`, maskSize: "100% 100%", maskMode: "luminance" }}
              />
            ))}
            <svg viewBox={`0 0 ${g.width} ${g.height}`} className="absolute inset-0 size-full" aria-hidden>
              {(["left", "right"] as const).map((s) => {
                const p = patchOf(g, s, bare.offset);
                return <circle key={s} cx={p.x} cy={p.y} r={p.r} fill="none" stroke="white" strokeWidth={g.width / 220} />;
              })}
            </svg>
          </div>
          <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">Skin analysis.</span> Red marks spots, redness and acne. The circles are the patches Veil reads.{" "}
            {!flags ? (
              "No masks came back, so the patches stay centred."
            ) : moved ? (
              <>
                Centred, they would sit on <span className="figure text-ink">{pct(before)}</span> flagged skin. Moved, they sit on{" "}
                <span className="figure text-ink">{pct(after)}</span>, and that is left out of the reading.
              </>
            ) : (
              <>
                The centred spot was already the cleanest. The <span className="figure text-ink">{pct(after)}</span> of it that is flagged is left out of the
                reading.
              </>
            )}
          </figcaption>
        </figure>
        <figure>
          <div className="relative overflow-hidden rounded-2xl bg-slide" style={{ aspectRatio: `${g.width} / ${g.height}` }}>
            {render ? (
              <Image src={render} alt="YouCam try-on of white foundation over the face" fill unoptimized className="object-cover" />
            ) : (
              <p className="absolute inset-0 grid place-items-center p-6 text-center text-[13px] text-graphite">Runs when you plant a cast below.</p>
            )}
          </div>
          <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">Makeup try-on.</span> White foundation at{" "}
            <span className="figure text-ink">{Math.round(PLANT_COVERAGE * 100)}%</span> coverage. Veil lays it on one cheek to plant the self-test cast below.
          </figcaption>
        </figure>
      </div>
      <div className="mt-8 flex items-center gap-4">
        <span
          role="img"
          aria-label={`Skin tone swatch ${hex}`}
          className="size-14 shrink-0 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)]"
          style={{ background: hex }}
        />
        <p className="text-[13px] leading-relaxed text-ink-soft">
          <span className="font-medium text-ink">Skin tone.</span> <span className="figure text-ink">{hex}</span>, {depth.name.toLowerCase()}, ITA{" "}
          <span className="figure text-ink">{Math.round(depth.angle)}°</span>. It sets the scale under the meter and ranks the shelf.
        </p>
      </div>
      <ol className="mt-10 border-t border-rule">
        {CALLS.map((c) => (
          <li key={c.path} className="grid gap-1 border-b border-rule py-3 text-[14px] sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:gap-6">
            <code className="figure text-[13px] text-ink">
              POST {c.path}
              {took(c.path) !== undefined && <span className="ml-2 text-graphite">{(took(c.path)! / 1000).toFixed(1)} s</span>}
            </code>
            <span className="text-ink-soft">{c.job}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[12px] leading-relaxed text-graphite">
        29 units for the two analyses on the bare photo, 1 unit for each try-on. Each task is polled until it finishes.
      </p>
    </section>
  );
}

export function Proof({ plant, retest, action }: { plant: Plant | null; retest: Test | null; action?: ReactNode }) {
  const tolerance = plant ? Math.max(1, plant.truth.dE * 0.2) : 0;
  const found = plant && Math.abs(plant.found.cast.dE - plant.truth.dE) <= tolerance;
  return (
    <section aria-labelledby="proof" className="mt-24">
      <h2 id="proof" className="text-[clamp(30px,3.8vw,48px)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
        Test the test
      </h2>
      <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-ink-soft text-pretty">
        A cast meter is only worth trusting if it finds a cast that is really there and stays quiet when nothing is. Veil checks both on your own face.
      </p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <ProofCase
          title="A planted cast"
          body="A white film of known strength goes on the swiped cheek, then the whole photo is dimmed and warmed by 7%, as a cloud would. Veil must find the cast a same-light comparison sees."
          result={
            plant && (
              <>
                Planted <span className="figure text-ink">{one(plant.truth.dE)}</span>, found{" "}
                <span className="figure text-ink">{one(plant.found.cast.dE)}</span>
              </>
            )
          }
          pass={plant ? Boolean(found) : null}
          passWord="Found it"
          failWord="Missed it"
        />
        <ProofCase
          title="No sunscreen at all"
          body="A second bare photo, a minute later, in slightly different light. Nothing changed on either cheek, so the answer must be Invisible."
          result={
            retest && (
              <>
                Reads <span className="figure text-ink">{one(retest.cast.dE)}</span>, {wordOf(retest.cast.verdict).toLowerCase()}
              </>
            )
          }
          pass={retest ? retest.cast.verdict === "invisible" : null}
          passWord="Stayed quiet"
          failWord="False alarm"
        />
      </div>
      {action}
    </section>
  );
}

function ProofCase({
  title,
  body,
  result,
  pass,
  passWord,
  failWord,
}: {
  title: string;
  body: string;
  result: ReactNode;
  pass: boolean | null;
  passWord: string;
  failWord: string;
}) {
  return (
    <div className="border-t border-ink pt-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[16px] font-medium">{title}</h3>
        {pass !== null && (
          <span className={`label ${pass ? "!text-ink" : "!text-wax-ink"}`}>
            <span aria-hidden className={`mr-1.5 inline-block size-1.5 -translate-y-px rounded-full ${pass ? "bg-ink" : "bg-wax"}`} />
            {pass ? passWord : failWord}
          </span>
        )}
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{body}</p>
      <p className="mt-4 text-[15px] text-ink-soft">{result ?? <span className="text-graphite">Not run yet</span>}</p>
    </div>
  );
}
