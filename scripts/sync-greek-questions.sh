#!/usr/bin/env bash
# Copy Austin's "Questions for Prof." Obsidian note into the repo and, if it
# changed, commit + push that one file to main so Vercel redeploys.
#
# This is a content-only update, so it pushes straight to main on purpose
# (code changes still go through PRs). It touches nothing else in the repo:
# it works in a throwaway worktree off origin/main, so whatever branch or
# uncommitted state your checkout is in doesn't matter.
#
# Usage:
#   npm run sync:greek             # copy, commit, push
#   npm run sync:greek -- --dry    # show what would change, push nothing
#   GREEK_NOTE=/path/to/note.md npm run sync:greek
#   SYNC_BRANCH=some-branch npm run sync:greek   # testing only
set -euo pipefail

NOTE="${GREEK_NOTE:-$HOME/Documents/Obsidian Vault/Grad School/Randolph/Greek 1/Questions for Prof.md}"
BRANCH="${SYNC_BRANCH:-main}"
DEST_REL="content/grad-school/randolph/greek-1/questions.md"
META_REL="content/grad-school/randolph/greek-1/questions.meta.json"
DRY=0
[[ "${1:-}" == "--dry" ]] && DRY=1

if [[ ! -f "$NOTE" ]]; then
  echo "sync-greek: note not found: $NOTE" >&2
  exit 1
fi

REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
git -C "$REPO_ROOT" fetch --quiet origin "$BRANCH"

TMP="$(mktemp -d "${TMPDIR:-/tmp}/sync-greek.XXXXXX")"
cleanup() { git -C "$REPO_ROOT" worktree remove --force "$TMP" >/dev/null 2>&1 || rm -rf "$TMP"; }
trap cleanup EXIT
git -C "$REPO_ROOT" worktree add --quiet --detach "$TMP" FETCH_HEAD

mkdir -p "$(dirname "$TMP/$DEST_REL")"
if [[ -f "$TMP/$DEST_REL" ]] && cmp -s "$NOTE" "$TMP/$DEST_REL"; then
  echo "sync-greek: no changes ($BRANCH already matches the note)."
  exit 0
fi

cp "$NOTE" "$TMP/$DEST_REL"
# "Last updated" on the page = the day the note was last modified (local time).
UPDATED="$(date -r "$NOTE" +%Y-%m-%d)"
printf '{\n  "lastUpdated": "%s"\n}\n' "$UPDATED" > "$TMP/$META_REL"

git -C "$TMP" add "$DEST_REL" "$META_REL"
git -C "$TMP" --no-pager diff --cached --stat

if [[ $DRY -eq 1 ]]; then
  git -C "$TMP" --no-pager diff --cached -- "$DEST_REL"
  echo "sync-greek: dry run, nothing pushed."
  exit 0
fi

git -C "$TMP" commit --quiet -m "content: sync Greek 1 questions for Prof. Cohen ($UPDATED)"
git -C "$TMP" push --quiet origin "HEAD:$BRANCH"
echo "sync-greek: pushed $(git -C "$TMP" rev-parse --short HEAD) to $BRANCH. Vercel will redeploy."
