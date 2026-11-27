# Contributing to CalmWeb

Thanks for helping. This repo is the CalmCampus website and its evidence base, so accuracy matters more than volume. Small, focused changes are easiest to review. For the app itself, see the [CalmApp](https://github.com/CalmCampus-FV/CalmApp) repo; for the university demos, [CalmUni](https://github.com/CalmCampus-FV/CalmUni).

## Before you start

Open an issue first for anything larger than a typo, a broken link or a source correction.

## Ground rules

- **Every claim has a source.** If you add or change a number, add or update its row in `research/index.csv` and the dossier in the same pull request.
- **Wellness wording, not medical claims.** Say "supports", not "detects" or "diagnoses". No testimonials or figures we can't source.
- **No trackers.** No analytics, third-party scripts, embeds or fonts loaded from other hosts. CI fails if a page, stylesheet or script pulls in anything external.
- **Plain HTML/CSS/JS.** No build step or framework unless we agree on one in an issue first.
- **Forms** live in [CalmForms](https://github.com/CalmCampus-FV/CalmForms); `docs/f/` and `docs/forms/` here are synced copies.
- **Keep it accessible.** Alt text on images, sensible heading order, readable contrast, works on a phone.

## Development

```bash
python3 -m http.server 3400 --directory docs   # the site, http://localhost:3400
```

Check every page at phone width and at desktop width, with the keyboard, and in light and dark mode for form pages. Run `python3 scripts/check-site.py` before pushing; CI runs the same.

## Pull requests

- Branch from `main`, keep the change focused, and explain the why.
- Make sure CI passes.
- Match the surrounding HTML/CSS style.

By contributing you agree that your work is released under the [MIT License](LICENSE).

Please be respectful and constructive; see the [Code of Conduct](CODE_OF_CONDUCT.md).
