# Gauntlet: Veil against the round-one winners

Live progress page for the gauntlet loop. Newest round first.

## Bar

The round-two gallery is not published, so the bar is round one of the same sponsor's hackathon (youcam-api.devpost.com, 238 entries):

- Aloud, 1st place: https://devpost.com/software/aloud-lxqr70
- ShadeSpan, 2nd place: https://devpost.com/software/shadespan
- CASTING, 3rd to 5th place: https://devpost.com/software/casting

Their pages and screenshots are saved in `research/bar/`. The blind packets are in `research/bar/blind/` (A, B, C, D, with the key held back from critics).

Criteria (equal weight, tie-break in this order): Technological Implementation, Design, Potential Impact, Quality of Idea. Judges may score from the description, screenshots and video alone.

## What the winners have that Veil does not (found before round 1)

- A public live URL. All three are deployed (Vercel or GitHub Pages).
- A demo video. All three have one.
- Real API runs. Aloud pins fixtures captured from real calls, and tested 10 of 10 captures on a real iPhone.
- Agentic depth. Aloud runs an agent tool loop and routes through the YouCam MCP server.
- More load-bearing APIs. CASTING uses four YouCam APIs.

## Rounds

### Round 1: blind critic panel (8 critics, Sonnet 5.5, B = Veil)

| Criterion | Critic 1 | Critic 2 |
|---|---|---|
| Design | B first | B first |
| Quality of Idea | B first | B first |
| Technological Implementation | B second (ShadeSpan first) | B first |
| Potential Impact | B second (ShadeSpan first) | B second (Aloud first) |

Gaps every critic named for Veil:
1. No real person and no real sunscreen. Every reading is on a filter-painted sample.
2. YouCam looks peripheral: no screenshot shows a YouCam output (masks, tone, try-on render) or a call log.
3. A dev-mode "1 Issue" badge shows in the screenshots.
4. No live link, repo or video in the write-up.
5. Failure states (light-gate refusal, cast map) are not shown.
6. Validation is one face only; the critics want planted, found and null across all four.

Done since round 1:
- Deployed: https://veil-skin.vercel.app (Vercel, replay mode until a key is set).
- Gap 2: a "What YouCam returned" panel in the report (lab and live). It shows the skin-analysis masks with the patches Veil reads, the share of flagged skin left out, the skin tone swatch with ITA, the makeup try-on render and the four API calls. It is labelled "Replay" when a local stand-in answers.
- Gap 6: a four-sample table under "Test the test" (planted 9.7/6.9/5.1/3.6, found 9.7/6.9/5.0/3.6, bare retest 0.1/0.2/0.2/0.0), with the threshold rationale cited (Paravina 2015, Mokrzycki and Tatol 2011).
- Gaps 3 and 5: 11 production screenshots with no dev badge, in `research/prod/`. They include the refused photo, the cast map, the try-on, the YouCam panel and two mobile views. The refused photo was captioned "Try-on"; it now says "Refused".
- Gap 4: `research/devpost.md` rewritten with live links, a YouCam table, the validation table, honest limits, the retail case and sources.
- A 1:46 captioned demo video, recorded from the live site: `research/prod/veil-demo.mp4`.
- Gap 1 (real person, real sunscreen) needs the user: a YouCam key and real swipes.

### Round 2: blind critic panel (8 critics, Sonnet 5.5, new packet B)

| Criterion | Critic 1 | Critic 2 |
|---|---|---|
| Design | B first | B first |
| Quality of Idea | B first | B first |
| Technological Implementation | B second (ShadeSpan first) | B third (CASTING, ShadeSpan) |
| Potential Impact | B second (ShadeSpan first) | B third (Aloud, ShadeSpan) |

Every critic named the same gap for Veil on Technological Implementation and Potential Impact: no real YouCam response and no real person. Everything visible runs on a local stand-in labelled "Replay", and the sunscreen is painted by a filter. The "Replay" label made this more visible than in round 1. Design critics also wanted to see the camera flow. Results: `research/bar/round2.json`.

Done after round 2:
- Camera-flow shots on a phone: bare step, viewfinder guidance ("Centre your face"), viewfinder ready, swipe step (`research/prod/10` to `13`, simulated camera feed). Added to packet B.

- `npm run capture`: with a key, it sends the four sample photos to YouCam and saves the real masks, tone and try-on over the stand-in files, plus `calls.json` with call times. The panel then says "Recorded" with the date and per-call seconds. Tested end to end against the mock; deployed.

Blocked on the user (no further critic round until one of these exists):
- A YouCam API key on the Vercel project (`YOUCAM_API_KEY`), so the live flow and the trace panel show real responses.
- Real swipes: a bare photo and a swiped photo of a real sunscreen on at least three real people, ideally Fitzpatrick IV to VI.


### Rounds 3 and 4: blind panel after the redesign (2026-10-23)
The current hackathon gallery is not published yet (deadline Nov 2, 2026), so the bar is still the winners of the previous YouCam API hackathon: ShadeSpan, CASTING and Aloud. Each round has eight judges on Sonnet 5.5: a Perfect Corp sponsor engineer and a veteran Devpost judge for each of the four published criteria. Letters are reshuffled each round.

| Criterion | Round 3 (Veil = C) | Round 4 (Veil = A) |
| --- | --- | --- |
| Technological Implementation | 1st, 3rd (ShadeSpan 1st) | 1st, 1st |
| Design | 1st, 1st | 1st, 1st |
| Potential Impact | 2nd (ShadeSpan 1st), 1st | 1st, 1st |
| Quality of Idea | 1st, 1st | 1st, 1st |

Between rounds 3 and 4, only the evidence changed. The /lab screenshots were recaptured from the live site (the redesigned UI, the shelf with Add to bag, the YouCam panel, the call log, the self-tests and a try-on). The write-up did not change. Packets: `research/bar/blind3`, `blind4`. Results: `round3.json`, `round4.json`.

Every judge in both rounds still names one gap for Veil: no real person with real sunscreen, and YouCam answers that come from the labelled stand-in. Closing it needs a YouCam key and real swipes. Real stock footage was checked (Pexels 7467138, 8306710, 7614213, 5891044). None shows a bare frame and then one coated cheek beside one bare cheek, so none can stand in for a real swipe.
