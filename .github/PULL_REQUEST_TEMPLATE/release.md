<!--
  Follow: https://efcnewlife.github.io/newlife-docs/docs/engineering/newlife_ui/development-workflow#release-workflow--default-dedicated-chore-release-xyz-pr
-->

## Summary

Release **`x.y.z`** of `@efcnewlife/newlife-ui`.

## What is in this release

<!-- Short list for reviewers; full notes under `## [x.y.z]` in CHANGELOG.md. -->

- 

## Version and changelog

- [ ] `package.json` **`version`** is **`x.y.z`**
- [ ] `CHANGELOG.md` has **`## [x.y.z] - YYYY-MM-DD`** (Keep a Changelog style as appropriate)
- [ ] **`[Unreleased]`** updated or cleared after moving content

## Testing

- [ ] `pnpm run typecheck`
- [ ] `pnpm run build`

## Post-merge (maintainer)

After this PR is merged on GitHub:

- [ ] On updated **`main`**: `git tag x.y.z` and `git push origin x.y.z` (**no** `v` prefix)
- [ ] Confirm publish workflow and GitHub Release for **`x.y.z`**
