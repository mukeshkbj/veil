# Hackathon brief — YouCam API Skin AI & eCommerce VTO Hackathon (Devpost)

Deadline Nov 2, 2026. Prizes: $2.5k / $1k / $500, Women in Tech, Rising Star. 1,125 participants.

## Tracks
- **Skin AI**: "People don't wonder about their skin in the abstract; they wonder right before a purchase, right after a bad breakout, or right when they're standing in front of a mirror deciding whether a product is working. Build something that meets that moment. Use YouCam's Skin AI, alone or combined with other YouCam APIs, to help users understand their skin and know exactly what to do next."
- **eCommerce VTO**: "Beauty and fashion decisions rarely happen in isolation; what someone wears and how they look are part of the same self-image. Bring Virtual Try-On together into one seamless, intuitive experience."
- Sponsor wants: "fresh, unexpected solutions to real-world pain points ... not surface-level wrappers", "intuitive enough that a first-time user instantly grasps its value", "show real impact beyond a simple API call", bonus for "Agentic AI workflows".

## Judging (equal weight; tie-break in this order)
1. Technological Implementation — how thoroughly/skillfully YouCam APIs are integrated; clear consumer/eCommerce value; genuine non-trivial working code.
2. Design — complete, coherent product experience, not a tech proof of concept.
3. Potential Impact — credible, specific case for a real problem for a real audience; solution actually addresses it as demonstrated.
4. Quality of Idea — creative, non-obvious use of YouCam API; genuine understanding of the problem space.
Stage one is pass/fail: fits theme + uses API. Judges may judge only from description, screenshots, and a 1–3 min video.

## Constraints
- Web or mobile prototype; public repo; demo video.
- Free budget: 1,000 API units. Skin analysis costs 9–22 units/call; skin simulation 4–6; makeup VTO 1; clothes 2; aging 2; skin tone analysis 20; face analyzer 10–30; Fitzpatrick 10.
- All tasks are async: POST /s2s/v2.0/file → PUT to presigned URL → POST task → poll GET task/{id}. Results kept 24h. Bearer API key, server-to-server only.
- We have no API key in this session. The app must run on a live key AND on a faithful offline replay mode built from the documented response schema.

## API suite (base https://yce-api-01.makeupar.com, specs in research/openapi/)
Skin: skin-analysis v2.1 (SD 16 / HD 16 concerns: wrinkle (forehead, glabellar, crowfeet, periocular, nasolabial, marionette), pore (forehead, nose, cheek), texture, acne, oiliness, radiance, eye_bag, age_spot, dark_circle, droopy eyelids, firmness, moisture, redness, tear_trough, skin_type (whole/T/U zone: Normal, Oily, Dry, Combination, Redness...)). Output: per-concern ui_score (flattered), raw_score (1–100, higher=healthier), per-concern alpha PNG masks, overall score, skin_age.
skin-simulation (before/after visualisation of up to 10 concerns improving/worsening), skin-tone-analysis (skin tone, eye, brow, lip, hair colours), fitzpatrick-scale-analyzer (I–VI), aging simulation, face-attr-analysis (face/eye/brow/lip/nose/cheekbone shapes), face-reshape.
Beauty VTO: makeup-vto (lip, blush, foundation, eyeshadow, etc. with real product colours/textures), look-vto (expert looks), mu-transfer (copy a makeup look from a reference photo), eye-color-vto, teeth-whiten, ai-smile.
Hair: hair-color, hair-style/hair-transfer, hair-type-detection (3 angles), density, frizziness, length, volume, bangs, beard.
Fashion: cloth (v2/v3/v4, upload any garment reference), fabric, scarf, hat, bag, shoes, earrings, necklace, bracelet, ring, watch.
Photo: lighting, color-correct, background change/blur, enhance.
Also: webhooks, MCP server, "Agent skills" docs exist — sponsor is pushing agentic usage.
