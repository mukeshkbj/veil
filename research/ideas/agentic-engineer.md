# Agentic-engineer ideas: YouCam hackathon

Persona: senior agentic-AI systems engineer. Rule used: an agent is real only if it closes a loop (perceive, decide, act, verify) with real tools and state. A chat reply that reads an API result does not count.

## Facts used from the specs

- Skin analysis v2.1 (`POST /s2s/v2.1/task/skin-analysis`) returns, per concern and region, `raw_score` (1-100, higher is healthier), `ui_score` (adjusted upward) and `mask_urls`. Use `format: "json"`. Use `raw_score` for all math, because `ui_score` is adjusted.
- Cost: 1-4 concerns cost 9 units (SD), 5-8 cost 12, 9-12 cost 14, 13-16 cost 16. HD costs more. A failed task costs 0 units.
- Skin simulation (`POST /s2s/v2.0/task/skin-simulation`) takes 0.0-1.0 per concern for 10 concerns. It costs 4 units for 1-4 concerns and 6 for 5-10.
- Makeup VTO (`POST /s2s/v2.0/task/makeup-vto`) costs 1 unit per call, whatever the number of effects. It takes an `effects[]` array of 13 categories. Colors are free hex values with intensity fields. Patterns are named labels from catalogs (`blush.json`, `eyeshadow.json` and so on) that are not in the OpenAPI files.
- Makeup transfer (`POST /s2s/v2.0/task/mu-transfer`) costs 2 units. It takes a source face and a reference face, long side up to 1024 px, frontal, single face.
- Skin tone analysis (`POST /s2s/v2.0/task/skin-tone-analysis`) costs 20 units. It returns `face_quality` (area, frontal, lighting, faceangle) and hex colors for skin, lip, eyebrow, eye and hair.
- Photo lighting costs 2 units. Color correction costs 2 units.
- Every task is async: upload, create task, poll. Results last 24 hours. The agent must store results itself.
- Sponsor ships MCP servers and Agent Skills for the API (source: https://yce.perfectcorp.com/ai-api/agent/mcp-skill). Plan: build the tool layer on the REST API so replay mode works. Expose the same tools through MCP so the agent runtime is swappable.

## Where the LLM is needed and where it is not

| Job | Owner |
|---|---|
| Polling, retries, unit budget, caching, stats, color math, optimizers | Deterministic code |
| Turn messy human input (product label, journal text, reference photo) into a plan | LLM |
| Choose what to measure next when evidence is unclear | LLM, inside deterministic guard rails |
| Write the verdict in plain words | LLM, from a structured result it may not change |

The LLM never computes a number. It reads numbers and proposes the next tool call. A validator rejects any call that exceeds the unit budget.

---

## Idea 1: Trial Bench

**One-line pitch.** An agent that runs a four-week experiment on one new skincare product, on your own face, and tells you whether it worked or whether something else did.

**Target user and moment.** An adult who just spent money on a serum, and who stands at the bathroom mirror on day 10 asking "is this working?". This is the exact moment named in the Skin AI track brief.

**Real pain.**
- People judge products by memory and mood.
- Selfie-based tracking apps compare photos with different lighting and angles, so the "result" is mostly camera noise.
- Users change two or three things at once, so credit goes to the wrong product.

**Agent loop.**
1. **Perceive (baseline).** Take two same-day selfies. Run skin analysis on both for the 4 concerns the product claims to address. The difference between the two runs is the measured noise floor for this user and this setup.
2. **Perceive (sensitivity).** Run skin simulation at 0.5 on the same concerns, then analyze the simulated image. The score change shows how many points a visible improvement is worth. This gives a minimum detectable effect per concern.
3. **Decide (protocol).** The LLM reads the product label and user notes and picks the concerns and the check-in dates. It lists other changes the user plans (new cleanser, travel, period). It states each as a hypothesis.
4. **Act.** Schedule the check-in. Before each capture, local code checks brightness and face angle. If the check fails, the agent asks for a retake. It calls photo lighting (2 units) only when the retake still fails.
5. **Perceive (check-in).** Run skin analysis on the same concerns.
6. **Verify.** Deterministic stats compare the new score with the baseline and the noise floor. Three outcomes: signal, no signal, inconclusive. If inconclusive, the agent buys one extra shot for the least certain concern only.
7. **Decide (stop or continue).** Stop early if the evidence is conclusive. This saves units. Otherwise continue.
8. **Attribute.** Code aligns the change point in each score series with the user's change log. The LLM turns that alignment into a verdict, such as "the drop started 2 days after the cleanser switch, 11 days before the serum could act".

**Exact endpoints and why.**
- `POST /s2s/v2.1/task/skin-analysis` with `format: json`: the only measuring instrument. `raw_score` and `region` give per-zone numbers. Masks show where change happened.
- `POST /s2s/v2.0/task/skin-simulation`: used as a calibration tool, not as a pretty picture. It gives a known-direction change to measure the instrument.
- `POST /s2s/v2.0/task/lighting`: repairs a capture that would otherwise corrupt the series.
- `POST /s2s/v2.0/file`, `GET task/{id}`: required plumbing. Store every `task_id` and score locally, because results expire after 24 hours.

**LLM vs deterministic.**
- LLM: label parsing into target concerns and a realistic timescale, change-log reasoning, verdict text, the follow-up question to the user.
- Deterministic: noise floor, minimum detectable effect, change-point alignment, stop rule, unit budget, scheduling.
- Honest note: the intelligence here is small but real. Without the LLM, the user would fill a form of target concerns and confounders. The LLM removes that form.

**20-second demo aha.** A 28-day strip scrubs fast across the screen. Each score line has a shaded noise band. A pin marks "new cleanser, day 9". The agent card appears: "Redness improved 9 points. Your noise band is plus or minus 3. The gain began after the cleanser, not the serum. Serum: no measurable effect on pores. Stop buying it." The viewer sees an agent that refuses to give credit it cannot prove.

**Why non-obvious.**
- It treats the YouCam score as a noisy instrument and measures its own error bars.
- It uses the simulation API as a calibration tool.
- It is a product that sometimes tells the user to buy less.

**Harsh risks.**
- Real repeatability of `raw_score` is unknown. If the noise is 8 points, most concerns will read "inconclusive". Mitigation: that result is the product's honesty feature, but the demo needs at least one concern with a clear signal.
- A four-week trial does not fit the 12 days left (deadline Nov 2). The demo must be a replay of a real 8-10 day self-trial plus a staged accelerated series. Judges may discount a staged series. State clearly which parts are replay.
- Skin analysis on a simulated image may not respond like real change. The calibration may mislead. Show the calibration as "estimate" and use the real test-retest noise as the main guard.
- Skin outcomes are not a medical claim. Add a plain disclaimer and never give a diagnosis.
- Single-user data. No control group. The agent attributes with correlation only and must say so.

**API unit cost per session (one full trial).**

| Step | Calls | Units |
|---|---|---|
| Baseline, 2 shots, 4 concerns | 2 x 9 | 18 |
| Simulation, 4 concerns | 1 x 4 | 4 |
| Analysis of simulated image | 1 x 9 | 9 |
| Weekly check-ins | 4 x 9 | 36 |
| Adaptive extra shots (max 2) | 2 x 9 | 18 |
| Lighting repairs (max 2) | 2 x 2 | 4 |
| **Total** | | **about 70 typical, 89 worst case** |

This fits 1,000 units: development, one real 10-day trial and the replay fixtures all fit with margin.

---

## Idea 2: Look Compiler

**One-line pitch.** Show it a makeup look from any photo. The agent compiles the look into an exact, editable recipe of shades, finishes and placements that reproduces it on your face.

**Target user and moment.** Someone who just saw a look on a video or a friend's photo and wants to wear it to an event on Saturday. The user does not know what products or steps made it.

**Real pain.**
- "Get the look" content names products the viewer cannot afford or cannot match to their own skin.
- A one-shot makeup transfer image shows the result but gives no recipe.
- Users cannot reproduce a picture that has no steps.

**Agent loop.**
1. **Perceive.** Run makeup transfer on the user's photo with the reference. The output is the target image: the look, on this face.
2. **Decide (decompose).** The LLM views the reference and target. It lists the layers it sees (lip color, blush placement, eyeshadow gradient, winged liner, brows, foundation finish). For each layer it picks a catalog pattern name and a starting hex from local color sampling.
3. **Act.** Call makeup VTO with a parametric recipe. This is a structured `effects[]` payload.
4. **Verify.** Local code measures color difference (CIEDE2000) between the VTO render and the target, zone by zone: lip, cheek, lid, crease, liner area, brow. Zones come from face landmarks computed locally.
5. **Decide (refine).** For zones with a large error, a deterministic optimizer adjusts hex and intensity. For zones with a shape error (for example the wing is missing), the LLM changes the pattern name and the optimizer resumes.
6. **Stop.** Stop when every zone is under a difficulty-based threshold or the unit cap is reached. Output the recipe card and the render.

**Exact endpoints and why.**
- `POST /s2s/v2.0/task/mu-transfer`: produces the ground-truth target. Without it, the loop has nothing to verify against.
- `POST /s2s/v2.0/task/makeup-vto`: the parametric renderer and the output format. Its free hex colors, textures and 13 effect categories make the recipe exact. It costs 1 unit per call, so 20-25 iterations are affordable.
- File and task plumbing.

**LLM vs deterministic.**
- LLM: layer decomposition from a reference photo, pattern choice from catalog names, diagnosis of a shape mismatch, wording of application steps ("blend the crease color up, then add liner").
- Deterministic: landmark zones, color sampling, CIEDE2000, coordinate-descent or CMA-ES search, caching, unit cap.
- A vision model is genuinely needed in step 2. Plain code cannot name the layers in a photo.

**20-second demo aha.** Left: a reference photo. Middle: the user, wearing the transferred look. Right: the user, wearing the compiled recipe. A counter shows the zone error falling from 14 to 3 over 8 renders in 8 seconds. Then the recipe card appears with 6 swatches, finishes and placements. A button exports it to a share link.

**Why non-obvious.**
- It uses one YouCam product (transfer) as the oracle for another (makeup VTO). The result is a shareable, editable object, not another image.
- The recipe also works as a cheap, reusable asset: a user can try the same recipe on a second photo for 1 unit.

**Harsh risks.**
- The pattern catalogs (`blush.json`, `eyeshadow.json`, `eyeliner.json`) are not in the OpenAPI files. We must fetch them from the docs before building. Offline replay needs them frozen in the repo.
- The VTO catalog may not reproduce every look (glitter, graphic liner). The error floor will stay high on those. The agent must report "match 71 percent, cannot reproduce graphic liner" instead of lying.
- The transfer output may shift geometry slightly. Landmark alignment is required, and misalignment will fake an error.
- Color difference is not perceptual similarity. A model-based image similarity score may be needed as a second check.
- Risk of looking like a filter app. The recipe card and the error loop must lead the demo.
- It is closest to a "try-on" product. Judges may call it a wrapper unless the loop is visible.

**API unit cost per session.**

| Step | Calls | Units |
|---|---|---|
| Makeup transfer | 1 (2 if the user tries a second reference) | 2-4 |
| VTO iterations | 20-25 | 20-25 |
| **Total** | | **about 25 typical, 30 cap** |

Cheapest of the three. About 30 sessions fit in the budget.

---

## Idea 3: Barely There

**One-line pitch.** An agent that finds the lightest possible touch-up that makes you look rested for tomorrow's photo or interview, and proves it with measurements instead of a filter.

**Target user and moment.** A person with a photo, interview or video call tomorrow, who wants to look like themselves on a good day, not like they wear makeup.

**Real pain.**
- Beauty filters and heavy VTO overshoot: skin turns plastic and the person looks unlike themselves.
- People under-correct or over-correct because they cannot judge dark circles and redness in a mirror.

**Agent loop.**
1. **Perceive.** Run skin analysis on 4 concerns: `dark_circle_v2`, `redness`, `acne`, `texture`. Read the masks to find the exact zones.
2. **Decide.** Local code samples skin hex from the cheek. The LLM reads the occasion (interview, wedding photo, video call) and sets a target: which concerns matter and how much gain counts as enough.
3. **Act.** Call makeup VTO with the lightest recipe: concealer (shade offset from skin hex, low coverage) on the mask zones, optional foundation, `skin_smooth` capped low.
4. **Verify.** Re-run skin analysis on the render. Compare each target concern with the baseline. Compare texture and non-target zones with the original to detect over-smoothing.
5. **Iterate.** Deterministic search (bisection on coverage, then shade) finds the smallest intensity that reaches the target gain without breaking the naturalness guard.
6. **Output.** A recipe: shade offset against the user's skin hex, zones, coverage level, and a before/after with the measured numbers.

**Exact endpoints and why.**
- `POST /s2s/v2.1/task/skin-analysis`: both the perception and the verifier. Masks and `raw_score` locate and measure the problem.
- `POST /s2s/v2.0/task/makeup-vto`: concealer, foundation and skin_smooth effects with free hex and intensity fields.
- File and task plumbing.

**LLM vs deterministic.**
- LLM: reads the occasion, sets the target gain per concern, writes the application guide.
- Deterministic: shade math, bisection search, guard checks, unit cap.
- Honest note: the LLM does little here. The core is an optimizer with an API oracle. Do not claim a deep agent.

**20-second demo aha.** Four frames, each labeled with the analysis score for dark circles: 41, 49, 58, 58. The agent says "stopped at attempt 3: the 4th added coverage but not score". The user sees the minimum-effort answer, and the numbers prove it.

**Why non-obvious.** It uses the analysis API as an objective function for a VTO search, so "enough makeup" becomes a measured stopping point.

**Harsh risks.**
- Kill risk: the analysis model may not respond to rendered makeup in the way assumed. It may ignore the render or reward smoothing. A 10-unit test on day one will show this. If it fails, drop the idea.
- Goodhart risk: texture and pore scores improve when skin is smoothed. The guard must not rely on the same score it optimizes.
- The recipe cannot be verified on a real face. The gap between VTO and real application is large.
- Narrow audience and weak "daily life" repeat use.
- Limited agency: one session, one loop.

**API unit cost per session.**

| Step | Calls | Units |
|---|---|---|
| Baseline analysis, 4 concerns | 1 x 9 | 9 |
| Each iteration: VTO + analysis | 1 + 9 | 10 |
| Typical 3-4 iterations | | 30-40 |
| **Total** | | **about 45 typical, 70 cap** |

---

## Critic's ranking

| Rank | Idea | Why |
|---|---|---|
| 1 | Trial Bench | Strongest agent: state over time, adaptive sampling, stop rules, honest uncertainty. Best fit to the Skin AI moment in the brief. Highest impact score. |
| 2 | Look Compiler | Safest demo and best visuals. Cheap, so iterations are plentiful. Deep use of the makeup VTO schema. Agent value is real but narrow. |
| 3 | Barely There | Smallest agent, narrowest audience, and a possible kill risk in the oracle. Good as a module, weak as a project. |

**Harsh critique of my own list.**
- All three depend on how YouCam scores behave. None of these assumptions was tested, because there is no API key in this session. The first task after getting a key is a 30-unit probe: two same-day selfies through skin analysis (noise), one simulation then analysis (sensitivity), one makeup render then analysis (oracle response).
- Trial Bench has the weakest 20-second demo, because the real effect is slow. Without a convincing time-lapse the judges may see only a chart.
- Look Compiler may be filed as "VTO with extra steps". The optimizer visible on screen is the defense.
- The LLM does less than the pitch suggests in ideas 2 and 3. Do not oversell it. Say what the model does in one sentence per idea.
- Judges may view only a 1-3 minute video. Idea 1 needs a 12-second scrub scene that carries the whole story.

**Bet: Trial Bench.** It fits the track language, it shows an agent that holds state and changes its plan, and its honesty angle is unusual. Hedge: run the 30-unit probe first. If the noise is too large for any concern to show signal, switch to Look Compiler, which does not depend on score stability. Borrow one piece from Look Compiler for Trial Bench only if time allows: the recipe card as the "what to do next" output.
