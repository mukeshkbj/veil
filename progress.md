# Progress

## Goal
Win the YouCam API Skin AI & eCommerce VTO Hackathon (deadline 2026-11-02). Pick the best idea through builder and judge personas, then build it to Awwwards-level quality.

## Decision
"Other Cheek": a split-face product trial. The untreated cheek is the control group. Full reasoning in `research/decision.md`, ideas in `research/ideas/`, judge scores in `research/judging/`.

## Done
- Research: `research/brief.md`, 29 OpenAPI bundles in `research/openapi/`.
- Ideation (5 builder personas) and judging (4 judge personas).
- Replay fixtures: `scripts/make_fixtures.py` writes `public/replay/` (3 subjects, 7 captures each, preview, planted, null). Takes about 4 minutes.
- Core libs: `src/lib/stats.ts` (tested, `npm test`), `youcam.ts`, `measure.ts`, `study.ts`, `runner.ts`, `format.ts`, `products.ts`.
- API routes: `/api/analyze`, `/api/simulate`, `/api/asset`, `/api/status`.
- Lab at `/lab`: four acts (Two sides, Before you buy, Trial, Prove it). Verified in the browser for sample 1.
- Landing page `src/app/page.tsx` and `src/app/home-figures.tsx`. Typecheck and lint clean.

- Landing page verified at 1440 px (hero, light vs serum, protocol, proof, rules, API table).
- Gate is relative to Day 0 (light shift 12%, yaw shift 0.2); Day 0 has loose absolute limits. Replay: all three samples give intended verdicts (freckles working at W3, elder working at W2, portrait nothing), and the side-lit "Week 2 first try" is rejected in all three.
- `/lab/live` built and verified end to end against `scripts/mock-youcam.mjs` (upload, poll, mask proxy, measure, claim preview, planted effect, trial in localStorage, gate before upload, delete trial). Not tested against the real YouCam API: no key.
- README rewritten.

- Review round 1 (Sonnet 5.5) applied: paid preview no longer fires on render; asset proxy blocks redirects and non-image bytes, no-store cache; paid routes check origin, type and size; noise band widened by successive differences (simulated false-alarm rate fell from up to 31% to under 4%, encoded in `stats.test.ts`); verdict sticks at first decision; asymmetric band edges; one live check-in per week, none after a verdict; storage-safe appends; object URLs and bitmaps released; dead code and comments removed; copy matched to behavior.
- OG image (`src/app/opengraph-image.tsx`). Protocol strip redrawn as a timeline.
- `research/devpost.md`: submission text and a 2:30 demo script.
- Evidence: `npm test` 8/8, `tsc` and `eslint` clean, `npm run build` passes. Visual checks at 1440 px, 390 px and dark mode.

## Not done
- No run against the real YouCam API (no key). First live units: the de-risk list in `research/decision.md`.
- Demo video not recorded. No git commit or public repo yet (needs the owner's go-ahead).
- Review item not fixed: same-camera mirroring is handled by copy only, not by detection.

## Round 2 (2026-10-22)
- User judged Other Cheek's Potential Impact too weak. Round 2 ideation is running: 5 builder personas (returns economist, inclusion, brand buyer, daily habit, contrarian), brief in `research/round2/BRIEF.md`, output in `research/round2/*.md`.
- Next: blind judging of the new ideas against Other Cheek, then pivot only if a candidate beats it on Impact without losing elsewhere. Reuse YouCam client, gating, design system and mock.

## Pivot to Veil (2026-10-22)
Judges picked Veil: a sunscreen white-cast test built on the split-cheek engine. Decision record: `research/decision-v2.md`. Fact-check: `research/round2/factcheck.md`. v1 backup: `../youcam-other-cheek-v1.tar`.

Done:
- Maths, tested (`node --test src/lib/*.test.ts`, 14 pass). `color.ts` has CIEDE2000, linear light and ITA. `cast.ts` holds the light-corrected expected colour, which is von Kries style in linear RGB from the control cheek, plus a paired bootstrap over aligned tiles, the verdict bands and skin depth. `shelf.ts` holds film mixing in linear light, dose calibration, the shelf ranking and the next-swipe agent.
- `measure.ts` registers the second photo to the bare one: a landmark similarity fit as the first guess, then NCC texture matching at the brows (105, 334) and nose bridge (168). It then reads 5x5 paired tiles per cheek and skips YouCam-flagged pixels. `veil.ts` holds the bare setup, the light and turn gate, the swipe test, the local film render and the planted self-test (truth under the same dimmed light).
- Fixtures: `scripts/make_fixtures.py` writes 4 subjects to `public/replay/`. Landmarks come from MediaPipe in the browser (`scripts/sources/landmarks.json`). The new subject is market.jpg (CC BY-SA 4.0, Alberto Buscató Vázquez).
- Mock: `scripts/mock-youcam.mjs` now serves skin-analysis, skin-tone-analysis and makeup-vto.
- UI:
  - `/lab` is the replay report: face panel, verdict, cast meter painted in the user's skin, cast map halftone, shelf, agent, try-on and the two self-tests.
  - `/lab/live` is the camera flow: bare (29 units), swipe with a rub-in timer and a cheek pick, report, render (1 unit each), planted test (1 unit), free bare retest, and a saved shelf in localStorage.
  - `/` is the landing page.
- Replay results:

| Sample | Bare Zinc reading | Planted | Bare retest |
|---|---|---|---|
| elder | 8.4, Ghost | found it | Invisible |
| portrait | 5.2, Visible | found it | Invisible |
| market | 4.8, Visible | found it | Invisible |
| freckles | 3.6, Visible | found it | Invisible |

  The agent's next swipe is recorded for each sample. On elder, Clearweight measures Invisible.
- Live flow verified end to end against the mock: the gate refused the side-lit photo, the swipe read Ghost and the planted test ran.

- Checked at 390 px (/, /lab, /lab/live) and in dark mode (/). Fixes: the empty bare-step placeholder is hidden below lg, saved-shelf rows are static (no dead tap target), and the gap above the saved shelf is tighter.
- `npm run lint`, `tsc` and `npm run build` pass, and 14 tests pass. `motion` was removed (unused).
- README and `research/devpost.md` (with video script) are rewritten for Veil. The landing numbers match the re-sweep.
- `.scratch/` and `public/scratch/` are git-ignored, not deleted.

- Sonnet 5.5 code review (20 findings) applied:
  - The dose ignores faint (<2) or saturated swipes and is clamped to [0.25, 4], with a regression test.
  - A darker patch is reported as darker, not as a white cast.
  - Error handling and URL cleanup are added to the lab and live flows.
  - The cheek check runs before units are spent.
  - Safe localStorage.
  - Signed asset proxy (HMAC) with a byte cap and timeout. Origin is required, there is a per-IP rate limit, and Content-Length is required.
  - a11y: role=alert/status, the rub timer no longer chatters, focus moves to the verdict, the face has a name, aria-pressed toggles, graphite contrast is 4.5:1+, and the bag button is 6:1+.
- Found by the review sweep:
  - The landmark registration was off by about 25 px, because the film pulls the mesh. NCC anchor matching fixed it.
  - The planted test applied light in sRGB. It now applies it in linear light.
  - The light gate now uses registered forehead discs.
  - Results: planted vs found differ by 0.0 to 0.2, and the null retest reads 0.0 to 0.2 on all samples.

- Landing motion pass (`src/app/home/`):
  - Hero: you drag the face's own slanted midline. The film photo is on one side and the bare photo is on the other. The intro sweep runs once in view, and the verdict card counts up. The grip is a keyboard slider (arrows, Home, End) with a round focus ring.
  - Four faces: larger cheek crops. Hover or tap shows the bare cheek (aria-pressed).
  - Stats: 25 vs 7 bars grow on scroll. Headings reveal word by word (SplitText, aria auto). Trust numbers count up.
  - "How Veil reads a swipe": a sticky figure in four layers (YouCam masks, film and midline, tiles and anchors, shelf card).
  - Motion stack: GSAP + ScrollTrigger, Lenis as the only smooth-scroll engine, no Three.js. Reduced motion skips the `.js` class, Lenis and every intro, so final states show at once. Without JS, all content stays visible.
  - The global focus ring moved into `@layer base`, so rounded utilities now win.
  - Checked at 1440 and 390 px, in light and dark mode, with keyboard and pointer. Lint, tsc, prettier, build and 15 tests pass.

- Dashboard and phone pass (references: recent.design Interface, inspora.design Product; traits taken: answer first, one hero numeral, quiet aligned rows, phone-first flow):
  - `Bench` takes a `lead` slot. On phones the verdict ("Ghost.") now comes before the photo. On desktop it heads the right column, beside the pinned photo.
  - Shelf rows have a fixed figure column, so every range bar lines up.
  - Live flow: a filled camera control (busy state, aria-busy), and a three-step progress bar. On phones the bare preview goes below the controls, so the busy status stays in view. Cheek-pick buttons are shorter.
  - Verified end to end at 390 px against the mock (bare, swipe, cheek pick, reading Ghost). Lint, tsc, build and 15 tests pass.

- Live viewfinder (`src/app/lab/live/viewfinder.tsx`): the camera opens in the page with an oval guide. MediaPipe checks the frame about four times a second: face found, size, centred, head turn (nose against the inner eye corners, because the ear points drift under a headscarf), and light balance across the forehead. The oval turns solid and the message reads "Hold still" when every check passes. The shutter always works. The shot is cropped 4:5, as shown. Escape closes it, Tab stays inside, and focus returns to the opener. If the camera is denied, the tile falls back to the file picker, and "Or upload a photo" is always there.
  - The darkness check fires only below forehead luma 22, so very dark skin in good light is never told it is too dark.
  - Verified with a simulated camera feed: off-centre, side light, then ready. Bare and swipe shots run through the camera to "Ghost." Lint, tsc, build and 15 tests pass.

- Gauntlet loop (live page: `research/gauntlet.md`). Bar: round-one winners of the same sponsor's hackathon. Blind packets in `research/bar/blind/`.
  - Deployed to https://veil-skin.vercel.app (Vercel project personal-f88c/veil-skin). Redeploy: `npx vercel deploy --prod --yes`.
  - "What YouCam returned" panel (`Trace` in `src/app/lab/report.tsx`): masks plus patches, flagged share, tone swatch with ITA, try-on render, call list. `flaggedShare` is now exported from `measure.ts`.
  - Four-sample validation table (`Sweep` in `src/app/lab/lab.tsx`), numbers measured on the page, with cited thresholds.
  - Production screenshots in `research/prod/`, demo video `research/prod/veil-demo.mp4` (1:46, captions).
  - `research/devpost.md` rewritten. Lint, tsc, build and 15 tests pass.
  - Round 2: B first on Design and Quality of Idea (both critics), second or third on Technological Implementation and Potential Impact. The shared gap is no real YouCam response and no real person.
  - Camera-flow phone shots (viewfinder guidance and ready, swipe step) added to packet B.
  - `npm run capture` (`scripts/capture.ts`) records real YouCam responses for the samples once a key exists; the panel then reads "Recorded" with call times.

Remaining:
- Next with a key: `YOUCAM_API_KEY=... npm run capture`, add the key to Vercel, redeploy, recapture shots, run critic round 3.
- Needs the user: a live run with a real YouCam key, real swipes, a public repo (gh is not logged in), voice-over if wanted, and the commit.

## Launch-ready pass (started 2026-10-22, overnight, no questions)

Ask: a 30 to 40 s motion-design launch film (HyperFrames, earshot SFX), an emotional storyline, a researched storyboard, a gauntlet with harsh blind critics against the Claude Opus 5.5 / Sonnet 5.5 / Poke films; a UI hill-climb against recent.design and inspora.design; README and a full Devpost submission file with a demo script.

Research (in `C:\Users\mukes\honey\veil-launch-refs\`):
- Earlier film research in `ambient-launch-refs` was for a phone-agent product; the new lens is faces, skin, light, being seen.
- New references: Pixel Real Tone (Super Bowl spot and case study), Dove Real Beauty Sketches, Supergoop Unseen, Black Girl Sunscreen, two Fenty films, three a16z story shorts (`yt/`, evidence in `ev/`, earshot transcripts in `ev/*-sound.txt`).
- Re-reads: Claude Opus 5.5, Sonnet 5.5, Haiku 5.5, Poke, H3 Max Relight, iPhone 18 Pro, Pixel 10a, Higgsfield, Apple 2030, Family.
- Brief: `BRIEF.md`; analyses and `PLAYBOOK.md` in `analysis/` (workflow wf_128e455e-5c0).
- UI bar: recent.design website recordings in `ui-bar/` (Superpower, Augen, Lovi, Hims & Hers, Unveil, Family, Amie, Endel, Displace, Vitra).

UI diagnosis: the current UI uses the generated default the HyperFrames spec bans (cream paper, italic serif display, small monospace caps, pill chips). The bar uses white space, one grotesk, real faces at large scale, one hot accent.

Plan: playbook, then brand direction shared by film and UI, then storylines and SPEC, then build the film in `launch/film`, then the gauntlet; the UI redesign runs after the first film cut; then README, SUBMISSION.md, redeploy.

### Film status (2026-10-23, overnight)
- Research done: 20 film analyses + `C:\Users\mukes\honey\veil-launch-refs\PLAYBOOK.md` (ten rules, banned list).
- `launch/film/STORYLINES.md` (A "The other cheek" picked), `launch/film/SPEC.md` (36 s, shots by frame).
- Built 9 scenes in `launch/film/compositions/` (hook, faces, stat, turn, report, test, payoff, release, end). Footage: Pexels clips in `assets/footage`. App images and real cast maps (exported by `tools/castmap.py`) in `assets/app`.
- Score: MusicGen beds `assets/music/pulse-long-11.wav` + `lift-long-23.wav`; SFX from earshot; `tools/mix.py` writes `assets/mix.wav` (-16.3 LUFS, -1.8 dBTP).
- Renders: `launch/film/renders/v2.mp4`. Gauntlet round 1 packets in `C:\Users\mukes\honey\veil-launch-refs\gauntlet\r1` (keys in `gauntlet/keys`), critics running.
- Next: apply critic gaps, loop; UI redesign (daylight white, one grotesk, Sun #FFB21A accent, skin colour signature; drop Newsreader italic + mono caps).

### Film and UI status (2026-10-23, 01:45)
- Film v5 at `launch/film/renders/v5.mp4` (36 s, -15.2 LUFS, -1.1 dBTP, no black frames). Scenes: hook, faces, stat, turn, phone, report, payoff, release, end. The test scene is gone.
- Changes since v2:
  - A phone beat built from real `/lab/live` screenshots (`tools/phone.py`, fake camera feed from sample 1).
  - Colour fields that use the app's own expected and measured cheek colours.
  - The mirror-check release (Pexels 12322718), and the claim on a skin-colour field.
  - One MusicGen score (`warm-long-5`), muffled until the turn at 8.5 s.
  - Word-rise type, and impacts aligned to their onsets in `tools/mix.py`.
- Gauntlet (blind, `C:\Users\mukes\honey\veil-launch-refs\gauntlet\r1` to `r4`, keys in `gauntlet/keys`):

  | Round | Opus 5.5 | Sonnet 5.5 | Poke | Real Tone | Control |
  | --- | --- | --- | --- | --- | --- |
  | r1 (v2) | won | won | lost | lost | none |
  | r2 (v3) | won narrow | won clear | won narrow | lost clear | none |
  | r3 (v4) | won clear | won clear | won narrow | lost narrow | v4 beat v3 |
  | r4 (v5) | running | running | running | running | running |

- UI: landing section headings, the self-test figures, the closing call to action and the story steps were raised to the hero's type voice. The YouCam mask overlay is softened. /lab and /lab/live headings match. tsc, eslint and tests pass. The production build and redeploy are still to do.
- Docs: `SUBMISSION.md` (Devpost fields, the film shot list, a 2-minute walkthrough script, film credits). The README links to it.

### Final status (2026-10-23, 08:10)
- Final film: `launch/film/renders/final.mp4` (a copy of v8). 36 s, no black frames. `npx hyperframes check` passes, with two hold warnings left (the first stat caption and the payoff subline).
- Gauntlet results after r4:

  | Round | Opus 5.5 | Sonnet 5.5 | Poke | Real Tone | Control |
  | --- | --- | --- | --- | --- | --- |
  | r4 (v5) | won | won | won | lost narrow | v4 beat v5 narrow (claim on a flat card lost) |
  | r5 (v6) | won clear | won clear | lost clear | won clear | v6 beat v4 narrow |
  | c6 (v7 vs v6) | | | | | split 1 to 1 (v7: legible shelf, but a blank frame in the re-sort) |
  | c7 (v8 vs v6) | | | | | v8 won 2 to 0, both clear |

- v7 made the shelf full width with three rows in large type. v8 removed the blank frame from the re-sort and moved the lockup 0.15 s earlier, so the end lines hold for 2 s.
- UI blind round u1 (`C:\Users\mukes\honey\veil-launch-refs\ui-gauntlet\u1`): ours beat Lóvi clear. Ours lost to Superpower (clear) and to Augen (narrow). Both losses named the story steps: a small portrait and small grey text. The fix: the portrait column is 1.2 times wider and up to 84vh tall, step and section body text is 19 px, and the shelf card type is larger. These changes were checked on desktop and mobile.
- Production build passes, with `metadataBase` set. The site is deployed to https://veil-skin.vercel.app, and `/`, `/lab`, `/lab/live` and `/opengraph-image` return 200. The live story section matches the local build.
- Docs: SUBMISSION.md and README point to `renders/final.mp4`. The shot table matches v8, and Pexels 7298140 is credited.
- Not done: no second UI round after the story fix. The middle of the film still reads as slides to some critics.

### Hackathon bar (2026-10-23, 09:00)
- Devpost gallery for this hackathon is unpublished, so the bar is the previous YouCam hackathon's winners (ShadeSpan, CASTING, Aloud), judged on the four published criteria.
- Round 4 (blind, eight judges, current live site and final film): Veil first on all eight ballots. Round 3 was six of eight. Details in `research/gauntlet.md`.
- Open gap, needs the user: a YouCam key on Vercel and real swipes on real people. Then run `npm run capture` and redeploy.
