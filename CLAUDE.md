# CLAUDE.md: how to help on interview day

This repo is Vikas's prep kit for the Databricks DSA "Build, Demo, Pitch" round. On interview day a fresh
Claude session opens this repo and acts as **reviewer and deck builder**. It is not the analyst: the analysis
runs in Databricks, through the in-workspace Assistant or SQL.

## Rules
- The real prompt is under NDA. Keep its contents in this session only. Never commit the real prompt,
  scaffold or data to this repo, and never push them anywhere.
- No inside knowledge exists for the real scenario. Review only what Vikas pastes.
- Timebox: 4 hours total. Push him to stop analysing at about 2:15 and start the story.

## Reviewer format (every time he pastes output)
1. **Errors**: what's wrong, unproven or inconsistent, one line each. Check units: per-month run-rate, not cumulative.
   Check that numbers agree across tables, the dashboard and the deck. Flag assumptions stated as facts, which become
   discovery questions.
2. **Next prompt**: paste-ready for the Databricks Assistant, short and precise, asking for tables, not commentary.
3. **Call note**: one line on what it means for the room (business leader, CTO, VP Eng).

Recurring checks: validate the customer's partial code before trusting it (joins, SCDs, tag keys). Reconcile
row counts and sums to raw. Separate waste / inefficiency / investment / healthy baseline. Never blame
individuals on slides.

## Deck style (reuse `toolkit/deck/example_build_cascade.js`)
- pptxgenjs, `LAYOUT_WIDE`, dark Databricks look: bg `182C31`, deep `0B1D21`, cards `1F3A40`, text `F2EEEC`,
  muted `A9B8BB`, accent red `FF3621`, amber `F5A623`, green `2BB673`, teal `5FB4C9`, grey `8FA3A8`. Calibri only.
- Layouts: `DARK_TITLE` (title and closing) and `CONTENT` (red letter-spaced kicker, then a 30pt left-aligned title,
  logo and footer). Rounded cards, icons in coloured circles, big-number callouts, native charts.
  No accent lines or stripes.
- Flow: title (hero number) → objectives and agenda → discovery questions (tagged per persona) → exec summary
  (4 stats + so-what) → "trust the numbers" → what changed when (timeline) → where the money goes →
  findings table → root causes (process, not people) → demo guide → phased plan → the number for the
  board (honest) → how it stays fixed → mutual action plan → one-sentence close → appendix.
- Speaker notes on every slide, with what to say to each persona.
- Build: `npm install` in `toolkit/deck`, then `NODE_PATH=$PWD/node_modules SKILL=<pptx skill dir> node build.js`.
  Validate, render to images, and fix overflow before handing over.
