# SPEC: Veil launch film, "The other cheek"

> This is the planning spec. The final cut (v8) changed some shots. The shot list as built is in the repo's SUBMISSION.md, and the review is in REVIEW.md.

GOAL: A judge feels the small humiliation of a visible cast in the first 3 s, understands in one look that Veil measures it on your own face, and ends on a woman with nothing on her skin that anyone can see.

OUTPUT: HyperFrames, 1920 x 1080, 30 fps.

TIME: 36.0 s x 30 = 1080 frames. Score at 84 BPM, one beat = 0.714 s = 21.4 frames, one bar = 2.857 s. A low tense pulse runs 0 to 8.4 s (not sad piano). It thins from 8.4 to 10.2 s. The lift bed enters at 10.2 s on the name.

LOOK
- Two grounds. Footage, full-bleed, for the human half. Daylight white #FFFFFF for the product half. The end card is her skin colour. No dark void: the film never sits on black.
- Ink #0D0D0C. Soft ink #6B6A66. Hairline #E7E6E2.
- One accent: Sun #FFB21A. It is the midline, the active row and the strike. It never colours text and never appears twice in one frame.
- The skin colour of the person on screen is the second colour. Meter fills and swatches use it, sampled from the frame (hex in SHOTS).
- Type: Host Grotesk (assets/fonts), one family. Display 600 at 96 px (8.9%), tracking -3%. Line 600 at 64 px (5.9%), tracking -2%. Label 500 at 30 px (2.8%), tracking 0. Sentence case only. No serif, no italic, no monospace, no all-caps labels.
- Footage grade: through `npx hyperframes media-treatment`, warm lift, 0 vignette, 2% grain only on footage.
- Depth on the white ground: one shadow, 0 0 0 1px rgba(13,13,12,.06), 0 24px 48px -16px rgba(13,13,12,.18). Radius 28 px on panels, 999 px on the handle only.

OBJECTS
- The cheek: real skin, macro, with real white cream on it (Pexels 5891044).
- The Veil report, rebuilt from the app at 1.8x: the portrait with the slanted midline (Sun, 6 px) and its round handle, the Bare and Swiped labels, the 25-tile grid per cheek, the verdict card (number, word, meter in skin colour), the shelf rows.
- The mark: a circle split by the slanted midline, the left half filled with skin colour.

MOTION
- Enter: expo.out, 14 to 18 frames. Move and camera: power2.inOut, 15 to 18 frames, with 6 to 10 px motion blur on the fastest third. Exit: power3.in, 9 to 12 frames, half the distance of the entrance.
- Text is revealed by a mask that wipes left to right, one line at a time, 12 frames per line, 4-frame stagger. Text never moves while read. No fade-up.
- Counters: power2.out, 27 frames, tabular figures.
- One hero move per shot. Secondary moves travel 60% as far and start 4 frames later.

SHOTS
1. 0 to 39 (0.00 to 1.30 s). Pexels 5891044 from 5.0 s: a white cream streak across a dark cheek, the finger leaving frame. Push 1.00 to 1.05. At frame 8 the question wipes in at the bottom left, 72 px, white: "Will anyone see this on me?" Sound: wet cream foley, one low tick when the line lands. Hard cut.
2. 39 to 78 (1.30 to 2.60 s). 5891044 from 17.6 s: rubbed in, and a grey film stays. The question holds at the same place (type still, picture moves). Hard cut.
3. 78 to 108 (2.60 to 3.60 s). Pexels 7198952 from 2.0 s, white patches seen in a mirror. The question is replaced by "Usually, yes." at the same baseline. Hard cut.
4. 108 to 135 (3.60 to 4.50 s). Pexels 7467138 from 0.4 s, white patches on both cheeks. Line holds. Hard cut.
5. 135 to 162 (4.50 to 5.40 s). Pexels 7198957 from 7.0 s, monochrome, eyes closed, white smear under the eye. "So people skip it." At frame 150 the smear grows into a white circle that fills the frame in 12 frames (power2.inOut). The cast becomes the white ground. Sound: an air swell.
6. 162 to 252 (5.40 to 8.40 s). White. "25%" at 230 px over a bar in deep skin colour #5A3A2B that grows to 62% of frame width; "7%" at 120 px over a bar in light skin colour #E1B9A0 to 17%. Line at 34 px: "of skin-of-colour patients name white cast as a reason they struggle with sunscreen. 7% of white patients do." Source at 22 px: "J Drugs Dermatol, 2024". Counters, 27 frames. Sound: two soft pops as each bar lands.
7. 252 to 306 (8.40 to 10.20 s). The bars retract (9 frames, power3.in). The bed thins. "Your other cheek can tell you." at 96 px, ink, left at x = 160, wipes in at frame 258. Hold.
8. 306 to 342 (10.20 to 11.40 s). The Sun midline drops through the line at a 6 degree slant (15 frames); the words part on it and slide out. "Veil" and the mark land on the line. The lift bed's first downbeat at 10.2 s, low thump.
9. 342 to 468 (11.40 to 15.60 s). The line widens into the Veil report. Sample 1's portrait at 1.8x, full frame height. The midline sweeps right to left across the face (24 frames, power2.inOut): right of it the bare photo, left of it the swiped photo. 25 tiles per cheek, 2-frame stagger. Labels "Bare" and "Swiped" at 30 px. Sound: five soft ticks, one per tile row.
10. 468 to 576 (15.60 to 19.20 s). Camera to the verdict card at 1.8x (18 frames). The number counts 0.0 to 8.4 ΔE00 (27 frames). The meter fills from her skin colour #504944 toward cast grey #B9B4AE. The bed drops out for 15 frames, then "Ghost." lands at 110 px on one low hit at frame 515. Line: "Anyone would see it." Hold.
11. 576 to 666 (19.20 to 22.20 s). The verdict card morphs into the shelf (15 frames). Five rows re-rank once (15 frames). The top row "Clearweight Gel 40" with 0.7 and "Invisible" takes the Sun bar. Line: "Then it ranks the shelf for her skin." Sound: one card slide.
12. 666 to 744 (22.20 to 24.80 s). "It tests itself on every skin." The four samples cut under a fixed number at 160 px: planted casts found at 9.7, 6.9, 5.0, 3.6 (the app's sweep table), shot lengths 24, 20, 16, 12 frames, the number rewriting in place on each cut. Each shot carries a skin swatch in that sample's tone. Sound: one pop per cut, two takes alternating.
13. 744 to 870 (24.80 to 29.00 s). Back to sample 1 with Clearweight Gel 40 (swiped2). The midline sweeps across her face again and nothing changes on either side. "0.7" and "Invisible." land at 110 px. Hold 2 s on her face. Sound: the lift bed opens fully.
14. 870 to 990 (29.00 to 33.00 s). Pexels 10043022: a woman in sunlight closes her eyes and lifts her face. Line at 72 px: "Find the sunscreen that disappears on you."
15. 990 to 1080 (33.00 to 36.00 s). Full frame in deep skin colour #5A3A2B. The Sun midline draws down; the mark's circle closes around it; "Veil" wipes in at 140 px, white. Under it at 34 px: "veil-skin.vercel.app" and "Built on YouCam skin analysis, skin tone and makeup try-on". Hold 54 frames. The music ends on a bar line with a 0.6 s fade; tail under 1.2 s.

BANNED
- Every default in the HyperFrames spec list, by name: dark void, glow, gradients, glass, cream ground with serif italic, mono caps, pill chips, centred everything, fade-and-slide-up, moving text, corner labels, three cards in a row, logo in a corner.
- Measurement readings on stock faces. Only the app sample carries a ΔE number. Stock faces carry only their sampled skin colour.
- Any claim of a real person, real swipe or real YouCam response in this film.
- Light skin as the default face.
- Gold particles, perfume language, sad piano under a slow zoom on a wince.
- The word Invisible without its number beside it.
- The same sound on two consecutive cuts.

QA
- Frame 15: the cream streak and the question, both read in under 1 s.
- Frame 60: rubbed-in grey film, the question at the same place.
- Frame 200: 25% and its bar read in under 1 s.
- Frame 290: the cheek line alone on white.
- Frame 330: name and midline, nothing else.
- Frame 420: two cheeks, midline, tiles; a stranger can tell which side has sunscreen.
- Frame 540: "Ghost.", 8.4 and the skin-coloured meter.
- Frame 640: shelf, top row Invisible with 0.7.
- Frame 720: a sample face with its found number, number at the same place as the cut before.
- Frame 830: sample 1, both sides the same, "Invisible." with 0.7.
- Frame 960: the claim on the release shot.
- Frame 1060: end card on skin colour.

SOURCES
- Footage: Pexels videos 5891044, 7198952, 7467138, 7198957, 10043022 (Pexels license; credits in the end note of README).
- Portraits: Veil samples 1 to 4 (Ferdinand Reus CC BY-SA 2.0, Heath Cajandig CC BY 2.0, Alberto Buscató Vázquez CC BY-SA 4.0, Christopher Harris CC0).
- Score: original, MusicGen small, generated locally. SFX: earshot.
