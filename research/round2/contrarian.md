# Round 2: contrarian builder

Persona: hackathon veteran, several sponsor-API wins. Angle: build what the other 1,100 entrants will not, and test whether the Other Cheek engine (midline split, personal noise band, photo gate, planted-effect self-test) fits a product with more impact.

Method note: I read BRIEF.md, decision.md, brief.md and the sponsor and veteran judging files. Figures below come from web search summaries. I did not open every primary paper. Weak sources carry a flag.

## What the other entrants will build

The sponsor judge already said it: six or more serum-verdict trackers, plus "scan, score, recommend" entries. Most entrants will sit in Skin AI. Few will touch accessibility, treatment side effects, or clinic intake. I dropped four angles after a quick check:

- Gift Proxy (agentic gifting, recipient sends a consented selfie, giver sees only a cart). Good privacy story, but use is seasonal and the engine adds nothing. Fall back to it if the others fail.
- Razor bumps for men. Beard hides skin, so the analysis model is unlikely to read it. Niche.
- Teens. Minor face data, consent and platform rules cost more build days than the product returns.
- Creators and live shopping. The APIs are async tasks, so live use fails on latency.

## Evidence base

1. EU Accessibility Act. Enforceable since 28 June 2025. It covers e-commerce and points to EN 301 549, which carries WCAG 2.1 AA. Fines vary by member state and sources conflict (one says EUR 5,000 to 20,000 per violation; another cites up to EUR 1,000 a day). https://alokai.com/blog/european-accessibility-act-2025 (law-firm and vendor blogs, not the EU text).
2. Estée Lauder Companies shipped a Voice-Enabled Makeup Assistant in January 2023. The app scans the face after makeup, judges how evenly it sits, and gives audio feedback on foundation, eyeshadow and lipstick. ELC cites 2 million-plus people with sight loss in the UK, 340,000 registered blind or partially sighted. It won an Innovation Award at the 2025 World 50 Impact Awards. https://www.elcompanies.com/en/news-and-media/newsroom/press-releases/2023/11-01-2023 and https://www.elcompanies.com/en/news-and-media/newsroom/company-features/2025/elc-world-50-impact-awards
3. A 2025 study of 15 visually impaired makeup users reports persistent problems with blending, symmetry and assessment. A 2022 CHI paper (12 interviews, 145 videos) says the process feels like "taking a gamble". https://arxiv.org/abs/2507.03942 and https://arxiv.org/pdf/2203.08864
4. US Census 2022: 8.18 million people report a vision disability. A CDC-supported estimate (2017 data) gives 7.08 million with acuity loss, 1.08 million blind. https://usafacts.org/articles/what-is-the-state-of-american-eyesight (search summary; confirm the Census figure on the page).
5. Returns. NRF forecasts 15.8% overall and $849.9 billion for 2025, 19.3% for online sales, about 17% for holiday sales. https://nrf.com/media-center/press-releases/consumers-expected-to-return-nearly-850-billion-in-merchandise-in-2025 . Foundation and concealer returns run near 23% where returns are allowed (vendor blog, weak): https://eightx.co/blog/average-beauty-and-cosmetics-return-rate-benchmarks
6. Cancer treatment and appearance. ACS projects 2,114,850 new US cases in 2026: https://cancer.org/statistics-2026 . Chemotherapy reaches roughly 650,000 to 750,000 US patients a year (secondary source, unconfirmed): https://theworlddata.com/chemotherapy-statistics-in-us/ . In a 1,478-patient breast cancer study, 88% reported eyelash loss and 90% eyebrow loss; a 524-patient study found 47%. Of 179 patients with chemotherapy alopecia, 72% said their social life suffered. Source pool: https://apm.amegroups.org/article/view/127199/html and https://pmc.ncbi.nlm.nih.gov/articles/PMC6186204 (figures seen in search summaries only).
7. Chemotherapy skin colour. Hyperpigmentation was the most frequent skin change in a 226-patient study (46.46%). It usually appears 2 to 3 weeks after the first dose and fades 10 to 12 weeks after treatment ends. https://link.springer.com/10.1007/s00403-024-03057-2 and https://eadv.org/wp-content/uploads/2024/03/EADV-CANCER-PATIENTS-Skin-colour-changes-induced-by-anticancer-therapies.pdf . I found no study on foundation shade drift in these patients. That gap is both the risk and the opening.
8. Look Good Feel Better reports more than 2 million people served across 27 affiliates, and a 2019 survey where confidence in appearance rose from 50% to 92% after a workshop (self-reported). https://lgfb.org.au/an-incredible-milestone-for-look-good-feel-better-australia/ and https://www.businesswire.com/news/home/20200204005088/en
9. Dermatology access. Average new-patient wait for a routine skin exam was 32.3 days across 15 cities (Merritt Hawkins 2017): https://www.dermatologytimes.com/view/dermatologist-shortage-fuels-mounting-wait-office-visits . In San Mateo County, 6.2% of 450 store-and-forward consults could not be diagnosed because of photo quality or missing history: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10334958/ . Dermatologists rated patient-submitted images sufficient in quality 62.2% of the time (JAMA Dermatology survey, 10 dermatologists), see https://jcadonline.com/store-and-forward-teledermatology-experience/
10. Perfect Corp already sells into these channels: BENU pharmacy in Milan (PHOENIX Pharma), Douglas (European beauty retailer), Sona Dermatology, Keensight Lummitry for dermatology practices. https://www.perfectcorp.com/business/news/douglas-skin-analysis and https://www.businesswire.com/news/home/20231115463313/en/Perfect
11. Isotretinoin context. More than 1 million prescriptions a year (2008 to 2011 FDA data), with iPLEDGE monthly visits for women of childbearing potential. https://mdedge.com/internalmedicine/article/46557/health-policy/fda-advisers-ipledge-needs-more-tweaking (dated).
12. Agentic commerce. Adobe reports AI-driven traffic to US retail sites up 393% year on year in Q1 2026. https://decrypt.co/364733/ai-traffic-us-retailers-jumps-q1-agentic-shoppers-outspend-humans (secondary).

---

## Idea 1: Second Mirror

**Pitch.** A voice-first mirror that tells a blind or low-vision user, one sentence at a time, whether the makeup on her face matches the look she chose, and which side to fix.

**Moment of use.** 7:40 am, last step before leaving. She applied blush by touch and cannot see whether the left and right cheeks match. Second moment: at an online cart, "will this shade suit me" asked in words.

**Flow.**
1. Capture coach (browser, 0 units). Face tracking speaks "turn a little right" and "more light on your left cheek". The shutter fires when lighting balance, yaw and distance pass the gate.
2. She picks a look by voice or by SKU. `skin-tone-analysis` reads tone and undertone once and caches it. The app reads the shortlist aloud, with shade names.
3. `makeup-vto` renders the target on her bare-face photo. The app describes the target in words ("soft coral blush, high on both cheekbones").
4. She applies, then takes a verify photo. The agent compares each region (cheeks, lips, lids, base) to the target as a change from the bare photo, and compares left and right across the midline. It speaks the largest gap first.
5. The loop repeats up to four rounds. At pass it says "matches within tolerance" and adds the used shade to a screen-reader-labelled cart.

**YouCam endpoints and units per session.**
- File upload, then `POST /s2s/v2.0/task/skin-tone-analysis`: 20 units, first session only.
- `POST /s2s/v2.0/task/makeup-vto`: 1 unit per target render, 1 to 3 renders. The eyebrows, blush, lip_color and foundation categories exist in the schema.
- First session about 22 to 24 units. Later sessions about 1 to 3 units.
- The verify step is local landmark and Lab maths. I will not claim the API does it.

**Agentic loop.** Perceive (gate and verify photo), decide (largest region gap, pick one instruction), act (speak it, re-prompt capture), verify (re-measure; stop on pass or four rounds). The decision policy is code. The language model only phrases the sentence.

**Signature visual.** High-contrast dark screen, split face with a hairline, two bars labelled Left and Right, and one very large caption: "Right cheek is a third lighter than left. Add blush and blend upward." The caption is the screenshot. The video carries real audio with captions.

**Brand-client business case.** The EU Accessibility Act makes e-commerce accessibility a legal duty for any retailer selling into the EU, and Douglas is a named Perfect Corp client. A brand-agnostic accessible VTO flow is a compliance line item, not a nice-to-have. It also opens a user group that ELC proved worth serving.

**Scores (harsh).**
- Technological Implementation 7. Two endpoints plus a real verify loop, but the verify step is local maths and the API is not in the loop.
- Design 8. Voice plus caption stage reads fast on video, but a judge cannot hear the product from a screenshot.
- Potential Impact 7. 8.18 million US adults with a vision disability and a legal driver, but makeup wearers within that group are a fraction and the retailer payoff is compliance, not revenue.
- Quality of Idea 7. Accessibility is rare in this pile. ELC already shipped the concept, so a judge who knows beauty will say "VMA exists".

**Biggest risk.** Handheld lighting noise is larger than the makeup difference, so the symmetry call is wrong half the time.
**Test (about 26 units).** One tone read (20) plus 6 `makeup-vto` renders (6) with a planted blush gap of 100% left and 50% right. Then take 10 bare-face phone photos under different light with the gate on, at 0 units. Pass if the left-right Lab gap in bare photos stays below a third of the planted gap.

---

## Idea 2: Still Me (a weekly mirror for people in cancer treatment)

**Pitch.** It rebuilds brows, lashes and hair on your own photo on day one. Then, once a week, it says in numbers with a band whether your skin has shifted enough that your foundation is now the wrong shade.

**Moment of use.** Week 2 of chemotherapy, bathroom mirror, first morning without brows. Later: every Sunday before the next cycle, and the day she buys a wig or a brow product.

**Flow.**
1. Gated baseline. Two same-day front photos pass the lighting-balance and pose gate. A local skin-patch reading from both sets her personal noise band.
2. Rebuild. `makeup-vto` draws brows and lashes from a mirrored template across the midline, so both sides match. Hair colour and hairstyle endpoints preview three wig or scarf options. She picks one.
3. Weekly sentinel. Each Sunday the app takes a gated photo and compares the local skin-patch Lab reading with baseline. It spends 0 API units when the change is inside her band.
4. Trigger. When the change leaves the band, the agent spends 20 units on `skin-tone-analysis` as an anchor read (skin, brow, hair and eye hex). Then it tests candidate foundation shades with `makeup-vto` and picks the closest under the same light. Wording: "your skin reads 5 steps off your baseline; your normal wobble is 1.4; try shade X". The app never says "your treatment is working or failing".
5. Output. A shade card, a brow and lash kit, and a shareable look for a caregiver or an oncology boutique. If the user reports pain, blisters or fever, the app shows a fixed message to call her care team and stops.

**YouCam endpoints and units per session.**
- `makeup-vto` (eyebrows, eyelashes, foundation): 1 unit per render; about 3 to 6 renders.
- Hair colour and hairstyle endpoints for wig preview: unit cost not in the brief. Confirm before budgeting.
- `skin-tone-analysis`: 20 units, only when the sentinel trips and on the baseline.
- Baseline session about 25 to 35 units. A quiet week 0 units. A tripped week about 24 units.
- Live runs: about 15 fit in the 1,000 free units.

**Agentic loop.** Perceive (gated photo, local patch reading), decide (is the change outside the personal band; is a paid read worth it), act (anchor read, candidate render, shade pick), verify (re-render, re-measure under the same light, stop at a unit cap). The spend policy is the agent.

**Signature visual.** A single swatch strip across the screen. Her baseline skin colour sits in the middle with a grey bracket for the noise band. The new reading lands visibly outside the bracket, and a shade ladder slides under it. Second screenshot: the brow-less selfie next to the mirrored brows and lashes.

**Brand-client business case.** Cancer treatment is a moment of identity loss where brand trust forms and holds. Brow, lash, base and wig purchases are real baskets. Shade drift mid-treatment is the same mismatch that drives foundation returns near 23%. ELC and other prestige groups already fund cancer-care beauty programs through Look Good Feel Better. Pharmacies and oncology boutiques already run Perfect Corp analysis kiosks (BENU, Douglas).

**Scores (harsh).**
- Technological Implementation 8. Gate, personal band, VTO, hair and tone chain with a unit-spend policy; the weekly sentinel is local maths, which a hard judge may call light.
- Design 8. Two strong frames (rebuild and swatch strip), an emotional arc, and no chart.
- Potential Impact 7. About 2.1 million new US cases a year, roughly 650,000 to 750,000 on chemotherapy, weekly use for months, value from the first session. Revenue lift for a retailer is plausible but unproven, and the shade-drift claim has no published evidence.
- Quality of Idea 8. Nobody pairs measurement-grade tone tracking with restoration for treatment patients. The tone-drift hypothesis may fail.

**Biggest risk.** Local skin-patch readings drift more under phone lighting than real chemotherapy pigment change, so the sentinel trips on noise.
**Test (about 26 units).** One `skin-tone-analysis` read (20) on a gated baseline plus 5 to 6 `makeup-vto` renders of brows, lashes and foundation on a stand-in photo. Then take 12 gated phone photos of one person over 3 days under different light, at 0 units, and measure the patch spread. Pass if the spread stays under one foundation step (about 2 ΔE) with the gate on. A retest read pair (40 units) comes after that.

---

## Idea 3: Pre-Flight (the Other Cheek engine as a clinic intake step)

**Pitch.** Gate, retest band and planted-effect self-test, packaged so a phone selfie becomes a dermatologist-ready or pharmacist-ready photo set with a stated sensitivity.

**Moment of use.** Booking a dermatology slot that is 32 days out, or a monthly isotretinoin review, or a pharmacy skin clinic visit.

**Flow.**
1. Intake. She picks the concern and the treatment ("acne flare, on isotretinoin since September").
2. Capture agent. Three views (front, left 45 degrees, right 45 degrees). The gate rejects with a named reason (uneven light, blur, turned head) at 0 units.
3. Two same-day front shots give the retest band. `skin-analysis` runs on the better one.
4. Self-check. `skin-simulation` plants a known change on one half and checks the pipeline finds it. The set gets a grade: "this capture can resolve changes of 6 points or more".
5. A one-page sheet goes to the clinic queue: masks, left and right loads, values with bands, capture grade. Return visits show change against the band.

**YouCam endpoints and units per session.**
- `POST /s2s/v2.1/task/skin-analysis` (HD, relevant concerns): 9 to 22 units per call, two calls for retest, so 18 to 44.
- `POST /s2s/v2.0/task/skin-simulation`: 4 to 6 units.
- About 25 to 50 units per run. About 20 live runs in 1,000 units.

**Agentic loop.** Perceive (gate), decide (retake or accept; spend a second analysis only if the first set is borderline), act (analysis, simulation), verify (planted effect found, null rejected), then hand off a graded packet.

**Signature visual.** A "photo grade" card showing a rejected photo with its named reason, then a graded set, then the one-page sheet. It is accurate and plain.

**Brand-client business case.** Clinics and pharmacies are real Perfect Corp buyers (Sona, Keensight, BENU). Better photos cut re-requests and no-shows. For a dermocosmetic brand the lift is indirect: a clinical-looking channel for its regimen.

**Scores (harsh).**
- Technological Implementation 8. The most rigorous chain of the three; it reuses the Other Cheek engine unchanged.
- Design 5. A graded form is an enterprise screen, and the video has no emotional beat.
- Potential Impact 6. Real access problem (32-day waits, 6.2% undiagnosable consults), but the buyer is a clinic, not the sponsor's brand clients, and the consumer repeat use is monthly at best.
- Quality of Idea 6. Sensible, not surprising. A judge will call it "photo QA for telehealth".

**Biggest risk.** The planted simulation is vendor-on-vendor, so the "capture grade" can look circular, and the HD masks may not show a one-half change at all.
**Test (about 28 units).** One `skin-analysis` call (up to 22) on a gated photo to read the mask format, plus one `skin-simulation` (up to 6) on a single concern over one half. Pass if the mask or raw_score moves on the planted half and stays flat on the other.

---

## Harsh critic: attacking my own three

**Second Mirror.** The strongest attack is "ELC did this in 2023 and won an award for it". My answer is brand-agnostic plus VTO as target plus the e-commerce side. A judge may not accept that. Second: the verify step uses no YouCam call, so the "deep integration" score is soft. Third: I cannot test with a blind user in ten days, so the claim "works for blind users" is unearned. I would need to say "designed with published accessibility guidance" and ask for one tester. A caption stage that works only with sound weakens the screenshot.

**Still Me.** The core claim, that skin tone drifts enough in treatment to break a foundation match, has no cited study of makeup shade. Pigment change is real (46.46% in one cohort), but most pigmentation is on hands, feet and veins, not the face. If the face does not drift, the weekly sentinel is a gate with nothing to catch. The rebuild act still works and sells on its own. Ethics risk: cancer patients are vulnerable, and one wrong sentence ("your skin looks worse") does harm. The demo needs a consenting stand-in and no real patient photos. Retail revenue is small compared with returns pitches.

**Pre-Flight.** It is the most defensible and the least likely to win. A judge sees a form and a sheet. It scores 5 on Design and I do not see a 9 anywhere. It is a good engine and a poor hero.

**Does any of this reach 9 on every criterion?** No. The closest are Still Me (Design and Idea could reach 9 with a strong video) and Second Mirror (Impact could rise with a named EU retailer pilot). None of my Impact scores reaches 8 without a partner letter or real user data, and I cannot get either in ten days. I would state the honest ceiling in the pitch rather than inflate it.

**Answer to question (b).** Yes, the strongest technology has a higher-impact home than serum verdicts. Its best form is not a tracker. It is a cheap sentinel (local reading inside a personal noise band) that gates expensive API calls and says "no change" when that is the truth. That pattern fits any case where the user cannot judge a change by eye: low vision, treatment side effects, or a clinic waiting list. Pre-Flight shows the pattern in clinic form and proves it is the weakest as a product. The pattern inside Still Me is the strongest use I found.

## Ranking

1. **Still Me** (31 points: 8, 8, 7, 8). Best emotional arc, two usable screenshots, weekly use, a real spend-policy agent, and a rare angle. Risk: the drift hypothesis. Build the rebuild act first so the product stands without the hypothesis.
2. **Second Mirror** (29 points: 7, 8, 7, 7). Rare angle with a legal reason for retailers to deploy. Risk: ELC precedent and a local verify step.
3. **Pre-Flight** (25 points: 8, 5, 6, 6). Right engine, wrong hero. Use its gate and self-test inside idea 1 or 2 instead of building it alone.

If the team wants one pick: Still Me, with the Second Mirror symmetry check as a stretch feature for the brow step (blind and low-vision users share the same mirrored-template need).
