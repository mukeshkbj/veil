# Round 2, angle: daily habit (consumer product designer)

Persona: a designer who has shipped daily-habit apps. The question I ask of every idea is "what is the 8:10 am moment, and why would a person open this again tomorrow without a reminder?" Round 1 produced products for purchase moments and trials. Nobody on the user panel opened them out of habit (research/judging/users.md: "No idea earns a daily habit from this panel"). This file fixes that.

Design commitments carried from round 1 and applied to all three ideas:
- No 0 to 100 face score on screen. Math uses `raw_score` and mask pixels. Words and pictures only.
- Photos stay on the device or in a 24 hour server cache. Numbers are kept, faces are not.
- One look per day, no magnified flaws, no "worse than yesterday" language (the user panel flagged daily mirror audits as a harm risk).
- Any simulated image is labelled "illustration".
- Every colour or fit check also reports a deep skin safety check (face tone must not drift toward lighter after any render).

## Evidence base

Figures come from web search on 2026-10-22. Where the source is a vendor blog or a secondary summary, I say so. Treat those as directional.

1. **Morning routines are long and repeated.** A Drive Research survey found women with a morning skincare routine spend about 12.5 minutes on it; 65% finish in 10 minutes or less. https://www.driveresearch.com/market-research-company-blog/skincare-statistics-and-trends/
2. **Getting ready with makeup is a 40 minute daily block.** A Cosmetify survey of 2,300+ British women, reported by Grazia, put the morning routine at about 40 minutes, and over half apply makeup every morning. https://graziadaily.co.uk/beauty-hair/makeup/average-length-beauty-routine-sleep
3. **Older but consistent:** YouGov (2012, nationally representative US sample): 56% take 11 to 30 minutes getting ready; 38% of women take over 30 minutes versus 21% of men. https://today.yougov.com/news/2012/07/10/morning-routine-30-spend-over-week-getting-ready-e
4. **Sun protection is the clearest daily gap.** RealSelf 2020: only about 11% of US adults wear sunscreen daily, 46% never do, and 55% of non-users say they do not get enough sun to need it. https://practicaldermatology.com/news/realself-sun-safety-report-majority-of-americans-dont-use-sunscreen-daily
5. **Forecast-only UV apps do not change behaviour.** In the Solar Cell RCT (JAMA Dermatology, 2012) only 125 of the 305 adults assigned to the app used it. A qualitative study of SunSmart found first-time users thought the forecast was overly cautious against their own read of the weather. https://www.mobihealthnews.com/news/study-app-increases-adherence-sun-protection and https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6698026/ . Lesson: a number about the sky is ignored; a picture of your own face is not.
6. **Weather really changes skin.** A 2016 JEADV review concludes that low humidity and low temperature reduce skin barrier function, and cold dry weather raises the risk of atopic dermatitis flares. https://pubmed.ncbi.nlm.nih.gov/26449379/
7. **Adult acne is common, and more so in women.** AAD study (JAAD 2008, self-reported, one university area): women reported current acne at 50.9% in their 20s, 35.2% in their 30s, 26.3% in their 40s versus 42.5%, 20.1%, 12.0% for men. https://www.sciencedaily.com/releases/2007/10/071019155627.htm
8. **Shade finding is a stated pain, worse on deep skin.** A March 2026 poll of 4,300+ US women (The Benchmarking Company, as summarized by my search tool, not verified at the primary source): 41% report trouble finding their shade for complexion products, 56% among women with darker skin tones. https://beautymatter.com/articles/makeups-inclusivity-race-is-solving-the-wrong-problem
9. **Foundation and concealer returns are the outlier.** Eightx puts beauty online returns at 4 to 12% (median 8 to 9%) but foundation and concealer at about 23% where returns are allowed; Banuba via Corso puts color cosmetics at 12 to 25%. Both are vendor blogs. https://eightx.co/blog/average-beauty-and-cosmetics-return-rate-benchmarks and https://www.corso.com/post-purchase-resource-center/the-most-common-ecommerce-return-reasons
10. **Online returns overall.** NRF and Happy Returns: online return rate about 19.3% in 2025, total returns about $849.9 billion; apparel is commonly cited at 20 to 30% (secondary sources). https://www.digitalcommerce360.com/2025/10/24/nrf-consumers-return-850-billion-merchandise-in-2025/
11. **Wardrobes are mostly unworn.** NIVEA survey (Australia, 2026, 1,000+ women aged 18 to 45): 91% own clothes they have never worn, and most rotate through only 25 to 50% of their wardrobe. https://sitchu.com.au/fashion/new-research-aus-fashion-week-2026 . An older Movinga study of 18,000 households found Americans had 82% of items unworn in the prior year. https://fashionunited.uk/news/fashion/people-do-not-wear-at-least-50-percent-of-their-wardrobes-says-study/2018081638356
12. **Daily habits are rare and valuable.** Duolingo reported 58.7 million DAU in Q2 2026 (+23% year on year) and 84% current user retention. https://pulse2.com/duolingo-daily-active-users-reach-58-7-million-as-retention-hits-record-84-and-social-accounts-top-1-billion-organic-impressions/ . Health and fitness apps keep only about 3 to 8% of users at day 30. https://businessofapps.com/data/health-fitness-app-benchmarks and https://www.braze.com/resources/articles/mobile-app-retention.md
13. **Getting ready is already a content genre.** "grwm" videos passed 157 billion views on TikTok by November 2023 (Fortune). https://fortune.com/2023/11/27/get-ready-with-me-videos-tiktok-157-billion-views-users-prepare-dates-getting-fired
14. **Retailers lack daily touchpoints.** CivicScience: only 21% of US adults visit Sephora, and 25% visit Ulta, for beauty more than once a year. https://civicscience.com/sephora-vs-ulta-shoppers-skincare-social-media-influence-brand-loyalty-and-more/
15. **The sponsor's own case studies (vendor claims, no baselines):** e.l.f. +200% conversion with makeup VTO, The Body Shop UAE up to +50% basket size with Skin Analysis, Keensight +50% consultation conversion. https://www.perfectcorp.com/business/successstory/list

Facts about the API surface I verified in research/openapi:
- `makeup-vto` has a `concealer` effect (`color`, `colorIntensity`, `colorUnderEyeIntensity`, `coverageLevel`) applied to zones (under-eye, forehead, chin), not to individual blemishes. It also adds a default `skin_smooth` of 50 unless set to 0. That default would fake any cover result, so every verify loop below sets it to 0 for measurement renders.
- `skin-analysis` v2.1 prices by concern count: 1 to 4 concerns 9 units SD or 12 HD; 5 to 8 concerns 12 or 16; 9 to 12 concerns 14 or 20; 13 to 16 concerns 16 or 22. Returns per-concern masks, so an agent can pick four concerns for 9 units.

## Idea 1: Mirror Forecast

**Pitch:** A weather app for your face: ten seconds at the morning mirror gives a "today's face" card, a look rendered on you, tuned to your skin this morning, the sky outside and what you are doing today.

**Moment of use:** 7:50 am, phone propped on the bathroom shelf, before makeup. The decision is "what goes on my face today": finish (matte or dewy), coverage, how much SPF, what to carry. Repeats every morning and once more at the midday check.

**User flow (5 steps):**
1. Open from the home-screen widget or the wake-time notification. Camera opens on a face guide. One tap takes the bare-face selfie. The occasion is one chip: Work, Outdoors, Date, Photos.
2. The card builds in view: a forecast strip (Shine, Hydration, Redness, UV) lights up from the face masks and today's weather at the user's location.
3. The agent renders "Today's look" on the user (finish, concealer only where redness sits, lip) and shows a bare/look slider.
4. The card ends in three lines: put on, skip, carry. Example: "Matte on your T-zone. SPF 50, reapply 1:15 pm when UV peaks at 8. Skip the heavy cream, humidity is 74%." Product slots map to SKUs.
5. At 1 pm (optional) the midday mirror: one more selfie. The same masks show where shine returned; the agent renders a touch-up. The next morning the card opens with "Yesterday's plan held" or "Shine came back by 2".

**YouCam endpoints and units per session (steady state):**
- `POST /s2s/v2.1/task/skin-analysis`, SD, 4 concerns (oiliness, moisture, redness, acne): 9 units.
- `POST /s2s/v2.0/task/makeup-vto`: 2 renders (candidate, then corrected after verify): 2 units.
- `POST /s2s/v2.0/task/skin-simulation`, optional "3 pm preview" illustration: 4 to 6 units (count 5).
- `POST /s2s/v2.0/task/skin-tone-analysis`, once at setup and cached: 20 units.
- Session total: 11 (core) or 16 (with 3 pm preview). Setup: 20. Midday check: 9 + 1.
- Outside YouCam: a free weather API (Open-Meteo, no key) for UV, humidity, temperature by hour.

**Agentic loop:**
- Perceive: raw scores and masks for four concerns, today's hourly UV and humidity, occasion chip, cached tone hex.
- Decide: an LLM planner chooses from typed options (finish, coverage per zone, corrector hue, SPF reapply hour, one carry item). Code enforces rules: no medical claims, one look per day, reapply time taken from the hourly UV curve, not invented.
- Act: render with `makeup-vto` (foundation finish, concealer, lip) and composite per zone with the analysis masks so coverage lands where redness actually is.
- Verify: deterministic Lab checks on the render. Redness-mask ΔE must drop at least a set margin; mean L* of the whole face must not rise more than a set limit (the deep skin lightening guard); mask halo ΔE at the edge must stay low. If a check fails, the agent adjusts intensity or corrector hue and re-renders, with a cap of 3 renders. Next morning it closes the loop on yesterday's forecast using the 24 hour-old midday scan.
- Stop: render cap or unit cap, then show the best passing render with a plain "close enough" note.

**Signature visual:** The face as the weather map. Redness, shine and dryness masks appear as soft radar-style overlays on the user's own photo, the hourly UV curve runs across the bottom with the reapply pin on it, and the bare/look slider sits in the middle. It screenshots as one card and doubles as a "grwm" share image.

**Brand-client business case:**
- Retailers get a daily touchpoint they lack: only 21 to 25% of US adults visit Sephora or Ulta for beauty more than once a year (evidence 14), while a morning card is 300+ opens a year if the habit holds.
- Each card is a shoppable plan: finish, SPF, primer, corrector map to SKUs, and the weather makes them seasonal and replenishable (SPF in a UV 8 week, barrier cream in a dry week).
- Skin Analysis plus VTO is the combination the sponsor sells; the card shows both in one view. The sponsor's own claims (+50% basket size, evidence 15) are the upper bound of what the client expects.
- Sunscreen daily use is 11% (evidence 4). A brand with an SPF line gets a reason to be in the first 10 seconds of the day.

**Scores (1 to 10, harsh):**
- Technological Implementation: 8. Three YouCam endpoints with a mask-conditioned compositor and a real verify loop is solid, but nothing here is hard to replicate once you know the masks exist, and the weather layer is trivial.
- Design: 8. The card is instantly legible and the radar-style overlay is distinctive; it is also close to a "scan, then recommend" shape, which risks looking familiar in a video.
- Potential Impact: 7. The daily habit is the right target and the touchpoint argument is real, but the quantified pain is time and decision fatigue, not money, and 11% daily sunscreen is a weak anchor for a conversion claim.
- Quality of Idea: 7. "Weather app for your face" is a sharp frame, but day to day raw_score changes may be mostly noise, so the insight is an assumption until tested.

**Biggest risk and a test under 30 units:** The forecast looks arbitrary if the analyzer's morning-to-morning wobble is larger than the weather effect, and the verify loop fails if analysis does not respond to rendered makeup. Test (19 units): analyze one bare face (SD, 4 concerns, 9), render a matte foundation with `skin_smooth` 0 (1), analyze the render (9). Pass if oiliness raw_score rises and the masks align with the rendered zones. Repeat the bare analysis under window light versus bathroom light only if units remain.

## Idea 2: Cover Story

**Pitch:** Wake up with a breakout before a date or a photo, and an agent finds each spot, decides which to cover, leave or treat, and shows you the covered face with the exact concealer shade and the three steps for tonight.

**Moment of use:** The morning of a big day, standing at the mirror with a new blemish. It is one of the most emotional skin moments there is, and it has a clear question: what do I do right now?

**User flow (5 steps):**
1. Take a selfie in window light. The app asks for a guide-framed shot and rejects a shot with heavy shadow.
2. The photo comes back with every spot ringed. Each ring has a chip: Cover, Leave, or Treat first. A line says "5 spots, 3 hide well, 1 is too raised to hide, 1 is fading."
3. A bare/covered slider shows the covered face. The concealer shade is matched to the skin around each spot, not the spot.
4. The kit appears: one concealer hex mapped to the nearest SKU, one corrector for redness, one patch or spot product, with a tonight and a tomorrow morning step list.
5. One tap saves the plan. A "3 days from now" illustration (labelled) shows the likely fading if the user follows the plan. The next breakout, the user returns to the same flow.

**YouCam endpoints and units per session:**
- `POST /s2s/v2.1/task/skin-analysis`, HD, 4 concerns (acne, redness, dark_circle, age_spot): 12 units.
- `POST /s2s/v2.0/task/skin-tone-analysis`, once and cached, for skin hex and undertone: 20 units. Spot-adjacent skin color is also sampled from pixels outside the masks.
- `POST /s2s/v2.0/task/makeup-vto`, concealer plus foundation with `skin_smooth` 0, up to 3 iterations: 3 units.
- `POST /s2s/v2.1/task/skin-analysis`, SD, 2 concerns (acne, redness), on the covered image to verify: 9 units.
- `POST /s2s/v2.0/task/skin-simulation`, optional "3 days from now" illustration: 4 to 6 units (count 5).
- Session total: 12 + 3 + 9 + 5 = 29 (tone cached), first session 49.

**Agentic loop:**
- Perceive: acne and redness masks from HD analysis. Connected components give a lesion list: area, location, redness contrast against a ring of surrounding skin, whether the lesion is raised (from the texture of the mask edge and local gradient).
- Decide per lesion: Cover (contrast is moderate and flat enough to hide), Leave (small and fading, makeup would draw more attention), or Treat first (large and raised; concealer will not hide it, so the plan says so). Thresholds are explicit rules; the LLM only writes the plan and picks the corrector hue from a table.
- Act: `makeup-vto` concealer renders at a chosen `coverageLevel` and `colorIntensity`; because the engine applies concealer by zone, the agent composites the render into the original only inside feathered lesion masks, so the rest of the face stays untouched (and untouched means real skin texture, no smoothing).
- Verify: re-run SD analysis on the composite. Acne and redness `raw_score` should rise; the ΔE between each lesion and its ring should drop below a target. If the analyzer still flags a lesion, the agent raises coverage or changes the corrector hue and re-renders, with a cap of 3 renders. If the cap is hit it says so: "Covered, but a close look will still show spot 4."
- Stop and report: it shows what the agent could and could not do, per spot.

**Signature visual:** One face with each blemish ringed in a thin vermillion circle and a small chip beside it (Cover, Leave, Treat first). The slider wipes from bare to covered. It works as a still screenshot because the story is in the rings.

**Brand-client business case:**
- Concealer and complexion are where shade mismatch lives: 41% of women have trouble finding their shade and 56% on darker skin (evidence 8), and foundation and concealer returns run at about 23% where allowed (evidence 9). The agent hands over a hex matched to the person's own skin and an SKU nearest that hex, at the moment of need.
- It is a high-intent, same-day purchase: a rescue kit, not a browse. A retailer with same-day pickup or delivery gets a basket of three to four items with a deadline attached.
- It is pro-conversion: it adds products (concealer, corrector, patch) rather than telling people to buy less.
- Adult acne audience: about half of women in their 20s and a third in their 30s (evidence 7).
- Perfect Corp can show clients one flow where Skin Analysis finds the problem and VTO shows the answer, which is the sponsor's two-family pitch.

**Scores (1 to 10, harsh):**
- Technological Implementation: 8. Mask to lesion list to per-lesion decision to masked compositing to re-analysis is real engineering across analysis, tone and VTO; the 2-iteration verify loop is the part a customer would not build in an afternoon.
- Design: 9. The ringed face and the slider are readable in two seconds and the chips are a clear verb; the risk is only that a video shows one face.
- Potential Impact: 7. The pain and the sale are concrete and the audience is large, but the use is tied to breakouts, which is weekly at best for most users, so it fails the "daily open" bar on its own.
- Quality of Idea: 8. Treating each blemish as a decision with a verified outcome is non-obvious next to "analyze, then recommend", and the `skin_smooth` insight is a real catch; it still reads as a very good makeup feature rather than a new category.

**Biggest risk and a test under 30 units:** The acne mask may not separate individual lesions, or the analyzer may not register a concealer composite, which would make the verify step meaningless. Test (22 units): one HD analysis with acne and redness on a photo with visible blemishes (12); inspect connected components against the ringed spots by eye. Render concealer with `skin_smooth` 0 (1), composite inside masks, then run an SD re-analysis with acne and redness (9). Pass if lesion count is within one of what a person sees and the re-analysis `raw_score` for acne or redness rises.

## Idea 3: Fit Check

**Pitch:** Snap your clothes once; every morning an agent picks today's outfit and the lip and blush that tie it to your face, shows it rendered on you, and tells you what your closet is missing.

**Moment of use:** 8:10 am at the closet, five minutes before leaving, with weather and an occasion. It is the one "what do I put on today" moment that happens to nearly everyone, not just people who wear makeup.

**User flow (5 steps):**
1. Setup: photograph 6 to 10 favourite garments on a bed or a hanger. The app asks for category (top, dress, outer layer) and nothing else. More items can be added later.
2. Each morning: one selfie and one chip (Work, Casual, Evening) with weather pulled in.
3. The agent renders the top three outfits on the user's photo and ranks them. A swipe pager shows each.
4. The chosen outfit gets one tied beauty note: a lip and blush rendered on the same photo ("terracotta lip picks up the rust sweater").
5. The app logs what was worn. After a week it shows the "unworn" shelf, and offers one shoppable gap item rendered on the user ("This olive jacket works with 6 things you own").

**YouCam endpoints and units per session:**
- `POST /s2s/v2.0/task/cloth-v4`: 3 outfit renders at 2 units = 6 units.
- `POST /s2s/v2.0/task/makeup-vto` (lip_color, blush): 1 to 3 units.
- `POST /s2s/v2.1/task/skin-analysis`, SD, 2 concerns (redness, oiliness): 9 units. Used to choose the strength of blush and base, and to flag a day when a red garment will fight redness.
- `POST /s2s/v2.0/task/skin-tone-analysis` once and cached: 20 units.
- Session total: 6 + 3 + 9 = 18; first session 38.

**Agentic loop:**
- Perceive: tone hex (skin, hair, eye, brow, lip), redness state, garment dominant colours from the closet photos, weather, occasion, wear history.
- Decide: a deterministic shortlist from Lab colour contrast between each garment and the face, a weather filter, and a rotation bonus for items not worn recently. The LLM only ranks ties and writes the card.
- Act: `cloth-v4` renders for the top three; `makeup-vto` for the beauty tie.
- Verify: for each render, check the face region ΔE against the source (the garment step must not touch the face), the garment's dominant colour against the reference photo (colour shift guard), and the lip hex harmony against the garment hue. Failed renders are dropped, never shown. Cap on units per session.
- Stop: top three passing renders, or fewer with a note.

**Signature visual:** The user in three outfits as a swipe stack, with their own face unchanged in each and a lip colour strip that updates as the garment changes. The "unworn shelf" screen is the second visual: closet items sorted by days since worn.

**Brand-client business case:**
- Closet-aware try-on turns a retailer's product photo into a render on the shopper's own body in the context of what they own: `cloth-v4` takes a garment reference image, so there is no per-SKU 3D asset.
- Gap suggestions drive conversion on items with known pairs, and the "works with 6 things you own" claim is a reason to keep an item, which targets bracketing and returns. NRF puts online returns at 19.3% and apparel at 20 to 30% (evidence 10).
- Wardrobes are 25 to 50% rotated (evidence 11), so the pitch to an apparel retailer is that the shopper already owns enough and needs reasons to wear and complete, not to buy more at random. The retailer gets the pair data.
- Honest limit: returns are driven mostly by fit and feel, which a colour-and-cut render does not fix. The business case is conversion and engagement first, returns second.

**Scores (1 to 10, harsh):**
- Technological Implementation: 7. Three families (cloth, tone, makeup) are used together, but the decision engine is colour distance and a rotation count, and closet management is plumbing.
- Design: 7. The three-outfit swipe is a good screenshot; the closet setup is homework, which kills a day-one first-time-user bar.
- Potential Impact: 7. "What to wear" is a daily moment with a large audience, but the quantified pain (unworn clothes) is weakly sourced and the returns case is indirect.
- Quality of Idea: 7. Pairing outfit and face in one daily surface fits the track's brief, but outfit planners exist, so the novelty rests on the beauty tie and the render.

**Biggest risk and a test under 30 units:** `cloth-v4` may render casually photographed garments (on a bed, wrinkled) badly, which would make the three-up stack unusable. Test (28 units): four `cloth-v4` renders on four casually photographed garments (8) plus one `skin-tone-analysis` (20). Pass if at least three of four renders keep the garment's colour and pattern and leave the face untouched.

## Harsh critic

**Attack on Idea 1 (Mirror Forecast).**
- It is the shape the sponsor said it has seen hundreds of: scan, score, recommend, with a prettier card. A video judge sees a nice card and asks what is hard about it.
- The weather link is plausible (evidence 6) but I have no evidence that a UV curve or a humidity number changes a person's finish choice. It could feel like a horoscope.
- Daily cost is 11 to 16 units per user per day. A brand client needs a plan for that cost, and I do not have one beyond "caching the tone read".
- The habit claim is the weakest part. Day-30 retention for health and fitness apps is 3 to 8% (evidence 12). A morning card with no streak and no reward is exactly the sort of thing people drop on day nine. A streak or score would help retention and harm users (the panel flagged obsessing), so I removed both.
- Skin state barely moves day to day for most people, so most mornings the card will look the same, and sameness kills a daily open.

**Attack on Idea 2 (Cover Story).**
- It is episodic. A person with clear skin never opens it. A person with acne opens it a few times a month at best. It fails the "daily or weekly" bar from the brief on its own terms.
- Concealer in `makeup-vto` is zone-based, so the best parts of the product (per-lesion decisions) live in my compositor, not the vendor API. A judge who values "deep use of YouCam APIs" may read that as engineering around the API.
- If the analyzer does not register the composite, the verify step is hollow. The risk test costs 22 units and could kill the loop, which would leave a before/after slider and a shopping list.
- "Treat" advice sits close to medical advice. Wording must stay at "common non-prescription options" and "see a clinician for painful, spreading or scarring breakouts", or the product creates liability for a brand client.
- A pimple app can feel intrusive. The user panel's rule (no magnified flaws) is in tension with a ring around every spot. The ring must be a soft, optional layer with a "hide rings" toggle.

**Attack on Idea 3 (Fit Check).**
- Closet setup is homework. The user panel's number-one reason to quit was long setup (under 30 seconds per use, and Priya's limit was three baseline selfies). Eight garment photos is more than that.
- The harmony rule is folk colour theory. If a judge asks why this top beat that top and the answer is a ΔE table, the agent reads as a sorting function.
- The returns case is weak: returns are mostly fit and feel, which this does not address (evidence 10 caveat).
- Skin AI is a minor passenger. The brief gives a plus for Skin AI and VTO used together, and here Skin AI only tunes blush strength.
- Outfit planners are a crowded category. The beauty tie is the only differentiator, and it is the least reliable output.

**Ranking (best to worst on the 9+ bar and on realism):**

| Rank | Idea | TI | DP | PI | QI | Total | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Cover Story | 8 | 9 | 7 | 8 | 32 | Best demo and best purchase tie; fails daily bar alone |
| 2 | Mirror Forecast | 8 | 8 | 7 | 7 | 30 | Best daily shell; weakest insight |
| 3 | Fit Check | 7 | 7 | 7 | 7 | 28 | Fits the VTO track; weakest on API depth and setup |

No idea clears 9 on every criterion as scored. The shortfalls are Potential Impact (7 on all three) and, for Idea 2, repeat use.

**Recommendation: build the hybrid, "Today's Face".** Use Mirror Forecast as the daily shell (widget, weather-and-skin card, the midday mirror) and make Cover Story's engine the star of any morning when the masks warrant it. The daily card shows the forecast strip every day. On a day with new blemishes or visible redness, the card expands into the ringed face and the cover plan. On a clear day it stays a ten second card. That gives:
- a daily open from the card, and a high-emotion peak from the cover plan,
- four YouCam families in a single flow (skin-analysis, skin-tone-analysis, makeup-vto, optional skin-simulation) without a long setup,
- a demo that opens on the radar-style card and then jumps to the ringed face and the slider,
- a business case with two legs: the daily touchpoint (SPF, finish, primer slots) and the same-day rescue kit (concealer, corrector, patch).

Units for the hybrid on a breakout morning: skin-analysis HD 4 concerns 12, makeup-vto 3, verify re-analysis 9, optional simulation 5 = 29 (tone cached at 20 once). A clear-day card costs 11. Budget for 1,000 units: about 10 live breakout runs plus a few clear-day runs; record one real full run and use replay mode for the rest.

**Pre-build gate (under 30 units):** run the Idea 2 test (22 units) first. If the analyzer does not register the composite or the masks do not separate lesions, drop the verify loop for the lesion path and keep Mirror Forecast's zone-level verify (Idea 1's test, 19 units, only if the first test leaves budget).

## Caveats on the evidence

- Evidence 8, 9, 10, 11 and 15 are vendor blogs, secondary summaries or self-reported surveys. They are directional. Verify the primary source before putting any of them on a slide.
- I found no source on the share of morning routines that change with weather, or on the frequency of makeup purchases by Gen Z. The daily-use argument rests on routine length (evidence 1 to 3), the sunscreen gap (4) and the habit benchmarks (12), not on a measured weather effect.
- No source validated the YouCam masks on deep skin. Aisha's rule applies: any reading that is unsure must say it is unsure, and the L* guard in the verify loop is not optional.
