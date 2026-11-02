# Devpost submission: Veil

## Tagline
Find the sunscreen that disappears on your skin.

## Links
- Live: https://veil-skin.vercel.app (the sample tests run in any browser, with no key and no camera)
- Sample tests: https://veil-skin.vercel.app/lab
- Camera flow: https://veil-skin.vercel.app/lab/live (it needs a YouCam key on the server)

## Inspiration
White cast stops people with brown and Black skin from using sunscreen. In a 2024 survey in the Journal of Drugs in Dermatology, 25% of skin-of-colour patients named white cast as a barrier, against 7% of white patients. 41% said they did not know how to find a product that suits them, against 22%. The survey had 150 people at one hospital, so it is a signal, not a census.

Today a shopper tests a sunscreen on the back of a hand, in shop light. A product page cannot help, because a cast depends on skin colour, light and how much you apply. So shoppers buy, see the cast at home, and return the product or stop using it.

Dermatology studies test a product on half of the face and keep the other half as the control. Veil puts that design in a phone and answers one question: will anyone see this on me?

## What it does
1. **A bare photo.** YouCam skin analysis returns masks for spots, redness and acne. YouCam skin tone analysis returns the skin colour.
2. **One swipe on one cheek.** The bare cheek is the control. If the light or the head moved since the bare photo, a gate refuses the photo and says why.
3. **The reading.** Invisible, Faint, Visible or Ghost. Veil shows the colour difference in ΔE00 with its 90% range, and a cast map of where the film sits. The meter is painted in the shopper's own skin colour.
4. **The shelf.** Veil predicts every product on the shopper's skin and scales each prediction to how thickly they applied. When two products could both vanish, an agent asks for the one swipe that decides. YouCam makeup try-on shows any product on the whole face, with an Add to bag button.
5. **Test the test.** Veil plants a white film of known strength with YouCam try-on, dims and warms the photo as a cloud would, and must find the film. A second bare photo must read Invisible.

## Why YouCam is load-bearing
The report has a "What YouCam returned" panel that shows each result and the decision it drives:

| Call | Result | What Veil does with it |
|---|---|---|
| `POST /v2.0/file` | A file id | Uploads the bare photo once. Swipes stay in the browser. |
| `POST /v2.1/task/skin-analysis` | Masks for spots, redness and acne | Moves the cheek patches to clean skin and drops flagged pixels from the reading. Without the masks, a red patch reads as a colour change. |
| `POST /v2.0/task/skin-tone-analysis` | Skin colour | Sets the depth (ITA), paints the meter and ranks the shelf. |
| `POST /v2.0/task/makeup-vto` | A foundation render | Shows a product on the face, and supplies the planted film for the self-test. |

A shopper pays 29 units for the bare analysis and 1 unit for each try-on. Swipes are measured in the browser for free, so three products cost about the same as one analysis.

## Validation
The planted cast and the bare retest run on each of the four samples:

| Sample | Skin | Planted (ΔE00) | Found | No sunscreen |
|---|---|---|---|---|
| 1 | Dark | 9.7 | 9.7 | 0.1 |
| 2 | Tan | 6.9 | 6.9 | 0.2 |
| 3 | Intermediate | 5.1 | 5.0 | 0.2 |
| 4 | Light | 3.6 | 3.6 | 0.0 |

Every planted cast is found within 0.1, and every bare retest reads Invisible. The side-lit photo is refused on all four samples (11% to 14% light shift, limit 6%).

The verdict bands come from published colour thresholds. Half of observers see a difference at about 0.8 ΔE00 and half reject it at 1.8 (Paravina et al., 2015), so Invisible ends at 1.5 and Faint at 3. Above about 5, observers see two different colours (Mokrzycki and Tatol, 2011), so Ghost starts at 6. The CIEDE2000 code passes the Sharma, Wu and Dalal reference pairs.

## Honest limits
- The four samples are licensed portraits. The sunscreen on them is painted by a filter, not real sunscreen.
- In the sample tests, a local stand-in answers in the same shapes as the YouCam API. The panel says "Replay" when that is the case. The camera flow calls the real API when a key is set.
- No real swipes on real people are in this submission yet. Validation across the Fitzpatrick range, against a panel asked "can you see it?", is the next step.

## The retail use case
The global suncare market is about $13.9 billion in 2025 (Global Market Insights). Veil fits two places in a retailer's flow:
- **At the counter.** A shopper swipes a tester, takes a photo, and sees the shelf ranked for their skin.
- **On the product page.** A shopper who tried one sunscreen gets a prediction for every other product, with a try-on and Add to bag.

Both cut the returns and the abandonment that a visible cast causes, for the shoppers that most products fail.

## How we built it
- Next.js 16, React 19, Tailwind 4, MediaPipe Face Landmarker, GSAP and Lenis. Hosted on Vercel.
- The YouCam calls run in server routes. The key never reaches the browser. Images come back through a signed proxy with a size cap and a timeout.
- MediaPipe landmarks give a first alignment. Veil then matches skin texture at both brows and the nose bridge, and solves the alignment from those points to within one or two pixels. Each cheek gets 25 tiles.
- The light correction is multiplicative in linear RGB: the change in the bare cheek between photos predicts the expected colour of the swiped cheek. The cast is the CIEDE2000 distance from that prediction. A paired bootstrap over tiles gives the 90% range.
- A live viewfinder checks distance, centring, head turn, darkness and side light before the shutter.

## Challenges
- Our first null test read 1.8 on a photo with no sunscreen, because the patches did not land on the same skin. A fit on all 478 landmarks brought it to 1.1. Phase correlation then showed the fit was still off by about 25 pixels, because the white film pulls the face mesh. Texture matching at the brows and nose bridge fixed it. The null test now reads 0.0 to 0.2.
- An additive light correction under-corrected dark skin in dim light. Light scales colour, so the correction is now multiplicative in linear light.
- The first planted test compared a dimmed photo with an undimmed one, so its truth included the cloud. It now measures truth in the same light as the test.

## What we learned
A meter is only useful if it says "Invisible" when nothing is there. We built the null test before we tuned anything else.

## What's next
- Real swipes on real people across the Fitzpatrick range, scored against a human panel.
- A retailer pilot at the counter.

## Built with
nextjs, react, typescript, tailwindcss, mediapipe, gsap, vercel, youcam-api

## Sources
- Sunscreen Practices and Preferences of Skin of Color Patients, J Drugs Dermatol, 2024: https://jddonline.com/articles/sunscreen-practices-and-preferences-of-skin-of-color-patients-S1545961624P0456X/
- Paravina RD et al., Color difference thresholds in dentistry, J Esthet Restor Dent, 2015.
- Mokrzycki WS, Tatol M, Colour difference ΔE: a survey, Machine Graphics and Vision, 2011.
- Sharma G, Wu W, Dalal EN, The CIEDE2000 color-difference formula, Color Research and Application, 2005.
- Global Market Insights, Suncare Products Market: https://www.gminsights.com/industry-analysis/suncare-products-market

---

# Demo video script (2 min)

| Time | Picture | Voice |
| --- | --- | --- |
| 0:00 | Landing hero. The midline sweeps across the face and the Ghost card rises. | "This sunscreen says sheer. On her, it is a grey mask." |
| 0:10 | The four faces. | "Same tube, four faces. A swatch on a hand shows none of this." |
| 0:18 | The 25% versus 7% bars. | "One in four skin-of-colour patients name white cast as a reason they skip sunscreen." |
| 0:28 | /lab, Sample 1. Bare, Swiped, Cast map. | "Veil compares the swiped cheek with the bare one, so the room light cancels." |
| 0:42 | The reading, then "See it" on the refused photo. | "Ghost, 8.4. A photo lit from one side is refused before it is measured." |
| 0:55 | What YouCam returned: masks, tone, try-on, calls. | "YouCam finds the spots to avoid, reads the skin tone and renders the try-on." |
| 1:10 | Shelf. Tap a product to try it on. | "Then Veil ranks the shelf on her skin." |
| 1:25 | Test the test and the four-sample table. | "Veil plants a known film and must find it. A bare retest must read Invisible." |
| 1:40 | /lab/live viewfinder. | "On a phone, the viewfinder checks the light before the shot." |
| 1:52 | Landing closing block. | "Your next sunscreen should vanish." |
