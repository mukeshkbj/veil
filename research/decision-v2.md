# Decision v2: Other Cheek, a control group for sunscreen

Round 2 (research/round2/) replaced the four-week serum trial. Three of four judges picked the same merge: Veil (inclusion.md) on the Other Cheek split-face engine. The sponsor judge scored the old trial 4 on impact because its best outcome was "buy less".

## The product
Swipe one sunscreen on one cheek. Take one photo. The bare cheek in the same photo is the control, so light and camera changes cancel. Other Cheek measures the white cast the way a lab does, says Invisible, Faint, Visible or Ghost, predicts the cast of every other sunscreen on the shelf for your skin, and picks the one swipe that would settle a close call. You buy the one that disappears.

## Why it scores
- Impact: 25% of skin-of-color respondents cite white cast as a sunscreen barrier, against 7% (J Drugs Dermatol 2024). 61% of Black respondents never wear sunscreen (Consumer Reports 2020). Cast makes people under-apply. Pro-conversion for brands: a sunscreen you will wear. New data for brands: cast by skin depth for their own SKUs; a 2025 paper says no standard cast method exists.
- Tech: skin analysis picks clean patches away from marks; skin tone analysis gives depth and quality flags; makeup try-on previews tinted picks and plants a known cast for the self-test; our colour pipeline (CIELAB, ΔE00, difference-in-differences, bootstrap interval, ITA° depth) and a next-swipe agent.
- Design: one split-cheek photo with a cast meter painted in the user's own skin.
- Idea: a try-on stack used to measure what a product does to you, not what it adds.

## Method
- Bare photo and swiped photo. Cheek patches located from face landmarks, placed away from marks found by skin analysis.
- Expected swiped colour = bare treated + (swiped control − bare control). Cast = ΔE00(expected, swiped treated). Also ΔL*, chroma loss, white cast score ΔL*/(100 − L*bare) (PLoS One 2025).
- Interval from a seeded bootstrap over patch tiles. Verdict bands on ΔE00: Invisible < 1.5, Faint < 3, Visible < 6, Ghost ≥ 6.
- Gate before any unit: forehead light balance and head turn compared with the bare photo.
- Depth band from ITA° of the bare cheek.

## Self-test
- Planted: a known cast rendered on one cheek must be found at the right size.
- Null: a second bare photo must read Invisible.

## Honesty rules
- Replay samples use a filter-made cast and say so on screen.
- Patterns, not medical advice. No beauty score.
