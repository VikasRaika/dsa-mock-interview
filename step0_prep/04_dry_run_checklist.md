# Dry-run checklist (do this BEFORE you start the mock clock)

The real instructions say: *"We won't be able to extend time for tooling issues."* This 45-minute warm-up removes that risk.

## A. Account & CLI (15 min)
```bash
databricks --version                         # >= 0.250 recommended
databricks auth login --host https://<your-host>.cloud.databricks.com
databricks auth profiles
databricks current-user me
```

## B. Hello-world bundle (15 min)
```bash
mkdir ~/dab-warmup && cd ~/dab-warmup
databricks bundle init default-python        # accept defaults, serverless = yes
cd <project_name>
databricks bundle validate -t dev
databricks bundle deploy -t dev
databricks bundle run -t dev                 # pick the job
databricks bundle destroy -t dev             # clean up
```
Write down every error you hit and how you fixed it. That's your personal FAQ for interview day.

## C. One rep of each presentation layer (15 min, on any table, e.g. `samples.nyctaxi.trips`)
- [ ] AI/BI Dashboard: 1 counter, 1 line chart, 1 table, 1 filter. Publish it.
- [ ] Genie Space: add the table, write 2 instructions, ask 3 questions, save one as trusted SQL.
- [ ] SQL Alert: condition on a query result.
- [ ] Explore your own system tables: `SELECT * FROM system.billing.usage LIMIT 10;` (see what's visible in Free Edition).

## D. Interview-day setup
- [ ] Stable internet, laptop charger, notifications off, browser profile with only Databricks + slides tabs
- [ ] Demo tabs pre-opened in order; screenshots folder as backup
- [ ] Notepad for writing the panel's questions visibly ("let me note that")
- [ ] Water. Breathe. You've rehearsed this.
