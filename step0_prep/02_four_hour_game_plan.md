# The 4-hour game plan

> The build counts for 25% of the score. Diagnosis, framing and the room count for 75%. **Finish the build by about 2:15 and spend the rest on the story.**

## Before the clock starts (do this now, not on interview day)
- [ ] Free Edition account created **with the email on your application**
- [ ] Databricks CLI installed, `databricks auth login` done, `databricks current-user me` works
- [ ] Deployed **any** bundle end to end once (`databricks bundle init default-python` → deploy → run). See `04_dry_run_checklist.md` in this folder
- [ ] Know how to make: an AI/BI dashboard, a Genie space, a SQL alert, a scheduled job (one rep each)
- [ ] AI assistant set up (Claude Code / Cursor) and pointed at a test repo
- [ ] Slide template ready (Google Slides / Keynote): title, agenda, 6 blank content slides, appendix
- [ ] Screen-share tested, notifications off, second monitor layout decided

## The clock

| Time | Do | Output |
|---|---|---|
| **0:00–0:20** | Read the prompt twice. Write down: who's in the room, what each fears, what decision they need. List **5–8 hypotheses** for "why spend tripled". | Hypothesis list, stakeholder map |
| **0:20–0:40** | Deploy the bundle, run the setup job, confirm the tables. While it runs, read the README and the customer's partial code **critically**. | Data in UC |
| **0:40–0:55** | **Trust the numbers.** Reconcile any derived table to raw. Find out whether customer code over- or under-counts. | One "validated total" you'd bet your job on |
| **0:55–1:50** | Diagnose: trend → step changes → top workloads → *why* (config and audit history) → waste vs value → attribution. Write each finding as a **one-liner with a $/month**. | 5–8 quantified findings |
| **1:50–2:20** | Prototype: one curated table or view + one presentation layer (dashboard or Genie) + make it re-runnable (job in the bundle). Stop polishing at 2:20. | Working demo path |
| **2:20–3:15** | Story: exec summary, findings, recommendation (phased, with owners, $ and risk), "how we keep it fixed", discovery questions, and an objection list with answers. | 6–8 slides + notes |
| **3:15–3:50** | **Rehearse out loud**, timed, at least twice. Cut whatever runs long. Take screenshots of every demo screen as a backup. | Timed run-through |
| **3:50–4:00** | Buffer. Close tabs. Pre-load demo tabs in order. | Calm |

## Rules of thumb
- **Every finding needs: what, $ per month, why it happened, who owns it, the fix, and the effort and risk of the fix.**
- Prefer **run-rate per month** over cumulative totals. Executives budget monthly and quarterly.
- Separate **waste** (no value, safe to stop), **inefficiency** (value exists, but you're paying too much for it), and **investment** (spend that earns money: protect it).
- Round numbers when you present ("about $25k a month"). Keep the exact query in the appendix for the CTO.
- Don't present something you can't explain the SQL for.
- If you're stuck for more than 15 minutes on a build issue, cut scope. A screenshot plus a notebook beats a broken app.
- Leave **known unknowns** as discovery questions for the call. They're points, not gaps.
