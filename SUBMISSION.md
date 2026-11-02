# Veil: Devpost submission

## Tagline
Find the sunscreen that disappears on your skin.

## Links
- Demo video (2:44): `submission/veil-demo.mp4`. It opens with the 36 s launch film (`launch/film/renders/final.mp4`). Upload it to YouTube and paste the link in the Devpost video field.
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

## Launch film (36 s)

The film tells one person's question and answers it with the product. It is a HyperFrames composition in `launch/film`. Rebuild it with `npx hyperframes@0.8.186 render -o renders/final.mp4` from that folder.

| Time | Picture | Words on screen | Sound |
| --- | --- | --- | --- |
| 0.0 to 2.6 | Macro of a dark cheek with a white streak of cream, then the cream rubbed in and still grey. | Will anyone see this on me? | The score plays muffled, as if through a wall. A cloth swipe. |
| 2.6 to 5.4 | Three panels: a woman with white under her eyes in a mirror, a man with a visible white cast, a woman in monochrome with cream under her eye. A white circle fills the frame. | Usually, yes. So people skip it. | Three swishes, one for each panel. An air swell. |
| 5.4 to 8.4 | Two bars, painted in deep and light skin colours. | 25% of skin-of-colour patients name white cast as a sunscreen problem. 7% of white patients do. Journal of Drugs in Dermatology, 2024. | Two soft pops as the numbers land. |
| 8.4 to 11.4 | The line splits in two along a slanted Sun line. The line turns upright and becomes the Veil mark. | Your other cheek can tell you. Veil | The score opens up: the turn. |
| 11.4 to 14.4 | The real Veil camera screen on a phone: the oval goes from dashed to solid, the shutter flashes, the camera flies into the screen. | Snap your bare face. Swipe one cheek. | A glass tick, a shutter, a whoosh. |
| 14.4 to 17.8 | A woman's portrait, held whole. A Sun line sweeps across and reveals the swiped half. Rings mark the two cheek patches. | Sample test. Her bare cheek is the control. | A glide, two ticks. The score drops out. |
| 17.8 to 20.6 | Full frame: two fields in her expected and measured cheek colours, split by the Sun line. | Where her cheek should be. Where it is. Bare Zinc 50, right cheek. 8.4 ΔE00. Ghost. Anyone would see it. | A sub drop on the cut. |
| 20.6 to 24.6 | A full-width ranked list in large type. The rows come in worst first, then re-sort so the best product is on top, marked by the Sun line. | Then it ranks the shelf for her skin. Clearweight Gel 40, 1.1, Invisible. Daylight Mineral 30, 5.5, Visible. Bare Zinc 50, 8.4, Ghost. | Taps as the rows land, a pop on the re-sort. |
| 24.6 to 28.6 | One more swipe. Then the two fields again, now almost the same colour. Only the Sun line tells them apart. | One more swipe. Clearweight Gel 40. 0.7 ΔE00. Invisible. Nobody would see it. | The score stops. One soft hit, a shimmer, silence. |
| 28.6 to 31.6 | A woman checks her cheek in a mirror, touches it and smiles. | None | Piano notes enter. |
| 31.6 to 33.8 | Sunlit skin outdoors, with no visible cast. | Find the sunscreen that disappears on you. | An air swell and a soft tap. |
| 33.8 to 36.0 | The lockup on deep skin brown. | Veil. veil-skin.vercel.app. Built on the YouCam API. | A soft bloom on the logo. |

The colour fields use the app's own numbers for sample 1. The expected and measured cheek colours are #463b33 and #5d544d for Bare Zinc 50, and #4a423b and #4c433d for Clearweight Gel 40. The phone shots are screenshots of `/lab/live` running against the mock YouCam server with a camera feed made from the sample portrait.

### Demo walkthrough (2 min, optional)

Use this when a judge wants the product shown end to end with a voice.

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

## Film credits

- Footage from Pexels, under the Pexels license. These clips show people putting on skincare. They illustrate the story and are not Veil measurements.
  - [Close-up of a person applying cream on the face](https://www.pexels.com/video/close-up-video-of-a-person-applying-cream-on-face-5891044/) (5891044)
  - [Woman applying under-eye masks](https://www.pexels.com/video/woman-applying-under-eye-masks-7198952/) (7198952)
  - [A man applying a skincare product on his face](https://www.pexels.com/video/a-man-applying-a-skincare-product-on-his-face-7614213/) (7614213)
  - [A woman applying cream below her eye](https://www.pexels.com/video/a-woman-applying-cream-below-her-eye-7198957/) (7198957)
  - [A woman applying makeup and fixing her hair in front of the mirror](https://www.pexels.com/video/a-woman-applying-makeup-and-fixing-her-hair-in-front-of-the-mirror-12322718/) (12322718)
  - [Sunlit skin outdoors](https://www.pexels.com/video/7298140/) (7298140)
- The portrait in the report is Ferdinand Reus, [Elderly Gambian woman face portrait](https://commons.wikimedia.org/wiki/File:Elderly_Gambian_woman_face_portrait.jpg), CC BY-SA 2.0, with sunscreen painted on by a filter.
- Music generated with MusicGen (facebook/musicgen-small).
- Sound effects rendered with [earshot](https://github.com/Leonxlnx/earshot).
- Type: Host Grotesk.
