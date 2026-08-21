#!/usr/bin/env bash
# Format staged files with Prettier, then re-stage them.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

prettier_files=()
while IFS= read -r path; do
  [[ -z "${path}" || ! -f "${path}" ]] && continue
  case "${path}" in
    *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md|*.yml|*.yaml|*.html)
      prettier_files+=("${path}")
      ;;
  esac
done < <(git diff --cached --name-only --diff-filter=ACMR)

if [[ "${#prettier_files[@]}" -eq 0 ]]; then
  exit 0
fi

PRETTIER="${ROOT_DIR}/node_modules/.bin/prettier"
if [[ ! -x "${PRETTIER}" ]]; then
  echo "prettier not found at ${PRETTIER}; run pnpm install" >&2
  exit 1
fi

"${PRETTIER}" --write -- "${prettier_files[@]}"
git add -- "${prettier_files[@]}"
