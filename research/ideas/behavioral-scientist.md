# Behavioral scientist: three ideas

Persona: contrarian behavioral scientist and design anthropologist. Test for every idea: does the product make a person feel better informed and less watched by their own face? If not, cut it.

## What the specs say that changes the design

1. `ui_score` is flattery by design. The skin-analysis spec says the UI score is a "psychological motivator" that adjusts raw scores "to produce more favorable results". In the documented HD sample the map is close to `ui ≈ 45 + 0.45 × raw` (raw 29.1 → ui 58, raw 89.7 → ui 85; per-concern curves differ, so this is a rough slope). A flattered score keeps about half the signal and rounds it to integers. Any product that tracks change, or decides whether a person needs something, must read `raw_score`. Any product that shows numbers should be wary of both.
2. Masks are alpha PNGs per concern and region. Region scores exist for pore (forehead, nose, cheek), wrinkle (six regions) and skin_type (whole, T zone, U zone). Redness, acne and texture are whole-face scores plus a mask. Any regional claim for those concerns comes from our own post-processing of the mask, not from the API.
3. Skin simulation takes an intensity from 0.0 to 1.0 per concern, up to 10 concerns. The spec describes 1.0 as "most natural, healthy-looking". It is an illustration generator, not a forecast.
4. Spec inconsistency to flag: the `oiliness` field in the simulation schema says "1.0 for maximum oil/shine added", while the overview says the feature controls shine. Test this before using it. Also, the Fitzpatrick table in the spec lists "Type V" twice (typo for IV).
5. Makeup VTO costs 1 unit per render and accepts `lip_color` with a hex `color`, a `texture` (matte, satin, shimmer) and `colorIntensity`. It is the cheapest endpoint in the suite by a wide margin.

Evidence caveat: I ran five web searches. Statistics marked **(memory)** come from my own recall and are not verified in this session. Check them before they go in a pitch.

---

## Idea 1: Trigger Lab

**Pitch:** A 20-second morning photo, a one-tap log of what you did yesterday, and after two weeks the app tells you which "triggers" really redden your face and which ones you can stop fearing.

**Target user and moment:** An adult with rosacea, flushing, sensitive or reactive skin, or early melasma. The moment is the morning after: they look in the mirror, see a red face, and try to guess why. Was it the wine, the spicy dinner, the hot yoga, the new serum, the bad night?

**Real pain and evidence**
- Rosacea affects roughly 5% of adults worldwide (Gether et al., meta-analysis, 2018) **(memory)**.
- Patient surveys from the National Rosacea Society list sun, stress, heat, wind, alcohol and spicy food as the most commonly reported triggers **(memory)**. These are self-attributed, recalled after the fact, and often wrong. People blame the last unusual thing they did (post hoc reasoning).
- The bad decision is over-restriction. People cut out foods, products and activities that were never the cause, and keep doing the thing that is. Nobody can run their own controlled trial by eye, because redness varies with light, mood and sleep.
- Redness is also under-recognized on darker skin, where erythema is harder to see against melanin **(memory)**. People with Fitzpatrick V and VI are often told "you do not have it".

**Core mechanic, step by step**
1. Setup. The user takes one capture with a face-size and lighting guide. The app takes a second capture one minute later. The gap between the two is the **noise floor**: changes smaller than that are shown as "within noise".
2. Fitzpatrick check, once. If the type is V or VI, the app shows a "readings on your skin tone are less sensitive" notice. It widens the noise band and asks the user to confirm flares by eye on the mask.
3. Each morning: one capture, same window, ideally before washing. The app runs skin analysis for `redness`, `skin_type` and `age_spot`, and stores only the numbers and the mask. It deletes the photo.
4. The user logs yesterday with chips: alcohol, spicy food, hot exercise, sun, stress, new product, poor sleep. The app caps tracked triggers at three at a time.
5. After about 10 days of data, the app compares next-morning raw redness on exposure days with non-exposure days. It uses a permutation test and requires at least 4 exposure days and 8 non-exposure days. It also checks whether two triggers co-occur on more than 60% of days. If so, it says "cannot separate these two".
6. Output is one verdict per trigger: "likely", "unclear" or "no detectable effect". A cleared trigger shows as permission, for example "Wine: no detectable effect on your redness. You can keep it."
7. A flare day shows the redness mask as a soft heat overlay on request only. A banner suggests a clinician visit if flares persist or if the user reports bumps, eye symptoms or pain.

**Exact endpoints and why each is essential**
| Endpoint | Why it is essential |
|---|---|
| `POST /s2s/v2.0/file`, then `PUT` to the presigned URL | Required for every image task. |
| `POST /s2s/v2.1/task/skin-analysis`, `GET .../{task_id}` with SD `dst_actions: ["redness","skin_type","age_spot"]` | `raw_score` for redness is the signal. `ui_score` would halve the effect size and round it. The mask shows where the flare sits. `skin_type` gives a Redness label and T zone versus U zone. `age_spot` covers the melasma variant. |
| `POST /s2s/v2.0/task/fitzpatrick-scale-analyzer`, `GET .../{task_id}` | Used for epistemic humility, not product recommendation. It sets how much to trust the redness reading. |

No chatbot, no routine builder. The statistics layer is the product.

**20-second demo aha:** A 21-day timeline scrolls past. The user taps the "wine" chip: "No detectable effect. Cleared." They tap "hot yoga": "Likely. Cheeks +11 raw points the next morning, 5 of 5 days." The cheek mask pulses. The app says what to stop worrying about before it says what to avoid.

**Why non-obvious:** It uses the honest score for the one job where honesty matters (detecting change), and it measures its own noise before it makes a claim. Most skin apps show a daily score. This one shows a verdict about cause, and its default outcome is relief.

**Harm handling (the differentiator)**
- No 0 to 100 number is ever displayed. The user sees change against their own baseline, with a noise band.
- Hard limit of one capture per day. A second tap shows "One look a day is enough. The photo will not change in an hour."
- Three tracked triggers at most, so the tool cannot become a restriction machine.
- Photos are deleted after the numbers are extracted. The API keeps results for 24 hours; the app does not extend that.
- It never diagnoses. It says "pattern in your data", not "you have rosacea".

**Harsh risks**
- Test-retest noise for redness is unknown. If the noise floor is larger than real trigger effects, the honest output is "cannot tell", which is a weak demo. Measure this first with 5 captures, about 45 units.
- Daily capture is a heavy ask. Face must fill 60% of the width, hair back, even light. Retention may collapse in week one.
- Regional claims (cheek versus nose) come from our own mask post-processing and face geometry, not from the API.
- Demo data must be replay fixtures, because nobody can show 21 real days in a hackathon. Label them as sample data, or judges will feel misled.
- Liability: a "no detectable effect" verdict could talk someone out of avoiding a real trigger. Wording must say "in your data, this period".
- Redness sensitivity on dark skin may be poor. The Fitzpatrick gate softens this and does not fix it.

**API unit cost**
- One-time setup: Fitzpatrick 10 + two baseline captures at 9 (SD, 1 to 4 concerns) = 28 units.
- Each daily session: 9 units.
- A full 14-day live journey: about 145 units. Plan one real journey, a 45-unit noise test, and a reserve.

---

## Idea 2: Already Own It

**Pitch:** Before you buy the fourth brick-red lipstick, the app puts all of them on your own lips and tells you which two are the same shade on you.

**Target user and moment:** A cosmetics shopper with a full drawer. The moment is the shade wall in a store or a cart tab at 11 pm. The drawer is at home, and the memory of it is not accurate.

**Real pain and evidence**
- Overbuying inside a narrow shade range is a known behavior, but I could not find a verified duplicate-purchase statistic. Treat this as an assumption. A ten-person "drawer test" (photograph their lipsticks, count near-duplicates by eye) is the evidence to collect before the pitch.
- Related verified signals: a March 2026 survey of over 4,300 American women reports that 39% stopped using a brand because its range was too narrow, 61% among women with darker skin tones ([source](https://client.cosmeticobs.com/en/articles/patterns-54/in-search-of-the-right-shade-9287)). A UK study found only 9% of 343 mainstream foundation shades suited dark skin, against 67% for light skin ([source](https://ualresearchonline.arts.ac.uk/id/eprint/8808/)). Trust in shade decisions is low, so people hedge by buying more.
- A report cited in the search says 73% of retailers saw rising beauty returns online. This is a secondary vendor-style claim and needs checking.

**Core mechanic, step by step**
1. The user takes one bare-lip selfie.
2. The user adds owned lipsticks to a digital drawer: hex from a product-page swatch (eyedropper) plus a texture chip (matte, satin, shimmer). Up to 12.
3. The user picks the candidate shade the same way.
4. The app renders every owned shade and the candidate on the same selfie using VTO. It isolates the lip region by differencing each render against the bare photo.
5. The app computes the perceptual color difference (CIEDE2000) between lip regions of each pair of renders.
6. Output is a contact sheet. The candidate sits next to its nearest owned shade, lips cropped side by side. Verdict: "On you, this is 2.1 apart from Brick. You own two near-matches. Different from everything you own: nothing."
7. A gap view plots the collection on a lightness and hue plane and shows empty zones. It never says what suits the user, only what is different from what they own.
8. A "collector" switch silences the verdict. Duplicates are a legitimate choice.

**Exact endpoints and why each is essential**
| Endpoint | Why it is essential |
|---|---|
| `POST /s2s/v2.0/file`, `PUT` | Upload the selfie once. |
| `POST /s2s/v2.0/task/makeup-vto`, `GET .../{task_id}` with `effects: [{category: "lip_color", palettes: [{color, texture, colorIntensity}]}]` | It renders the shade with finish and lighting on the user's own lips. It is used as a measuring instrument for "same on you", not as a display. |

**20-second demo aha:** Eight lipsticks appear as swatches that look different. The app renders all of them on one face in two seconds. Two collapse into the same lip. A counter reads "Not bought: 1".

**Why non-obvious:** Every try-on app shows what could be. This one uses the same endpoint to show what is already there. The conversion funnel is reversed.

**Harm handling**
- The default verdict is "wait". The savings counter is tracked locally and never shown as a score of the user.
- No judgment on what looks good on the user. Only "same as" and "different from".
- No leaderboard, no social share of the drawer.

**Harsh risks**
- This is the weakest technical case. A CIEDE2000 on two hex codes already predicts most duplicates without the API. The VTO adds finish and lip-base interaction, which may be a small gain. **Kill test, first two hours (about 27 units):** render 8 shades on 3 faces with different lip bases. If the ranking of nearest matches equals the hex-only ranking, drop the claim that VTO is essential.
- Eyedropped swatch hex values come from lit product photos and are often wrong. Real lipstick differs from its render in opacity and base color.
- Business model: a brand-sold VTO widget loses revenue from this tool. A judge may ask who pays.
- Narrow audience compared to the other two.

**API unit cost**
- Per session: one render per owned shade plus the candidate. For 8 owned shades that is 9 units.
- The kill test: 27 units. A full demo with a 12-shade drawer: 13 units.

---

## Idea 3: Week-6 Wall

**Pitch:** The week most people quit a working treatment is week 3 to 6. This app shows, by zone, whether the breakouts are where you always break out (hold on) or somewhere new (ease off), and puts a speed bump in front of the "shop alternatives" button.

**Target user and moment:** Someone two to six weeks into a new retinoid, benzoyl peroxide or azelaic acid product. It looks worse. They open a shopping app instead of waiting.

**Real pain and evidence**
- Acne treatments typically take weeks before visible change. Sources I found describe early flare-ups (often called purging) lasting about two to six weeks, with improvement commonly seen around weeks 8 to 12 ([overview of sources](https://perks.optum.com/blog/how-long-does-tretinoin-take-to-work)). These are commercial clinic and blog pages, not trials. Treat the timeline as approximate and use dermatology society wording in the product.
- A source claims purge flare-ups appear where a person already tends to break out, while breakouts in new areas suggest a reaction. This heuristic is unvalidated.
- Cost of quitting early: product hopping and, for darker skin, more post-inflammatory hyperpigmentation. A cited 2002 study found acne-related PIH in 65.3% of African-American (n=239), 52.7% of Hispanic (n=55) and 47.4% of Asian (n=19) patients, and reviews note that picking and trauma make PIH worse and longer lasting ([review](https://practicaldermatology.com/topics/pigmentary-disorders/post-inflammatory-hyperpigmentation-in-skin-of-color-an-updated-review/67255/)).
- Adherence to topical acne therapy is poor in the literature, with figures often quoted in the 30 to 50% non-adherence range **(memory)**.
- Younger users are hard-hit. Reports about "Sephora kids" describe rashes, sunburn and irritation from potent actives, though these are anecdotal ([coverage](https://www.personalcareinsights.com/news/sephora-kids-spark-concern-with-adult-skin-care-dermatologists-and-social-media-react.html)).
- Behavioral basis: present bias, memory of the "before" face fading, and the lack of a commitment device.

**Core mechanic, step by step**
1. The user names the product, its start date and the concern it targets. Expectation text comes from a fixed, reviewed content file, not from a language model.
2. Day 0 capture (HD): `acne`, `redness`, `texture`, `moisture`. The acne mask is stored as a coarse zone map: forehead, left cheek, right cheek, nose, chin, jaw.
3. Expectation ghost: a skin-simulation call at modest intensity (acne 0.4, texture 0.3, redness 0.3) produces "a plausible week-8 look", always captioned "illustration, not a prediction".
4. Weekly capture, same four concerns. The app compares acne zone overlap with the day-0 zones, and tracks redness and moisture against baseline.
5. Verdict per check-in: **Hold** (acne in usual zones, redness and moisture within noise), **Ease off** (redness up and moisture down beyond the noise floor), or **See a clinician** (two consecutive weeks of redness and moisture worse, or any pain, swelling or spreading). The safety rule always overrides the purge heuristic.
6. If the user taps "shop alternatives" before week 8, a speed bump shows: days left to the honest decision date, what result would justify switching, and a "remind me then" button. It is a pre-commitment device and can always be skipped.

**Exact endpoints and why each is essential**
| Endpoint | Why it is essential |
|---|---|
| `POST /s2s/v2.0/file`, `PUT` | Image upload. |
| `POST /s2s/v2.1/task/skin-analysis`, HD `dst_actions: ["hd_acne","hd_redness","hd_texture","hd_moisture"]` | `raw_score` tracks change that `ui_score` would flatten. The acne mask gives the zone map for the "usual zones" test. Redness and moisture together are the irritation signal. |
| `POST /s2s/v2.0/task/skin-simulation` | The expectation ghost. It shows that realistic improvement is gradual and subtle at 0.3 to 0.4 intensity, which resets what "working" looks like. |

**20-second demo aha:** Six weekly thumbnails look no better to the eye. The app overlays week 0 and week 6 zones: "Same places. Redness flat. Hold." Then "Shop alternatives" slides a gate across it: "Decision date: Nov 18. Remind me."

**Why non-obvious:** The sponsor wants products for the moment before a purchase. This one prevents the purchase by making change visible to the one judge that matters, the user, and by treating "do nothing" as the product.

**Harm handling**
- No numbers shown. Only direction versus the user's own baseline, with a noise band.
- Safety rules (clinician referral) override the "hold" logic.
- The simulation is always captioned as an illustration and never shown at intensity above 0.4.
- Age gate and no minors' data stored. Teens are the main audience for acne, so the first version targets adults 18+.

**Harsh risks**
- Purge versus reaction by zone is an unvalidated heuristic. The product could tell someone to hold on while their skin is reacting. This is the biggest risk. The safety override reduces it and does not remove it.
- Aligning acne masks week to week needs consistent pose. A coarse six-zone grid is the safe fallback.
- A simulation of a better face next to the user's real one can still feel like a demand.
- Weekly use means a thin daily-life feel, and the journey is too long for a demo. Replay fixtures are required.
- Overlap with Idea 1 in plumbing. They would share one capture-and-ledger engine.

**API unit cost**
- Day 0: 12 (HD, 4 concerns) + 4 (simulation, 1 to 4 concerns) = 16 units.
- Weekly check-in: 12 units.
- A full 6-week journey: 7 captures × 12 + 4 = 88 units.

---

## Considered and cut
- **Chemo hair-loss head-covering try-on:** emotionally strong, but I found no documented bald-scalp support in the hair, hat or scarf specs, and a failed render on a patient is a bad failure mode.
- **Pre-purchase "Cart Check" that tells you whether you need a serum:** it treats an unvalidated `raw_score` threshold as proof of need. Relative ranking within a person is safer but weak.
- **Foundation shade finder:** the vendor already sells it. Commodity.
- **Mirror-time picking support:** magnified masks of flaws could trigger skin-picking behavior. Do not build.
- **Men's sunscreen fear appeal** (CDC data: about 12% of men versus 29% of women always use sunscreen on a sunny day, [source](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9169522/)): fear appeals tend to backfire, and aging simulation is not parameterized by sun exposure.
- **Teen-first acne app:** minors' face data and consent make this a legal risk for a hackathon build.

---

## Ranking (harsh critic)

| Rank | Idea | Reason |
|---|---|---|
| 1 | Trigger Lab | API use is essential and cannot be replicated (raw score, masks, Fitzpatrick). The raw-versus-flattered argument is real and measurable. The result changes behavior. Demo needs a replay fixture. |
| 2 | Week-6 Wall | Specific moment, strong behavioral frame, uses three endpoints. The purge heuristic is unvalidated, which hurts credibility with a clinical judge. |
| 3 | Already Own It | Best 20-second demo and cheapest to build, but the API is replaceable by a hex calculation. A technical judge will find this in minutes. |

**The bet: Trigger Lab.** It wins on the judging criterion that breaks ties (technological implementation) and on the most defensible impact case. Its default outcome, relief from false triggers, is the clearest answer to "does this make people feel worse about their faces".

Execution advice:
1. Spend the first 45 units on a test-retest noise test. If redness noise is too large, fall back to Week-6 Wall, which tolerates slower and larger effects.
2. Build one capture-and-ledger engine and ship Week-6 Wall as the second mode ("Why is my face red?" and "Should I keep using this?"). Skip Already Own It unless the two-hour kill test shows VTO beats hex.
3. Run the whole app in replay mode from the documented `score_info.json` schema, and label replay data on screen.
4. Never show `ui_score` or a 0 to 100 number anywhere. Say so in the submission text, with the spec's own sentence about the score being a "psychological motivator".

Unit plan for 1,000 units: noise test 45, one real 14-day Trigger Lab journey 145, one real Week-6 journey 88, development and retries about 400, reserve about 320.
