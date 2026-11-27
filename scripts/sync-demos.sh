#!/usr/bin/env bash
# Copy the university demos from CalmUni (their source) into docs/<demo>/ here.
#
#   bash scripts/sync-demos.sh            # sync from CalmUni main
#   bash scripts/sync-demos.sh --check    # only report differences, exit 1 if any (used by CI)
#   CALMUNI_DIR=../CalmUni bash scripts/sync-demos.sh   # use a local CalmUni checkout instead
#
# Only the demo folders listed below are touched. Their URLs have been sent to universities,
# so a folder is never removed here, even if it disappears from CalmUni.
set -euo pipefail
DEMOS="quivr demo epfl unil"
root="$(cd "$(dirname "$0")/.." && pwd)"
mode="${1:-sync}"

src="${CALMUNI_DIR:-}"
if [ -z "$src" ]; then
  src="$(mktemp -d)"; trap 'rm -rf "$src"' EXIT
  git clone -q --depth 1 https://github.com/CalmCampus-FV/CalmUni.git "$src"
fi

status=0
for d in $DEMOS; do
  from="$src/published/$d"
  to="$root/docs/$d"
  if [ ! -d "$from" ]; then
    echo "CalmUni has no published/$d/: leaving docs/$d/ as it is" >&2; status=1; continue
  fi
  if [ "$mode" = "--check" ]; then
    if diff -r -q "$from" "$to" >/dev/null; then echo "docs/$d/ matches CalmUni"; else
      echo "docs/$d/ differs from CalmUni published/$d/:"; diff -r -q "$from" "$to" || true; status=1; fi
  else
    rm -rf "$to" && mkdir -p "$to"
    cp -R "$from/." "$to/"
    echo "synced docs/$d/"
  fi
done
[ "$mode" = "--check" ] && [ $status -ne 0 ] && echo "Run: bash scripts/sync-demos.sh, then open a PR." >&2
exit $status
