# Decision: Other Cheek

"Turn the other cheek into a control group."

## Why this idea
- 4 of 5 builder personas proposed some form of "is this product working?" with a personal noise floor.
- 3 of 4 judge panels (veteran, tech + design, and the split-face scores from the sponsor) put Lopsided and The Other Cheek in their top 3, and each proposed the same hybrid: a day-1 two-sides reading, then a split-face product trial with planted-effect validation.
- The user panel ranked Headroom (pre-purchase check) and Receipts (keep or cancel verdict) highest for real use. Both fold into the hybrid as the entry point and the exit point.
- The sponsor judge preferred eCommerce VTO ideas and warned against calling `ui_score` flattered in the pitch. We use `raw_score` silently, frame YouCam as a measurement-grade instrument, and add a pre-purchase check plus a refill decision for retail value.

## The product in one paragraph
A shopper is about to buy, or has just bought, a skincare product. Other Cheek reads their two face halves from one selfie, checks whether the product's claims target anything they actually have (headroom), and previews the claimed effect on one half only. If they buy, the app runs a four-week split-face trial: the product goes on one side, and the other side is the control in the same photo, so light, sleep, season and hormones cancel out. Every check-in measures the gap between the halves against the user's own noise floor. The verdict is one of: real effect, nothing detectable, or too early to tell. The verdict ends in a keep or cancel decision with the money at stake.

## Acts
1. Two sides (day 1 value): capture with lighting-balance and pose gates, midline split, per-concern side loads, the mirror-twin moment.
2. Headroom (cart moment): product claims mapped to concerns, raw headroom per concern, skin-simulation preview of the claim on one half.
3. Trial (weeks 1–4): treated side assigned, two same-day captures for the noise floor, weekly check-ins, tension-line verdict, money card.
4. Prove it (instrument check): planted effect via skin-simulation composited on one half must be detected; planted null must not.
5. Trial runner agent: deterministic policy that gates captures, retries documented engine errors, spends units only when uncertainty is high, and stops when the evidence is decisive. It writes its decisions to a visible lab notebook.

## Rules
- All math on `raw_score` and mask pixels. No 0–100 score shown to the user.
- No "worse side", no red-for-bad. Use "carries more".
- Every replay or constructed data set is labelled on screen.
- Results are "consistent with", never diagnosis.

## Visual direction (starting point, refine in build)
Specimen slide: bone white, glass grey, ink; one vermillion accent marks the treated side only. Light grotesk UI with tabular figures, italic serif for verdict words. Signature moment: the tension line, a ribbon between the two sides that snaps taut when the gap clears the noise band.

## De-risk with the first live units (needs a key)
1. Mask format and whether bilateral concerns return one mask.
2. Test-retest noise of `raw_score` and mask load.
3. Whether analysis detects a simulation composited on one half.
