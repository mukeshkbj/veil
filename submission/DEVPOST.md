# Devpost form: paste-ready fields

## Project name (60 characters max)

Veil: find the sunscreen that disappears on your skin

## Elevator pitch (200 characters max)

Swipe a sunscreen on one cheek. Veil uses your bare cheek as the control and YouCam Skin AI to measure white cast on your own face, then ranks the whole shelf for your skin.

## About the project (Markdown)

```markdown
## Inspiration
White cast stops people with brown and Black skin from wearing sunscreen. In a 2024 survey in the *Journal of Drugs in Dermatology*, 25% of skin-of-colour patients named white cast as a reason they struggle with sunscreen, against 7% of white patients. 41% said they did not know how to find a product that suits them.

Today a shopper tests a sunscreen on the back of a hand, in shop light. A product page cannot help, because a cast depends on skin colour, light and how thickly you apply. So people buy, see the cast at home, and return the product or stop wearing sunscreen.

Dermatology studies test a product on half of the face and keep the other half as the control. We put that design in a phone so it answers one question at the shelf: **will anyone see this on me?**

## What it does
1. **A bare photo.** YouCam skin analysis returns masks for spots, redness and acne, so Veil reads only clean skin. YouCam skin tone analysis returns the skin colour and its ITA depth.
2. **One swipe on one cheek.** The bare cheek is the control. It shares the light, the camera and the skin, so Veil can take the room out of the reading. If the light or the head moved since the bare photo, Veil refuses the photo and says why.
3. **The reading.** Invisible, Faint, Visible or Ghost, with the colour difference in ΔE00, its 90% range and a cast map of where the film sits. The meter is painted in the shopper's own skin colour.
4. **The shelf.** Veil predicts every product on the shopper's measured skin, scaled to how thickly they applied. When two products could both vanish, an agent asks for the one swipe that decides. YouCam makeup try-on shows any product on the whole face, next to Add to bag.
5. **Test the test.** Veil plants a white film of known strength with YouCam try-on, dims and warms the photo as a cloud would, and must find the film. A second bare photo must read Invisible.

## How we used the YouCam API
| Call | What Veil does with the result |
|---|---|
| `POST /v2.0/file` | Uploads the bare photo once. Swipes stay in the browser. |
| `POST /v2.1/task/skin-analysis` | Masks for spots, redness and acne move the cheek patches to clean skin and drop flagged pixels. Without them, a red patch reads as a colour change. |
| `POST /v2.0/task/skin-tone-analysis` | Skin colour and ITA set the meter scale and rank the shelf. |
| `POST /v2.0/task/makeup-vto` | Shows a product on the whole face, and plants the known film for the self-test. |

The report has a "What YouCam returned" panel that shows each result next to the decision it drives. A shopper pays 29 units for the bare analysis and 1 unit per try-on. Swipes are measured in the browser for free.

## How we built it
- Next.js 16, React 19, TypeScript and Tailwind 4 on Vercel. The YouCam calls run in server routes, so the key never reaches the browser.
- MediaPipe Face Landmarker gives a first alignment of the two photos. Veil then matches skin texture at both brows and the nose bridge and solves the alignment to within one or two pixels. Each cheek gets 25 tiles.
- The light correction is multiplicative in linear RGB: the bare cheek's change between photos predicts where the swiped cheek should be. The cast is the CIEDE2000 distance from that prediction. A paired bootstrap over tiles gives the 90% range.
- The verdict bands come from published colour thresholds: half of observers see a difference at about 0.8 ΔE00 (Paravina et al., 2015), and above about 5 they see two different colours (Mokrzycki and Tatol, 2011).
- A live viewfinder checks distance, centring, head turn, darkness and side light before the shutter.

## Validation
| Sample | Skin | Planted (ΔE00) | Found | No sunscreen |
|---|---|---|---|---|
| 1 | Dark | 9.7 | 9.7 | 0.1 |
| 2 | Tan | 6.9 | 6.9 | 0.2 |
| 3 | Intermediate | 5.1 | 5.0 | 0.2 |
| 4 | Light | 3.6 | 3.6 | 0.0 |

Every planted cast is found within 0.1, every bare retest reads Invisible, and a side-lit photo is refused on all four samples.

## Challenges we ran into
- Our first null test read 1.8 on a photo with no sunscreen, because the patches did not land on the same skin. Phase correlation showed the landmark fit was off by about 25 pixels, because the white film pulls the face mesh. Texture matching at the brows and nose bridge fixed it. The null test now reads 0.0 to 0.2.
- An additive light correction under-corrected dark skin in dim light. Light scales colour, so the correction is now multiplicative in linear light.
- The first planted test compared a dimmed photo with an undimmed one, so its truth included the cloud. It now measures truth in the same light as the test.

## Accomplishments that we're proud of
- A meter that says "Invisible" when nothing is there, on every sample, before we tuned anything else.
- A shelf that ranks products for one person's skin from one swipe, and knows when it needs a second.

## What we learned
A cast meter is only useful if it stays quiet on bare skin. We built the null test first.

## Honest limits
The four sample tests use licensed portraits with sunscreen painted on by a filter, and a local stand-in answers in YouCam's response shapes, labelled "Replay". The camera flow calls the real YouCam API.

## What's next
- Real swipes on real people across the Fitzpatrick range, scored against a panel asked "can you see it?".
- A retailer pilot at the counter and on the product page, where a visible cast drives returns.
```

## Built with (tags)

next.js, react, typescript, tailwindcss, youcam-api, youcam-skin-analysis, youcam-skin-tone-analysis, youcam-makeup-vto, mediapipe, gsap, lenis, vercel, node.js, hyperframes

## "Try it out" links

- https://veil-skin.vercel.app
- https://veil-skin.vercel.app/lab
- https://github.com/mukeshkbj/veil

## Image gallery (upload in this order, all 3:2, under 5 MB)

`submission/screenshots/`:
01-landing, 15-film-ghost, 06-reading-ghost, 07-cast-map, 08-refused-photo, 09-shelf-agent, 10-reading-invisible, 11-shelf-add-to-bag, 12-try-on, 13-youcam-returned, 14-test-the-test, 02-landing, 03-landing, 04-landing, 05-how-it-works

## Video demo link

Upload `submission/veil-demo.mp4` to YouTube as Public or Unlisted, then paste the YouTube URL.

## Text description (features, functionality, consumer and retail value)

Veil is a web app that tells you whether a sunscreen will leave a white cast on your own face, before you buy it.

How it works: you take a bare photo, swipe the sunscreen on one cheek, and take a second photo. The bare cheek is the control. It shares the light, the camera and the skin, so Veil can remove the room from the reading and measure only the cast. The result is a verdict (Invisible, Faint, Visible or Ghost), the colour difference in ΔE00 with a 90% range, and a cast map of where the film sits. If the light or your head moved between photos, Veil refuses the photo and says why, instead of giving a wrong answer.

YouCam does the skin work. Skin analysis returns masks for spots, redness and acne, so Veil reads only clean skin. Skin tone analysis returns the skin colour and its ITA depth, which sets the meter and ranks the shelf. Makeup try-on shows any product on the whole face, and also plants a white film of known strength so Veil can test itself: it must find the planted film, and a second bare photo must read Invisible.

From one swipe, Veil predicts every other product on the shelf for that person's skin, scaled to how thickly they applied. When two products could both vanish, an agent asks for the one extra swipe that decides. The winner goes to the bag in one tap.

Consumer value: people with brown and Black skin are three to four times more likely to name white cast as a reason they struggle with sunscreen. Veil replaces the back-of-the-hand test with a reading on your own face, so you find a sunscreen you will actually wear.

Retail value: a cast is invisible on a product page and on a pale tester arm, so it shows up as returns and abandoned products. Veil works at the counter (swipe a tester, see the shelf ranked for your skin) and on the product page (try-on and Add to bag). Only the bare photo uses API units, about 29. Swipes are measured in the browser for free.

## Code repository

https://github.com/mukeshkbj/veil

## Was there a moment where the API surprised you?

The good surprise was how much the makeup try-on could do beyond showing a product. A foundation render with smoothing turned off is a controlled, known film on a real face. That let us use it as a measuring instrument: Veil plants a white film of known strength with try-on and must find it again. That planted test became our main proof that the meter works, and it was not a use we expected when we started. The skin-analysis masks were the other good surprise. They come back as one alpha mask per concern, which is exactly the shape you need to drop flagged pixels from a colour reading.

The frustrating part was getting started without live output. Every task is asynchronous (upload a file, PUT it to a signed URL, start a task, poll), and we built most of the app before we could watch a real response. We worked from the OpenAPI specs and wrote a mock server that follows the same file and task flow, so the whole live path could be tested end to end. With hindsight, a public sandbox that returns sample responses would make the first hour of every project much faster.

## Industries or use cases nobody is talking about yet

- **Cosmetic R&D and formulation QA.** Brands test white cast on small in-person panels. The same bare-cheek control and skin-tone analysis could run a remote cast panel across hundreds of skin tones before launch.
- **Shade-range gap analysis.** Anonymised skin-tone results from shoppers show a brand which depths its range does not serve, before the reviews do.
- **Medical products in skin tones.** Bandages, wound dressings, prosthetic covers and hearing aids are now sold in skin tones. Skin-tone analysis could pick the closest match from a photo.
- **Remote split-face clinical studies.** Dermatology trials already use half-face designs. A phone flow with skin-analysis masks and a light gate could collect usable data from home.
- **Film, TV and stage makeup continuity.** Checking that a base reads the same across scenes and lighting is the same measurement Veil makes.

## Where did you hit a wall technically, and how did you work around it?

- **Alignment.** Our first test on a photo with no sunscreen read 1.8 ΔE00 instead of 0, because the cheek patches did not land on the same skin in both photos. Face landmarks were off by about 25 pixels, because a white film on one cheek pulls the face mesh. We now use the landmarks only for a first fit, then match skin texture at both brows and the nose bridge, which the sunscreen never touches. The null test now reads 0.0 to 0.2.
- **Dark skin in dim light.** An additive light correction under-corrected dark skin, so a cloud could look like a cast. Light scales colour, so we moved the correction to multiplicative, in linear RGB.
- **A self-test that lied.** Our first planted test compared a dimmed photo with an undimmed truth, so the cloud leaked into the result. It now measures the truth in the same light as the test.
- **Bad photos.** A photo lit from a new side can fake a cast. Veil checks the light balance on the forehead between photos and refuses the photo when it moved more than 6%, with the reason.
- **Building without live responses.** We wrote a mock YouCam server and replay data in the documented response shapes, plus `npm run capture`, which swaps in recorded real responses once a key is set.
