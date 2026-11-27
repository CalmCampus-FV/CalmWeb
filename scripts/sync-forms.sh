#!/usr/bin/env bash
# Copy the public form files from CalmForms (their source) into docs/f/ and docs/forms/ here.
#
#   bash scripts/sync-forms.sh            # sync from CalmForms main
#   bash scripts/sync-forms.sh --check    # only report differences, exit 1 if any (used by CI)
#   CALMFORMS_DIR=../CalmForms bash scripts/sync-forms.sh   # use a local CalmForms checkout instead
#
# Only docs/f and docs/forms are touched (docs/tokens.css stays owned by this repo). Form links
# have been sent, so a folder is never removed here, even if it disappears from CalmForms.
set -euo pipefail
DIRS="f forms"
root="$(cd "$(dirname "$0")/.." && pwd)"
mode="${1:-sync}"

src="${CALMFORMS_DIR:-}"
if [ -z "$src" ]; then
  src="$(mktemp -d)"; trap 'rm -rf "$src"' EXIT
  git clone -q --depth 1 https://github.com/CalmCampus-FV/CalmForms.git "$src"
fi

status=0
for d in $DIRS; do
  from="$src/docs/$d"
  to="$root/docs/$d"
  if [ ! -d "$from" ]; then
    echo "CalmForms has no docs/$d/: leaving docs/$d/ as it is" >&2; status=1; continue
  fi
  if [ "$mode" = "--check" ]; then
    if diff -r -q "$from" "$to" >/dev/null; then echo "docs/$d/ matches CalmForms"; else
      echo "docs/$d/ differs from CalmForms docs/$d/:"; diff -r -q "$from" "$to" || true; status=1; fi
  else
    rm -rf "$to" && mkdir -p "$to"
    cp -R "$from/." "$to/"
    echo "synced docs/$d/"
  fi
done
[ "$mode" = "--check" ] && [ $status -ne 0 ] && echo "Run: bash scripts/sync-forms.sh, then open a PR." >&2
exit $status
