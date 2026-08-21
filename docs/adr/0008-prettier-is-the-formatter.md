# Prettier is the formatter

This library had no project-owned formatter; style lived in personal editors. Prettier is the only frontend formatter for sources covered by its config. Commit-time enforcement uses `.githooks` via `core.hooksPath` (same install story as branch-name `pre-push`), not Husky or lint-staged. Shared option set with sibling Newlife frontends: double quotes, semicolons, `trailingComma: "es5"`, `arrowParens: "always"`, `printWidth: 120`.

## Considered Options

- **Biome** — format+lint in one tool; would compete with or replace ESLint elsewhere and is not needed here (this package has no ESLint gate).
- **Husky + lint-staged** — conflicts with the org `.githooks` / `core.hooksPath` convention.
- **Document-only Prettier** — insufficient to stop editor drift.

## Consequences

- Developers and CI use Prettier (`pnpm run format` / `pnpm run format:check`).
- Full-tree apply lands in a dedicated follow-up PR after hook wiring.
- Clone once: `./scripts/install-git-hooks.sh`. Emergency: `git commit --no-verify`.
