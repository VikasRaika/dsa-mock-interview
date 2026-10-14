# Candidate Prompt: Cascade Outfitters

**Role:** Delivery Solutions Architect (DSA), Databricks
**Format:** 4-hour build (in the 24 hours before your slot), then a 60-minute mock customer call
**Confidential:** do not distribute

---

## The account

**Cascade Outfitters** is a North American outdoor gear and apparel retailer with about **$1.6B revenue**, about 40% of it
online. It has been a Databricks customer for 18 months. They migrated from an on-prem Hadoop + Teradata
stack and run their data platform, marketing analytics, supply-chain forecasting and finance reporting on Databricks
(AWS, Unity Catalog enabled, 2 workspaces: `prod` and `dev`).

You are the newly assigned DSA. Your Account Executive forwarded this email last night:

> **From:** Michelle Grant, Chief Operating Officer
> **To:** Cascade Account Team (Databricks)
> **Cc:** David Okonkwo (CTO), Sarah Lindqvist (VP Engineering)
> **Subject:** Databricks spend: we need to talk
>
> Our Databricks bill has more than tripled since June. Nobody on my team can tell me why, which team is
> responsible, or whether we're getting anything for it. We approved $165k for Q3 and we are well past that.
>
> I've been asked by our CFO to bring a plan to the board finance committee in two weeks. Right now the options on
> the table are a hard 40% cut across every team, or pausing new projects on Databricks while we evaluate
> alternatives. I'd rather not do either blindly.
>
> I'd like a session with your team, David and Sarah this week. Please come with answers, not a sales pitch.
>
> — Michelle

Your AE adds: *"Renewal is in Q1. They're also our reference account for retail personalization, since 'Project Atlas'
launched this summer. Snowflake is circling. Don't let this become a procurement conversation."*

## What you have

Cascade's platform team exported a snapshot of their **System Tables** (billing, compute, jobs, pipelines, audit)
for **June 1 to October 11, 2026**, plus a team directory, Q3/Q4 budgets and weekly e-commerce KPIs. The project scaffold
(`cascade_finops_starter.zip`) deploys this into your Free Edition workspace with **Declarative Automation Bundles**.
It also contains a partial analysis that Cascade's platform engineer started. **You have not verified it.**

Read `README.md` and `SETUP.md` inside the zip first.

## What we're asking you to do

1. **Deploy** the bundle and get the data into Unity Catalog in your workspace.
2. **Diagnose** what's driving spend. Separate what's waste from what's creating value, and quantify both.
3. **Build a lightweight prototype** that Cascade could keep using after you leave, for example a dashboard, a Genie
   space, a recurring job, an app, or a clean notebook. It's a prop for your story, not the product.
4. **Prepare** a short narrative and a recommendation for the call: what to do, in what order, what it saves, what it
   costs Cascade in effort or risk, and how they keep it from happening again.

## The call (60 minutes)

You'll lead the call. On the panel:

| Persona | Cares about |
|---|---|
| **Michelle Grant**, COO (Business Leader) | The board, the budget, the "so what", whether Databricks is worth it |
| **David Okonkwo**, CTO | Platform strategy, governance, risk, total cost of ownership, "how do we know this won't recur?" |
| **Sarah Lindqvist**, VP Engineering | Her teams' velocity, Black Friday readiness (code freeze Nov 1), not being blamed |

A suggested shape (you own the agenda):
- **~5 min:** intros, agenda, confirm objectives
- **~10–15 min:** discovery. You *will* learn things in the room that are not in the data.
- **~20 min:** findings + demo
- **~15 min:** stakeholder questions, objections, trade-offs
- **~5 min:** recommendation, next steps, owners, dates

## Scoring (shared with all candidates)
- **25%: the demo/build.** Does it work, is it credible, does it support the story?
- **75%: diagnosis, business framing, and how you navigate the room.** Discovery, the "so what", handling skeptical
  stakeholders, and a clear, defensible recommendation.

## Rules
- No more than **4 hours** on prep + build.
- Use any tools you like (AI assistants included). The demo must run in **Databricks Free Edition**.
- Assume anything not in the data is unknown until you ask about it on the call.
