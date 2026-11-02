# Three ideas from the creative technologist

Persona: interaction designer who ships demo films. Rule used for every idea: the metaphor must come from data the API returns, and a person must have a reason to return.

## What the specs give us that most teams will ignore

I read the skin analysis, skin simulation, aging, makeup VTO and unit tables. Four facts shape the ideas below.

1. **Masks are pixels, not pictures.** With `enable_mask_overlay: false` and `format: "json"`, each concern returns `mask_urls` as raw alpha PNGs. They align with the source image (capped at 2560 px on the long side). Most teams will paint them on a face. The pixels also support math: area, centroid, left versus right, change over time.
2. **`ui_score` is flattered on purpose.** The spec says it is "adjusted to produce more favorable results". `raw_score` (1 to 100, higher is healthier) is the honest signal. Any app that tracks change must use `raw_score`.
3. **The score regions are not left or right.** Regions are `forehead`, `nose`, `cheek`, `whole`, and so on. The API does not split by side. No YouCam spec I read returns face landmarks. A left and right comparison therefore needs the mask pixels plus a midline from an open-source detector in the browser (for example MediaPipe).
4. **Makeup VTO adds smoothing by default.** If a request has no `skin_smooth` effect, the engine applies strength 50. Any measurement that uses VTO renders must set `skinSmoothStrength: 0`, or the render changes pores and texture on its own.

Unit prices used below (from the specs): analysis SD 9 / 12 / 14 / 16 and HD 12 / 16 / 20 / 22 for 1-4 / 5-8 / 9-12 / 13-16 concerns. Skin simulation 4 for 1-4 concerns, 6 for 5-10. Makeup VTO 1. Aging 2 (returns 16 photos, ages 12 to 70). Skin tone analysis 20. Failed tasks cost nothing. HD and SD concerns cannot be mixed in one call.

Ideas I rejected: a skin "weather forecast" (one photo cannot predict next week, so it would be invented); an aging "fork" of two futures (the divergence would be made up, and the Impact judge would see that); a skin atlas (a heatmap in a new coat); a shelf scanner (YouCam has no product recognition).

---

## Idea 1: Lopsided

**One-line pitch.** Your face is never symmetric, and the pattern of the difference tells you which habit to test next.

**Target user and moment.** A person in their 20s to 40s who just got a breakout on one cheek, or who sees one eye looking more tired in photos. The moment is the bathroom mirror, 7:30 am, when they think "why is it always the left?"

**The real pain.** People ask "what is wrong with my skin". Nobody asks "why is only one side wrong". The one-sided pattern is a better clue than any average score. Two things support this:
- Strong one-sided sun damage exists. The best-known case is a truck driver with heavy left-face photoaging from years of window exposure (Gordon and Brieva, NEJM; summary in the [ABC News write-up](https://abcnews.go.com/blogs/health/2012/06/03/sunny-side-old-pic-reveals-suns-aging-effects)). Milder versions are plausible for any long-term driver or window-seat worker. This is a hypothesis for ordinary users, not a proven effect.
- Sleep side is a weaker link. A 2022 study found lower upper eyelid height on the preferred sleep side. A study of 64 side sleepers found no left and right wrinkle difference (both reported in the [search summary](https://www.sciencefocus.com/wellbeing/best-position-sleep-wrinkles) and the [ASAPS release](https://theaestheticsociety.org/media/press-releases/study-shows-stomach-and-side-sleeping-positions-cause-facial-distortion-and)). The app must say "test it", never "this is the cause".

**Interface metaphor.** A forensic case file with a split screen. A vertical hairline divides the face. Each half carries its own evidence tags. The user does not read a score. They read a ratio ("left 2.6x right") and an experiment card.

**Core interaction, step by step.**
1. The user takes one front selfie. The app checks lighting in the browser first. If one half of the face is more than a set amount brighter than the other, the app asks the user to turn toward the light and retry. This protects the result from lateral lighting.
2. The app uploads the photo and runs one SD analysis with 8 concerns: `acne`, `redness`, `age_spot`, `wrinkle`, `droopy_upper_eyelid`, `dark_circle_v2`, `oiliness`, `pore`.
3. The browser finds the facial midline with MediaPipe. It splits each mask PNG at the midline and computes an asymmetry index per concern: (L - R) / (L + R), using alpha sum inside the face region.
4. The screen shows the face split. The stronger side keeps its colored mask. The weaker side fades to grey. A ratio badge sits on the midline.
5. The user drags the hairline left or right. The ratios update live for the area inside the dragged region (a scrub on a free, client-side computation).
6. The app lists hypotheses ranked by evidence, each labeled "test, not diagnosis". Examples: one-sided eyelid droop with one-sided wrinkles maps to "sleep side"; one-sided age spots and wrinkles maps to "driver-side or window-side sun"; one-sided acne maps to "phone side, hand side, pillowcase side".
7. The user taps one hypothesis. The app builds a 14-day experiment ("sleep on the other side", "wipe the phone daily", "SPF on the driver side plus window film"). It sets a scan reminder at day 7 and day 14.
8. At day 14 the app shows the ratio before and after. It also shows the lighting imbalance of both scans, so the user can see whether the change is real. If the ratio did not move, the app says so and drops that hypothesis.
9. Optional split-face mode: the user applies one product to one side only. This is the standard design in dermatology trials. The untreated side is the control inside the same photo, which cancels most day-to-day change in lighting and skin state.

**YouCam endpoints and why each is essential.**
- `POST /s2s/v2.0/file`, then `PUT` to the presigned URL: upload the selfie. Required for every task.
- `POST /s2s/v2.1/task/skin-analysis` and `GET /s2s/v2.1/task/skin-analysis/{task_id}` with `format: "json"` and `enable_mask_overlay: false`: the whole idea depends on the raw mask PNGs. No other endpoint returns where on the face a concern sits.
- `POST /s2s/v2.0/task/skin-simulation` (optional, 4 units): render a "balanced you" with the heavier side's concerns reduced. Composite the sim's heavier half onto the original so the user sees the target. This is a motivation frame, not a prediction.

**20-second demo aha.**
- 0 to 3 s: a plain selfie fills the phone. A thin vertical line draws down the nose.
- 3 to 8 s: the left half keeps its color. The right half drops to grey. Acne and redness masks bloom on the left cheek like heat. A badge reads "Acne: left 2.6x".
- 8 to 13 s: the finger drags the hairline outward. Numbers roll for each concern. The upper eyelid droop number lights up on the same side.
- 13 to 17 s: a card slides in: "Pattern fits: you sleep on your left. Test it for 14 nights."
- 17 to 20 s: a jump cut. A second split-screen appears with a small calendar showing 14 days. The ratio reads "2.6x to 1.4x". The badge turns green. A small line below says "Lighting imbalance: 4%, scan accepted."

**Why it is non-obvious.** It reads mask pixels, not scores. It asks a question that no skin app asks (which side, and why). The experiment loop turns a result into a behavior test. The shared split-face method comes from clinical practice.

**Harsh risks.**
- Evidence for sleep asymmetry is mixed. If the pitch overclaims, a judge who knows the field will notice. The copy must say "hypothesis" and show the failure case.
- Lateral lighting, head yaw and camera mirroring all create fake asymmetry. The lighting gate, a yaw check and a "consistent over 3 or more scans" rule are mandatory. Without them the product is a random number generator.
- Mask semantics are untested. I have not seen whether `hd_wrinkle_output_crowfeet` is one mask for both eyes or two. If it is one mask, the split at the midline still works, but I must verify with real output on day 1.
- Return rate is episodic, not daily. The fix is a rotation of experiments and a monthly re-check, but this is weaker than a daily habit.
- Medical edge: a one-sided age spot cluster could be a lesion. The app must not diagnose. Add a plain note: "see a dermatologist for any new, changing or bleeding spot".
- Camera preview is mirrored. The word "left" must mean the subject's left everywhere.

**API unit cost per session.** One scan: SD, 8 concerns = 12 units. Optional balanced-you sim = 4. A full 14-day experiment (day 0, day 7, day 14) = 36 units. A full live demo set of five scans = 60 units. Plan: record real outputs once, then run the rest in replay mode.

---

## Idea 2: Receipts

**One-line pitch.** Put your serum on trial: a verdict, with an honest "I cannot tell yet", before you buy the refill.

**Target user and moment.** Someone four weeks into a new product, with the refill page open in another tab. The moment is the purchase, which matches the Skin AI brief ("right before a purchase").

**The real pain.** Skin changes slowly, in small steps, under changing light. People cannot judge their own progress and keep buying. Skin apps make it worse: consumer scores shift with lighting, and one vendor note I found says repeated results can differ unless light, distance and angle are kept the same (see the [Philips guidance](https://www.philips.co.uk/c-f/XC000021434/why-does-the-philips-lumea-skin-selfie-analyser-show-inconsistent-results)). A preprint on lighting and a skin-analysis device exists, but I could not read its results.

**Interface metaphor.** A lab notebook that ends in a verdict stamp. Time is a scrub bar under the face. Evidence is the mask of the concern the product claims to fix. The noise band is a grey tube around the score line.

**Core interaction, step by step.**
1. The user names the product and the concern it claims (for example "retinol serum, forehead lines").
2. Day 0: the app asks for three selfies in a row. It runs the same analysis on each (HD, up to 4 concerns). The spread of `raw_score` across the three gives a noise band per concern.
3. The app also builds a "ghost target": it runs skin simulation on the day-0 photo for the claimed concern at intensity 0.7, then runs analysis on the simulated image. The result is the score the skin could plausibly reach. This turns "get better" into "reach 74".
4. Each week the user takes one selfie. The app extracts the claimed-concern mask and score.
5. The user scrubs a time bar. The mask on the face fades or thickens as the weeks pass. The line chart shows `raw_score` with the noise band.
6. The app issues a verdict only when the change exceeds twice the noise band for two weeks in a row. Verdicts: "Working", "Not working", "Cannot tell yet". The third is the most common and the most honest.
7. A closing card shows money: cost per month of the product and the verdict. "Keep" or "Cancel" is a single tap, with a calendar reminder.

**YouCam endpoints and why each is essential.**
- `POST /s2s/v2.1/task/skin-analysis` (HD, 1-4 concerns): the measurement, using `raw_score`, not `ui_score`.
- `POST /s2s/v2.0/task/skin-simulation`: the ghost target. The chain simulation then analysis is the unusual part.
- `file` upload and `GET` polling for each task.

**20-second demo aha.**
- 0 to 4 s: a face with a thin timeline below it, labeled "Week 0 to Week 6".
- 4 to 12 s: a thumb scrubs the timeline. The forehead-line mask fades week by week. A score line climbs inside a grey band.
- 12 to 17 s: a red stamp falls: "Forehead lines: WORKING, +14." A second stamp for pores: "Cannot tell. Change is inside the noise."
- 17 to 20 s: "Keep serum A. Cancel serum B. Saves $312 a year."

**Why it is non-obvious.** It treats the score as a measurement with error, and says so. It uses simulation as an instrument, not as a toy.

**Harsh risks.**
- **Cold start.** On day 1 the app has nothing to show. A judge who tries it with one selfie sees only a baseline.
- **Circular demo.** For the film I would need six weeks of images. The only way to get them in time is to generate them with skin simulation and then analyse them with the same vendor's analysis. That proves the pipeline runs, not that a product works. I would have to label it as synthetic, and a skeptical judge can reject it. The honest fix is two or three real selfies per teammate, taken months apart.
- The ghost target depends on analysis responding sensibly to a generated image. Untested.
- Three baseline shots add friction.
- Product claims and mask semantics may not match (for example, a serum "for glow" has no mask).

**API unit cost per session.** Setup: three baseline analyses (HD, 4 concerns) = 36, plus ghost sim 4 and ghost analysis 12 = 52. Each weekly check-in = 12. A six-week trial = 52 + 72 = 124 units per user. A synthetic demo dataset (six sims at 4 and six analyses at 12) = 96 units.

---

## Idea 3: Minimum Dose

**One-line pitch.** The least makeup that actually works, found by an agent that renders, measures and stops at the knee of the curve.

**Target user and moment.** A person who wears base makeup every day, standing at the vanity, before an event, choosing between "a little" and "full coverage". Also the shopper who is about to buy a concealer and a foundation. This bridges the Skin AI track and the eCommerce VTO track.

**The real pain.** People over-apply because they cannot see where extra product stops helping. Result: cakey base, wasted product, shade that does not match. No app shows the point of diminishing returns.

**Interface metaphor.** A pharmacy label with a dose-response curve. The slider is "dose". The curve is the measured score. The pin is "minimum effective dose".

**Core interaction, step by step.**
1. The user takes a bare-face selfie. The app runs analysis on `redness`, `dark_circle_v2` and `texture` (SD, 3 concerns = 9 units) and `skin_type` zones.
2. An agent chooses the dose points. It starts at 50%, then moves up or down (a binary search with at most three renders).
3. For each point the agent calls makeup VTO with foundation coverage, concealer under-eye intensity and `skinSmoothStrength: 0`. It then runs the same analysis on the rendered image. The change in score is the measured effect.
4. The curve draws on the screen as each point arrives. The agent stops where the next dose adds fewer than 2 points.
5. For oily T-zone versus dry U-zone skin, the app renders two foundation variants (matte and dewy) and composites them using the `skin_type` mask. The result is one face with zone-specific finish.
6. The user drags the dose slider. The app crossfades between the rendered stops. The curve is real, the frames in between are interpolated, and the UI says so.
7. Output: a recipe card ("Under-eye 35, redness cover 20, T-zone matte, cheeks dewy") with hex shades. The shade comes from skin tone analysis (20 units, once per user) and links to a product.

**YouCam endpoints and why each is essential.**
- `POST /s2s/v2.1/task/skin-analysis`: the objective function, on the bare face and on each render.
- `POST /s2s/v2.0/task/makeup-vto` with `foundation`, `concealer`, `skin_smooth` effects: the actuator. At 1 unit it is cheap enough for a search loop.
- `POST /s2s/v2.0/task/skin-tone-analysis` (once): gives the shade for the palette.

**20-second demo aha.**
- 0 to 4 s: a bare face, with red redness and dark-circle masks.
- 4 to 12 s: a slider moves from 0 to 100. The masks shrink as the dose rises. A curve draws under the face.
- 12 to 16 s: the curve flattens near 40. A pin drops: "Minimum effective dose: 40."
- 16 to 20 s: the face at 40 beside the face at 100. Text: "100 gains 2 points and costs you the skin texture."

**Why it is non-obvious.** It closes a loop between two products. The analysis is the judge, the VTO is the hand, an agent decides when to stop. Sponsors asked for agentic workflows beyond a single call.

**Harsh risks.**
- **Core hypothesis is unverified.** The analysis may not respond to rendered makeup the way it does to real skin. If the score does not move, the curve is flat and the idea dies. Test this in the first 30 units.
- It serves makeup wearers only, and the "less makeup" message may clash with a retailer's goal.
- The composite may show a seam at the mask edge.
- Interpolated frames between real renders can be accused of faking the slider.
- Highest unit use per session of the three.

**API unit cost per session.** Bare-face analysis 9, three search steps at 1 (VTO) + 9 (analysis) = 30, two zone renders 2. Total about 41 per session, plus 20 once for the shade. A full demo with five dose points is about 59.

---

## Harsh ranking

| Rank | Idea | Why |
|---|---|---|
| 1 | Lopsided | Works on the first photo. Cheapest per session. Most new. Honest by design. |
| 2 | Receipts | Best habit and best business story. Weak cold start and a circular demo. |
| 3 | Minimum Dose | Best fit for the two-track brief and the agent requirement. The core measurement may not work. |

**Critic notes.**
- Lopsided wins on the Quality of Idea and Design criteria and costs the least. A judge can try it with their own selfie in 30 seconds, which matters because stage one can be judged from a video alone. Its weakness is Impact: the return rate is episodic and the evidence for sleep effects is mixed. The experiment loop and the failure-case screen are the answer. If those screens are missing, the project drops below Receipts.
- Receipts has the strongest Impact story but cannot show value on day 1, and its demo is either synthetic or slow. Borrow the split-face control from Lopsided to fix the noise problem and the cold start together.
- Minimum Dose is a test of one assumption. If the first 30 units show that analysis scores move with the dose, it jumps to second. If not, drop it at once.

**The bet.** Lopsided, with the split-face experiment as the second act. Build order: (1) fixtures and replay mode for analysis JSON and mask PNGs; (2) midline split and ratio math; (3) lighting gate; (4) experiment card and day-14 comparison; (5) polish the 20-second film. Spend the first live units on one real scan to confirm the mask structure before building anything else.

Sources used for the evidence notes: [ABC News on the truck driver case](https://abcnews.go.com/blogs/health/2012/06/03/sunny-side-old-pic-reveals-suns-aging-effects), [Science Focus on sleep position](https://www.sciencefocus.com/wellbeing/best-position-sleep-wrinkles), [ASAPS release](https://theaestheticsociety.org/media/press-releases/study-shows-stomach-and-side-sleeping-positions-cause-facial-distortion-and), [Philips guidance on inconsistent skin selfie results](https://www.philips.co.uk/c-f/XC000021434/why-does-the-philips-lumea-skin-selfie-analyser-show-inconsistent-results), [preprint on lighting variability and a skin analysis device](https://www.preprints.org/manuscript/202409.0822).
