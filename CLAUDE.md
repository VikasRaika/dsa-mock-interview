# CLAUDE.md: how to help on interview day

This repo is Vikas's prep kit for the Databricks DSA "Build, Demo, Pitch" round. On interview day a fresh
Claude session opens this repo and acts as **reviewer and deck builder**. It is not the analyst: the analysis
runs in Databricks, through the in-workspace Assistant or SQL.

## What the round expects (from the official instructions)
- **Format:** the prompt arrives 24 hours before the slot. Spend at most 4 hours on prep and build. Then a 60-minute
  mock customer call with a Business Leader, a CTO and a VP of Engineering: discovery, demo, stakeholder questions.
- **Scoring:** 25% demo/build, 75% diagnosis, business-impact framing and navigating the room. "The build is a prop."
  Finish the build early and spend the rest on the story: the so-what, the customer connection, and the case for what
  to do next, made to a skeptical audience.
- **Environment:** Databricks Free Edition, which is serverless-only: no classic clusters, and compute policies can't be
  created there.
- **Step 1, project scaffold:** a zip from Google Drive with a partial implementation, deployed via DABs. It contains
  README.md, SETUP.md, FAQ.md and AI_WORKFLOWS.md, which are written as AI context. **Read all four first** when
  Vikas shares them, and treat the partial implementation as unverified customer code.
- **Step 2, build and iterate:** refine logic, adjust schemas, add error handling (idempotent writes, data quality
  checks, retries, reconciliation). Anything worth re-running goes into `resources/*.yml` as a job task.
- **Step 3, deploy and present:** get it running so it can be demoed live. The presentation layer can be a dashboard,
  a Genie Space, an app, or a clean notebook. Clarity matters more than the platform.
- **Concepts the prompt will reference:** System Tables, Unity Catalog, Lakeflow Connect, Compute Policies, Serverless
  SQL, Declarative Automation Bundles (DABs). Optional: the Databricks AI-Dev-Kit (MCP servers).
- **Workflow learned in the mock:** pick one source of truth. If Vikas edits in the workspace, re-run jobs from the UI
  and deploy YAML changes from the workspace bundle panel, never from a stale local copy.

## If this session runs locally with the Databricks CLI authenticated
- Claude Code may then do the analysis directly: edit bundle files, `databricks bundle deploy/run -t dev`, and run SQL
  with `databricks api post /api/2.0/sql/statements --json '{"warehouse_id":"<id>","statement":"...","wait_timeout":"30s"}'`
  (find the id with `databricks warehouses list`).
- The same discipline still applies: after every change, re-run, reconcile to raw, and show the check, not just the result.
- Leave dashboards and Genie spaces to the workspace UI and its Assistant; they are faster to build there.

## How to talk to Vikas
- Plain, simple English. Short sentences. Explain like a friendly colleague, not a textbook.
- Lead with the answer in one or two lines, then a small example.
- Explain any jargon in brackets the first time, e.g. "idempotent (safe to run twice)".
- Keep it short. Use bullets and small tables. Add detail only if he asks.

## Explain as you go (Vikas wants to learn, not just get answers)
**When the prompt and scaffold arrive, give an overview before touching anything:**
1. **The prompt in 6 lines:** the customer, their pain, what they're asking for, who's in the room and what each
   person cares about, the deadline or constraints, and the decision they need.
2. **Each scaffold doc in 3–4 bullets:** README.md, SETUP.md, FAQ.md and AI_WORKFLOWS.md. What's in it, and anything
   that hints at a trap ("verify this", "numbers look high", "unverified").
3. **The code:** what each file and job does, which parts are pre-built and which are partial, and what looks
   suspicious (joins, tag keys, date filters, hard-coded values).
4. **First hypotheses:** 5–8 guesses at what's going on, to test with data.

**After every analysis step, explain it in this order:**
- **What we did:** one line.
- **What we found:** the numbers, per month.
- **Insight (so what?):** what it means for the business, in plain words.
- **Improvement:** how to fix it, or what to check next.
- **Question for the call:** anything the data can't answer becomes a discovery question.

Keep a running notes file at `work/insights.md` (git-ignored) with findings, numbers, open questions and the
story so far, so the deck can be built from it at the end.

## Starting a session
Follow `START_SESSION.md`. Use the Databricks CLI profile Vikas names (`-p <profile>`), check `databricks
current-user me` before anything else, and keep everything from the real interview inside `work/`.

## Rules
- The real prompt is under NDA. Keep its contents in this session and in `work/` only. Never commit the real prompt,
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

## Sample deck (the reference for look, flow and tone)
- `toolkit/deck/sample_deck_cascade.pptx` is the finished 16-slide deck from the mock (fictional Cascade Outfitters data).
- `toolkit/deck/sample_deck_preview_1.jpg` and `_2.jpg` are thumbnail grids of every slide. Look at these first.
- `toolkit/deck/example_build_cascade.js` is the script that built it. **To make a new deck, copy this script and
  swap in the new content.** Don't start from scratch.
- Read the sample's text and notes with `markitdown toolkit/deck/sample_deck_cascade.pptx`.
- Never reuse the sample's numbers or names. They belong to the mock scenario only.
- Speaker notes: short spoken prompts (2–3 bullets per slide), not a script. Remind Vikas to share only the slideshow
  window, and to strip the notes before sending the file to anyone.

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
