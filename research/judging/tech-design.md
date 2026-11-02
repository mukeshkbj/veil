# Joint judging: technology and design

Two voices score the 15 ideas. Voice A is the principal engineer. Voice B is the Awwwards-style designer. Scores are 1 to 10.

Inputs read: `brief.md`, all five idea files, and the OpenAPI specs for skin analysis, skin simulation, task management and the shared error codes. No API key exists, so no score here comes from a live call. Every behavior claim marked "unverified" must be tested first.

Spec facts that matter for both voices:

- Skin analysis returns `ui_score` (flattered), `raw_score` (honest) and `mask_urls` per concern.
- A successful task returns a `dst_id`. A later task can use it as input without a new upload. Only skin analysis, face analyzer and skin tone analysis document `dst_id` in the specs I searched. Whether skin analysis accepts a simulation `dst_id` is unverified.
- A failed task costs 0 units. Results expire after 24 hours.
- Documented engine errors: `error_no_face`, `error_pose`, `error_lighting_dark`, `error_src_face_too_small`, `error_src_face_out_of_bound`, `error_below_min_image_size`, `error_exceed_max_image_size`, `error_nsfw_content_detected`, `error_face_parsing`, `error_inference`, `error_download_image`, `error_decode_image`, `error_upload`. Skin simulation also returns `error_invalid_params`.
- The Derm file notes a sample `mask_urls` that ends in `.jpg`, while the text says PNG alpha. This is unresolved.

---

## Scorecard

T = technical depth potential (Voice A). F = feasibility for one builder in about 2 days with agent help (Voice A). D = design ceiling (Voice B). Joint = ((T + F) / 2 + D) / 2.

| # | Idea (source) | T | F | D | Joint |
|---|---|---|---|---|---|
| 1 | Lopsided (creative) | 8 | 7 | 9 | 8.25 |
| 2 | The Other Cheek (derm) | 9 | 7 | 8 | 8.00 |
| 3 | Look Compiler (agentic) | 8 | 6 | 7 | 7.00 |
| 4 | Unanimous (retail) | 7 | 5 | 8 | 7.00 |
| 5 | Headroom (retail) | 5 | 9 | 7 | 7.00 |
| 6 | Trigger Lab (behavioral) | 7 | 6 | 7 | 6.75 |
| 7 | Trial Bench (agentic) | 8 | 6 | 6 | 6.50 |
| 8 | Minimum Dose (creative) | 7 | 5 | 7 | 6.50 |
| 9 | Receipts (creative) | 6 | 5 | 7 | 6.25 |
| 10 | Second Shade (retail) | 7 | 5 | 6 | 6.00 |
| 11 | Week-6 Wall (behavioral) | 6 | 6 | 6 | 6.00 |
| 12 | Already Own It (behavioral) | 3 | 9 | 5 | 5.50 |
| 13 | Week 3 (derm) | 6 | 5 | 5 | 5.25 |
| 14 | Fade (derm) | 7 | 3 | 5 | 5.00 |
| 15 | Barely There (agentic) | 5 | 5 | 4 | 4.50 |

### Voice A: engineer notes per idea

- **Lopsided (8/7).** Real image processing: split alpha masks at a landmark midline, compute an asymmetry index, gate on lighting and yaw. Works from one selfie, 12 units. Risk: mask semantics and mirrored camera, both testable on day 1.
- **The Other Cheek (9/7).** Deepest honest pipeline of the 15. Positive control (simulate a known improvement, composite one half, recover it) and negative control (off-target simulation, recover nothing) validate the stats on real API output. Chained async tasks, test-retest noise floor, effect = change in the left-right gap. Risk: a composited face has a seam at the midline that analysis may flag. Mask coverage as a per-side proxy is unproven. The mirrored-half method is the fallback at 2x cost.
- **Look Compiler (8/6).** Uses `mu-transfer` as an oracle for `makeup-vto`. Needs landmark zones, CIEDE2000 and a search loop at 1 unit per render. Risk: pattern catalogs (`blush.json`, `eyeshadow.json`) are not in the specs and replay needs them frozen. It does not depend on score stability, which makes it the best hedge.
- **Unanimous (7/5).** Fan-out of N members x M colorways through `cloth-v4`, a maximin solver, and budget-aware selection of which renders to buy. 108 units per 4-person group and soft color-harmony scoring limit it.
- **Headroom (5/9).** Cheap and safe. The depth is thin: one analysis, one simulation, and a client-side image diff. A "best case" ceiling is not a product-specific result. A judge can call it a wrapper with a slider.
- **Trigger Lab (7/6).** Permutation test with exposure-count rules and a co-occurrence check. Honest and well scoped. The demo needs 3 weeks of data that only fixtures can supply.
- **Trial Bench (8/6).** Best agent loop on paper: noise floor, adaptive sampling, stop rule, change-log attribution. The LLM does less than the pitch says. Long timelines force fixtures.
- **Minimum Dose (7/5).** Search loop with the analysis API as the objective function. The whole idea dies if analysis does not respond to rendered makeup. Goodhart risk with smoothing.
- **Receipts (6/5).** Good stats framing but the demo is circular. Simulation feeds analysis from the same vendor.
- **Second Shade (7/5).** Clever Lab-space lighting correction using brow and hair color as reference. 20 units per tone call is costly. Unproven that tone analysis reads a foundation-covered face.
- **Week-6 Wall (6/6).** Weaker than Trigger Lab on the same plumbing. The purge-by-zone heuristic is unvalidated.
- **Already Own It (3/9).** A hex-only CIEDE2000 predicts most duplicates without the API. A technical judge finds this in minutes.
- **Week 3 (6/5).** Same unvalidated purge heuristic. Mask registration across weeks is hard.
- **Fade (7/3).** Highest chance of total failure: `age_spot` may miss diffuse melasma. Needs consented melasma photos.
- **Barely There (5/5).** One optimizer with one oracle, narrow audience, and an unverified oracle.

### Voice B: designer notes per idea

- **Lopsided (9).** The only idea where the face itself is the interface. A hairline you can drag, a face that splits into color and silver. The danger is tone: "left 2.6x right" can read as a verdict on someone's face. The design must frame asymmetry as portraiture, not defect.
- **The Other Cheek (8).** One face, one line, one outcome. The planted-effect proof is an unusual and memorable beat. Risk: it can collapse into a stats panel.
- **Unanimous (8).** Four faces re-dressing in sync is the most social, most filmable moment. Risk: becomes a generic grid of tiles.
- **Look Compiler (7).** Strong object: a recipe card with swatches. The error counter falling is a good loop. Risk: reads as a filter app.
- **Headroom (7).** The slider is clear, and "Skip" is a fresh stance. Visually it is a before/after slider, which judges have seen many times.
- **Trigger Lab (7).** Emotionally right (relief). A timeline is a chart, so the risk is dashboard look.
- **Minimum Dose (7), Receipts (7).** Strong metaphors (pharmacy label, lab notebook). Both lean on a curve or a stamp, which are cliches if done literally.
- **The rest (4 to 6).** Dashboards: score trends, zone grids, region outlines, return portals.

---

## Offline replay: what a faithful mode must contain

Goal: a judge with no key runs the same code path and sees honest behavior.

1. **A mock server, not mocked functions.** Run a local HTTP server that implements the documented routes: `POST /s2s/v2.0/file`, the presigned `PUT`, `POST` task, `GET` task/{id}. The app changes only the base URL. Any shortcut in app code defeats the point.
2. **The full async lifecycle.** The create call returns a `task_id`. Polling returns `running` for a realistic, jittered duration, then `success` or `error`. Include `dst_id` on success. Honor the 24-hour expiry on result URLs.
3. **Schema-exact results.** Per concern: `type`, `ui_score`, `raw_score`, `mask_urls`; regional scores where the spec lists them (pore, wrinkle, skin_type); overall score and skin age. `ui_score` must follow the documented flattering relation, roughly `45 + 0.45 x raw`, per-concern curves differ.
4. **Real mask pixels.** Masks must be alpha images aligned to the fixture photo at its returned size. Record them from real calls once a key exists. If recording is impossible, generate them from a face-parsing pass and label them synthetic. Never ship hand-drawn blobs and call them engine output.
5. **Recorded first, synthetic second.** Replay keys are `hash(endpoint, normalized params, image sha)`. Exact match returns a recorded response. A miss returns a clear "not in replay set" error. Do not interpolate silently.
6. **Seeded, disclosed noise.** If the product measures test-retest noise, replay must show variation between repeated same-day calls. Use recorded repeats when available. If noise is synthesized, print "synthetic noise" in the UI. A noise floor invented by the author cannot prove the stats method works.
7. **Planted effects stay honest.** For the validation harness, the simulation fixtures must be real simulation outputs recorded once. Replay may not fake the engine "finding" the planted effect.
8. **Fault injection for documented errors.** A switch that triggers `error_no_face`, `error_pose`, `error_lighting_dark`, `error_below_min_image_size`, `error_nsfw_content_detected`, `error_inference`, plus an expired result URL. Each must show a designed recovery (retake guidance, retry with backoff, zero units charged).
9. **A unit ledger.** Enforce the published prices (analysis 9 to 22, simulation 4 or 6, VTO 1, tone 20, Fitzpatrick 10), charge nothing for failed tasks, and show a running balance against 1,000 units.
10. **User-photo policy.** In replay mode, only bundled faces return recorded results. A user upload gets a plain message: "Replay mode cannot analyze new photos. Add a key." Do not run a local lookalike model and present it as the engine.
11. **A visible mode badge.** A persistent "REPLAY: recorded responses" marker on every screen and in every exported frame, so screenshots never mislead.
12. **Provenance file.** `fixtures/PROVENANCE.md` lists each fixture: live or synthetic, date, units spent, source image consent.

---

## Visual language for the top 2

### 1. Lopsided: "Darkroom"

Concept: the app is a darkroom print being developed. The face is a photograph, not a data object.

- **Type.** A high-contrast text serif for headlines, set large and light (for example Instrument Serif or Newsreader). A small monospace with tabular figures for measurements only. Nothing else.
- **Color.** Warm paper white `#EFE9E1`, near-black ink, one accent: safelight red `#C8452B`, used for the active side only. No gradients, no purple, no teal.
- **Material.** Matte fiber paper with faint grain, a deckled print edge, a graphite hairline. Masks render as halftone ink density, not neon heat. The weaker side desaturates to silver-gelatin monochrome.
- **Signature interaction.** Drag the hairline like an enlarger filter. The two halves re-balance under your finger. The ratios update as quiet figures beside the print, with no badge and no color alarm.
- **Signature micro-moment.** Release the hairline. It snaps to the detected midline with a small detent and a paper-tick haptic. Then each half reflects into a full face for 600 ms: "you, twice." Two portraits cross-fade. The caption reads: "Neither is the real you. Both are." After that the findings appear. This puts self-acceptance before any measurement.
- **Respect rules.** No red-for-bad. No "worse side". Say "carries more redness". Findings are hypotheses to test, never causes.

### 2. The Other Cheek: "Slide and Tension Line"

Concept: a microscope slide. The face is the specimen. The trial is a quiet ritual, not a dashboard.

- **Type.** A light neo-grotesk for UI with tabular figures. An italic serif only for the verdict words ("Real effect", "Nothing detectable").
- **Color.** Bone white, cool glass grey `#DDE3E6`, ink black. One accent, vermillion `#D9381E`, applied only to the treated side.
- **Material.** Frosted glass, an etched center line, thin specimen labels. No cards with drop shadows.
- **Signature interaction.** Tap the treated side. A faint vermillion tint settles on that half. Each weekly scan adds a thin glass layer to a stack you can scrub.
- **Signature micro-moment: the tension line.** The gap between the treated and control sides is drawn as a ribbon between two lines, with the noise band as its slack. When the measured gap clears the noise band, the ribbon snaps taut with one soft tick, and the verdict appears. When it does not, the ribbon stays slack and gently wavy. The caption: "Nothing you can see. Keep your $90." The user feels the strength of the evidence before reading it.
- **Proof beat.** A "Prove it" hold gesture runs the planted effect and the planted null side by side: one ribbon snaps taut, one stays slack. This is the 8-second clip that shows the engineer judge the method works.

---

## Joint conclusions

### Top 3

1. **Lopsided.** Day-1 value from one selfie, deep mask-pixel work, highest design ceiling. Its weakness is Impact, because use is episodic and the sleep-side evidence is mixed.
2. **The Other Cheek.** Best technical honesty: positive and negative controls, noise floor, chained tasks. Its weakness is weekly use that lasts only for one trial.
3. **Look Compiler.** The hedge. It does not depend on score stability, it covers the VTO track, and its optimizer loop is visible. Pick it only if the day-1 probe kills the score-based ideas.

Honorable mentions: Unanimous for the most filmable moment but 108 units per group; Trigger Lab for its relief-first verdict, which is worth borrowing as copy.

### Proposed hybrid: "Half & Half"

Skin AI track. One product, three acts that share one pipeline.

1. **Act one, day 1: your two sides** (Lopsided). One selfie, lighting and yaw gate, midline split, quiet asymmetry reading, the mirror-twin moment. Useful on first use, so a judge sees value in 30 seconds.
2. **Act two, weeks 1 to 4: the other cheek** (Other Cheek). The user treats one side only. The asymmetry from act one becomes the baseline gap. Effect = change in that gap against the test-retest noise floor. The tension line gives the verdict, including "nothing detectable".
3. **Act three, the agent layer** (Trial Bench). A deterministic loop owns capture gating, unit budget, retry on documented errors, and a stop rule. It buys an extra scan only for the least certain concern. The LLM reads the product label, picks 1 to 4 concerns, and words the verdict from a structured result it cannot change. State this scope in one sentence in the submission, and do not oversell it.

Rules that carry across all acts: use `raw_score` for all math, never display `ui_score` or a 0 to 100 number, show change against the user's own noise band, and include the planted-effect validation strip.

Unit estimate: day-1 probe about 36 (three SD or HD scans at 12), validation harness about 85, one real run about 70. This leaves margin inside 1,000 units.

### Riskiest unknowns, in the order to de-risk

Spend about 40 units on the first three. Stop and re-plan if any of them fails.

1. **Mask format and semantics.** PNG alpha or JPG? Binary or soft? Same size as the input? One mask or two for bilateral concerns such as crow's feet? Every per-side number depends on this. Two scans of one face answer it.
2. **Test-retest noise.** Two same-day selfies through the same concerns. If `raw_score` noise is as large as a plausible product effect, most verdicts will read "inconclusive", and the demo needs at least one concern with a clear signal. Measure mask coverage noise at the same time.
3. **Sensitivity and chaining.** Simulation at 0.5 on one concern, then analysis on the output. Does the score move in the right direction? Does analysis accept the simulation's `dst_id` as input, or must the app download and re-upload? This decides the positive control.
4. **Composite seam.** Build a left-half original plus right-half simulated face. Does analysis flag the midline? If yes, fall back to the mirrored-half method at 2x cost, or to mask coverage per side.
5. **Left and right correctness.** Mirrored camera preview, subject's left versus viewer's left, MediaPipe midline under 10 to 15 degrees of yaw. A wrong side label breaks trust at once.
6. **Lighting gate threshold.** How much side-to-side brightness difference creates fake asymmetry? Tune on 5 real photos with window light on one side.
7. **Poll latency and concurrency.** Live task time decides whether a live demo is possible or only replay. Unknown until a key exists.
8. **Replay data source.** Whose face, with what consent, supplies the recorded fixtures? Decide before building, and record in `PROVENANCE.md`.

If risk 1 or 2 fails: drop to Look Compiler, which depends on neither. Its own first check is to fetch the missing pattern catalogs from the docs.
