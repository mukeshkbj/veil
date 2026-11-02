# Round 2: returns and conversion economist

Persona: I ran beauty and fashion P&Ls. I think in terms of money that leaves the business at the point of purchase: the wrong shade, the wrong colour, the gift nobody wanted, the cart that never checks out.
Scope: this file proposes three ideas. It edits no other file.
Unit costs come from the OpenAPI files in `research/openapi/`. Paths are relative to `https://yce-api-01.makeupar.com`. Every flow starts with `POST /s2s/v2.0/file`, then a PUT to the presigned URL, then a POST to the task, then polling `GET task/{id}`. This upload step is not repeated below.
Every idea runs on a live key and on an offline replay mode built from the documented response schema. Every replay or mock catalog is labelled on screen.

## Evidence base

Trust levels: High means a primary or press-release source. Medium means a named survey reported by a third party. Low means a vendor blog with no primary source.

| # | Fact | Source | Trust |
|---|---|---|---|
| 1 | US retailers expect about $849.9B in returns in 2025. The overall return rate is 15.8%, the online rate is 19.3%, and retailers expect 17% of holiday sales to come back. | [NRF press release](https://nrf.com/media-center/press-releases/consumers-expected-to-return-nearly-850-billion-in-merchandise-in-2025), figures as reported by [Retail TouchPoints](https://www.retailtouchpoints.com/news/nrf-forecasts-nearly-850-billion-in-returns-in-2025-slight-decrease-from-2024) | High |
| 2 | Foundation and concealer return at about 23% where returns are allowed. Makeup overall returns at about 15.7%. Sealed items return at 1% to 5%. 64% of beauty returns say the product looked different in person. | [Eightx benchmark](https://eightx.co/blog/average-beauty-and-cosmetics-return-rate-benchmarks) | Low (the 23% figure is repeated by other blogs but I could not trace it to primary data) |
| 3 | Colour cosmetics return at 12% to 25%, a range the source says shade mismatch drives almost entirely. | Banuba analysis, as cited by [Corso](https://www.corso.com/post-purchase-resource-center/the-most-common-ecommerce-return-reasons) | Low |
| 4 | Returns cost online retailers an average of 21% of order value to process. | Pitney Bowes survey, as reported by [eMarketer](https://www.emarketer.com/content/online-returns-eat-retailers-bottom-lines) (publication year not confirmed) | Medium |
| 5 | Online apparel returns run at about 24.4%. Brands rank size and fit first (53%), colour second (16%) and damage third (10%). The sample is 100 brand and retailer decision-makers, and 3DLOOK sponsored the report. | [Coresight](https://coresight.com/research/the-true-cost-of-apparel-returns/) | Medium |
| 6 | In the US, 76.1% of returned value ends as a refund. Only 17.1% of returned value ends as an exchange. | Loop 2025 State of Ecommerce Returns, as reported by [Retail Times](https://retailtimes.co.uk/uk-retailers-risk-loyalty-loss-with-78-of-returns-ending-in-refunds-and-lowest-exchange-rates-globally/) | Medium (vendor report) |
| 7 | 70.19% of online carts are abandoned. 48% of US shoppers abandoned a cart in the last 3 months because they were "just browsing". | [Baymard Institute](https://baymard.com/lists/cart-abandonment-rate), last updated July 2023 | High |
| 8 | 58% of shoppers say they buy more than they intend to keep ("bracketing"), per a 2021 Narvar survey. A 2022 Narvar survey put the figure at 63%. | [Sales Tech Star on Narvar](https://salestechstar.com/sales-marketing/narvar-study-finds-58-of-consumers-intentionally-buy-more-goods-than-they-intend-to-keep/) | Medium |
| 9 | Perfect Corp clients report that try-on users convert 2.5 to 3.2 times as often. Avon reports +320% conversion and +33% average order value. Cosnova reports 2.5 times. A YouCam for Web release cites 8% fewer returns. These are self-selected users and vendor claims. | [Avon](https://www.perfectcorp.com/business/successstory/Avon-Sees-Boost-in-Conversion-Perfect-Corp-Virtual-Try-On), [Cosnova](https://www.perfectcorp.com/business/successstory/Cosnova-SS-EN), [Business Wire](https://www.businesswire.com/news/home/20200401005488/en/Perfect-Corp.-Partners-with-Jillian-Dempsey-for-the-Launch-of-YouCam-for-Web-AR-Try-On-Solution) | Medium (vendor) |
| 10 | Returns rise 25% to 35% from 26 December compared with earlier in the month (Adobe data). In a UK Post Office poll, 18% of non-electrical beauty gifts were re-gifted, donated, sold or returned. Only clothing and footwear ranked higher. | [Axios](https://www.axios.com/2025/12/25/christmas-gifts-holiday-returns), [Portsmouth News on the Post Office poll](https://www.portsmouth.co.uk/read-this/eight-in-10-brits-would-return-or-sell-their-unwanted-gifts-according-to-research-5454271) | Medium |
| 11 | In a Hong Kong Consumer Council survey of 1,650 women, 49% owned facial products unopened for over a year. A Renude survey of its own audience found 62% of purchased products were unsuitable for the buyer's skin. | [The Standard](https://www.thestandard.com.hk/news/article/184532/Almost-half-of-women-stockpile-unused-skincare-products-over-a-year-Consumer-Council), [Renude](https://ai.renude.co/blog/creating-a-more-sustainable-way-to-shop-for-skincare) | Medium and Low (Renude sample is self-selected) |
| 12 | Online beauty and personal care sales are near $257.5B. Online share of beauty sales was 26% in 2024 and is projected at 33% by 2030. | [ClickPost D2C report](https://www.clickpost.ai/blog/beauty-industry-ecommerce-market) | Medium |

What I could not find: a primary-source share of foundation returns caused by shade, any measured effect of try-on on returns from an independent A/B test, and any figure for gift-return rates in beauty alone. Each idea below says where it depends on one of these gaps.

Operator fact, not verified by search: an opened or used cosmetic cannot go back on the shelf, so a returned foundation is a write-off of the product plus the handling cost. Fact 2 supports this: sealed items return at 1% to 5%, and unsealed colour products return far more often.

Where the APIs reach and where they do not: apparel size and fit drive 53% of apparel returns (fact 5), and no YouCam endpoint measures a body. I do not pitch a fit tool. The leaks that a face-based API can reach are colour and shade, claim mismatch, gifts bought blind, and low confidence.

---

## Idea 1: Neck Test

**One-line pitch:** A foundation shade is right when the face disappears into the neck, so Neck Test measures that seam on the shopper's own photo, repeats the render until the seam closes, and stamps the proof on the cart line.

**The moment of use:** The shopper stands at the foundation or concealer page with two or three adjacent shades in her cart. She cannot choose, so she plans to buy all three and return two (bracketing, fact 8). The same test also runs at the return screen when the reason is "wrong shade".

**Why this is the sharpest leak in the P&L:** Complexion products return at about 23% (fact 2, low trust). Each return costs about 21% of order value to process (fact 4) and the opened product is a write-off. Only 17.1% of returned value ends as an exchange (fact 6), so the shopper usually leaves with a refund and no replacement.

### User flow in 5 steps

1. **Capture.** The shopper takes one bare-face selfie in window light with the neck visible. The browser checks face angle, neck visibility and exposure before it spends any units.
2. **Perceive.** The agent runs skin analysis for `redness`, `acne` and `oiliness`. It uses their masks to remove blemished, red and shiny pixels from the face sample. It then reads the median colour of a clean cheek patch and the median colour of an upper-neck patch in CIELAB, and it computes the starting seam as ΔE2000 between the two.
3. **Decide.** The target colour is the neck colour of the source photo. The agent ranks the shades in the product line (hex values from a retailer shade table) by ΔE2000 to that target. It picks the three nearest shades.
4. **Act.** The agent renders each candidate with the foundation effect. It measures the seam on every render. It then moves the hex in the direction that closes the remaining ΔL, Δa and Δb, and it renders again. After two or three renders it has an ideal hex, and it snaps that hex to the nearest real shade.
5. **Prove.** The cart line gets a badge: "Matched to your neck, seam ΔE 1.4 (was 6.8)". The three bracketed shades collapse to one line. If no shade in the line gets below ΔE 3, the agent says so, searches one other line, and otherwise reports "no shade in this line fits you".

### YouCam endpoints and unit cost per session

| Call | Purpose | Units |
|---|---|---|
| `POST /s2s/v2.1/task/skin-analysis` with `redness`, `acne`, `oiliness` (SD) | Pixel masks that clean the face sample | 9 |
| `POST /s2s/v2.0/task/makeup-vto`, foundation effect (`color`, `colorIntensity`, `glowIntensity`, `coverageIntensity`) | Up to 6 renders: 3 candidates, 2 refinements, 1 confirmation | 1 each, 6 maximum |
| `POST /s2s/v2.0/task/skin-tone-analysis` (optional) | Independent cross-check of the face colour, and `face_quality.lighting` | 20 |

A normal session costs 9 + up to 6 = 15 units. A session with the cross-check costs 35 units. At 15 units, 1,000 units cover about 60 sessions with room for probes.

### The agentic loop

- **Perceive:** skin masks and two colour patches, with a lighting gate that stops the run before any render if exposure is poor.
- **Decide:** choose candidates from the shade table, then compute the next hex from the measured residual.
- **Act:** call the VTO endpoint, one render at a time.
- **Verify:** re-measure the seam on the returned pixels. The agent never trusts the input hex, because `colorIntensity` and `coverageIntensity` change the rendered colour. This is the reason a closed loop is needed, and it is the part a customer cannot add with a single API call.
- **Stop rule:** seam ΔE2000 at or below 2, or 6 renders, or a second miss, which triggers the "no match in this line" answer.

If the foundation effect also repaints the neck, the seam disappears from the render. The reference stays the neck of the source photo, so the measurement still works. For display, the app composites the original neck back under the jaw line, so the seam is still visible in the picture.

### Signature visual

A full-face portrait with a thin vertical seam meter at the jaw line. The seam starts as a visible colour break between face and neck. With each render it fades, and a ring beside the face counts down from 6.8 to 1.4. The screenshot is one face with a half-open seam and the ring number. The first-time user needs no explanation: "match your neck" is a sentence people already know from makeup advice.

### Brand-client business case

- **Placement:** a "Prove my shade" button on the foundation, concealer, skin tint and powder pages. The same agent runs in the cart when two or more shades of one product appear.
- **Money:** take 100,000 foundation orders at an illustrative $38. At 23% returns, 23,000 orders return. At 21% of order value, handling is about $7.98 per return, or about $183,500, plus 23,000 write-off units. If the proof prevents 20% of those returns (an assumption to test in a pilot), the client avoids 4,600 returns and about $36,700 of handling, plus 4,600 write-off units.
- **Second lever:** at the return screen, the agent measures the worn-photo seam directly (no render needed for the measurement) and offers an exchange. Fact 6 shows the exchange rate is the weak spot, at 17.1%.
- **Third lever:** conversion for shade-hesitant visitors. Facts 7 and 9 give the pool and the vendor-claimed lift. The lift is self-selected, so I do not forecast it.
- **Repeat use:** every complexion purchase (foundation, concealer, tint, bronzer, powder), plus a seasonal re-check when tan or winter pallor shifts the neck colour. This is four to eight uses a year, not daily.

### Scores (harsh)

| Criterion | Score | Justification |
|---|---|---|
| Technological Implementation | 8 | A closed measurement loop with mask-cleaned sampling is real engineering across two API families, but only one hero endpoint does the visible work. |
| Design | 8 | One face, one seam and one falling number is graspable in five seconds, but the flow is a single-purpose utility. |
| Potential Impact | 7 | The leak is large and the client case is concrete, but the category is narrow, use is seasonal, and the 23% figure is low-trust. |
| Quality of Idea | 8 | Using the neck as a measurable ground truth for "right shade" is non-obvious, but shade finders are a crowded category. |

### Biggest risk and a test under 30 units

**Risk:** the foundation effect may not track the input hex, may repaint the neck, or may leave a hard edge at the jaw. Any of these breaks the loop.

**Test (24 units, two faces):** run skin analysis once per face (9 + 9 = 18 units). Render three foundation hexes per face that step in lightness around the neck colour (3 + 3 = 6 units). Pass if the measured face colour moves monotonically with the input hex, the seam has a clear minimum within one step of the planted match, and the jaw edge shows no hard line. If the neck is repainted, switch to the source-neck reference and the composite, then re-test with 3 more units.

---

## Idea 2: Gift Proof

**One-line pitch:** Buy her something that fits without asking her what colour she wears: the recipient taps a link, looks at six products on her own face, and the giver sees only the ones she said yes to, never her photo.

**The moment of use:** Twelve days before a birthday or a holiday, the giver has a $60 to $120 budget and no idea what is safe. She opens the retailer app and enters the recipient's name and the budget.

**The leak:** Gifts are the one purchase where the buyer cannot try anything and the user has no say. Retailers expect 17% of holiday sales to come back (fact 1), and returns jump 25% to 35% after 26 December (fact 10). In the UK Post Office poll, 18% of beauty gifts were re-gifted, donated, sold or returned (fact 10).

### User flow in 5 steps

1. **Ask.** The giver enters a budget and an occasion and sends a "Help me not get this wrong" link. The link names no items. The recipient sees a consent screen that says the selfie is deleted within 24 hours, the giver never sees it, and only colour data stays on her side.
2. **Perceive.** The recipient takes a selfie. The agent runs skin tone analysis (skin, lip, brow, eye and hair colour) and skin analysis for `redness`, `moisture` and `oiliness`. The skin result removes products with actives that a reactive skin should not receive as a surprise.
3. **Decide.** The agent builds a budgeted shelf of six to eight items from the retailer catalog: one lip or cheek colour, one pair of earrings or one necklace, one scarf, and one skin-safe care item. It balances variety and price, and it keeps the total within the budget.
4. **Act and verify.** The agent renders each item on the recipient: lip and blush with makeup try-on, and earrings, necklace and scarf with their try-on endpoints. The recipient sees her own face in each item and taps a heart or a cross. The agent reads the pattern, drops the categories she rejected, and runs one replan round with two or three new renders.
5. **Give.** The giver sees a face-free shelf: product tiles with "She tried this on and said yes" badges. She buys one item or the bundle. The recipient never learns which one.

### YouCam endpoints and unit cost per session

| Call | Purpose | Units |
|---|---|---|
| `POST /s2s/v2.0/task/skin-tone-analysis` | Recipient colouring as data | 20 |
| `POST /s2s/v2.1/task/skin-analysis` with `redness`, `moisture`, `oiliness` (SD) | Skin-safety filter for care items | 9 |
| `POST /s2s/v2.0/task/makeup-vto` (lip, blush) | Colour product renders | 1 each |
| `POST /s2s/v2.0/task/2d-vto/earring` and `POST /s2s/v2.0/task/2d-vto/necklace` | Jewellery renders | 1 each (single wear) |
| `POST /s2s/v2.0/task/scarf` | Scarf render | 2 |
| Replan round: 2 to 3 more renders | Replacement items | about 3 |

One recipient session costs about 20 + 9 + 1 + 1 + 1 + 1 + 2 + 3 = 38 units. The giver costs nothing. 1,000 units cover about 20 full sessions after probes.

### The agentic loop

- **Perceive:** colouring and skin state from two analysis calls.
- **Decide:** a budget-constrained selection that keeps variety (a knapsack with a diversity rule), not a ranked list.
- **Act:** parallel renders for the shelf, within a unit cap.
- **Verify:** the recipient's taps are the check. The agent also applies a machine check before showing a render: face detected, garment or jewellery visible and not clipped. A failed render never reaches the recipient.
- **Replan:** one round that removes rejected categories and adds replacements, then stops. The agent logs each decision in a visible notebook.

### Signature visual

Two phones side by side. On the left, the recipient's face wears six items in a grid, and hearts light up as she taps. On the right, the giver's face-free shelf lights up tile by tile with "She said yes" ticks. The screenshot works because it shows a private moment and a purchase decision in one frame, with no face on the giver's side.

### Brand-client business case

- **Gift conversion and returns:** the giver buys a pre-approved item, so the gift is less likely to be returned (facts 1 and 10).
- **Acquisition:** every gift creates a consented customer profile with measured colouring. The recipient's own first purchase is easier to win than a cold lead. Perfect Corp clients can see this as a new acquisition channel, which the other two ideas do not offer.
- **Privacy position:** the architecture shares measurements and approvals, not photos. This answers the regulatory concern that face data raises (for example Illinois BIPA) better than a share-the-selfie design.
- **Repeat use:** a giver uses it three to eight times a year. A recipient who joined to help a friend returns for her own shade. Neither is daily.

### Scores (harsh)

| Criterion | Score | Justification |
|---|---|---|
| Technological Implementation | 7 | Four to five endpoint families and a replan loop are broad, but the main verification is the recipient's tap, which is a human step and not a machine check. |
| Design | 8 | The two-phone story is clear and keeps the surprise, but the video must show a second person to land. |
| Potential Impact | 7 | The gift-return pain is real and the acquisition angle is strong, but gift data is thin (no beauty-only figure) and the recipient must act. |
| Quality of Idea | 8 | "Measure her, do not show her" is a fresh answer to blind gifting, but the shelf is still a recommendation list underneath. |

### Biggest risk and a test under 30 units

**Risk:** the recipient does not finish the link, or the giver does not wait for her. The cold-start is on the human side.

**Test (about 27 units, plus a zero-unit human test):** send the link concept to eight real gift recipients through friends, using a hand-made shelf. Measure the share who finish within 24 hours (target 60% or more) and the share of tiles they accept. In parallel, spend 27 units on render quality: one tone analysis (20), then lip, blush, earrings, necklace and scarf on one selfie (1 + 1 + 1 + 1 + 2 = 6). Fail the idea if fewer than half of the first eight recipients finish, or if any jewellery render needs a retry.

---

## Idea 3: Money Map

**One-line pitch:** Draw the skincare cart onto the face: every dollar lands on a zone, coloured by whether that zone has headroom, and the agent rewrites the cart so more money lands where the skin needs it.

**The moment of use:** The shopper has four skincare items in the cart for $142. She has bought serums before that did nothing, and she is about to do it again.

**The leak:** Products bought on a claim, with no link to the buyer's skin. 49% of surveyed women owned facial products unopened for over a year (fact 11, Hong Kong), and 62% of purchases were unsuitable in the Renude audience (fact 11, low trust). Retailers lose the repeat sale, because a wrong first purchase ends the relationship.

### User flow in 5 steps

1. **Scan.** The shopper takes one selfie. The agent runs the full 16-concern skin analysis and keeps `raw_score` and the per-concern masks.
2. **Read the cart.** A language model parses each cart item's claims and key ingredients into YouCam concern names, with a confidence value. For example "pore-refining serum" maps to `pore`, and "caffeine eye cream" maps to `dark_circle` and `eye_bag`.
3. **Map.** The agent computes headroom per concern and zone as 100 minus `raw_score`. It splits each item's price across the concerns it claims, weighted by headroom. The face shows the result: green where money meets headroom, grey where money lands on healthy skin, and an outlined gap where headroom has no money.
4. **Re-aim.** Within a spend tolerance of plus or minus 10%, the agent swaps items from the retailer catalog to raise the money placed on the top three gaps. It also flags two actives that should not share a routine night. It then calls skin simulation on the claimed concerns for the original cart and for the re-aimed cart.
5. **Compare.** A slider shows the best-case face for each cart. The headline reads "31% of your money was aimed at your top three gaps. Now it is 78%."

### YouCam endpoints and unit cost per session

| Call | Purpose | Units |
|---|---|---|
| `POST /s2s/v2.1/task/skin-analysis`, 16 concerns (SD) | Headroom, zones and masks | 16 |
| `POST /s2s/v2.0/task/skin-simulation`, original cart (5 to 10 concerns) | Best-case render of the current cart | 6 |
| `POST /s2s/v2.0/task/skin-simulation`, re-aimed cart | Best-case render of the new cart | 4 to 6 |

A session costs 26 to 28 units. 1,000 units cover about 30 sessions after probes. A second re-aim round costs 4 to 6 more units.

### The agentic loop

- **Perceive:** the 16-concern analysis and the cart contents.
- **Decide:** maximise covered headroom per dollar within the spend tolerance and a conflict rule. This is a small optimisation, and the code decides, not the model. The model only parses claims.
- **Act:** swap items and render both carts with simulation.
- **Verify:** recompute coverage for the new cart and require that uncovered headroom drops and spend stays inside the tolerance. If either fails, the agent tries the next best swap, and it stops after three attempts.

### Signature visual

A face map. Concern masks from the analysis are tinted by status, and dollar callouts sit on the zones: "$68 on pores: pores are 91/100, healthy". Beside it, a hollow outline on the under-eye area reads "no money here, 41/100". The screenshot makes the cart's mistake visible in two seconds, and nothing like it exists in the skin scorecard category.

### Brand-client business case

- **Swap, not skip.** An earlier idea in this project said "skip this purchase", which is a hard sell to retailers. Money Map keeps spend flat and re-aims it, so average order value does not fall.
- **Trust and repeat.** A shopper whose first serum matches a real gap is more likely to buy again. I could not find a primary figure for repeat rate, so this is an argument and not a number.
- **Cross-sell with a reason.** The outlined gap tells the retailer which product to show next and why.
- **Cart abandonment.** Baymard's 70.19% (fact 7) includes shoppers who leave from doubt. Money Map gives that doubt a visible answer. I do not claim a lift.
- **Repeat use:** each skincare purchase, plus a re-scan each season. Monthly at best.

### Scores (harsh)

| Criterion | Score | Justification |
|---|---|---|
| Technological Implementation | 6 | Two endpoints and local maths make a sound pipeline, but the simulation cannot verify efficacy, so the verify step is arithmetic on its own input. |
| Design | 8 | The money-on-the-face map is instantly readable and works as a screenshot. |
| Potential Impact | 7 | The pain is wide and the client framing is positive, but the evidence for skincare waste is soft (fact 11) and no repeat-rate figure exists. |
| Quality of Idea | 6 | Mapping spend to zones is fresh, but the underlying shape is still scan, score, recommend. |

### Biggest risk and a test under 30 units

**Risk:** the skin simulation shows a generic best case for a concern and not a product-specific result, so a judge reads the slider as marketing. A second risk is that the masks are too coarse to attach money to a zone.

**Test (24 units):** run one 16-concern analysis (16), then two simulations of four concerns each, for two different concern sets (4 + 4 = 8). Pass if the pixel difference in each render sits at least 70% inside the masks of the concerns that were requested, and if the two renders differ in different zones. If it fails, drop the slider and keep only the map.

---

## Harsh-critic section

### Attacks on Idea 1: Neck Test

- **The shade table is mock data.** A real client supplies hex values for each shade. A hex swatch is not the pigment in the bottle. Oxidation darkens many foundations within an hour. The proof is a proof of the hex, not of the product. The screen must say so.
- **The neck is a poor reference for some people.** Sun exposure, redness and make-up on the neck all shift it. The jaw and neck rule is common advice and not a lab standard. A skin-tone panel would find cases where it fails.
- **Chin shadow biases the neck patch.** The agent samples below the shadow and gates on exposure, but a dark-skinned user in a warm room may still pass a bad capture.
- **The seam target of ΔE 2 is a rule of thumb.** I did not source it. A small panel test is needed before the number appears in a video.
- **The category is crowded.** YouCam already ships a shade finder. The video must show the closed loop, or a judge files it there.
- **Dependency on one hero endpoint.** If the foundation effect behaves badly, the whole idea fails. The 15-unit test shows this on day one, which is also a strength.

### Attacks on Idea 2: Gift Proof

- **It needs two people.** A judge who tries it alone cannot see the point. The video must show both phones, and a staged second person can look scripted. A solo mode, where the user is both giver and recipient, hides the surprise and weakens the story.
- **The recipient's taps are not agent verification.** Without them the loop is a for-loop over renders. The machine check on render quality is real but small.
- **Privacy is a promise.** A 24-hour retention window helps, and the API keeps results for 24 hours anyway. But a surprise gift still means a stranger asks for a face. Some recipients will refuse.
- **The hair colour field is coarse.** The tone analysis returns hair colour as one of seven fixed values. The shelf should lean on skin, lip, brow and eye colour.
- **The "returns" claim is weak.** I found no beauty-only gift-return figure. The acquisition argument carries the case.

### Attacks on Idea 3: Money Map

- **It is Headroom with a better chart.** A judge who saw round 1 will see the same shape: scan, score, recommend, with a slider.
- **The simulation ceiling is not a result.** It shows a best case for a concern, not what a serum does. The slider needs a label that says so, and the label weakens the picture.
- **Claim parsing is a language model task.** It is not the YouCam work, and a competing entry can do it as well. The YouCam share of the engineering is small.
- **The evidence is the weakest of the three.** Fact 11 comes from a Hong Kong survey and a self-selected audience.

### Ranking

| Rank | Idea | Why |
|---|---|---|
| 1 | Neck Test | It has the cleanest ground truth (a pixel measurement), the sharpest P&L number, a 15-unit session, and a day-one test that can kill it cheaply. |
| 2 | Gift Proof | It has the freshest idea and the best acquisition story for a client, but the human cold-start and the weak gift data hold it back. |
| 3 | Money Map | It has the strongest still image and the weakest engineering and novelty. |

### What would lift each toward a 9

- **Neck Test:** widen it from foundation to every shade-bearing complexion product in one flow (foundation, concealer, tint, bronzer) and show a real before-and-after exchange at the return screen. That raises Impact and Design together.
- **Gift Proof:** add a machine verifier that does not depend on the recipient (for example, a measured colour distance between each item and the recipient's own lip or brow colour as a comfort check). That raises Technological Implementation.
- **Money Map:** replace the generic simulation slider with a measured per-zone change, or drop the idea.

### Honest summary for the ideation round

None of the three reaches 9 on all four criteria with the evidence I could find. Neck Test comes closest because it replaces a soft score with a measurement and ties directly to the most-returned beauty category. Its two weak points are the seasonal repeat rate and its dependence on one rendering behaviour that a 15-unit probe can confirm or kill in a day.

Considered and cut: a hair-dye "realistic outcome" tool (its outcome model would be my own chemistry, and the API cannot verify it), and a group colourway planner (it already exists as Unanimous in round 1).
