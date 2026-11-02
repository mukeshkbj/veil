# Sponsor judge: Perfect Corp (YouCam API) product and developer-relations lead

Lens: Would this make an Estée Lauder, a skincare brand, a retailer or a clinic want the API? Does it use many YouCam products in a way a customer could not build alone? Is the agent real? Can I understand it from a 1-3 minute video?

I have seen hundreds of "scan, score, recommend routine" entries. A tracker that charts `raw_score` over four weeks reads as a skin-analysis wrapper with a nicer chart to me. Anything whose core loop is "your score moved or did not" starts one point behind.

## Stance on the `ui_score` / noise-floor angle

Six of the 15 ideas headline "the vendor's `ui_score` is flattered, so we use `raw_score`" or "we measure the API's own test-retest noise". Four more lean on it quietly.

- **Reading `raw_score` for maths: fine.** It is a documented field, and a good engineer should use it. No penalty.
- **Putting the spec's "psychological motivator" sentence in the pitch: hurts.** It tells 800 brand clients that the score they show their customers is fudged. Our brand clients show the `ui_score` in their widgets. I would not enjoy that slide in front of them.
- **"Noise floor" as the product's headline: mixed.** Framed as rigor ("clinic-grade confidence bands"), it helps with the clinic and derm segment. Framed as "the API is noisy, so we refuse to answer", it makes the vendor look unreliable. Also, "Stop buying it" and "Cancel serum B" are anti-conversion messages. They are a hard sell to retail clients.
- **Net:** the honesty angle is a differentiator for me personally, but it lowers Potential Impact (for brand clients) and does not raise Technological Implementation (it is statistics on one endpoint). I score it accordingly.
- **Replay fixtures:** most longitudinal ideas need 4-12 weeks of data and will show staged series. I discount staged series and synthetic "sim then analyse" loops.

## Scores (1-10; TI = Technological Implementation, DP = Design potential, PI = Potential Impact, QI = Quality of Idea)

### Agentic engineer

**A1. Trial Bench** — total 27
- TI 8: Chains analysis, simulation-as-calibration and lighting repair with a real stop rule and state, but only the Skin AI family.
- DP 5: Its story is a slow chart and a stamp, and the 20-second demo must carry a time-lapse it cannot show live.
- PI 6: A real pre-refill moment, but the best outcome is "buy less", which is not a pitch I can take to brand clients.
- QI 8: Using the simulation API as a measuring-instrument calibrator is genuinely non-obvious.

**A2. Look Compiler** — total 30
- TI 8: mu-transfer as the oracle for a makeup-vto optimisation loop is a deep use of two flagship endpoints and the 13-effect schema, at 1 unit per iteration.
- DP 8: Reference photo, you in the look, you in the compiled recipe, an error counter dropping, then a shareable recipe card: instantly readable.
- PI 6: "Get the look" is a proven retail motif and the recipe maps to SKUs, but the lift to a client's revenue is asserted, not argued.
- QI 8: One YouCam product acting as ground truth for another, ending in an editable object instead of another image, is fresh.

**A3. Barely There** — total 21
- TI 6: Analysis plus VTO in an optimiser is sound, but the author admits the LLM does little and the oracle may not respond to rendered makeup.
- DP 5: Four frames with scores 41, 49, 58, 58 is a lab result, not a product.
- PI 4: Narrow audience (interview and photo prep) and weak repeat use.
- QI 6: "Least makeup that works" is a nice angle, but it conflicts with what makeup retailers sell.

### Behavioral scientist

**B1. Trigger Lab** — total 24
- TI 7: A permutation-test layer on `raw_score` and Fitzpatrick gating is careful work on two endpoints, with little API breadth.
- DP 5: A 21-day timeline of chips and verdicts has a thin visual and high daily friction.
- PI 5: Strong for rosacea users, but "your wine is fine" yields no commercial path for a brand client, and it leans on the honesty angle I discount.
- QI 7: Relief as the default outcome is humane and unusual, but it is a health logbook more than a beauty product.

**B2. Already Own It** — total 17
- TI 3: One VTO endpoint whose result the author admits a hex-distance calculation predicts.
- DP 6: The contact sheet and "Not bought: 1" counter is cute and graspable.
- PI 3: It exists to stop purchases, which is the opposite of what our retail clients want.
- QI 5: The inverted funnel is a clever sentence, but a technical judge dismantles it in minutes.

**B3. Week-6 Wall** — total 23
- TI 7: HD analysis zones, simulation as "expectation ghost" and a safety-override rule engine over three endpoints.
- DP 5: Weekly thumbnails and a speed bump on "shop alternatives" is a good beat in a thin wrapper.
- PI 5: Decent problem (quitting actives early), but a retailer sees a feature that delays sales, and the purge-by-zone claim is unvalidated.
- QI 6: The commitment-device idea is smart, but the product is a tracker with one extra screen.

### Creative technologist

**C1. Lopsided** — total 30
- TI 7: It reads mask pixels, not scores, and does midline maths with MediaPipe, which is clever but rests on one analysis call.
- DP 9: A split face, a draggable hairline and ratio badges work from one selfie, and a judge can try it in 30 seconds.
- PI 5: Episodic use, mixed evidence on sleep side, and no commercial link to a brand client.
- QI 9: "Which side, and why?" is a question no skin app asks.

**C2. Receipts** — total 25
- TI 7: Noise band from three baselines plus a simulate-then-analyse ghost target is neat but is the same chain as A1 and D2.
- DP 6: The scrubbing timeline with falling stamps is nice, but there is nothing to see on day 1.
- PI 6: The money framing (saves $312 a year) is sharp, but it is aimed at the user, not the retailer.
- QI 6: It is the third entry in this pile that tests whether a serum works.

**C3. Minimum Dose** — total 28
- TI 8: Analysis as objective function, VTO as actuator and skin-tone for shade, with an agent that stops at the knee of the curve.
- DP 7: A dose slider with a flattening curve and a pinned "minimum effective dose" is a clear one-line visual.
- PI 6: It bridges both tracks and feeds a concealer and foundation purchase, but "wear less" cuts against the category.
- QI 7: Dose-response for makeup is original, and it depends entirely on whether analysis responds to rendered makeup.

### Dermatologist

**D1. Week 3 (purge or reaction?)** — total 24
- TI 7: HD analysis with six concerns, zone overlap and Fitzpatrick weighting, plus a clinician PDF export.
- DP 5: A split-screen of "generic app vs ours" is good for the video, but the product is a weekly rule engine.
- PI 6: A real adherence problem with real citations; clinicians will care, retailers will not.
- QI 6: Reading a score drop as information is smart, but the core claim is unvalidated.

**D2. The Other Cheek** — total 29
- TI 8: Split-face trial design with a planted positive control and a null control built from the simulation API is the best use of two endpoints in the pile.
- DP 7: One face, one line and a stamp, plus a "known effect recovered, known null rejected" strip, reads clearly.
- PI 6: It addresses "is this working?", but compliance is shaky and most results will be "no detectable effect".
- QI 8: Handing a clinical-trial design to a consumer is non-obvious, but it is the fourth "does the serum work" entry.

**D3. Fade (melasma, mMASI-style)** — total 26
- TI 7: Five endpoints (Fitzpatrick, tone, analysis, simulation, masks) feed a re-implemented clinical score, but all of it depends on `age_spot` detecting melasma.
- DP 6: Four coloured regions with a falling number is clear and clinical, and a little cold.
- PI 6: It serves an underserved group and fits Women in Tech, and it is a niche for brand clients.
- QI 7: Rebuilding mMASI from masks is ambitious, and "mMASI-style estimate" is the most we can claim.

### Retail PM

**R1. Headroom** — total 29
- TI 7: 16-concern analysis, LLM claim parsing and a simulation best-case diff make a real pipeline, though it is two endpoints.
- DP 8: Scan once, paste two serums, a before/after slider and a "Skip / Better aimed" banner is the cleanest video of the skin ideas.
- PI 7: A pre-purchase decision engine with product-claim mapping is something a brand's e-commerce team can picture; the "skip" is the concern.
- QI 7: Simulation as a decision tool is good, though "skin analysis plus product recommendations" is still the shape.

**R2. Second Shade** — total 32
- TI 8: Tone analysis with brow, hair and eye colour as a lighting reference, plus makeup-vto previews and a closed-loop validation using VTO then re-analysis.
- DP 7: A returns-portal flow, a mismatch readout and a shade slider with "Exchange" is easy to follow, though it is a mock portal.
- PI 9: Returns of used foundation are a write-off, the buyer is a CX leader, and the exchange-instead-of-refund story is the strongest ROI case in the pile.
- QI 8: Working at the moment of failure with the evidence on her face is a fresh angle, and the brow-and-hair trick is clever.

**R3. Unanimous** — total 32
- TI 9: Cloth-v4, skin-tone-analysis and makeup-vto across several users with a maximin solver is the broadest and most "bring VTO together" integration here.
- DP 8: Four faces tile, re-dress, one tile turns red, a lip colour rescues her, and the bar goes green, which is a strong shareable demo.
- PI 7: A high-ticket group occasion (bridal party, family photo) with a real stalled-order problem, though use is occasional and privacy needs care.
- QI 8: Every VTO product serves one person; this serves the group decision where the order stalls.

## Ranking by total

| Rank | Idea | TI | DP | PI | QI | Total |
|---|---|---|---|---|---|---|
| 1 (tie) | R3 Unanimous | 9 | 8 | 7 | 8 | 32 |
| 1 (tie) | R2 Second Shade | 8 | 7 | 9 | 8 | 32 |
| 3 (tie) | A2 Look Compiler | 8 | 8 | 6 | 8 | 30 |
| 3 (tie) | C1 Lopsided | 7 | 9 | 5 | 9 | 30 |
| 5 | D2 The Other Cheek | 8 | 7 | 6 | 8 | 29 |
| 5 | R1 Headroom | 7 | 8 | 7 | 7 | 29 |
| 7 | C3 Minimum Dose | 8 | 7 | 6 | 7 | 28 |
| 8 | A1 Trial Bench | 8 | 5 | 6 | 8 | 27 |
| 9 | D3 Fade | 7 | 6 | 6 | 7 | 26 |
| 10 | C2 Receipts | 7 | 6 | 6 | 6 | 25 |
| 11 (tie) | B1 Trigger Lab | 7 | 5 | 5 | 7 | 24 |
| 11 (tie) | D1 Week 3 | 7 | 5 | 6 | 6 | 24 |
| 13 | B3 Week-6 Wall | 7 | 5 | 5 | 6 | 23 |
| 14 | A3 Barely There | 6 | 5 | 4 | 6 | 21 |
| 15 | B2 Already Own It | 3 | 6 | 3 | 5 | 17 |

Tie-break for first place follows the stated order (Technological Implementation first): Unanimous (9) beats Second Shade (8). Between A2 and C1 for third, I take Look Compiler: it uses two flagship VTO endpoints and ends in a shoppable object, while Lopsided rests on one call and no commercial link.

Pattern worth noting: the five trackers that measure whether a product worked (A1, C2, D2, B1, B3, plus D1) share one mechanism. I would see four or five of them in the finals pile, and they will cancel each other out. The ideas that cross into the VTO track and touch multiple YouCam products score higher on my lens because fewer teams will build them.

## Top 3

1. **R3 Unanimous (32).** Broadest integration, strongest "VTO together" fit, most shareable demo.
2. **R2 Second Shade (32).** Best business case and the cleverest single trick, but it depends on tone analysis behaving on a foundation-covered face.
3. **A2 Look Compiler (30).** Best use of the makeup schema, and its output is a shoppable, shareable object.

## Single idea most likely to win 1st place: R3 Unanimous

- It answers the eCommerce VTO track brief almost word for word ("what someone wears and how they look are part of the same self-image").
- It uses three flagship products (cloth-v4, skin-tone-analysis, makeup-vto) in one flow. A brand client can see where each sits in a cart.
- It is the only idea here where the output is a decision a group makes together. The demo is four faces re-dressing at once, which a video-only judge understands in five seconds.
- Most of the 1,125 entrants will be on the Skin AI track, and most of those will be a variant of scan, score and chart. A group-shopping room is the rarest shape in the pile.
- It wins on the tie-break (Technological Implementation).

It does not win automatically. The three ways it can lose are listed at the end.

## Proposed HYBRID: "Matching Set" (group outfit-and-face planner)

Take Unanimous as the spine. Add Look Compiler's verify-and-refine loop for the rescue step, Second Shade's lighting-reference trick for the tone read, and Second Shade's returns maths for the impact slide.

**Who:** A bridal party, family photo group or office-event group choosing one outfit colourway, where everyone has a different skin tone.

**Core loop**
1. **Join.** The organiser pastes a garment link with 3-4 colourway images and shares a QR or link. Each member uploads one selfie with a consent screen that states retention and deletion.
2. **Perceive.** `skin-tone-analysis` per member returns skin, hair, eye, brow and lip hex. The brow and hair hex are used as a lighting reference to correct the skin read (Second Shade's trick).
3. **Render.** `cloth-v4` dresses each member in the top two colourways and the group's worst one, using the garment reference image with no per-SKU asset.
4. **Decide.** A transparent solver picks the colourway that maximises the lowest member's harmony score (maximin), with mean score as tie-break. The score is labelled "signal", and the renders are the evidence.
5. **Rescue (the agent).** For the member with the lowest score, the agent derives a target lip, blush and optionally eyeshadow palette from the garment colour and her tone data. It calls `makeup-vto` (1 unit per render) in a loop, and it checks each candidate with a deterministic Lab colour measure and a re-run of tone analysis on the render until the member's gap closes or the unit cap is hit. An optional reference look photo goes through `mu-transfer` first (Look Compiler's oracle) so the rescue can follow a look the user already likes.
6. **Output.** One group cart: the winning garment per person with sizes, plus a personal shade kit (hex values, finishes, placements) mapped to SKUs. The organiser sees an estimated "avoided returns" figure labelled as an estimate, using the NRF return rates from the brief's evidence tables.

**20-second demo**
- 0-4 s: Four selfies join through a QR code. Four faces tile.
- 4-9 s: The organiser taps three colourways. All four faces re-dress together. Per-person bars rise.
- 9-14 s: One tile turns red (sage on Priya). A counter drops from 14 to 3 over 8 renders, and a pink lip and a warm blush appear on her. Her bar turns green.
- 14-18 s: A pin lands on burgundy: "Chosen because the worst-off person is best off." Sage is greyed out with the note "Would have been returned by 1 in 4."
- 18-20 s: The cart fills with four garments and four personal shade kits. One tap: "Order all four."

**Why it would beat everything listed**
- Highest breadth: four YouCam products (cloth-v4, skin-tone-analysis, makeup-vto, mu-transfer) in one flow, each doing work the others cannot.
- A real agent in step 5: perceive, decide, act, verify, and stop on a cap. It is the only agent in the pile that is visible on screen in the first 20 seconds.
- Both tracks in one product, with a returns-and-conversion business case for the retailer who owns the cart.
- A solo path exists for judges who try it alone: one person, three colourways, plus the same rescue loop. Invite friends is an upgrade, not a requirement.
- It does not need the "your vendor's score is flattered" story. It reads `raw_score` where it needs scores and does not mention `ui_score` on screen. The README can say one neutral line: "all maths uses raw scores".

**Units:** About 26 per member (tone 20, three cloth renders at 2) plus about 8 for the rescue loop on one member. A four-member run is about 115 units. About eight live runs fit in 1,000 units. Record real outputs once, then run the rest in replay mode.

## 3 biggest ways a strong team could still lose with Unanimous

1. **The render grid is the whole demo, and cloth-v4 can fail on it.** Strapless, sheer, patterned or dark-on-dark garments can come back with artifacts, wrong skin or a shifted colour, and four uncanny faces in a row sink the video. Fix: choose 3-4 garments that render cleanly on all four demo faces, test them on day one, and cut any garment that fails. Never show a failed tile.
2. **The harmony score reads as folk colour theory, and the agent reads as a for-loop.** If a judge asks why sage lost and the answer is an invented number, the solver is decoration. If the rescue step looks like a lipstick filter, the "agentic" bonus is gone. Fix: let the renders carry the evidence, show the score as secondary, and make the verification visible on screen (the ΔE counter falling with a re-measure from tone analysis). Say in one sentence what the model decides and what the code decides.
3. **It needs a group, a consent screen and 115 units, but a judge only has a video.** A reviewer who cannot try it alone, or who sees the privacy risk of friends' faces and derived colour data, marks it down on Design and Impact. A staged group demo can also look scripted. Fix: ship the solo path, label replay data on screen, keep deletion visible, and spend the live units on one recorded run that shows real API output rather than on many runs.

Also check before building: the makeup pattern catalogs referenced by the VTO schema are not in the OpenAPI files, so the rescue step should stick to free hex colours and named textures until they are fetched. Run a 30-unit probe first (one tone read on a bare face and on a face with foundation, one cloth render on a hard garment) to confirm assumptions 1 and 2 above.
