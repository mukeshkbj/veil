# Round 2 judgement: tech and design (principal engineer + product designer)

I ignored the builders' own scores. I read the five idea files, decision.md, brief.md, and checked claims against the OpenAPI specs. The frame is a 2-minute video, 3 screenshots and a description, built by one person in about 10 days with 1,000 units.

## What the specs actually say (checked, not assumed)

- makeup-vto foundation can be measured. The effect takes a free `#RRGGBB` colour plus `colorIntensity`, `glowIntensity` and `coverageIntensity`, and the spec says it is "applied globally based on skin segmentation". The output is an image, so any colour measurement is our own pixel maths at 1 unit per render. What the spec does not tell us: whether the rendered colour tracks the input hex monotonically, and whether the neck is inside the segmentation. Seam, Neck Test and Cover Story all bet on this. A 5 to 6 unit probe settles it, and every foundation idea should run that probe before anything else. Also confirmed: with no `skin_smooth` effect supplied the engine adds smoothing of 50, so every measurement render must set it to 0 explicitly. The daily-habit and inclusion builders caught this and it is a real mark of care.
- skin-tone-analysis returns usable colour values, with limits. It gives `skin_color`, `lip_color`, `eyebrow_color` and `eye_color` as free hex values, plus `face_quality` flags (`has_face`, `area`, `frontal`, `lighting`, `faceangle`). The flags are strings such as "good", with no documented scale. `hair_color` is one of only 7 fixed values, so it cannot carry a hair "level". `skin_color` is one face-wide hex, with no stated calibration or precision. That is fine as a reference or cross-check, but too coarse to detect a few L* points of sunscreen cast. Local pixel sampling has to do the real measuring. At 20 units per call it also cannot be spent freely.
- skin-analysis gives `raw_score` (float 1 to 100), `ui_score`, and `mask_urls` per concern. Masks stay usable on every render of the same photo only if the render stays pixel-aligned, which the inclusion builder asserts but the spec does not promise.
- makeup-vto has `eyebrows`, `eyelashes`, `eye_shadow`, `lip_color`, `concealer` (zone-based, not per blemish) and `foundation`. So "rebuild brows and lashes" is supported.
- skin-simulation takes slider values (`wrinkle`, `spots`, `redness`) from 0 to 1, with "at least one cannot be zero". It is a best-case illustration, not a product-specific effect. Any idea that shows it as "what this serum does" over-claims.
- mu-transfer: no unit price in the spec. Every idea that uses it has an unknown line in its budget.

Unit costs I trust from brief.md: skin analysis 9 to 22, simulation 4 to 6, VTO 1, tone 20, Fitzpatrick 10. The builders' arithmetic checks out. 1,000 units is plenty for any single idea if the planned probes are cheap.

## Scores (1 to 10, harsh; 9+ means plausible first place out of about 150)

Format: TI = Technological Implementation, D = Design, PI = Potential Impact, QI = Quality of Idea.

### Returns economist

**1. Neck Test** (TI 6, D 7, PI 6, QI 5)
- TI: a closed loop around the VTO render with mask-cleaned sampling is real but small, and Seam does the same thing with more depth.
- D: one face, a seam, a falling ΔE number reads in five seconds, but it is a single-purpose utility.
- PI: the foundation return story is the best P&L argument in the pile, but the 23% figure is untraceable and the shade table is mock data.
- QI: "match the neck" is a known makeup rule turned into a metric, and shade finders are the most crowded category in this hackathon.

**2. Gift Proof** (TI 6, D 7, PI 6, QI 7)
- TI: breadth across lip, blush, earrings, necklace and scarf endpoints is real, but the "verify" is the recipient's tap, so the loop is a for-loop over renders.
- D: the two-phone story is clear, but a solo judge cannot feel the surprise and a staged second person risks looking scripted.
- PI: the privacy design (share measurements and approvals, not photos) is a good brand-side argument, but the gift-return data is thin and the recipient must act.
- QI: "measure her, do not show her" is a fresh answer to blind gifting, though underneath it is a recommended shelf.

**3. Money Map** (TI 5, D 7, PI 5, QI 5)
- TI: claim parsing is an LLM job that any entrant can do, and the simulation cannot verify efficacy, so the verify step is arithmetic on its own input.
- D: dollars drawn onto face zones is a screenshot with a hook.
- PI: the waste evidence is soft (a Hong Kong survey and a self-selected audience).
- QI: it is Headroom with a better chart, and the judges have already seen scan, score, recommend.

### Inclusion

**4. Seam** (TI 7, D 8, PI 7, QI 6)
- TI: masks, tone read and VTO feed a secant-step loop with real ΔE00 colorimetry, but it depends entirely on the renderer following the hex, and the solver is plain optimisation.
- D: the seam strip with a falling ΔE counter and the blend recipe "70% 6W + 30% 7N" is a strong single frame.
- PI: deep-skin shade failure is real and specific, but use is a few matches a year and the demo catalogue has no measured Lab values.
- QI: "no single bottle fits, mix these two" is a genuine step past a shade finder, which still leaves it in a crowded category.

**5. Veil** (TI 6, D 8, PI 8, QI 9)
- TI: tone and analysis calls do real work (clean-patch masks, brow and eye colour as drift references), but the core is colorimetry a developer could write without YouCam, and the two-photo design has a lighting-noise risk the builder honestly rates as a kill risk.
- D: the split-cheek photo with a "Ghost 7.9" meter and a difference map is the best screenshot of the 16, and the swipe step is the only friction.
- PI: 25% vs 7% white-cast barrier, 61% of Black respondents never wear sunscreen, and a named health stake make this the best-evidenced pain in the pile.
- QI: measuring what a product does to you rather than what the app adds, filling a gap the literature names (no standard white cast method), is the freshest idea in the field.

**6. Translate** (TI 7, D 7, PI 6, QI 7)
- TI: four endpoints and two own metrics, with the straight mu-transfer copy as an honest baseline, but mu-transfer pricing is unknown and the line emphasis metric may not move.
- D: the three-up with two bars per frame works as a screenshot, but explaining the bars costs a sentence.
- PI: an under-served audience (women 50 and over, deep skin), but a 2019 survey and no return or conversion number for look-based shopping.
- QI: "preserve contrast, not colour" is real colour science, though it sits next to a round-1 reference-look idea.

### Brand buyer

**7. Shade Twins** (TI 7, D 8, PI 6, QI 6)
- TI: four endpoints with a Lab-gap verify loop is solid, but twin ranking is nearest-neighbour over about 8 staged creators and the whole idea hangs on mu-transfer not washing out deep skin.
- D: three faces joined by ribbons with colour-gap numbers is a vivid frame.
- PI: creator commerce is a big channel, but it needs creator contracts and photo licences, and nothing in the demo proves a twin's shade works on you.
- QI: lookalike creator as social proof is novel, and it is still a shade matcher in a creator costume.

**8. Consult Canvas** (TI 6, D 6, PI 6, QI 5)
- TI: Skin AI only, a knapsack over an invented price list, and a skin-simulation render that cannot be product specific.
- D: a budget slider on a face is clear, but it is a clinic tool and judges will not feel a user.
- PI: cost as the stated barrier is true, but every conversion number is a vendor number and the catalogue is made up.
- QI: consult visualisers already exist and are already sold by the sponsor.

**9. Honest Hair Color** (TI 5, D 8, PI 6, QI 7)
- TI: the spec kills the verify step. `hair_color` from tone analysis is one of 7 fixed values, so "read the hair level back from the render and compare to the predicted hex" cannot be done with the API. It reduces to a rule table plus two hair-color renders.
- D: the triptych with a level ruler reads in three seconds.
- PI: the "box or salon" decision is a clean retail metric, but Garnier already ships a similar quiz and hair is outside the Skin AI track.
- QI: a try-on that knows what is attainable is a sharp frame, even though the knowledge is a colourist rule of thumb.

### Daily habit

**10. Mirror Forecast** (TI 6, D 7, PI 6, QI 6)
- TI: three endpoints plus a free weather API, with a mask-conditioned compositor, is competent, but the weather layer is trivial.
- D: radar-style overlays on a face with a UV curve is a good card and the shape of every wellness dashboard.
- PI: the habit claim is the weakest part (day-30 retention for such apps is 3 to 8%) and day-to-day skin barely moves.
- QI: "weather app for your face" is a catchy frame with no evidence that weather changes the choice.

**11. Cover Story** (TI 8, D 9, PI 6, QI 7)
- TI: acne and redness masks to a lesion list, a per-lesion cover, leave or treat decision, masked compositing, and an own-ΔE verify is the best-integrated chain of the 16, with a real catch on `skin_smooth`.
- D: ringed blemishes with one-word chips and a bare-to-covered slider is readable in two seconds and is the strongest first-use moment in the pile.
- PI: a same-day purchase moment with a clear basket, but use is episodic and a clear-skin judge may not feel it.
- QI: treating each blemish as a decision is non-obvious, though it still reads as a very good makeup feature, not a new category.

**12. Fit Check** (TI 6, D 6, PI 5, QI 5)
- TI: three endpoint families, but the decision engine is colour distance and a rotation count.
- D: closet setup is homework that kills first-use clarity.
- PI: the returns case is indirect because returns are driven by fit, which no endpoint measures.
- QI: outfit planners are common and Skin AI is a passenger.

### Contrarian

**13. Second Mirror** (TI 6, D 7, PI 7, QI 6)
- TI: the verify step is local maths with no YouCam call in the loop, so the integration is thin.
- D: a voice-first caption stage is strong in a video and nearly invisible in a screenshot.
- PI: the EU Accessibility Act is a real driver, but it cannot be tested with a blind user in 10 days, so the claim is unearned.
- QI: accessibility is rare in this pile, but Estée Lauder shipped the concept in 2023.

**14. Still Me** (TI 7, D 8, PI 7, QI 8)
- TI: brows and lashes mirrored across the midline, a local sentinel that spends 0 units until the change leaves a personal band, and a unit-spend policy is a good agent design. The sentinel itself is local maths, and the drift hypothesis is unproven.
- D: the brow-less selfie next to the rebuilt face, and the swatch strip with a grey band, are two screenshots with real emotion.
- PI: a high-stakes moment with weekly use, but no study shows face colour drifts enough to break a foundation match, and the demo needs a stand-in, not a patient.
- QI: pairing measurement-grade tone tracking with restoration is rare, and the rebuild act works even if the hypothesis fails.

**15. Pre-Flight** (TI 6, D 4, PI 5, QI 5)
- TI: a clean reuse of the gate and self-test, but planting a vendor simulation and checking a vendor analysis finds it is circular.
- D: a grade card and a one-page sheet is an enterprise form.
- PI: the clinic access problem is real, but the buyer is not the sponsor's brand client and the user value is invisible in a video.
- QI: it is photo QA for telehealth.

### Incumbent

**16. Other Cheek** (TI 7, D 8, PI 7, QI 8)
- TI: a midline split, noise band and planted-effect self-test is the most rigorous measurement design here, but it uses two endpoint families only, has never run live, and whether skin-analysis detects a simulation composited on one half is still an open question.
- D: the specimen-slide look and the tension line that snaps taut is a real signature moment, though the verdict "nothing detectable" is quiet.
- PI: "does my serum work" is the most universal pain in the Skin AI track, but a 4-week trial cannot be shown live, so the video runs on a labelled replay.
- QI: using the other cheek as a control group is a genuinely new framing of an old question.

## Top 3

1. **Veil merged with the Other Cheek engine** (call it "Other Cheek: Veil", a split-cheek sunscreen test). Highest ceiling, and the only idea that moves three criteria to 9 if the risk probe passes.
2. **Cover Story** (best Design and best single-session chain, safe to execute).
3. **Still Me** (best emotional arc; build the rebuild act first so it stands without the drift claim).

Other Cheek itself is fourth. It stays the safest pick, and its engine is the reason the merge works.

## What would raise the top pick to 9+ on every criterion

The recommendation: do not build Veil as written (two photos, bare then swiped). Take its question and Other Cheek's trick.

**The change.** Put the sunscreen on one cheek and leave the other bare, then photograph both in the same frame. Light, white balance, exposure and skin state cancel out, because both cheeks sit in one photo. Cast = the lightness difference between the swiped patch and its mirror patch on the bare cheek, using the published white cast score `(L*final - L*initial) / (100 - L*initial)`, with `L*initial` read from the bare mirror patch. This removes Veil's biggest risk (lighting noise between two photos exceeding a few L* points). It also reuses Other Cheek's noise band: take two same-day photos, measure bare-left against bare-right before any product, and that asymmetry is the floor under which no cast is reported. Gate the capture on `face_quality` and on the app's own lighting-balance check.

**Technological Implementation to 9.** Make the YouCam calls load-bearing, not decorative.
- skin-analysis masks (`age_spot`, `redness`, `acne`) choose a clean patch on each cheek and exclude marks, so the cast is measured on even skin. This is the "what the API gives you that a developer could not write in an afternoon" step.
- skin-tone-analysis supplies brow and eye hex as drift references, and `skin_color` as a cross-check on the local sample. When the two disagree beyond the noise band, ask for a retake. This is a real use of its 20 units.
- Run the planted-effect self-test: composite a synthetic whitening (a known L* lift through the swipe mask) on the bare cheek of the same photo and show the pipeline recovers it, and a null (no lift) is reported as "no cast". This is the Other Cheek self-test applied to a measurement the app can actually verify, since the planted lift is exact. It is stronger than the builders' skin-simulation plant, which only tests a vendor against itself.
- Use makeup-vto `foundation` at low coverage as the "tinted option" preview, labelled as an illustration. Use Fitzpatrick (10 units) to pick the skin-depth bucket that the verdict is reported against.
- Pre-build probe, about 25 units: two bare photos plus one swiped photo, local sampling only, then one tone read. Pass if bare-left vs bare-right asymmetry stays under half the swipe effect. Run it before anything else.

**Design to 9.** The screenshot is one face split at the midline: left cheek bare, right cheek swiped, a vermillion band on the treated side only (Other Cheek's accent), and a single large word in italic serif: "Ghost" or "Invisible". Under the face: the cast number with the noise band drawn as a grey bracket around zero, and three side-by-side cheeks (your sunscreen, a tinted match, bare). The first-use clarity is "put it on one cheek, take one photo", a sentence anyone understands. Show a deep skin tone in the hero frame, since white cast is the problem there. Add a difference-map toggle that amplifies the cast so it survives a small screenshot.

**Potential Impact to 9.** Lead with the measured disparity (25% vs 7% white cast barrier, 61% of Black respondents never wear sunscreen) and the health consequence, then frame the client value as the missing data point: a "cast on your skin depth" rating per SKU, the way size and fit data works for clothes, aggregated without photos. State the pilot honestly: the retailer case rests on data a pilot must collect. Keep the claim at "iron oxide tint" and make no melasma treatment claim. Add Other Cheek's full 4-week trial only as a follow-on ("also test whether it protected you"), not as the hero, because a replay-only 4-week arc is what holds Other Cheek down on Impact.

**Quality of Idea to 9.** It is already the freshest idea. Protect it by claiming the measured gap in the literature (the PLoS One 2025 paper states no official method to quantify white cast exists) and by making the split-cheek control the named innovation. Do not call it a shade finder or a sunscreen recommender.

Honest ceiling: Technological Implementation is the criterion most likely to stay at 8, because the colorimetry is mostly local maths. The tiebreak order in the brief puts it first, so the load-bearing YouCam calls above matter more than any polish.

## Merges worth considering

- Seam + Neck Test collapse into one. Neck Test is a strict subset. Build only Seam if you want a foundation idea, and run its 6 unit render probe first.
- Cover Story as the "after" step of the merged idea: after a swipe test, a person with a breakout can get the ringed-face cover plan. That adds a second moment, but it dilutes the one-sentence pitch, so only do it if time remains.
- Still Me's sentinel (spend 0 units until the change leaves a personal band) is the best agent behaviour in the pile and is a direct fit for Other Cheek's noise band. Add it to whichever idea wins as the visible "lab notebook" line: "inside your normal wobble, no units spent".

## Ideas many other entrants will also build

- Serum or product trackers and "is it working" verdicts: the sponsor judge counted six or more already. Other Cheek's control group differentiates it, but expect the description to be compared against them.
- Foundation and shade finders: Neck Test, Seam, Shade Twins and Cover Story's concealer-shade step all sit near the most crowded VTO category. Seam's blend recipe is the only part I would call differentiated.
- Scan, score, recommend cards with a daily or weather shell: Mirror Forecast, Money Map, Consult Canvas.
- Outfit planners and closet apps: Fit Check.
- Hair colour try-ons with a quiz: Honest Hair Color (Garnier and Madison Reed already ship these).
- Likely to be built by almost nobody: Veil, Still Me, Second Mirror (accessibility), Gift Proof, Translate.

## Risks I would put in front of the builder

- Run the 25 unit split-cheek probe above before committing. If the same-photo asymmetry between the two bare cheeks exceeds half the expected cast, the merged idea falls back to Other Cheek unchanged.
- Check `GET /s2s/v2.0/credit/feature-cost` first. It gives the real price of mu-transfer, hair-color and hair-type-detection, which three of the 16 ideas assume.
- Decide whether a replay demo is acceptable. Any idea that cannot show a live API run in the video loses credibility with a judge who sees only the video. Veil and Cover Story can both be shown live in under two minutes. Other Cheek's 4-week trial cannot.
