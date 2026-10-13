# Databricks primer for this round

These are the concepts the real prompt says it will reference. For each one: what it is, why a customer cares,
what you'd say on a call, and the gotchas. Learn these **before** you start the clock.

---

## 1. System Tables (`system.*` catalog)
**What:** Databricks-managed, read-only Delta tables in Unity Catalog that record what happened in your account:
billing, compute, jobs, queries and audit. An account admin enables them, and they're queryable with plain SQL.

| Schema.table | What you learn |
|---|---|
| `system.billing.usage` | DBUs per SKU per hour, with `usage_metadata` (cluster_id, job_id, warehouse_id, dlt_pipeline_id, endpoint_name...), `identity_metadata` (run_as / owned_by), `custom_tags`, `billing_origin_product`, `product_features`, `record_type` |
| `system.billing.list_prices` | price per SKU over time. **SCD**: `price_start_time`, `price_end_time` (NULL = current) |
| `system.compute.clusters` | cluster config history (SCD, one row per change): node types, auto-termination, policy, tags |
| `system.compute.node_timeline` | per-minute CPU/memory utilisation per node, for finding **idle or oversized** clusters |
| `system.compute.warehouses` / `warehouse_events` | SQL warehouse config history and start/stop/scale events |
| `system.query.history` | every SQL warehouse / serverless query: who, duration, bytes, source (dashboard, Genie...) |
| `system.lakeflow.jobs` / `job_run_timeline` / `job_task_run_timeline` | jobs metadata, runs, result states, durations |
| `system.lakeflow.pipelines` | Lakeflow Declarative Pipelines (and Connect ingestion) metadata |
| `system.access.audit` | who did what: config edits, permission changes, logins |

**Patterns you should be able to write from memory:**
```sql
-- Price usage at the price valid when it was used (SCD / point-in-time join)
SELECT u.*, u.usage_quantity * p.pricing.default AS list_cost
FROM system.billing.usage u
JOIN system.billing.list_prices p
  ON  u.sku_name = p.sku_name AND u.cloud = p.cloud
  AND u.usage_start_time >= p.price_start_time
  AND (p.price_end_time IS NULL OR u.usage_start_time < p.price_end_time);

-- Cost by workload
SELECT coalesce(usage_metadata.job_id::string, usage_metadata.cluster_id,
                usage_metadata.warehouse_id, usage_metadata.dlt_pipeline_id,
                usage_metadata.endpoint_name) AS workload, ...

-- Latest config per entity from an SCD table
SELECT * FROM system.compute.clusters
QUALIFY row_number() OVER (PARTITION BY cluster_id ORDER BY change_time DESC) = 1;
```
**Gotchas:** `record_type` can be RETRACTION / RESTATEMENT, so sum them, don't filter them out. Tags are free text, so
`cost_center` vs `CostCenter` are different keys. Serverless usage has no cluster_id; you attribute it via
`usage_metadata` / budget policies. Data is regional and lands with some latency. **Always reconcile a total to raw
before showing an executive a number.**

**Call language:** "System tables give you an audited, queryable ledger of every DBU: who, what, when, and under which tag.
That makes cost a data problem you can govern with the same platform."

---

## 2. Unity Catalog (UC)
**What:** unified governance: a 3-level namespace `catalog.schema.object`, access control (GRANT), lineage, audit, tags,
ABAC / row filters and column masks, and governance of tables, volumes, models, functions, connections and system tables.
**Why it matters for cost:** lineage tells you **whether anyone reads a table**. A pipeline writing a table with no
downstream readers is a classic waste signal. Tags and governed tags support attribution.
**Call language:** "One permission model and one lineage graph across data and AI, so you can see who owns something,
who uses it, and what breaks if you turn it off."

---

## 3. Lakeflow (Connect · Declarative Pipelines · Jobs)
- **Lakeflow Connect**: managed ingestion connectors (Salesforce, Workday, ServiceNow, SQL Server, Google Analytics,
  SharePoint...). Serverless, incremental, UC-governed. It runs as an ingestion pipeline: **triggered (scheduled) or
  continuous.** Continuous means always on, so you pay 24×7.
- **Lakeflow Declarative Pipelines** (formerly DLT): declarative ETL with streaming tables and materialized views, plus
  expectations for data quality.
- **Lakeflow Jobs** (Workflows): orchestration with schedules, triggers (file arrival, table update), retries, repair runs.

**Key cost question:** *"What freshness does the consumer actually need?"* Freshness should match the SLA of the
slowest consumer that matters, not the loudest stakeholder. Table-update triggers let downstream jobs run only when data changes.

---

## 4. Compute policies (classic compute)
**What:** JSON rules that constrain what users can create. Rule types: `fixed`, `range`, `allowlist`, `blocklist`,
`regex`, `unlimited`, plus `isOptional` and `hidden`.
```json
{
  "autotermination_minutes": {"type": "range", "minValue": 10, "maxValue": 60, "defaultValue": 30},
  "custom_tags.cost_center": {"type": "allowlist", "values": ["CC-100","CC-200"]},
  "node_type_id": {"type": "allowlist", "values": ["m6i.xlarge","m6i.2xlarge"], "defaultValue": "m6i.xlarge"},
  "num_workers": {"type": "range", "maxValue": 8},
  "dbus_per_hour": {"type": "range", "maxValue": 20}
}
```
Also: **policy families** (Databricks-provided templates such as Personal Compute and Shared Compute), per-user max
compute, and permissions that control who can create unrestricted clusters.
**Serverless equivalent:** **serverless budget policies**, which attach tags to serverless usage for attribution. Account
console **Budgets** send alerts when spend crosses thresholds (they alert, they don't hard-stop).
**Gotcha for Free Edition:** serverless-only, so you **can't create policies** there. Bring the JSON as an artifact and explain it.
**Call language (to Engineering):** "Guardrails, not gates: sensible defaults, a self-serve path for exceptions, and a
policy owned in code that your team reviews."

---

## 5. Serverless SQL warehouses
- Sizes (approx DBU/hour): 2X-Small 4 · X-Small 6 · Small 12 · Medium 24 · Large 40 · X-Large 80 · 2X-Large 144 · 3X-Large 272 · 4X-Large 528
- Instant start, **auto-stop** (idle minutes), autoscaling (min/max clusters for concurrency), Photon, intelligent workload management.
- Bigger size helps **single-query latency**. More clusters help **concurrency**. Mixing up the two is a common money pit.
- Dashboards with frequent **scheduled refreshes** keep a warehouse warm all day.
- `system.query.history` + `warehouse_events` tell you utilisation and who's hitting it.

---

## 6. Declarative Automation Bundles (DABs)
**What:** infrastructure-as-code for Databricks projects. `databricks.yml` holds bundle, variables, targets (dev/staging/prod),
and resources (jobs, pipelines, dashboards, apps, schemas, volumes, model serving endpoints, ...).
```bash
databricks bundle init                 # templates (default-python, default-sql, ...)
databricks bundle validate -t dev
databricks bundle deploy   -t dev      # uploads files and creates/updates resources
databricks bundle run      -t dev <resource_key>
databricks bundle summary  -t dev
databricks bundle destroy  -t dev
databricks bundle generate job|pipeline|dashboard --existing-...   # pull UI-built things into code
```
- `mode: development` prefixes names with `[dev you]`, pauses schedules, and isolates per user. `mode: production` enforces
  stricter checks (and requires run_as / permissions to be set).
- Variables: `${var.catalog}` with `--var="catalog=x"` overrides. Substitutions like `${bundle.target}` and `${workspace.current_user.userName}`.
- **Why it's a cost story:** policies, budgets, alerts and dashboards defined as code get reviewed, versioned and
  applied the same way to every workspace, and CI/CD with a review step is what stops "someone changed the cron on a Friday".

---

## 7. Presentation-layer options (pick ONE that fits the audience)
| Option | Best for | Effort |
|---|---|---|
| **AI/BI Dashboard** | COO/CFO: trend, top drivers, budget vs actual | Low |
| **Genie Space** | "Let me ask my own question". Wow factor for business users. Needs good instructions. | Low-Med |
| **Notebook** | Technical walkthrough for CTO/VP Eng. Shows reasoning. | Low |
| **Databricks App** | Custom workflow (e.g. a "recommendations inbox" with approve buttons) | Med-High, risky in 4h |
| **Job + alert / SQL alert** | "This keeps working after we leave" | Low |

---

## 8. Databricks AI-Dev-Kit (optional)
A toolkit (MCP server + skills/templates) that lets a local AI agent (Claude Code, Cursor) execute SQL, create jobs,
pipelines, dashboards and Genie spaces in your workspace. Set it up and test it **before** the prompt arrives, or skip it.
Don't learn a new tool on the clock.

---

## 9. Pricing vocabulary (be ready to explain without jargon)
- **DBU** (Databricks Unit) = normalised unit of compute per hour. **$ = DBUs × $/DBU for that SKU.** Different SKUs
  (all-purpose, jobs, serverless SQL, DLT, model serving) have different rates. **All-purpose (interactive) compute is
  the most expensive per DBU**, and jobs compute is much cheaper. That's why "move production work off interactive clusters"
  is a lever.
- Classic compute = DBUs **plus** your cloud VM bill (EC2). Serverless = one Databricks price that includes the infra.
  That matters for TCO comparisons: classic DBU cost understates true cost.
- For an exec: "You pay for compute time. The levers are run it less, run it smaller, run it on the cheaper type, or stop it when idle."
