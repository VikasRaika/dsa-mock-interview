# Start a session (new Databricks account, or interview day)

Two parts: **A** is what you type yourself. **B** is the message you paste into Claude.

> ⚠️ **On the real interview day, use the Databricks Free Edition account registered with the email the recruiter
> has on file.** A different account is fine for practice only.

---

## A. Your steps (about 10 minutes)

**1. Get the repo**
```bash
git clone https://github.com/VikasRaika/dsa-mock-interview
cd dsa-mock-interview
git checkout claude/databricks-dsa-mock-interview-l4spxb
```

**2. Log in to the Databricks account you want to use.** Give each account its own profile name.
```bash
databricks auth login --host https://<your-workspace>.cloud.databricks.com --profile practice2
databricks auth profiles                      # check the new profile shows "Valid: YES"
export DATABRICKS_CONFIG_PROFILE=practice2    # every databricks command now uses this account
databricks current-user me                    # should print the right email
```
Your workspace URL is whatever is in the browser address bar when you're logged in, up to `.com`.

**3. Put the scaffold in a working folder.** This folder is git-ignored, so nothing in it gets pushed.
- **Practice:** `mkdir -p work && unzip step1_google_drive_folder/cascade_finops_starter.zip -d work/`
- **Interview day:** download the zip from the recruiter's Google Drive, then `unzip <file>.zip -d work/`

**4. Start Claude Code in the repo folder**
```bash
claude
```

---

## B. Paste this into Claude as your first message

```
Read CLAUDE.md and START_SESSION.md first and follow them.

Setup:
- Databricks CLI profile: practice2   (already logged in; use `-p practice2` or DATABRICKS_CONFIG_PROFILE)
- Scaffold is unzipped in: work/<folder-name>/
- This is: PRACTICE / INTERVIEW (pick one)
- Clock started at: <time>

Do this, in order, and explain each step in plain English as you go:
1. Check the CLI works: `databricks current-user me`, list catalogs, list SQL warehouses.
2. Give me an overview of the prompt (I'll paste it) and of README.md, SETUP.md, FAQ.md and AI_WORKFLOWS.md.
3. Read the bundle (databricks.yml, resources/, src/). Tell me what each part does and what looks suspicious.
4. Deploy and run it: `bundle validate`, then `bundle deploy -t dev`, then `bundle run` on the setup job.
   If the catalog isn't `workspace`, pass --var="catalog=<name>".
5. Verify the tables exist and row counts look sane. Then stop and wait for me.
```

---

## If something goes wrong
| Problem | Fix |
|---|---|
| `bundle deploy` uses the wrong account | Check `echo $DATABRICKS_CONFIG_PROFILE`, or add `-p practice2` to the command |
| "catalog not found" | Run `databricks catalogs list` and redeploy with `--var="catalog=<name>"` |
| Old account's free-tier quota is used up | Use a new profile (step 2). Never edit `~/.databrickscfg` by hand while a job is running |
| Claude can't run SQL | Run `databricks warehouses list`. If the warehouse is stopped, start it in the UI or use serverless |
