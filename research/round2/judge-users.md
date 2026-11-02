# Round 2 judge: the everyday-user panel

Panel: Priya (24, combination skin, buys new products monthly), Marcus (36, minimal routine, rosacea, hates upsell), Linda (52, melasma, distrusts apps), Aisha (19, Fitzpatrick V-VI, acne, assumes beauty tech fails on her skin), Sofia (29, shops online weekly, returns a third).

The panel asks one question: would I actually use this, how often, and would I tell a friend. I read the 15 candidate files and the Other Cheek decision. I ignored the builders' scores. I ran no code and saw no video, so every score comes from reading the description.

## Which scores are the panel's core view

Potential Impact and Design are the core scores. Impact here means real use and word of mouth. Design here means ease of first use, judged as a first-time visitor with 30 seconds.

Technological Implementation and Quality of Idea are secondary. The panel cannot read code. These two scores come from how convincing the described mechanism sounds, and they carry less weight than the other two.

## Score table

| # | Candidate | Tech | Design (first use) | Impact (panel) | Idea |
|---|---|---|---|---|---|
| 0 | Other Cheek (incumbent) | 8 | 7 | 7 | 8 |
| 1 | Neck Test | 7 | 8 | 7 | 6 |
| 2 | Gift Proof | 6 | 6 | 5 | 7 |
| 3 | Money Map | 5 | 7 | 6 | 4 |
| 4 | Seam | 8 | 7 | 7 | 7 |
| 5 | Veil | 6 | 6 | 8 | 8 |
| 6 | Translate | 7 | 7 | 6 | 6 |
| 7 | Shade Twins | 7 | 8 | 7 | 7 |
| 8 | Consult Canvas | 7 | 5 | 3 | 4 |
| 9 | Honest Hair Color | 6 | 8 | 6 | 7 |
| 10 | Mirror Forecast | 6 | 8 | 5 | 5 |
| 11 | Cover Story | 8 | 8 | 7 | 7 |
| 12 | Fit Check | 6 | 5 | 4 | 5 |
| 13 | Second Mirror | 6 | 6 | 4 | 7 |
| 14 | Still Me | 7 | 7 | 5 | 7 |
| 15 | Pre-Flight | 7 | 4 | 3 | 5 |

No candidate earns a 9 on any criterion as written. A 9 means a plausible first place out of about 150 entries, and nothing here has that yet.

## Scores with one sentence each

### 0. Other Cheek (incumbent)
- Tech 8: The midline split, the personal noise band and the planted-effect self-test are real engineering, but there is still no live API run.
- Design 7: The day-one two-sides reading is easy, but the trial asks for four weeks of discipline and two same-day captures.
- Impact 7: Marcus wants exactly this answer ("is it working?") and Sofia likes the money card, but Priya would quit by week two and Aisha doubts the lighting gate on her skin.
- Idea 8: Using the other cheek as a control group is the cleanest idea in the pile, though it is the same shape as several serum-verdict trackers.

### 1. Neck Test
- Tech 7: The closed seam loop with mask-cleaned sampling is sound, but it stands on one hero endpoint and a hex swatch that is not the real pigment.
- Design 8: One selfie, one seam and one falling number is clear in five seconds.
- Impact 7: Sofia, Priya and Aisha all hit the wrong-shade problem and would try it, but they buy foundation a few times a year, so they would not open it often.
- Idea 6: Shade finders are everywhere, and "match your neck" is advice people already know.

### 2. Gift Proof
- Tech 6: It uses many endpoints, but the real check is the recipient's tap, so the loop is a for-loop over renders.
- Design 6: It needs two people on two phones, and a solo judge cannot feel it.
- Impact 5: Sofia would use it as a giver, but Linda would never send a selfie to a stranger's link, and nobody else gifts beauty often.
- Idea 7: "Measure her, do not show her" is a fresh answer to blind gifting.

### 3. Money Map
- Tech 5: It is two endpoints and local arithmetic, and the claim parsing is a language model task that anyone can copy.
- Design 7: Dollars drawn on the face are readable in two seconds.
- Impact 6: A pre-purchase check is what this panel asked for in round 1, and Marcus would like a cart check, but the "re-aim your spend" step feels like an upsell.
- Idea 4: It is scan, score and recommend with a better chart, and many entrants will build it.

### 4. Seam
- Tech 8: Masks, tone read and a secant solver on a black-box renderer make a credible loop.
- Design 7: The seam strip is clear, but the Lab ladder and the "70% 6W plus 30% 7N" recipe need a sentence of explanation.
- Impact 7: Aisha has been "between shades" her whole life and would tell friends if it works, but a two-bottle recipe sounds like an upsell to Marcus and Sofia.
- Idea 7: Returning "no single bottle fits, mix these two" goes beyond a shade finder, though the shelf is the same.

### 5. Veil
- Tech 6: The colour maths does the real work and a developer could write it without YouCam, so the API share is small.
- Design 6: The swipe, the 30-second rub and the second selfie are real friction for a first-time user.
- Impact 8: White cast is the top sunscreen complaint for Aisha, Linda needs an iron-oxide tint for melasma, and Marcus needs a daily SPF that does not irritate, so three of five would use it and tell friends.
- Idea 8: It measures what a product does to your skin, where the cited paper says no standard method for white cast exists.

### 6. Translate
- Tech 7: Four endpoints and two metrics make a good chain, but "preserve contrast" is a hypothesis.
- Design 7: The three-up of reference, straight copy and translated explains itself.
- Impact 6: Linda and Aisha have both copied a look that came out chalky, but they would use it a few times a year at most.
- Idea 6: It is close to Round 1's Look Compiler, which also takes a reference look.

### 7. Shade Twins
- Tech 7: The verify loop is real, but the twin ranking is a nearest-neighbour search over staged creators.
- Design 8: One selfie, three twins and one cart is easy to grasp.
- Impact 7: Priya and Aisha would love "someone who has my face", and Sofia shops from creator links, but the creator pool is staged and the use depends on creators posting.
- Idea 7: A lookalike creator as social proof is fresh, though it ends in a shade finder.

### 8. Consult Canvas
- Tech 7: Three Skin AI calls, a budget optimiser and a guard loop are solid.
- Design 5: It is a clinic tablet, and none of the panel would ever see the screen.
- Impact 3: Nobody on the panel sits in a consult chair more than once a year, and Linda would distrust a simulated result.
- Idea 4: Consult visualisers already exist and Perfect Corp already sells into them.

### 9. Honest Hair Color
- Tech 6: The decision step is a rule table, and a hair level read from a selfie is weak.
- Design 8: The triptych and the level ruler read in three seconds.
- Impact 6: Linda would trust a tool that admits a box cannot lift her colour in one step, and Sofia returns box dye, but Marcus and Aisha would not use it.
- Idea 7: A try-on that knows what is possible is a sharp idea, but Garnier already runs a quiz like it.

### 10. Mirror Forecast
- Tech 6: The weather layer is trivial and the card is scan, score and recommend.
- Design 8: The card is clear and works as a share image.
- Impact 5: Marcus keeps a minimal routine and skin barely changes day to day, so most mornings the card would say the same thing and Priya would drop it by day nine.
- Idea 5: "Weather for your face" is a sharp phrase on top of an unproven insight.

### 11. Cover Story
- Tech 8: Lesion list, per-spot decision, masked compositing and re-analysis form a loop a customer would not build in an afternoon.
- Design 8: Ringed spots with Cover, Leave and Treat chips plus a slider are readable in two seconds, but a ring on every spot is a magnified-flaw risk and needs a hide toggle.
- Impact 7: Priya, Aisha and Sofia all know the "breakout before a big day" panic and would share it, and Marcus can use it for redness, but the use depends on breakouts and Linda would skip it.
- Idea 7: Treating each blemish as a decision with a verified outcome is better than "analyse, then recommend", though it reads as a very good makeup feature.

### 12. Fit Check
- Tech 6: The engine is colour distance and a rotation count.
- Design 5: Eight garment photos of homework before the first payoff is a bad first use.
- Impact 4: Sofia might try it, but the panel would not do the setup, and fit causes most clothing returns, which this does not touch.
- Idea 5: Outfit planners are a crowded category.

### 13. Second Mirror
- Tech 6: The verify step is local maths, and no API call sits in the loop.
- Design 6: The caption stage is clear, but the product is a voice and a judge cannot hear it in a screenshot.
- Impact 4: Nobody on the panel is blind, so the panel would not use it, although they would call it kind.
- Idea 7: Accessibility is rare in this pile, but Estée Lauder shipped a voice makeup assistant in 2023.

### 14. Still Me
- Tech 7: The spend policy that gates paid calls with a free local reading is a real agent behaviour.
- Design 7: The brow rebuild and the swatch strip are strong frames, and the subject is heavy for a first-time user.
- Impact 5: Nobody on the panel is in treatment, Linda might know someone who is, and the shade-drift claim has no study behind it.
- Idea 7: The pairing of tone tracking with restoration is rare, but the drift hypothesis may fail.

### 15. Pre-Flight
- Tech 7: It reuses the Other Cheek engine well.
- Design 4: A graded form and a one-page sheet is an enterprise screen with no emotional beat.
- Impact 3: The buyer is a clinic, and the panel would see it as a better photo upload.
- Idea 5: It is photo quality control for telehealth, which is sensible and not surprising.

## Top 3

1. **Veil, rebuilt on the Other Cheek split-face engine.** It is the only candidate that serves a measured, unmet need for three of five panel members, and almost no other entrant will build it. As written it has weak Design and Tech, and the merge below fixes both.
2. **Cover Story.** It is the strongest as-written demo: a breakout, a decision per spot and a shareable slider. If the Veil lighting test fails, Cover Story moves to first.
3. **Neck Test with Seam's blend step.** Sofia, Priya and Aisha all feel the wrong-shade pain. The two ideas share one seam-measuring loop, so one build covers both. This pick comes third because the category is crowded.

Other Cheek alone ranks fourth for this panel. A four-week commitment is the weak point, and the Veil merge keeps its engine and removes the wait.

## Top 1: what lifts Veil to 9+ on each criterion

**The merge.** Put the product on one cheek and use the other cheek as the control, in one photo. This removes the main Veil risk: lighting drift between a bare selfie and a swiped selfie. It also cuts the flow to one selfie, one swipe and one verdict. The day-one two-sides reading from Other Cheek gives the baseline difference between the two cheeks, so the app subtracts it.

**Technological Implementation (6 to 9).**
- Reuse the midline split, the lighting-balance gate and the noise band from Other Cheek, and compute the published white cast score on the swiped cheek against the control cheek.
- Run the planted-effect self-test: use `makeup-vto` foundation with a known pale hex and coverage on one cheek, and show that the meter recovers it, and that a planted null gives no reading.
- Use `skin-analysis` masks to pick clean patches away from acne and age spots, `fitzpatrick-scale-analyzer` to set the depth bucket, and `skin-tone-analysis` as an independent cross-check, with a stated rule for when each paid call runs.
- Show the meter result against a constructed ladder of known veil strengths, and state the noise band in the output.

**Design (6 to 9).**
- Cut it to one selfie. Draw a fixed line of product on a fingertip as a dose guide, so the swipe is repeatable.
- Show one verdict word (Invisible, Faint, Visible, Ghost) on the split-cheek photo, with an amplified difference map beside it.
- Make the first screen a deep-skin face, show one rejected photo with a plain reason, and show the result in under 15 seconds of video.

**Potential Impact (8 to 9).**
- Add real data: swipe at least six volunteers across Fitzpatrick IV to VI with two or three products each, and show the test-retest spread.
- Give the result a second life: every swipe adds to a per-product, per-skin-depth cast record, which a retailer can show on a product page.
- Add a reason to return. A new product needs a new swipe, and a season change needs a re-check.
- Keep the health wording to "iron oxide tint" and stop there.

**Quality of Idea (8 to 9).**
- Frame it as "a sunscreen you can see before you buy it", and put the cited gap on screen: no standard method for white cast exists.
- The control cheek turns a hard colour problem into a lighting-proof one. That is the sharp line to say in the first 15 seconds.

## Ideas many other entrants will likely also build

- **Other Cheek and any serum-verdict tracker.** The contrarian file counts six or more of these.
- **Neck Test, Seam, Shade Twins.** Shade finders are the most crowded category, and Perfect Corp already ships one.
- **Money Map and Mirror Forecast.** Both are scan, score and recommend with a card or a chart.
- **Cover Story.** Acne detection with a concealer render is a likely common entry, though the per-spot decision and verify loop set it apart.
- **Fit Check, Honest Hair Color, Consult Canvas.** Outfit planners, hair try-ons and clinic visualisers are all existing categories.
- **Least crowded:** Veil, Still Me, Second Mirror, Pre-Flight and Gift Proof.

## Limits of this review

- The panel judged from the written descriptions. It did not see any demo.
- Panel members cannot judge whether the YouCam masks work on deep skin. Aisha's doubt applies to every candidate until a live test shows otherwise.
- The Veil recommendation depends on one untested assumption: the cheek-to-cheek difference is stable enough to subtract. A 21-unit test, similar to the builder's own, would check it.
