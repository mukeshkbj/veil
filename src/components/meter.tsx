import { BANDS, type Cast, SCALE_MAX } from "@/lib/cast";
import { type Lab, labToHex } from "@/lib/color";
import { one } from "@/lib/format";
import { castColor } from "@/lib/shelf";

const at = (v: number) => `${(Math.min(Math.max(v, 0), SCALE_MAX) / SCALE_MAX) * 100}%`;

export function skinScale(skin: Lab) {
  const stops = Array.from({ length: 9 }, (_, i) => {
    const v = (i / 8) * SCALE_MAX;
    return `${castColor(skin, v)} ${at(v)}`;
  });
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

const EDGES = BANDS.slice(0, -1).map((b) => b.below);

export function CastMeter({ skin, cast }: { skin: Lab; cast: Cast }) {
  const [lo, hi] = cast.interval;
  return (
    <figure role="img" aria-label={`Cast ${one(cast.dE)} on a scale to ${SCALE_MAX}. Ninety percent range ${one(lo)} to ${one(hi)}.`}>
      <div className="relative pt-5">
        <div className="absolute top-0 h-3 border-x border-ink/70" style={{ left: at(lo), width: `calc(${at(hi)} - ${at(lo)})` }}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-ink/70" />
        </div>
        <div className="relative h-11 rounded-[10px] shadow-[inset_0_0_0_1px_oklch(0_0_0/0.08)]" style={{ background: skinScale(skin) }}>
          {EDGES.map((e) => (
            <span key={e} className="absolute inset-y-0 w-px bg-ink/25 mix-blend-multiply" style={{ left: at(e) }} />
          ))}
          <span
            className="absolute -inset-y-1.5 w-[3px] -translate-x-1/2 rounded-full bg-ink shadow-[0_0_0_2px_var(--paper)] transition-[left] duration-500 ease-[var(--ease-move)]"
            style={{ left: at(cast.dE) }}
          />
        </div>
      </div>
      <div className="relative mt-2 h-4">
        {BANDS.map((b, i) => {
          const from = i ? BANDS[i - 1].below : 0;
          const to = Math.min(b.below, SCALE_MAX);
          return (
            <span
              key={b.verdict}
              className={`label absolute -translate-x-1/2 whitespace-nowrap ${b.verdict === cast.verdict ? "text-ink" : ""}`}
              style={{ left: at((from + to) / 2) }}
            >
              {b.word}
            </span>
          );
        })}
      </div>
    </figure>
  );
}

export function SplitSwatch({ left, right, size = 64 }: { left: Lab; right: Lab; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.1)]"
      style={{ width: size, height: size, background: `linear-gradient(to right, ${labToHex(left)} 50%, ${labToHex(right)} 50%)` }}
    />
  );
}

export function RangeBar({ skin, value, range, measured }: { skin: Lab; value: number; range: [number, number]; measured: boolean }) {
  return (
    <div className="relative h-5" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full opacity-90" style={{ background: skinScale(skin) }} />
      {!measured && (
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/35"
          style={{ left: at(range[0]), width: `calc(${at(range[1])} - ${at(range[0])})` }}
        />
      )}
      <span
        className={`absolute top-1/2 size-3 -translate-1/2 rounded-full ${measured ? "bg-ink" : "border-2 border-ink bg-paper"}`}
        style={{ left: at(value) }}
      />
    </div>
  );
}
