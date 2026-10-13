# Discovery, story, and running the room

## What a DSA is being tested on
A **Delivery Solutions Architect** is post-sales. You own getting customers to *value* on Databricks: use cases
into production, a healthy platform, adoption, and growth that the customer is happy to pay for. The interview tests whether you can:
1. **Diagnose** a messy technical and business situation fast, with data.
2. **Translate** it into business impact the business leader cares about.
3. **Lead** a room of stakeholders who want different things, without losing any of them.
4. **Land a plan** with owners, dates and measurable outcomes (a mutual action plan).

**The DSA tension to name for yourself:** Databricks makes money when customers consume. A great DSA cuts *waste*
so the customer trusts the platform and reinvests in *value*. "Healthy consumption" is the phrase. Don't apologise for
recommending cuts, and don't recommend cuts that kill the use cases making the customer money.

---

## Opening (first 5 minutes)
1. Thank them and acknowledge the pressure: "Michelle, you've got a board committee in two weeks."
2. **Confirm objectives** and adjust: "My understanding is you want three things: why it happened, what to do now, and how to stop it recurring. Anything I've missed?"
3. Agenda with timings. Ask permission: "I'd like to ask a few questions first. The data told me *what* happened, and you can tell me *why*."
4. Ask each persona: "What does a good outcome from today look like for you?"

## Discovery (10–15 minutes): ask questions you can't answer from the data
Use what you found to ask *sharp* questions. Generic discovery scores lower than hypothesis-driven discovery.

| Type | Examples |
|---|---|
| **Business outcome** | "What does the board need to see: a number, a trend, or a plan?" · "What's the Q4 budget and how firm is it?" · "Which initiatives are strategic for next year?" |
| **Value** | "How do you measure the success of <initiative>?" · "What would it cost the business if <workload> was 1 day stale?" |
| **Hypothesis check** | "I see X changed on <date> by <team>. What was the intent?" · "Who are the consumers of <table/dashboard>?" · "Is <vendor/contractor> engagement still active?" |
| **Constraints** | "What's frozen for peak season, and from when?" · "Who can approve config changes in prod?" · "What's change management like?" |
| **Org / ownership** | "Who owns platform cost today?" · "Is there a FinOps function?" · "How does chargeback work for cloud spend elsewhere?" |
| **Decision process** | "Who signs off the plan before the board?" · "What would make you choose option A vs B?" |

**Technique:** ask, **listen**, then summarise back: "So what I'm hearing is ... did I get that right?" Then **adapt your
pitch** to what you just learned. Panels reward visible adaptation.

---

## The story (use SCR, top-down)
1. **Situation:** "Spend went from about $X to about $Y per month."
2. **Complication:** "About N% of that growth is avoidable, and a big part of it is spend you can't attribute today. But part of it is earning you money."
3. **Resolution:** "Here's a 3-step plan: stop the bleeding this week, put guardrails in before your freeze, and run cost as a governed product from Q1."

### Suggested slide flow (6–8 slides)
1. **Exec summary**: 3 bullets plus the one number (monthly savings at the target run-rate)
2. **What happened**: spend trend with the step changes annotated (the "aha" chart)
3. **Where it goes**: waste / inefficiency / investment, quantified
4. **Root causes**: process gaps, not people (no guardrails, no ownership, no visibility)
5. **Demo**: the prototype answering a real question live
6. **Plan**: phased (this week / before freeze / next quarter): action, owner, $ saved, risk, effort
7. **How it stays fixed**: governance as code, budgets and alerts, chargeback, a review cadence
8. **Next steps / mutual action plan**: dates, owners, what you need from them
- Appendix: methodology, SQL, assumptions, caveats

### Make numbers board-ready
- "Run-rate from $Y to $Z per month **without touching** the initiative that's driving revenue."
- Show **ranges** where you're estimating. State assumptions.
- Translate DBUs to dollars, and dollars to something the business cares about (e.g. "about 3 days of incremental online revenue").

---

## Handling the room
**Objection framework: LAER.** Listen → Acknowledge → Explore (ask a question) → Respond (with data).

| You'll hear | Strong move |
|---|---|
| "Just give me a yes/no: can you hit 40%?" | Answer directly first ("Yes on run-rate; here's how / not without cutting X, and here's why you shouldn't"), *then* explain. |
| "You're the vendor, why would I trust you to cut my bill?" | "Because customers who waste money don't renew. I want you spending on things that pay back." Then show the data, which is theirs, not ours. |
| "Are you saying my team wasted money?" (defensive) | Depersonalise: "Every one of these was a reasonable decision without a guardrail. The fix is the system, not people." Give credit for what's working. |
| "Competitor X offers predictable pricing" | Don't trash them. Reframe: predictability comes from governance (budgets, policies, alerts), and you can show that today. Ask what predictable means to them. |
| "Can't you just give us a discount / credit?" | Don't commit. "That's a commercial conversation I'll bring to our account team. The bigger lever is the run-rate we can fix this week." |
| A question you can't answer | "I don't know yet. Here's how I'd find out, and I'll come back to you by <time>." Write it down visibly. |
| Two stakeholders disagree | Name the trade-off, offer options with consequences, and ask the decision owner to decide. Don't pick sides by personality. |

**Watch the clock.** If discovery runs long, cut slides, not the plan. Keep 5 minutes for next steps no matter what.

## Close
- Recap the decision(s) made and owners.
- Mutual action plan: **this week**, **before freeze**, **next 90 days**, and what *you* (Databricks) will do.
- Offer the follow-up: "I'll send the dashboard link, the queries and the plan by tomorrow 10am."
