# Retail PM ideas: three bets for the YouCam hackathon

Persona: former Sephora/Ulta digital growth PM. I owned VTO conversion, shade-match returns, and apparel return reduction.
Budget rule: 1,000 free units in total. Every unit cost below comes from the OpenAPI specs in `research/openapi/`.
All endpoints share the same plumbing: `POST /s2s/v2.0/file`, a PUT to the presigned URL, `POST` the task, then poll `GET task/{id}`.

## Evidence base (what I found, and how far to trust it)

| Claim | Source | Trust |
|---|---|---|
| 2025 US return rate 15.8% overall, 19.3% online, about $849.9B forecast (NRF/Happy Returns) | [Retail TouchPoints](https://www.retailtouchpoints.com/news/nrf-forecasts-nearly-850-billion-in-returns-in-2025-slight-decrease-from-2024) | High (forecast) |
| Appriss counted $706B actually returned in 2025, $131B of it buy-online-return-online | [Business Wire](https://www.businesswire.com/news/home/20260219293604/en/Appriss-Retail-Benchmark-Report-Uncovers-%24796B-in-Total-Retail-Loss) | High |
| Online apparel returns run about 20-30%. Size and fit cause roughly 50-70% of apparel returns. | [Channelwill](https://www.channelwill.com/blogs/ecommerce-return-rates), [Branvas](https://branvas.com/blogs/news/apparel-returns-fit-issue-report) | Medium (vendor blogs citing Coresight, McKinsey) |
| 71% of shoppers returned an item because it differed from the product page (Salsify 2025). Bracketing figure 58% (Narvar 2021). | [Size.ly summary](https://www.size.ly/blog/ecommerce-return-statistics) | Medium (secondary) |
| Foundation and concealer return at about 23%. 64% of beauty returns say "looked different in person". | [EightX](https://eightx.co/blog/average-beauty-and-cosmetics-return-rate-benchmarks) | Low (one vendor blog, no primary source) |
| 83% of foundation wearers would consider another shade if it matched better (Ipsos, 2016) | [Ipsos](https://www.ipsos.com/sites/default/files/news_and_polls/2016-06/Cosmetics%20Factum%20Analysis%207274.pdf) | Medium (old, primary) |
| 71% of adults do not use sunscreen daily. "Poor blending with my skin tone" is a stated reason. | [CeraVe survey via Skin Inc.](https://www.skininc.com/home/news/21860905/cerave-survey-uncovers-reasons-adults-skip-sun-protection) | Medium (brand-sponsored, 2021) |

I found no authoritative number for "wrong shade" share of foundation returns. I found none for group-purchase abandonment or for skincare overbuying. Where an idea needs those, I say so in its risks.
From operator experience (verify before pitching): opened or used makeup cannot be restocked, so a used-foundation return is a full write-off, not just a refund.

---

## Idea 1: Headroom

**Pitch:** Before you buy a serum, Headroom shows how much your skin can visibly change on the exact concerns that serum claims to fix. It tells you what to skip.

**Target user and moment:** A shopper with a $68 "pore-minimizing" serum in the cart, standing in the Sephora or Ulta app. She has bought four serums this year and cannot say which one worked.

**Real pain:**
- Skincare shoppers buy on claims ("brightens", "refines pores") without knowing whether they have that concern.
- Retailers get the cost later: low repeat rate, "didn't work for me" reviews, and returns of opened product.
- No authoritative stat found for overbuying. The CeraVe survey shows only 47% follow a daily routine, so purchase and use already diverge. Validate with a 10-question survey before pitching.

**Core mechanic:**
1. The user takes one frontal selfie (hair down, per the skin-analysis guide). The app runs `skin-analysis` with all 16 concerns on SD. It stores `raw_score` per concern. It does not use `ui_score`, because `ui_score` is the flattered number.
2. The user pastes a product URL or picks a cart item. An LLM agent extracts the claims and maps each claim to YouCam concern names (pore, wrinkle, dark_circle, and so on).
3. The app computes the **gap** per concern as `100 - raw_score`. It computes the product's **addressable gap** as the sum of gaps over the concerns the product claims.
4. For each product, the app runs `skin-simulation` with only the claimed concerns set to 1.0. This renders the best case that product could reach on this face.
5. The app diffs the simulated image against the original over the face region, with no API call. This gives a **visible change index**. A before/after slider shows the result.
6. The agent ranks the cart: "Keep", "Skip", or "Better aimed at your top two gaps". It links to products that claim those two gaps.
7. Weekly re-scan updates the gaps. A concern that drops below a threshold moves out of the shopping list.

**YouCam endpoints and why each is essential:**
- `POST /s2s/v2.1/task/skin-analysis` (+ GET): the only source of per-concern, per-region scores and masks. Without it there is no personal gap.
- `POST /s2s/v2.0/task/skin-simulation` (+ GET): the only way to show a product's best case on the user's own face. It turns an abstract score into a picture.
- `POST /s2s/v2.0/file`: standard upload.

**Unit cost per session:**
- Full session: analysis 16 (16 concerns, SD) + 2 product simulations at 4 each (1-4 concerns) = **24 units**.
- Repeat product check on a stored baseline: 4 units, or 6 if the product claims five or more concerns.
- Budget fit: about 40 full sessions.

**20-second demo aha:** Scan once. Paste two serums. Serum A's slider barely moves the face and a banner reads "Your pores are 91/100. Skip." Serum B's slider visibly clears the under-eye area and the banner reads "Targets your two lowest scores."

**Why non-obvious:**
- Most Skin AI entries output a scorecard and a routine list. Headroom outputs a **no**, backed by a picture.
- It uses the simulation endpoint as a decision tool, not a before/after toy.
- It uses the honest score, not the flattering one.

**Harsh risks:**
- The simulation shows an idealised ceiling for a concern, not a product-specific result. The UI must label it "best case if the claim is fully true". A reviewer can call it misleading.
- One selfie has noise. Lighting and angle can move a score several points. Show score bands and do not rank products within noise.
- Retailers may dislike a tool that says "skip". Pitch it as trust and repeat rate, not as fewer sales.
- Claim parsing depends on an LLM and on product pages. Offline replay needs fixtures for 6-8 products.
- Face-region diff can be dominated by colour shifts that the simulation introduces. Test it on both a flat and a textured face.

---

## Idea 2: Second Shade

**Pitch:** A returns-portal flow that turns "wrong shade" refunds into exchanges. It measures the mismatch from a selfie of the user wearing the foundation, then previews the corrected shade on the same face.

**Target user and moment:** A shopper who wore a new foundation for an hour and now sees a line at her jaw. She is on the return page, about to click "Reason: wrong shade".

**Real pain:**
- Shade mismatch is the best-known foundation failure. Ipsos found 83% of wearers would switch if a shade matched better.
- A returned used foundation cannot be restocked (operator experience). The retailer loses the margin, the product, and often the customer.
- Today the fix is a blind second guess. Shoppers pick another shade with the same information that failed the first time.
- The returns data is real but soft: 15.8% overall and 19.3% online (NRF 2025). The 23% foundation figure is unverified.

**Core mechanic:**
1. At first purchase, the app stores the bare-face tone profile from `skin-tone-analysis`: `skin_color`, `eyebrow_color`, `hair_color`, `eye_color`.
2. At return time, the user takes a selfie wearing the foundation in the same room. The app runs `skin-tone-analysis` again.
3. **Lighting correction:** brows, hair, and eyes are not changed by foundation. The app measures their shift between the two photos in Lab space. It subtracts that shift from the skin shift. This removes most of the lighting difference.
4. **Mismatch vector:** the corrected skin shift gives `ΔL`, `Δa`, `Δb`. If the total is under a small ΔE threshold, the agent says "shade is fine" and routes to the formula/finish questionnaire instead.
5. The agent picks the catalog shade closest to `current_shade_hex - mismatch`. It uses ΔE2000 over the line's shade hex list, then cross-line if none fits.
6. `makeup-vto` renders the current shade and the proposed shade on the bare-face photo with the same coverage and glow. A slider shows the difference.
7. The portal offers "Exchange for 220N, free shipping". It keeps refund as a secondary option.

**YouCam endpoints and why each is essential:**
- `POST /s2s/v2.0/task/skin-tone-analysis` (+ GET): returns hex for skin, eyebrow, hair, eye, and lip in one call. The brow and hair hex are the lighting reference. No other endpoint gives them.
- `POST /s2s/v2.0/task/makeup-vto` with the `foundation` effect: takes any `#RRGGBB`, so the proposed shade renders without a product SKU. Cost is 1 unit.
- `POST /s2s/v2.0/file`: standard upload.
- Optional validation: apply a known wrong shade with `makeup-vto`, re-run `skin-tone-analysis` on the result, and check the app recovers the right correction direction. This tests the maths on real API output with no real foundation.

**Unit cost per session:**
- Full session (bare scan + wear scan + 2 renders): 20 + 20 + 1 + 1 = **42 units**.
- Return-time only, with a stored bare profile: 20 + 1 + 1 = **22 units**.
- Budget fit: about 20 full sessions, or 40 return-only sessions. Spend a few on closed-loop validation. Use replay mode for everything else.

**20-second demo aha:** Return portal, reason "wrong shade". Selfie. The screen reads "You read 9 lighter and 4 yellower than your skin." A slider moves from the current shade to the corrected shade on the same face. One tap: "Exchange". A side card shows "Refund $38 + unsellable product vs. exchange".

**Why non-obvious:**
- Every shade tool works before purchase. This one works at the moment of failure, where the data is richest because the user holds the evidence on her face.
- It uses brow and hair hex as a lighting reference, which makes the tone endpoint do more than return a colour.
- The buyer is the returns or CX leader, not the merchandising team.

**Harsh risks:**
- No proof that `skin_color` shifts reliably when a cosmetic covers the face. Unknown without a live key. Closed-loop VTO validation reduces but does not remove this.
- Oxidation: many foundations darken within an hour. The selfie must come 30+ minutes after application. The UI must say so.
- If the user dislikes finish or formula, shade math does not help. The "shade is fine" branch must be honest, or it will trigger a second return.
- A bad exchange is worse than a refund. Keep the refund path one tap away.
- The demo shows a mock portal. Real return-system integration is out of scope; say so.
- Cost is high for the budget. Cache aggressively.

---

## Idea 3: Unanimous

**Pitch:** A group-shopping room for one garment in several colourways. Every member sees herself in each colour, a maximin solver picks the colour that works for everyone, and a lip colour rescues the member who loses.

**Target user and moment:** A bridal party, family photo, or friend group in a chat, stuck on "sage or burgundy?" for the third week. Everyone has a different skin tone and nobody wants to veto.

**Real pain:**
- Group orders stall on one dissenter. I cannot cite a stat for group-cart abandonment. It is an operator observation. Test it with a short survey or retailer interviews.
- Colour is a known cause of fashion returns. 71% of shoppers have returned something that differed from the page (Salsify 2025), and the 58% bracketing figure (Narvar 2021) includes shoppers who buy two colours to keep one.
- A single mannequin photo says nothing about how a colour reads next to your face.

**Core mechanic:**
1. The organiser pastes a product link with 3-5 colourway images, or picks from a retailer feed.
2. She shares a join link. Each member uploads one selfie. A consent screen states retention and deletion.
3. For each member the app runs `skin-tone-analysis` and gets skin, hair, eye, brow, and lip hex.
4. A transparent scoring model rates each colourway per member. It uses chroma clash with skin undertone and value contrast with hair and eyes, computed in Lab. The UI labels it "signal", not verdict.
5. The app runs `cloth-v4` with each member's selfie as `src` and the colourway image as `ref` (`garment_category: auto`). To save units it renders each member's top two colourways and the group's worst one.
6. A solver picks the colourway that maximises the **lowest** member score, with mean score as tie-break. It flags the member who would lose most.
7. For the flagged member, `makeup-vto` renders a lip (and optional blush) recolour that closes the gap. She sees the "fix" before she votes.
8. Members vote or approve. The room outputs a group cart with each member's size field.

**YouCam endpoints and why each is essential:**
- `POST /s2s/v2.0/task/cloth-v4` (+ GET): takes any garment reference image and a person photo. This makes retailer colourway images work with no per-SKU 3D asset.
- `POST /s2s/v2.0/task/skin-tone-analysis`: gives each member's colouring as data, so the group solver has numbers to compare.
- `POST /s2s/v2.0/task/makeup-vto`: the rescue step. It makes the product beauty-and-fashion rather than apparel only.
- `POST /s2s/v2.0/file`: standard upload.

**Unit cost per session** (4 members, 3 colourways):
- Per member: tone 20 + cloth 3 x 2 = 6 + rescue lip 1 = 27.
- Group of 4: **108 units**. Each extra colourway adds 8 units per group of 4.
- Budget fit: about 9 full groups. Demo uses 2 live groups, then replay.

**20-second demo aha:** Four faces tile on screen. The organiser taps three colourways and all four faces re-dress. A bar shows each person's score. One tile turns red, then a pink lip appears on her and the bar turns green. "Order all four."

**Why non-obvious:**
- Every VTO product serves one person. This serves a group decision, and the group decision is where the order stalls.
- The maximin solver is a real algorithm with a visible output, not a recommendation list.
- The rescue step ties beauty and fashion into one action.

**Harsh risks:**
- Colour-harmony scoring is contested. "Seasonal colour" systems are folk theory. The UI must show the try-on images as the evidence and the score as secondary.
- Not a daily-use product. Groups form for weddings, trips, and holiday photos. Position it as a shared-cart feature inside a retailer app, not a stand-alone app.
- Privacy: friends' faces and derived colour data. Some jurisdictions regulate face data (for example Illinois BIPA). Needs explicit consent and deletion.
- Cloth VTO fidelity varies on strapless, patterned, or sheer garments. Pick demo garments with care.
- Size fit is not solved. The group cart must say so.
- Highest unit cost per session. Replay fixtures carry most of the demo.

---

## Harsh critic: ranking

| Rank | Idea | Why |
|---|---|---|
| 1 | Headroom | Cheapest per session. Lowest technical risk: both endpoints are documented and independent of cosmetic-on-face behaviour. The slider is the best 20-second visual of the three. Fits the Skin AI prompt ("right before a purchase"). Weak spot: a simulation ceiling is not a promise. |
| 2 | Second Shade | Best retailer ROI story and the most novel use of the tone endpoint. It loses to Headroom on risk: no proof that tone analysis reads a foundation-covered face usefully, and the unit cost is 2-3x higher. Wins if the closed-loop validation works. |
| 3 | Unanimous | Strongest on "beauty plus fashion in one flow" and on emotional demo. It ranks last because the colour scoring is soft, usage is occasional, and a group of four costs 108 units. |

**Which I would bet on:** Headroom, with the Second Shade return-economics slide borrowed for the impact section. Headroom is the only idea where every claim in the demo is checkable from documented API behaviour. It is also the only one with the "no" result that most judges have not seen.
It is a Skin AI entry. If the team prefers the eCommerce VTO track, bet on Second Shade, but run the closed-loop validation first. If the validation fails, drop to Unanimous.

**Cut ideas, for the record:**
- *Cast Check* (will this SPF leave a white cast on me?): foundation effect with a pale hex to fake cast. Great for deep skin tones and daily sunscreen use. Cut because the physics is faked and I could not source a product-cast dataset.
- *Event-lighting stress test*: cut. The lighting endpoint only brightens a photo and cannot relight a scene.
- *Shade passport browser extension*: cut. It is a shade finder in a new wrapper, and YouCam already ships one.
