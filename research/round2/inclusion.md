# Round 2, angle: people that beauty tech and beauty retail serve badly

Persona: cosmetic chemist and product lead (deep skin Fitzpatrick IV-VI, mature skin, melasma, acne, rosacea).

Short version. The three ideas below each measure something that a shade finder or a skin score cannot: the seam at the jaw (Seam), the white cast of a sunscreen on one cheek (Veil), and the contrast of a makeup look on a face that is not the model's (Translate). All three use the YouCam renders as the actuator and use our own colour maths on pixels as the judge. None of them uses `ui_score`. No idea scores 9 on every criterion. The scores in each section say where the gap is.

## Evidence base

Labels: P = peer-reviewed or conference paper, S = survey, V = vendor-published, 2 = secondary summary that I did not trace to the primary source.

| # | Fact | Source |
|---|---|---|
| E1 | Study of 150 adults (J Drugs Dermatol 2024, P). 25% of skin-of-color (SOC) respondents cite white cast as a sunscreen barrier, against 7% of non-Hispanic White respondents. Daily sunscreen use is 25% against 31%. Cost is a barrier for 16% against 2%. 47% of SOC respondents prefer brands owned by SOC people, against 13%. The sample comes from one medical centre, so it is not national. | https://www.healio.com/news/dermatology/20240627/individuals-with-skin-of-color-experience-barriers-to-proper-sunscreen-usage |
| E2 | Consumer Reports 2020 (S, as quoted by Cronkite News): 61% of Black respondents and 23% of Latino respondents say they never wear sunscreen. Mintel (S, as quoted): 84% of Black sunscreen users say there are not enough sunscreens for their skin tones. | https://cronkitenews.azpbs.org/2023/04/26/new-sunscreens-people-of-color/ |
| E3 | PLoS One 2025 (P, 13 women, Fitzpatrick II-VI, authors are employees of the sponsor). White cast score = (L*final - L*initial) / (100 - L*initial), measured with a colorimeter at 2 mg/cm2. Zinc oxide at 20% to 30% was "unacceptable" for all volunteers. The paper states that no official method to quantify white cast exists. A 2023 AAD abstract (96 women, P, 2) reports a 2.95-fold larger whitening effect on dark skin than on light skin, and that people apply less sunscreen when it whitens. | https://pmc.ncbi.nlm.nih.gov/articles/PMC12380271/ and https://jcad.mydigitalpublication.com/hot-topics-in-skin-health-may-2023/page-5 |
| E4 | Davis and Callender, J Clin Aesthet Dermatol 2010 (P). Acne-induced post-inflammatory hyperpigmentation (PIH) in 65.3% of African-American patients (N=239), 52.7% of Hispanic (N=55) and 47.4% of Asian (N=19) patients. Epidermal PIH can take months to years to resolve. Daily broad-spectrum SPF is "integral" to treatment. The figure comes from one 2002 study with small subgroups. | https://pmc.ncbi.nlm.nih.gov/articles/PMC2921758/ |
| E5 | Randomised double-blind trial, 68 patients, 8 weeks, all on 4% hydroquinone (P, 2, from search summary). Sunscreen with iron oxide (UV plus visible light) gave 15% greater MASI improvement and 28% greater colorimetric improvement than UV-only sunscreen. Harvard Health notes that tinted iron-oxide sunscreens block visible light and untinted ones do not. | https://pubmed.ncbi.nlm.nih.gov/24313385/ and https://www.health.harvard.edu/blog/melasma-what-are-the-best-treatments-202207112776 |
| E6 | A 2025 atlas of more than 1.1 million dermatology images has only 5.8% Fitzpatrick V-VI images (P). Deep skin is thin in the data that skin AI learns from, so any deep-skin claim needs a visible reliability check. | https://arxiv.org/abs/2601.00840 |
| E7 | Ipsos for Boots, US, 2016 (S, sample size not stated on the page). 54% of women who buy foundation bought more than one bottle because they were unsure of the shade. They bought 2.4 shades of the same product in 3 months. 65% say shade finding frustrates them. | https://www.ipsos.com/en-us/node/134791 |
| E8 | The Pudding, 2021, analysis of 6,816 complexion products. Of 130 products with numbered shades on Sephora and Ulta, 97% put the lightest shade first and only four brands ordered shades dark to light. | https://flowingdata.com/2021/03/29/analysis-of-color-names-used-with-makeup |
| E9 | NRF and Happy Returns 2025 (S of 358 e-commerce professionals): 15.8% of sales returned ($849.9 billion). The online rate is 19.3%. 71% of consumers are less likely to shop at a retailer after a poor returns experience. | https://nrf.com/media-center/press-releases/consumers-expected-to-return-nearly-850-billion-in-merchandise-in-2025 |
| E10 | Perfect Corp case study, Avon (V, self-reported): 320% higher conversion and 33% higher average order value for shoppers who use virtual try-on. The page says nothing about returns. | https://www.perfectcorp.com/business/successstory/Avon-Sees-Boost-in-Conversion-Perfect-Corp-Virtual-Try-On |
| E11 | AARP Mirror/Mirror survey, 1,992 US women, July 2019 (S). Women 50 and older spend about $29 a month, about $22 billion a year. 53% of Boomer women and 40% of Gen X women disagree that the industry makes products with people their age in mind. 74% and 64% say older adults are under-represented in ads. Over 70% say they are more likely to buy from brands that show a range of ages. | https://www.aarp.org/press/releases/2019-10-15-boomer-and-gen-x-women-feel-ignored-by-beauty-and-grooming-product-makers-aarp-survey-finds.html |
| E12 | Spectrophotometer study of liquid foundation darkening (V, Guangzhou cosmetics company): sebum is the largest factor in darkening, sweat and light are smaller. The abstract reports lightness change (delta L), not a full delta E. | https://www.scconline.org/Portals/100/SCC-Study%20On%20the%20Factors%20Affecting%20The%20Darkening%20of%20liquid%20Foundations.pdf |
| E13 | Five-year melanoma survival is 71% for Black patients and 94% for White patients, 2013 to 2019 (2, quoting ACS Cancer Facts and Figures 2025). The page says the gap is mainly stage at diagnosis. A CDC analysis gives a lower pair, 66.2% against 90.1%. The direction is solid and the exact figures depend on years and registry. | https://www.blackhealth.org/conditions/melanoma-skin-of-color/ and https://www.cdc.gov/pcd/issues/2019/18_0640.htm |
| E14 | Alhena stress test of 15 live shade-matching agents, Aug 2026 (V, about its own product). 5 of 15 returned bestsellers instead of a match and 6 of 15 named a shade but did not route to it. The report gives no accuracy by skin tone. | https://alhena.ai/blog/ai-foundation-shade-matching/ |
| E15 | Market sizes (V, research vendors that disagree): global sunscreen about $13.5 billion in 2024 and $14.4 billion in 2025; tinted sunscreen about $1.08 billion in 2025. Nielsen (2019, V): African Americans account for almost 90% of spending in ethnic hair and beauty aids. | https://straitsresearch.com/report/tinted-sunscreen-market and https://www.nielsen.com/us/en/press-releases/2019/african-american-spending-power-demands-that-marketers-show-more-love-and-support-for-black-culture/ |

Facts I could not source: a clean national share of Black women who cannot find a foundation match (one aggregator says 60%, with no primary study), and any brand-level return rate for foundation shade mismatch. One benchmark says foundation returns run near 23% (https://eightx.co/blog/average-beauty-and-cosmetics-return-rate-benchmarks), but it is vendor content and I do not use it as a base number.

## Spec facts that shape the ideas

These come from the OpenAPI files in `research/openapi/`.

- `makeup-vto` `foundation` takes a free hex colour, `colorIntensity`, `glowIntensity` and `coverageIntensity`. It needs no pattern catalogue. The default `skin_smooth` is 50 when you omit the effect, so set both smooth values to 0 for an honest render.
- The render stays pixel-aligned with the source. A mask from one `skin-analysis` call therefore stays valid for every render of that photo. We can measure colour inside those masks for 1 unit per render.
- `skin-analysis` returns a mask URL per concern, with `raw_score`. The feature-cost example lists 9 units for 1 to 4 SD concerns and 12 for 5 to 7. Confirm all prices with `GET /s2s/v2.0/credit/feature-cost` before any run.
- `skin-tone-analysis` returns `skin_color`, `eyebrow_color`, `lip_color` and `eye_color` as free hex values, plus `face_quality` flags for lighting and angle. `hair_color` is one of only 7 fixed values, so it is useless as a reference. `face_angle_strictness_level: strict` limits pitch to 4, yaw to 6 and roll to 4 degrees, which helps two photos align.
- `skin-simulation` has `spots` and `redness` sliders and a `wrinkle` slider.

---

## Idea 1: Seam

**Pitch.** Find the foundation that disappears at your jawline, including the blend of two bottles that a catalogue does not sell as one shade, by measuring the seam in a try-on render and fixing it until it is gone.

**Moment of use.** A shopper stands at a foundation page after two wrong bottles. The product page says "Deep 6W", but her face sits between 6W and 7N and carries dark marks on the cheeks. She wants one answer she can order now.

**User flow**
1. She takes one selfie by a window, with neck in frame. The app gates the photo on `face_quality` and angle before it spends a unit.
2. The app reads her skin. It builds a "clean base" mask: skin minus acne, dark marks, redness and shine, using the analysis masks. It samples CIELAB colour in the forehead, cheek and jaw zones, and on the neck patch (MediaPipe landmarks).
3. The solver searches the brand catalogue for one shade, a two-shade blend, or shade plus adjuster. The target is the jaw and neck colour, with a drift correction for oily zones (E12).
4. The agent renders the candidate with `makeup-vto`, measures the seam (face against neck, ΔE00) and the mark-against-base contrast, corrects the hex, and repeats up to 5 renders.
5. She sees the seam strip before and after, the recipe ("70% 6W + 30% 7N"), and a cart with both bottles and, when marks need it, a corrector. The brand sees "no single shade within ΔE00 2.5 of this shopper".

**YouCam endpoints and cost per session**
- `POST /s2s/v2.0/task/skin-analysis` (v2.1, SD, 5 to 7 concerns: age_spot, acne, redness, oiliness, dark_circle): 12 units.
- `POST /s2s/v2.0/task/skin-tone-analysis` with `strict`: 20 units.
- `POST /s2s/v2.0/task/fitzpatrick-scale-analyzer`: 10 units. It drives a reliability note on deep skin. Drop it to save units.
- `POST /s2s/v2.0/task/makeup-vto`, `foundation` effect, up to 5 renders (two of them are the high-coverage render for the mark composite): 5 units.
- File API: no unit cost listed.
- Total: 47 units with Fitzpatrick, 37 without. A budget of 1,000 units allows about 20 live sessions. Replay mode covers the rest.

**The agentic loop**
- Perceive: masks, tone read, Lab samples per zone and the neck patch.
- Decide: the solver picks a hex, a coverage level and a catalogue recipe.
- Act: one `makeup-vto` render. For marks, a second render at higher coverage is composited through the `age_spot` mask only, so the whole face is never caked.
- Verify: our own code measures ΔE00 across the jaw seam in the render and the mark-against-base contrast. The vendor score is not used.
- Adapt: a secant step on the hex using the last two measured residuals. The renderer is a black box, so the loop learns how it maps hex to skin colour for this one face. It stops at seam ΔE00 of 1.5 or less, at 5 renders, or when two steps give no gain.
- What the model does: it turns a pasted catalogue page into a shade table and explains the result in plain words. What the code does: all colour maths, the solver and the stop rules. I will say this on screen in one sentence.

**Signature visual.** The seam strip: a thin band across the jaw with the bare neck on one side and the render on the other. A ΔE counter falls from 4.6 to 1.4 as renders arrive. Beside it, a Lab ladder shows the catalogue chips as dots, her colour as a ring off the ladder, and a blend line from 6W to 7N running through the ring. A screenshot shows the problem and the fix in one frame.

**Brand-client business case.** Shade doubt makes shoppers buy several bottles or leave (E7: 54% bought more than one, 65% frustrated). Online returns run at 19.3% of sales (E9), and opened cosmetics usually cannot be returned, so the loss shows up as a lost reorder. Seam adds three things a plain shade finder lacks. It converts the "between shades" shopper to two SKUs, which lifts order value (virtual try-on users show +33% order value in a vendor case, E10). It shows the brand its range gaps: each session logs the distance to the nearest SKU, without the photo. And it gives deep-skin shoppers a reason to trust the page (E8 shows how the industry orders shades; E6 shows how thin the data is). I have no figure for the share of shoppers with no match. A pilot has to measure it, and I say so in the pitch.

**Scores (harsh)**
- Technological Implementation 8. Skin masks, tone, Fitzpatrick and VTO feed a closed loop with real colorimetry. It is not 9 because the solver is plain optimisation and the whole loop depends on how well the renderer follows the input hex.
- Design 8. The seam strip is readable in a second. It loses a point because the Lab ladder needs a sentence of explanation.
- Potential Impact 7. The audience and the pain are real and specific. Foundation is bought a few times a year, the return figures are weak, and there is no daily use.
- Quality of Idea 8. Measuring the seam and returning "no single bottle fits, mix these two" is not what a shade finder does. A shade finder is still the same shelf, and Perfect Corp already sells one.

**Biggest risk and the test.** The risk is that the VTO foundation render does not track the input hex closely enough to steer. Test with 25 units: one deep-skin selfie, one tone read (20 units), then 5 `foundation` renders on a hex ladder at fixed coverage (5 units). Pass if the measured cheek L* rises and falls in the same order as the hex, and the tone-read hex agrees with our own cheek Lab sample within ΔE00 3. Fail means the loop calibrates the renderer and not the foundation, and the idea drops to a recommendation.

---

## Idea 2: Veil

**Pitch.** One swipe of a sunscreen on one cheek tells you how much it ghosts you, and which tinted option vanishes, with the cast measured the way a lab measures it.

**Moment of use.** She stands at the sunscreen shelf, or opens a tab with a mineral SPF, or holds the bottle she stopped wearing because it left her grey. She knows she should wear it daily (E4 and E5 say sun protection decides how PIH and melasma end). She does not want a second grey face.

**User flow**
1. She takes a bare selfie in steady light. The app reads her skin and picks a clean patch on the cheek, away from marks.
2. The app asks for one swipe: two fingers of the product on one cheek, rubbed in for 30 seconds, brows kept clean.
3. She takes the second selfie. The app refuses it before spending units if the light or the angle moved. It corrects the remaining colour drift with her eyebrow and eye colours as references, because they do not change when she wears sunscreen.
4. The app computes the cast with the published white cast score (E3) and shows a plain verdict: Invisible, Faint, Visible or Ghost. It then predicts the cast for other products in the catalogue and, if two top picks are too close to call, asks her to swipe the more uncertain one next.
5. She sees a ranked list, with a "tinted, iron oxide" flag for melasma (E5), a try-on preview of the top three, and one tap to the cart. Her measurement joins the product's cast record for her skin depth.

**YouCam endpoints and cost per session**
- `POST /s2s/v2.0/task/skin-tone-analysis` with `strict`, bare photo: 20 units. Swiped photo: 20 units. The two reads give skin, eyebrow and eye hex plus quality flags, and cross-check our local sampling.
- `POST /s2s/v2.0/task/skin-analysis` (SD, `age_spot` and `redness`), bare photo: 9 units. A second call on the swiped photo: 9 units. The masks let us measure patch contrast before and after for melasma and PIH.
- `POST /s2s/v2.0/task/makeup-vto` `foundation` as a veil preview for the top 3 products (hex of the product tint, coverage from its opacity): 3 units.
- Total: 61 units. About 16 live sessions fit in 1,000 units. The skin-analysis calls are optional for people with even skin (cost 43).

**The agentic loop**
- Perceive: bare patch Lab, reference colours, patch contrast.
- Plan: the agent estimates cast for each catalogue product from filter type, tint colour and a per-product opacity prior. It computes an interval for each. If the top two intervals overlap, it picks the swipe that best separates them.
- Act: the user is the actuator here. The agent gives exact instructions and gates the photo on lighting, angle and alignment.
- Verify: our code computes ΔL*, the white cast score, Δb* (greyness) and ΔE00 on the swiped patch against the mirror bare patch, corrects drift with the references, and cross-checks with the API's `skin_color` change. A disagreement larger than the noise band flags a bad photo and asks for a retake.
- Update: the swipe sets the opacity of the swiped product and tightens the model for similar products. The agent stops when one product is clearly best or after 3 swipes.
- What the model does: it reads the ingredient and tint text of a pasted product page. What the code does: the colour maths and the swipe selection.

**Signature visual.** The split-cheek swipe. One photo shows the left cheek bare and the right cheek swiped. A cast meter reads "Ghost 7.9" for the mineral SPF she owns. Below it, three renders of the same cheek sit side by side: bare, untinted mineral (ghosted), tinted match (gone), each with its ΔE00. A difference map amplifies the cast so it shows even on a small screenshot.

**Brand-client business case.** The category is large (E15) and the gap is measured: 25% of SOC respondents cite white cast against 7% (E1), 61% of Black respondents never wear sunscreen (E2), and 84% of Black users say the choice is too small (E2). The stake is health as well as looks: cast makes people apply less (E3), PIH and melasma worsen with sun (E4, E5), and melanoma survival differs by race (E13). A retailer gains a "cast on your skin depth" rating on every product page, the way size and fit data works for clothes. A brand gains the first objective cast data by skin depth for its own SKUs, which it can use to decide which tint to launch. Today E3 says no official method exists. I treat the vendor-reported results in E10 as a sign that try-on features lift conversion, not as proof for sunscreen.

**Scores (harsh)**
- Technological Implementation 7. The tone, analysis and VTO calls each do real work, and the drift correction and active swipe choice are real engineering. The core is still colorimetry that a developer could write without YouCam, so the YouCam share is smaller than in Seam.
- Design 8. The split-cheek photo and the three-up row are instantly clear. The swipe step adds friction a reviewer who only watches a video cannot feel.
- Potential Impact 8. The audience is large, the pain is measured, and health stakes are real. It loses points because the app opens at purchase time, not daily, and the retailer case rests on data the pilot must collect.
- Quality of Idea 9. It uses a try-on and tone stack to measure what a product does to you, not what it adds, and it fills a gap the literature names (no standard cast method). It is not 10 because the idea is a measurement, not a new experience.

**Biggest risk and the test.** The risk is that lighting noise between two photos is larger than the cast signal. Mineral sunscreen can shift L* by only a few points. Test with 21 units: take 2 bare photos and 1 swiped photo of one volunteer within 5 minutes under the same window. Run local sampling only (0 units), with eyebrow and eye references. Run one tone read (20 units) on the swiped photo to cross-check, plus one `foundation` render (1 unit). Pass if the bare-to-bare L* difference stays under half of the swipe L* difference after reference correction. Fail means the idea needs a fixed reference card in the frame, which is a worse product.

---

## Idea 3: Translate

**Pitch.** Copy a makeup look from a photo of someone else, then translate it to your face by keeping the contrast the look has with its model's skin, instead of copying its colours.

**Moment of use.** She saves a look from a video of a 24-year-old with fair skin. She is 58, or she has deep skin, or her lids are hooded. She tried the "same" lip and eyeshadow once and it came out chalky and creased. She wants the look, not the hex codes.

**User flow**
1. She uploads a reference look and one selfie. The app shows the straight copy from `mu-transfer` as the baseline.
2. The app reads her skin: lines near the eyes and mouth, droopy lids, oil zones and her lip and skin colour. It also measures the reference: the colour contrast of lip, lid and cheek against the model's own skin.
3. The agent proposes a translation. It matches the contrast, not the hex. It swaps shimmer for satin where the wrinkle masks sit, lowers coverage near lines, moves lid colour up for a hooded lid, and sets skin smoothing to 0 so the render shows real texture.
4. The agent renders with `makeup-vto`, measures contrast fidelity and line emphasis in the render, adjusts, and stops when both pass or after 6 renders.
5. She sees Reference, Straight copy and Translated side by side, with the product list as free-hex colours and named finishes ready to map to SKUs.

**YouCam endpoints and cost per session**
- `POST /s2s/v2.0/task/mu-transfer`: the cost is not in the brief, so I assume 5 units or less. Confirm it with `feature-cost`.
- `POST /s2s/v2.0/task/skin-analysis` (SD, wrinkle zones, droopy eyelid, pores, oiliness: 5 to 7 concerns): 12 units.
- `POST /s2s/v2.0/task/skin-tone-analysis`: 20 units.
- `POST /s2s/v2.0/task/makeup-vto` (lip_color, eye_shadow, blush, foundation; up to 6 renders): 6 units.
- Total: about 43 units. About 23 live sessions.

**The agentic loop**
- Perceive: reference contrast vector per feature (lip, lid, cheek against surrounding skin, in ΔE00 and hue shift), her lines from the masks, her lip and skin colour.
- Decide: choose finish, intensity and placement from rules the code states, using only free hex colours, named textures and the published pattern catalogues.
- Act: render the look.
- Verify: contrast fidelity is the render's feature-to-skin contrast divided by the reference's contrast. Line emphasis is local luminance variance inside the wrinkle masks, render against bare, with smoothing off. The vendor score is not used.
- Adapt: raise colour intensity for fidelity, drop shimmer or coverage for line emphasis, and stop at fidelity within 15% of the reference with line emphasis no greater than bare.
- What the model does: it picks pattern names given eye shape and describes the look in words. What the code does: both metrics and the stop rules.

**Signature visual.** A three-up: Reference, Straight copy, Translated. Under each, two thin bars show lip contrast and line emphasis. The straight copy shows a pale lip bar and a long line bar. The translated look shows the lip bar restored and the line bar flat. A screenshot shows why the same hex is the wrong look.

**Brand-client business case.** "Shop this look" is a proven retail pattern, and 62% of Gen Z beauty shoppers bought a product they found on social media (Tinuiti 2025, V: https://tinuiti.com/research-insights/research/2025-beauty-marketing-study/). The new reach is shoppers who today cannot use those looks: women 50 and older (E11: about $22 billion a year, 53% of Boomers say products are not made with their age in mind, over 70% prefer brands showing a range of ages) and deep-skin shoppers (E6, E8). The retailer gets looks that convert for faces unlike the model's, and a "looks different in person" return reason that falls. I have no sourced figure for that reason's share, so I do not claim one.

**Scores (harsh)**
- Technological Implementation 8. It chains four endpoints with two measured metrics, and the baseline comparison shows the work. The pattern catalogues are not in the OpenAPI files and have to be fetched.
- Design 8. The three-up works on a screenshot. The two metric bars add explanation.
- Potential Impact 6. The audience is large and under-served, but the evidence is a 2019 survey, it quantifies no return or conversion pain for looks, and use is occasional.
- Quality of Idea 8. "Preserve contrast, not colour" is a real colour-science idea. It sits next to Round 1's Look Compiler, which also takes a reference look.

**Biggest risk and the test.** The risk is that the line emphasis metric does not move when the finish changes, because the renderer may not draw shimmer or matte at pixel level. Test with about 17 units plus the `mu-transfer` price: one selfie with visible lines, one skin-analysis call for the wrinkle masks (12 units), and 4 renders of the same lip and lid colours in matte, satin and shimmer, with smoothing at 0 (4 units). Pass if line emphasis in the wrinkle masks differs between matte and shimmer by more than the difference between two renders of the same settings. Fail means drop the second metric and keep only contrast fidelity.

---

## Harsh critic

**Seam.**
- It is a shade finder. A judge who knows Perfect Corp sells one will ask what is new. The honest answer is the blend and the measured seam, and that has to land in the first 15 seconds.
- Catalogue swatch hex values are marketing colours, not measured Lab on skin. Without brand-measured data the recipe is a guess in a precise costume. The pilot needs spectrophotometer data from the brand, and the hackathon demo does not have it.
- The real test of a foundation match is a bottle on a face. No API gives that ground truth, so the demo proves the loop converges on the render and not on reality. I would say so on screen.
- Phone auto white balance and under-exposed deep skin can break the whole read. E6 warns that the underlying models are weakest here.
- The repeat use is thin: a few matches a year.

**Veil.**
- A reviewer can say it is a colour meter with a Perfect Corp logo. It uses the tone and analysis calls honestly, but the maths do not need them.
- A finger swipe is not a controlled dose. E3 used 2 mg/cm2. A thin swipe understates the cast and a thick one overstates it. I cannot fix this without a dose guide, such as a fixed line length of product.
- Predicting cast for products she did not swipe rests on label priors. A wrong prediction is worse than none. Without brand-measured opacity the cold start is weak, so the demo must label predicted values as predicted.
- "Melasma-appropriate" is a near-medical claim, and E5 shows a benefit with hydroquinone, not alone. Say "iron oxide tint" and stop there.
- A video judge cannot swipe, so the demo is pre-recorded. Label it.

**Translate.**
- "Preserve contrast" is my hypothesis, not a result. Perceived looks involve shape and finish too, and a person may prefer the straight copy.
- `mu-transfer` may already adapt to skin depth. If it does, the baseline loses its point.
- Line emphasis is a texture statistic. It does not measure how old the render looks, and the maths could reward a flat, dull face.
- The evidence for mature skin is the weakest of the three. The creasing advice I found is beauty-blog guidance, not science.
- It overlaps Look Compiler from Round 1, so the judges have seen the shape.

**Ranking, best first**
1. **Veil.** It has the most original idea, the strongest quantified pain, a health stake, and a visual that works as a screenshot. Its weak point is Technological Implementation, and the swipe step costs Design. If the 21-unit test passes, build this one.
2. **Seam.** It has the best fit with both tracks and the cleanest technical story, and it scores higher than Veil on Technological Implementation. It loses on novelty (shade finder crowding) and on repeat use. If the 25-unit test shows the renderer tracks hex well, it moves to first.
3. **Translate.** It has good engineering and a good visual. Impact is the weakest, the mature-skin evidence is old, and it sits closest to a round 1 idea.

**What would lift each toward 9 on every criterion**
- Veil: a fixed dose guide and a second skin-depth bucket from the Fitzpatrick call to tie the result to a clear safety stake; a second YouCam stage that matters (for example, `skin-simulation` `spots` to show how an even, covered tone would look beside the measured patch contrast).
- Seam: real measured Lab for even one brand's shades (a public spectrophotometer set), and a daily reason to return, such as a seasonal re-match prompt tied to a measured tan shift.
- Translate: a measured return or conversion fact for look-based shopping, and a controlled test that people prefer the translated look.

**Ideas I considered and cut**
- Spot or Mark: split acne lesions into active and residual marks on deep skin and plan around each. Its audience is good (E4), but it reads as scan, classify, recommend, and it depends on `age_spot` detecting PIH on deep skin where the training data is thin (E6).
- Device Safe Match: gate at-home IPL and laser devices by Fitzpatrick type. The safety angle is real, but the experience is a one-time gate, and I found no source on injury or return numbers.
