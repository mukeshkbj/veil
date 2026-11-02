# Dermatologist persona: three ideas

Persona: board-certified dermatologist turned consumer skin-tech founder.
Brief: Skin AI track, 1,000 units total for build and demo, deadline Nov 2, 2026.

## The clinical frame behind all three ideas

Consumer skin apps fail in the same three ways.

1. They flatter. The spec says `ui_score` is "adjusted ... to produce more favorable results". A flattered score hides small real changes. Any tracking feature must use `raw_score`.
2. They compare photos with no noise floor. Light, distance, and angle change a selfie more than four weeks of a serum does. No app tells the user how big a change must be before it is real.
3. They ignore time. Most treatments need 8 to 12 weeks. Users judge at week 3, which is the worst moment to judge.

Every idea below fixes at least one of these, and uses a feature the API documents.

Facts I verified by search are marked **[src]**. Facts from my clinical memory are marked **[memory]** and should be checked before they go in a pitch.

---

## Idea 1: Week 3 (purge or reaction?)

**One-line pitch:** A weekly check-in for people on a new retinoid or acne active that tells them whether the new bumps are purging, irritation, or a plain failure, so they do not quit too early or push too hard.

**Target user and moment:** An adult, 20 to 35, on week 2 to 5 of adapalene or tretinoin. They see more pimples than at week 0. They stand at the mirror at night and decide whether to apply the active again.

**The real pain**
- 45.6% of patients in a 250-patient questionnaire study had stopped their topical acne therapy. 37.7% of those stopped because of side effects **[src]**.
- Irritant dermatitis occurs in roughly 85% of tretinoin users in one review **[src]**.
- The same study found that every-other-night users had the fewest side effects and the lowest discontinuation **[src]**. Titration works, but users do not know when to step up or back.
- A 2025 review warns that social media "purging" claims can deter use or excuse real irritation **[src]**.
- Purge is a clinical idea, not a myth. A retinoid speeds up cell turnover, so micro-comedones that already exist reach the surface. They appear where the user usually breaks out **[memory]**. Irritation appears in new places, with redness and dryness.
- I found no study that measures how many users quit during the purge window **[src]**. Do not claim one.

**Why existing apps fail:** They show one score per photo. A purge lowers the score, so the app confirms the user's fear. None of them knows what week of treatment it is, and none of them compares where the bumps are.

**Core mechanic**
1. Day 0: the user sets the active, the start date, and the target frequency. The app runs a Fitzpatrick check once.
2. Day 0: the app takes two guided photos in one sitting. It scores both. The difference is the noise floor for this user in this bathroom.
3. Each week: a guided capture. Client-side face landmarks (MediaPipe, not a YouCam API) check pose, distance, and alignment to the day-0 outline. Bad photos are rejected before any unit is spent.
4. The app runs HD skin analysis with six concerns: acne, pore, redness, moisture, oiliness, texture.
5. The app divides the face into zones. It compares today's acne mask with the day-0 acne and pore masks, zone by zone.
6. A small rule engine returns one of four verdicts, each tied to the week of treatment:
   - Purge pattern: acne `raw_score` falls, new lesions fall inside the day-0 congestion zones, redness and moisture hold within the noise floor.
   - Irritation pattern: redness `raw_score` falls and moisture `raw_score` falls beyond the noise floor, lesions appear in new zones. Advice: step the frequency down.
   - Working: acne `raw_score` rises beyond the noise floor.
   - Too early or too noisy: the change is inside the noise floor. Advice: hold, and say so.
7. For Fitzpatrick V and VI, the app lowers the weight of the redness signal. Erythema is harder to see and to detect in darker skin **[memory]**. It leans on moisture and texture instead, and it says so on screen.
8. Export: a one-page PDF for a clinician with the score trend, masks, dates, and the active used.

**YouCam endpoints and why each is essential**
- `POST /s2s/v2.0/file`, then `PUT` to the pre-signed URL: upload for every photo.
- `POST /s2s/v2.1/task/skin-analysis` and `GET .../{task_id}`, HD actions: the whole product. It needs `raw_score` for trend, because `ui_score` is flattered. It needs the per-concern masks for the zone comparison. HD is needed because `hd_pore` returns forehead, nose, and cheek sub-scores.
- `POST /s2s/v2.0/task/fitzpatrick-scale-analyzer`: one call at day 0 to set signal weights and sun-sensitivity copy. The spec's table lists "Type V" twice, so map by the type number the API returns.

**The 20-second demo aha**
Split screen, week 3. Left: a generic app says "Skin score 71, down 9" in red. Right: Week 3 shows 11 new bumps highlighted, 9 inside the day-0 congestion zones, with the verdict "Purge pattern. Day 21 of about 42. Redness and moisture steady. Keep going." Then swap to a second user: bumps on the cheeks outside the congestion zones, redness and moisture falling, verdict "Irritation. Drop to two nights a week."

**What makes it non-obvious**
- It treats a score drop as information, not as a failure.
- It uses the test-retest noise floor, which no consumer app exposes.
- It uses the zone overlap of two mask sets over time, not one score.

**Risks and weaknesses (harsh)**
- The core claim (purge lesions sit in old congestion zones) is a clinical heuristic. I have not seen it validated with AI masks. A dermatologist judge will ask for proof, and we have none.
- Mask registration between weeks is hard. Head pose shifts of a few degrees move lesions across zone borders. Use coarse zones, not pixel overlap.
- The acne model may mark healing marks as acne. Then "new lesions" are partly old marks.
- Our demo timeline must be a fixture. The simulation API only removes problems, so we can fake an improving timeline but not a worsening one. One honest build: take a real "week 3" photo, run simulation with acne at 0.4 to make a cleaner "day 0", and label it as a constructed fixture. That makes the zone overlap high by design. A skeptical judge will see it. Say it in the video.
- Medical advice risk. Phrase output as "pattern consistent with" and always offer the clinician export.
- Weekly use is good only while a user is on a new active. Retention after week 12 is weak.

**API unit cost per user session**
- Day 0: two HD analyses with six concerns (16 units each) plus Fitzpatrick (10) = 42 units.
- Each weekly check-in: one HD analysis, six concerns = 16 units.
- A full 12-week program = 42 + 12 x 16 = 234 units per user.
- Build and demo plan: about 8 live analyses (128) plus Fitzpatrick (10) = about 140 units. The rest runs on offline replay.

---

## Idea 2: The Other Cheek (a split-face trial for one product)

**One-line pitch:** Put the new serum on half your face for four weeks, and the app tells you, with a noise floor and a control side, whether the product did anything.

**Target user and moment:** A shopper who bought a $60 to $120 serum, moisturizer, or exfoliant and is about to decide to buy it again, or about to give up. The moment is week 2 to 4, in front of the mirror, asking "is this working or am I imagining it?"

**The real pain**
- Users cannot separate a product effect from season, sleep, hormones, and other products. Everything changes at once, so memory fails.
- The split-face design is a standard tool in dermatology and cosmetic trials. One side gets the product, the other side gets placebo or nothing, with side randomised **[src]**. A 2006 IPL trial and several registered trials use it. Registered trials list the control side and blinded assessment as the usual features **[src]**.
- A cosmetics paper argues that split-face design with high-resolution imaging detects formulation differences with fewer subjects **[src]**.
- No consumer app offers this design. The user is the lab.

**Why existing apps fail:** They compare "before" and "after" in time. Time is the weakest control there is. The other half of the same face, in the same week, under the same sleep and weather, is the best control available to a consumer.

**Core mechanic**
1. The user picks the product and what it claims (pores, texture, radiance, moisture). The app limits the metrics to one to four concerns.
2. The app randomises the side (left or right) and shows a "treat this side only" outline.
3. Day 0: two photos in one sitting. The app measures baseline asymmetry (left vs right) and the noise floor from the pair. A face is never perfectly symmetric, so the app tracks the change in the left-right gap, not the gap itself.
4. Weeks 1 to 4: one guided photo per week. Landmarks (MediaPipe) fix the midline. The app runs HD skin analysis on the chosen concerns.
5. The app computes, for each side, the mask coverage per concern from the returned masks. It also keeps the whole-face `raw_score` as a sanity check. The effect is `(treated - control)` at week N minus the same gap at day 0.
6. The verdict has three states: real effect (beyond the noise floor), no detectable effect (inside it), or "your photos are too noisy, retake". "No detectable effect" is a first-class result.
7. Optional second method: build two mirrored half-faces (left half plus its reflection, right half plus its reflection) and score each with the API. That yields true per-side `raw_score` values, at twice the cost. Use it only if mask coverage proves noisy.

**Positive and negative controls (the engineering twist)**
- Positive control: take a selfie. Run `skin-simulation` with `pores` at 0.5. Composite the simulated right half onto the original left half. Run analysis. The app must report a right-side pore improvement. If it does not, the pipeline is broken.
- Negative control: composite a half with an off-target simulation (for example `acne`, while the metric is pores). The app must report no pore effect. The simulation API rejects all-zero intensities, so use an off-target concern or a second same-day capture for the null.
- This lets us show a validation figure in the video: "known effect recovered, known null rejected". It is the strongest rigour signal available inside a hackathon.

**YouCam endpoints and why each is essential**
- `POST /s2s/v2.0/file` plus pre-signed `PUT`: uploads.
- `POST /s2s/v2.1/task/skin-analysis` with HD actions: `raw_score` for the trend (not `ui_score`), plus per-concern masks, which are the only way to get per-side numbers without a second call.
- `POST /s2s/v2.0/task/skin-simulation` with per-concern intensities from 0.0 to 1.0: builds the positive and negative controls and the demo fixture. No other API gives a controlled, known, local change to a real face.

**The 20-second demo aha**
A face with a vertical line. The right half glows with a pore-improvement overlay. A stamp: "Right cheek: pores +9.4 raw (noise floor ±2.1). Real effect." Cut to the validation strip: "We planted a known effect and found it. We planted nothing and found nothing." Last frame: the same screen for a different product with "No detectable effect. Save your $90."

**What makes it non-obvious**
- It borrows a clinical-trial design and hands it to a consumer.
- It treats `ui_score` as unfit for measurement and says why.
- It uses the simulation API as a test instrument, not as a "see your future skin" filter.

**Risks and weaknesses (harsh)**
- Users must apply the product to one half only. Many will not, and products migrate. Real compliance is poor.
- Mask coverage is a proxy for severity. We have not seen the mask format. The spec text says PNG alpha, but the sample `mask_urls` ends in `.jpg`. Check this on the first live call.
- A chimeric (composited) face has a seam at the midline. The analysis engine may flag nose or nasolabial features there.
- Effects of a good serum over four weeks can be smaller than the noise floor. The honest answer is then often "no detectable effect". Users may feel the app is useless. Frame it as savings.
- Facial asymmetry from sleeping side, hand use, and window light creates side bias. The day-0 gap subtraction handles part of it, not all.
- Weekly use lasts only for the length of a trial (four weeks). A user runs perhaps three to six trials a year.
- The simulation is a generative model. Its "improvement" shows what the model draws, not what skin does. That is fine for a pipeline test. It is not evidence of product efficacy, and the video must not imply it.

**API unit cost per user session**
- A four-concern HD analysis costs 12 units.
- Day 0: two captures = 24 units. Weeks 1 to 4: 4 x 12 = 48 units. One full trial = 72 units.
- Mirrored-half method doubles each analysis (24 units per check).
- Build and demo plan: three simulations (4 each = 12), plus about six analyses (72) = about 85 units for the validation figure. Add about 60 units for a real-photo run.

---

## Idea 3: Fade (melasma tracking with a real clinical score)

**One-line pitch:** A weekly selfie that returns an mMASI-style melasma score, region by region, so the user can see whether treatment and sun protection work.

**Target user and moment:** A woman, often Fitzpatrick III to VI, with melasma on a treatment plan (sunscreen, tinted sunscreen, topical lighteners, or a prescription). Moment: Sunday evening, after a week outdoors, wondering whether the patches are darker.

**The real pain**
- Melasma affects up to about 1% of the general population and 9 to 50% in higher-risk groups (people of colour, pregnant women, high UV exposure) **[src]**.
- It disproportionately affects women **[src]**.
- Sunscreen is the key control. A Moroccan study of pregnant women reported 2.7% new melasma with regular sunscreen against 53% in an earlier study of similar design. It is small and old **[src]**. Most patients do not follow photoprotection advice **[src]**.
- Visible light, especially 400 to 450 nm, is thought to play a role, so tinted (iron oxide) sunscreens are advised for skin of colour **[src]**. One trial of that question has no result in what I found **[src]**.
- Clinicians measure it with MASI. The modified score (mMASI) uses darkness and area by region. Regions are forehead (weight 0.3), right malar (0.3), left malar (0.3), and chin (0.1). Darkness runs 0 to 4. Area runs 0 to 6 **[src]**.
- I found no accepted numeric threshold for a meaningful mMASI change **[src]**. Do not invent one.
- Treatment takes months **[memory]**, so users need a trend line that tells them to keep going.

**Why existing apps fail:** Skin-tone and spot apps score "pigmentation" as one number, tuned for a light-skinned default. They give no regional clinical score, they flatter, and they do not link a bad week to sun exposure.

**Core mechanic**
1. Day 0: Fitzpatrick type, then skin-tone analysis to get the baseline skin colour (a hex value) used as the reference for "normal" skin.
2. Each week: guided capture, then HD analysis with three concerns: age_spot, redness, radiance.
3. Client-side landmarks split the masks into the four mMASI regions.
4. For each region, area is the mask coverage mapped to the 0 to 6 bands. Darkness is the colour distance between masked pixels and unmasked skin in the same region, mapped to 0 to 4. Redness is subtracted so inflammatory marks do not count as melasma.
5. The app computes mMASI as `0.3·Df·Af + 0.3·Dr·Ar + 0.3·Dl·Al + 0.1·Dc·Ac`.
6. The user logs sun exposure and the sunscreen used with two taps. The trend view shows mMASI against those logs.
7. A "goal" image: `skin-simulation` with `spots` at an intensity the user chooses. It is labelled "illustration, not a prediction".
8. Export for the clinician: mMASI trend, region table, photos.

**YouCam endpoints and why each is essential**
- `POST /s2s/v2.0/file` plus `PUT`: uploads.
- `POST /s2s/v2.1/task/skin-analysis`, HD: `hd_age_spot` mask for area and darkness, `hd_redness` to exclude inflammation, `raw_score` for the trend line.
- `POST /s2s/v2.0/task/fitzpatrick-scale-analyzer`: one call. It sets the copy about sun and visible light, and the darkness calibration.
- `POST /s2s/v2.0/task/skin-tone-analysis`: `skin_color` hex as the reference colour for the darkness computation. It costs 20 units, so it runs once.
- `POST /s2s/v2.0/task/skin-simulation` (`spots`): the goal illustration.

**The 20-second demo aha**
A face with four coloured region outlines. A number counts down: "mMASI 8.4 to 6.1 in 10 weeks". Below it, a bar chart of sun-exposure weeks, with the one bump in week 6 circled and labelled "beach trip, no tinted sunscreen". Caption: "The score your dermatologist uses, from a selfie."

**What makes it non-obvious**
- It re-implements a clinical outcome measure from API masks rather than showing a vendor score.
- It serves an under-served group (skin of colour, women) with a tool built around their main treatment risk, which is sun and visible light.
- It links the score to behaviour. The behaviour (sunscreen) is the strongest lever in the evidence above.

**Risks and weaknesses (harsh)**
- The biggest risk is detection fidelity. The `age_spot` model is built for discrete spots. Melasma is diffuse patches. It may miss it, especially in darker skin. If the mask is empty or wrong, the whole idea fails. We cannot test this without a key and a melasma photo.
- Our mMASI is not validated. It must be labelled "mMASI-style estimate", not a clinical score. We have no accepted threshold for change.
- Skin colour and darkness depend on lighting. Skin of colour under warm indoor light gives large errors. A noise floor from a day-0 retest is needed here too.
- We need melasma photos with consent for the demo. Public sets are small and the licence is unclear. The fallback is a fixture, which weakens the story.
- Narrow audience. Judges may see it as niche.
- Weekly use is plausible, but benefit shows only over months. The user may stop at week 4.

**API unit cost per user session**
- Day 0: Fitzpatrick (10) + skin tone (20) + one HD analysis with three concerns (12) = 42 units.
- Weekly: 12 units.
- A 12-week program = 42 + 12 x 12 = 186 units.
- Build and demo plan: about 6 analyses (72) + Fitzpatrick (10) + skin tone (20) + two simulations (8) = about 110 units.

---

## Unit budget across the build

The brief gives 1,000 units total. Cost per call: Fitzpatrick 10, skin tone 20, simulation 4 to 6, HD analysis 12 (1 to 4 concerns) or 16 (5 to 8). SD is cheaper (9 or 12) but has no per-region pore scores.

| Idea | Build and demo units | Per-user full program |
|---|---|---|
| 1. Week 3 | about 140 | 234 |
| 2. The Other Cheek | about 145 | 72 per trial |
| 3. Fade | about 110 | 186 |

All three leave a large margin. None of them needs a loop that polls often. Cache every response, because results expire after 24 hours and each success costs units.

---

## Harsh ranking

**1st: The Other Cheek (Idea 2). This is the one I would bet on.**
- It is the only idea whose central claim we can test inside the hackathon. The positive and negative controls need one selfie and about 100 units.
- It matches the track text exactly: "deciding whether a product is working."
- It uses three API features in a chain (upload, simulation, analysis) and a real statistic (noise floor). That scores on Technological Implementation, the first judging criterion and the tie-breaker.
- The visual is simple: one face, one line, one stamp.
- Its weakness is real. Weekly use lasts only for a trial, and compliance is shaky. I accept that, because the others have bigger weaknesses.

**2nd: Week 3 (Idea 1).**
- It has the strongest emotional hook and the biggest audience.
- It loses to Idea 2 because its core claim (purge sits in old zones) is unproven, and our demo data would be built to confirm it. A dermatologist on the panel would see that.
- If time allows, take its noise-floor and week-aware verdict logic into Idea 2 as a "this product is an active, so expect a purge window" note. That adds clinical depth for little code.

**3rd: Fade (Idea 3).**
- It has the best impact story and the best fit for a special prize (Women in Tech), and it makes the clearest use of Fitzpatrick and skin tone.
- It has the highest chance of total failure. If `age_spot` does not detect melasma patches, nothing works, and we learn that only on the first live call.
- Run one live `age_spot` analysis on a melasma photo before choosing it. Spend 12 units to find out. If the mask looks right, move it up to 2nd.

**Decision:** Build The Other Cheek. Spend the first 30 units on one HD analysis to confirm the mask format (PNG alpha or JPG) and the score shape, because the whole per-side method depends on it.

---

## Sources

- mMASI structure and weights: [Clinical trial NCT07727954](https://clinicaltrials.gov/study/NCT07727954), [BC Laser and Skincare on melasma scales](https://www.bclaserandskincare.com/2021/03/successful-melasma-treatments-measurement-scales/)
- Acne therapy discontinuation and retinoid irritation: [PMC6683887](https://pmc.ncbi.nlm.nih.gov/articles/PMC6683887), [Dermatology Times on adherence](https://www.dermatologytimes.com/view/adherence-issues-in-the-treatment-of-acne), [JCAD retinoid review](https://jcadonline.com/the-evolution-of-topical-retinoids-in-dermatology-a-cornerstone-of-acne-management-1971-2025/)
- Split-face designs: [NCT06415292](https://clinicaltrials.gov/study/NCT06415292), [NCT07548424](https://clinicaltrials.gov/study/NCT07548424), [ISRCTN18412271](https://www.isrctn.com/ISRCTN18412271), [IPL split-face trial](https://candelamedical.com/resources/clinical-papers/skin-rejuvenation-using-intense-pulsed-light-a-randomized-controlled-split-face-trial-with-blinded-response-evaluation/), [J Cosmet Sci split-face paper](https://library.scconline.org/v049n03/59)
- Melasma prevalence, sunscreen, visible light: [PMC9790748](https://pmc.ncbi.nlm.nih.gov/articles/PMC9790748/), [PMC6986132](https://pmc.ncbi.nlm.nih.gov/articles/PMC6986132), [NCT02061839](https://clinicaltrials.gov/study/NCT02061839), [Skin Spectrum summary](https://skin.substack.com/p/melasma-frequent-in-skin-of-colour). The Moroccan sunscreen figure came through a secondary summary and a manufacturer page. Check the original paper before quoting it.
- API facts (`ui_score` calibration text, HD pore sub-regions, simulation intensities, unit costs, Fitzpatrick table typo): read directly from `research/openapi/ai_skin_analysis.json`, `ai_skin_simulation.json`, `ai_fitzpatrick_skin_type.json`, `ai_skin_tone_analysis.json`.
