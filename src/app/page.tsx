import Link from "next/link";
import { Wordmark } from "@/components/mark";
import { skinScale } from "@/components/meter";
import { SCALE_MAX, verdictOf, wordOf } from "@/lib/cast";
import { hexToLab } from "@/lib/color";
import { Choreo } from "./home/choreo";
import { Cheek } from "./home/faces";
import { Smooth } from "./home/smooth";
import { Split } from "./home/split";
import { Story } from "./home/story";

const FACES = [
  { id: "elder", depth: "Dark", skin: "#504944", dE: 8.4, cheek: [259, 833] },
  { id: "portrait", depth: "Tan", skin: "#ae765c", dE: 5.2, cheek: [790, 645] },
  { id: "market", depth: "Intermediate", skin: "#c88674", dE: 4.8, cheek: [410, 782] },
  { id: "freckles", depth: "Light", skin: "#bd9084", dE: 3.6, cheek: [300, 656] },
];

const STEPS = [
  {
    name: "A bare photo",
    body: "YouCam skin analysis marks spots, redness and acne so Veil can keep them out of the reading. YouCam skin tone analysis places your skin on the ITA scale.",
  },
  {
    name: "One swipe, one cheek",
    body: "Sunscreen goes on one cheek. The other stays bare and becomes the control, so a cloud or a lamp cannot pass for a cast.",
  },
  {
    name: "A reading you can check",
    body: "Veil finds your face, then lines up the two photos to the pixel on the texture of your brows. It compares the same 25 tiles of skin on each cheek and reports the colour difference with its 90% range.",
  },
  {
    name: "A shelf for your skin",
    body: "Every product is predicted on your measured skin colour, scaled to how thickly you apply. When two could win, Veil asks for one more swipe. YouCam makeup try-on shows the winner on your whole face.",
  },
];

const pct = (v: number) => `${(Math.min(v, SCALE_MAX) / SCALE_MAX) * 100}%`;

function Bar({ skin, dE }: { skin: string; dE: number }) {
  return (
    <div className="relative h-3 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.08)]" style={{ background: skinScale(hexToLab(skin)) }} aria-hidden>
      <span className="absolute -inset-y-1 w-[3px] -translate-x-1/2 rounded-full bg-ink shadow-[0_0_0_2px_var(--paper)]" style={{ left: pct(dE) }} />
    </div>
  );
}

export default function Home() {
  const hero = FACES[0];
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 sm:px-8">
      <Smooth />
      <Choreo />
      <header className="flex items-center justify-between py-5">
        <Wordmark />
        <nav className="flex items-center gap-2">
          <Link href="/lab" className="rounded-full px-3 py-2 text-[14px] text-ink-soft transition-colors duration-150 hover:text-ink">
            Sample tests
          </Link>
          <Link
            href="/lab/live"
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
          >
            Test a sunscreen
          </Link>
        </nav>
      </header>

      <section className="pt-10 pb-24 sm:pt-16 lg:pt-20">
        <h1 data-split="0.15" className="max-w-[14ch] text-[clamp(48px,8.4vw,132px)] font-semibold leading-[0.9] tracking-[-0.055em] text-balance">
          Find the sunscreen that disappears on your skin.
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p data-rise="0.55" className="max-w-[46ch] text-[19px] leading-[1.5] text-ink-soft text-pretty">
            Swipe it on one cheek and take a photo. Veil compares that cheek with the bare one, takes out the light, and tells you if anyone will see a white
            cast. Then it ranks the shelf for your skin.
          </p>
          <div data-rise="0.7" className="flex flex-wrap items-center gap-3">
            <Link
              href="/lab/live"
              className="rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
            >
              Test with your camera
            </Link>
            <Link
              href="/lab"
              className="rounded-full px-5 py-3.5 text-[15px] font-medium text-ink shadow-[inset_0_0_0_1px_var(--rule)] transition-colors duration-150 hover:bg-slide"
            >
              See a sample test
            </Link>
          </div>
        </div>
        <div className="mt-12 sm:mt-16">
          <Split id={hero.id} skin={hero.skin} dE={hero.dE} product="Bare Zinc 50" />
        </div>
        <p data-rise="0.8" className="mt-5 text-[13px] text-graphite">
          Two photos. About two minutes. Built on YouCam skin analysis, skin tone analysis and makeup try-on.
        </p>
      </section>

      <section aria-labelledby="four" className="border-t border-rule pt-16 pb-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-end lg:gap-16">
          <h2 data-split id="four" className="text-[clamp(36px,5.2vw,76px)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
            Same tube. Four faces.
          </h2>
          <p className="max-w-[52ch] text-[19px] leading-[1.55] text-ink-soft text-pretty">
            One untinted zinc sunscreen, swiped at about the same thickness. On the darkest skin it reads as a mask. A shop swatch on a pale arm would show you
            none of this.
          </p>
        </div>
        <ol data-rise className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 lg:gap-x-8">
          {FACES.map((f) => (
            <li key={f.id}>
              <Cheek face={f} />
              <p className="mt-5 text-[clamp(28px,3vw,40px)] font-semibold leading-none tracking-[-0.04em]">{wordOf(verdictOf(f.dE))}</p>
              <p className="mt-1.5 text-[13px] text-ink-soft">
                {f.depth} skin ·{" "}
                <span className="figure" data-count={f.dE}>
                  {f.dE.toFixed(1)}
                </span>
              </p>
              <div className="mt-3">
                <Bar skin={f.skin} dE={f.dE} />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-[12px] leading-relaxed text-graphite">
          Hover or tap a cheek to take the sunscreen off. Measured by Veil on licensed sample portraits. On these samples the sunscreen is painted on by a
          filter, not applied. Each bar runs from bare skin to a heavy cast, in that person’s colour.
        </p>
      </section>

      <section aria-labelledby="why" className="border-t border-rule pt-16 pb-24">
        <h2 data-split id="why" className="text-[clamp(36px,5.2vw,76px)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
          People skip sunscreen they can see.
        </h2>
        <div className="mt-12 grid gap-6" role="img" aria-label="25% of skin-of-colour patients against 7% of white patients">
          <div className="flex items-center gap-6">
            <span className="figure w-[2.3em] shrink-0 text-[clamp(64px,11vw,168px)] leading-[0.8] font-semibold tracking-[-0.06em]">
              <span data-count="25">25</span>%
            </span>
            <span className="flex-1">
              <span data-grow className="block h-[clamp(40px,6vw,88px)] rounded-r-full bg-[#5a3a2b]" />
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="figure w-[2.3em] shrink-0 text-[clamp(64px,11vw,168px)] leading-[0.8] font-semibold tracking-[-0.06em] text-graphite">
              <span data-count="7">7</span>%
            </span>
            <span className="flex-1">
              <span data-grow="0.15" className="block h-[clamp(40px,6vw,88px)] w-[28%] rounded-r-full bg-[#e1b9a0]" />
            </span>
          </div>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:gap-16">
          <div>
            <p className="max-w-[46ch] text-[19px] leading-[1.55] text-ink-soft text-pretty">
              Skin-of-colour patients, then white patients, who named white cast as a reason they struggle with sunscreen. In the same survey, 41% did not know
              how to find a product that suits them.
            </p>
            <p className="mt-2 text-[13px] text-graphite">Journal of Drugs in Dermatology, 2024. A survey of about 150 patients.</p>
          </div>
          <div>
            <p className="text-[17px] leading-relaxed text-ink-soft text-pretty">
              <span className="font-semibold text-ink">10% zinc</span> was enough to leave a visible cast on tan and brown skin in a lab test. Light skin only
              showed it at 30%. The study scored the cast from colour readings, the same score Veil reports.
            </p>
            <p className="mt-2 text-[13px] text-graphite">PLOS One, 2025. Thirteen volunteers, funded by a skincare brand.</p>
          </div>
        </div>
        <p className="mt-16 max-w-[24ch] text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
          A swatch on your hand cannot tell you how a sunscreen sits on your face. Your other cheek can.
        </p>
      </section>

      <section aria-labelledby="how" className="border-t border-rule pt-16 pb-12">
        <h2 data-split id="how" className="max-w-[16ch] text-[clamp(36px,5.2vw,76px)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
          How Veil reads a swipe
        </h2>
        <div className="mt-6 lg:mt-12">
          <Story steps={STEPS} />
        </div>
      </section>

      <section aria-labelledby="trust" className="grid gap-12 border-t border-rule pt-16 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <h2 data-split id="trust" className="text-[clamp(36px,5.2vw,76px)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
          It tests itself on your face
        </h2>
        <div>
          <p className="max-w-[60ch] text-[16px] leading-relaxed text-ink-soft text-pretty">
            Before you trust a number, Veil plants a white film of known strength on your cheek with YouCam try-on, dims the photo as a cloud would, and checks
            that it finds the film. A second bare photo must read Invisible. A photo lit from one side is refused before it is measured.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-ink pt-5">
            <div>
              <dt className="text-[15px] text-ink-soft">Planted</dt>
              <dd className="figure mt-2 text-[clamp(44px,6vw,88px)] leading-none font-semibold tracking-[-0.05em]" data-count="9.7">
                9.7
              </dd>
            </div>
            <div>
              <dt className="text-[15px] text-ink-soft">Found</dt>
              <dd className="figure mt-2 text-[clamp(44px,6vw,88px)] leading-none font-semibold tracking-[-0.05em]" data-count="9.7">
                9.7
              </dd>
            </div>
            <div>
              <dt className="text-[15px] text-ink-soft">No sunscreen</dt>
              <dd className="figure mt-2 text-[clamp(44px,6vw,88px)] leading-none font-semibold tracking-[-0.05em]" data-count="0.1">
                0.1
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-[12px] text-graphite">Sample 1, measured in the browser. Below 1.5 reads as Invisible.</p>
        </div>
      </section>

      <section className="rounded-[28px] bg-ink px-6 py-16 text-paper sm:px-12 sm:py-24">
        <h2 data-split className="max-w-[14ch] text-[clamp(44px,7.4vw,116px)] font-semibold leading-[0.94] tracking-[-0.055em] text-balance">
          Your next sunscreen should vanish.
        </h2>
        <p className="mt-6 max-w-[52ch] text-[19px] leading-[1.55] text-paper/70">
          Only the bare photo goes to YouCam. Swipes are measured in your browser, and Veil keeps no photos. Your shelf stays on your phone for the next time
          you shop.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/lab/live"
            className="rounded-full bg-paper px-6 py-3.5 text-[15px] font-medium text-ink transition-transform duration-150 active:scale-[0.97]"
          >
            Test with your camera
          </Link>
          <Link href="/lab" className="rounded-full px-5 py-3.5 text-[15px] font-medium text-paper shadow-[inset_0_0_0_1px_oklch(1_0_0/0.25)]">
            See a sample test
          </Link>
        </div>
      </section>

      <footer className="mt-10 text-[12px] leading-relaxed text-graphite">
        Sample portraits: Ferdinand Reus (CC BY-SA 2.0), Heath Cajandig (CC BY 2.0), Alberto Buscató Vázquez (CC BY-SA 4.0), Christopher Harris (CC0), via
        Wikimedia Commons. The products are a sample shop. Veil is not medical advice.
      </footer>
    </div>
  );
}
