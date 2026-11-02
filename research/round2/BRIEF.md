# Round 2 ideation brief (read fully before writing)

Project root: C:\Users\mukes\.t3\projects\youcam. Read research/brief.md (hackathon rules, criteria, API list and unit costs) and skim research/judging/*.md (how four judge personas scored 15 round-1 ideas and why). Round 1 picked "Other Cheek" (a 4-week split-face skincare trial, see research/decision.md). It is now considered NOT good enough: its Potential Impact is weak (best outcome is "buy less", anti-conversion for the sponsor's brand clients; needs weeks of staged data; narrow audience; no daily use).

## The bar for round 2
Each idea must plausibly score 9+ out of 10 on EVERY criterion, for a judge who watches a 2-minute video:
1. Technological Implementation: deep, non-wrapper integration of several YouCam APIs (Skin AI AND eCommerce VTO families together is a plus), real engineering a customer could not trivially build, an agentic loop that does real work (perceive, decide, act, verify), not a chatbot bolted on.
2. Design: a complete product, instantly graspable by a first-time user; a signature visual moment that works on a screenshot.
3. Potential Impact: a specific real audience with a quantified pain (cite numbers with sources from web search: returns rates, spend, market size, prevalence), AND a credible reason a Perfect Corp brand/retailer client would deploy it (conversion, returns, AOV, trust). Real repeat use in daily or weekly life. Value visible from ONE session; no multi-week data needed to demo.
4. Quality of Idea: non-obvious use of the APIs, genuine insight into the problem; not "scan, score, recommend routine"; not a generic VTO try-on page.

Constraints: one builder plus AI agents, ~10 days, 1,000 free API units total, web app (Next.js). Results must be demoable with real API calls (budget them).

## Output
Write your file to research/round2/<your-angle>.md with:
- Evidence base: 5+ cited facts from web search (URL + figure).
- Exactly 3 ideas. For each: one-line pitch; the moment of use; user flow in 5 steps; exact YouCam endpoints with unit cost per session; the agentic loop; the signature visual; the brand-client business case; scores 1-10 on the 4 criteria with a one-sentence justification each, scored harshly; the single biggest risk and how to test it with under 30 units.
- A harsh-critic section that attacks your own 3 ideas and ranks them.
Do not edit any other file. Keep prose plain and specific; no em dashes.
