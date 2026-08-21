#!/usr/bin/env bash
# Black-box tests for scripts/format-staged.sh (Prettier only)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FORMATTER="${ROOT_DIR}/scripts/format-staged.sh"
FIXTURE_DIR="${ROOT_DIR}/scripts/.format-staged-fixtures"
pass_count=0
fail_count=0

cleanup() {
  if [[ -d "${FIXTURE_DIR}" ]]; then
    git -C "${ROOT_DIR}" reset HEAD -- "${FIXTURE_DIR}" >/dev/null 2>&1 || true
    rm -rf "${FIXTURE_DIR}"
  fi
}
trap cleanup EXIT

mkdir -p "${FIXTURE_DIR}"

assert_true() {
  local label="$1"
  shift
  if "$@"; then
    pass_count=$((pass_count + 1))
  else
    fail_count=$((fail_count + 1))
    echo "FAIL: ${label}"
  fi
}

is_staged() {
  local rel="$1"
  git -C "${ROOT_DIR}" diff --cached --name-only -- "${rel}" | grep -qx "${rel}"
}

rel_ugly="scripts/.format-staged-fixtures/ugly.ts"
ugly_file="${ROOT_DIR}/${rel_ugly}"
cat >"${ugly_file}" <<'TS'
export const x={a:1,b:2}
TS
git -C "${ROOT_DIR}" add -- "${rel_ugly}"

set +e
out="$("${FORMATTER}" 2>&1)"
status=$?
set -e

assert_true "format-staged exits 0" test "${status}" -eq 0
assert_true "prettier added spacing after colon" grep -q 'a: 1' "${ugly_file}"
assert_true "file still staged" is_staged "${rel_ugly}"
assert_true "working tree matches index" git -C "${ROOT_DIR}" diff --quiet -- "${rel_ugly}"

git -C "${ROOT_DIR}" reset HEAD -- "${rel_ugly}" >/dev/null
rm -f "${ugly_file}"

rel_txt="scripts/.format-staged-fixtures/note.bin"
echo "x" >"${ROOT_DIR}/${rel_txt}"
git -C "${ROOT_DIR}" add -- "${rel_txt}"
set +e
out="$("${FORMATTER}" 2>&1)"
status=$?
set -e
assert_true "exits 0 when no prettier targets" test "${status}" -eq 0
git -C "${ROOT_DIR}" reset HEAD -- "${rel_txt}" >/dev/null
rm -f "${ROOT_DIR}/${rel_txt}"

if [[ "${fail_count}" -gt 0 ]]; then
  echo "${fail_count} failed, ${pass_count} passed"
  echo "${out:-}"
  exit 1
fi

echo "All ${pass_count} checks passed"
