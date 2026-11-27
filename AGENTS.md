# CLAUDE.md

CalmWeb: the website of CalmCampus (the iOS app lives in `CalmCampus-FV/CalmApp`, university demos in `CalmCampus-FV/CalmUni`, company demos in `CalmCampus-FV/CalmBiz`, the research and design archive in `CalmCampus-FV/CalmCampus`): marketing site (hub, universities, companies, app), impact report and the evidence dossier backing their claims. Live at calmcampus.app; cc.braunf.com redirects there (path preserved) as a fallback.

## Layout

- `docs/` — the site: plain HTML/CSS/JS, no build step. Served by GitHub Pages from `main` `/docs`; `CNAME` holds the domain, `.nojekyll` disables Jekyll. Pages: `index.html` (hub), `universities/`, `companies/` and `app/` (one `index.html` each), `report.html` (impact report). `tokens.css` holds the design tokens and fonts shared with the forms; `site.css` styles the pages (`style.css` looks like a leftover, check before touching). `f/` and `forms/` are frozen copies of the public form pages from the CalmForms repo (reached through the old `cc.braunf.com/f/<slug>` links, which redirect to form.calmcampus.app): change them there and run `bash scripts/sync-forms.sh`, never edit them here. `quivr/`, `demo/`, `epfl/` and `unil/` are the university demos (installable web apps, each with its own CSP and service worker scoped to its folder). They are published copies of `published/<demo>/` in the CalmUni repo: change them there and run `bash scripts/sync-demos.sh`, never edit them here. Their URLs (`/quivr/`, `/quivr/?lang=en`, `/demo/`, `/epfl/`, `/unil/`) have been sent to universities: never move, rename or delete these folders. 
- `scripts/` — `check-site.py` (CI), `sync-demos.sh` (from CalmUni), `sync-forms.sh` (from CalmForms). `.github/workflows/demo-sync.yml` (Source sync) fails when either set of copies drifts.
- The forms platform (admin, Worker, Supabase, its tests) lives in `CalmCampus-FV/CalmForms`.
- `research/` — evidence dossier PDF, source index (`index.csv`, one row per cited paper), `NOTES.md`, `research_log.md`. `papers/` (the PDFs) is gitignored; `download_papers.sh` re-fetches it.

## Commands

```bash
python3 -m http.server 3400 --directory docs   # site only, http://localhost:3400
python3 scripts/check-site.py                  # links resolve, nothing loads from third parties
bash scripts/sync-demos.sh --check; bash scripts/sync-forms.sh --check   # copies match their sources
```

CI (`.github/workflows/ci.yml`) runs all of the checks above. Run them before pushing.

## Principles

- Claims on the site must trace to a source in `research/index.csv`; update the index and dossier together with the page.
- Wellness wording, not medical claims ("supports", not "detects burnout"). No fabricated numbers or testimonials.
- Privacy: no third-party trackers, analytics or embeds. The product keeps all data on-device, and the site must not contradict that.
- Forms rules (anonymity, pure `core.js`, secrets) are in CalmForms' AGENTS.md. No third-party scripts, fonts or embeds anywhere; CSP is `'self'`-only.
- Keep the repo self-contained: don't depend on files from the app repo at build time. Link to it instead. The exceptions are `scripts/sync-demos.sh`, `scripts/sync-forms.sh` and the Source sync check, which read the public CalmUni and CalmForms repos.
