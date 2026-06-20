# @efcnewlife/newlife-ui

Shared React UI components for Newlife Portal. Built with TypeScript, Tailwind CSS v4 design tokens (consumed by the host app), `clsx`, and `tailwind-merge`.

**Package name:** `@efcnewlife/newlife-ui` (GitHub Packages / npm scope `efcnewlife`).

## Install (consumers)

Registry is GitHub Packages. In the consuming app, add `.npmrc`:

```ini
@efcnewlife:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Create a PAT with `read:packages`, then:

```bash
export NODE_AUTH_TOKEN=ghp_xxxxxxxx
pnpm add @efcnewlife/newlife-ui
```

```json
{
  "dependencies": {
    "@efcnewlife/newlife-ui": "^0.1.0"
  }
}
```

### Local development (same machine, before publish)

Point to the sibling repo:

```json
"@efcnewlife/newlife-ui": "file:../newlife-ui"
```

The `package.json` in this repo must keep `"name": "@efcnewlife/newlife-ui"`.

## Build

```bash
pnpm install
pnpm run build
```

Outputs `dist/` (ESM + `.d.ts`).

## Publish (maintainers)

Recommended flow: merge the release PR (version bump + `CHANGELOG.md`), then tag and push the tag (no `v` prefix).

1. Bump `version` in `package.json` (semver).
2. Add a **`## [x.y.z]`** section in `CHANGELOG.md` for that version (template: Summary, Breaking changes, Added, Changed, Fixed, Host app / consumers). The tag **must match** the bracketed version (e.g. tag `0.2.0` ↔ `## [0.2.0]`).
3. Commit, push, then: `git tag 0.2.0 && git push origin 0.2.0`
4. **Actions** runs on tag push: publishes to GitHub Packages and **creates or updates** the GitHub Release. Release body = your `CHANGELOG` section **plus** GitHub’s auto-generated merged-PR list below it.
5. Repository secret **`PACKAGE_TOKEN`**: PAT with `write:packages` (and `read:packages`). The GitHub Release step uses the default `GITHUB_TOKEN` (`contents: write` on that job only).

Manual **Actions → Run workflow** (no tag) still publishes from the branch’s `package.json` but **does not** create a GitHub Release (releases are tag-only).

The workflow (`.github/workflows/publish.yml`) runs `pnpm publish` with `NODE_AUTH_TOKEN: ${{ secrets.PACKAGE_TOKEN }}`.

Manual publish from your machine:

```bash
export NODE_AUTH_TOKEN=ghp_xxxxxxxx   # PAT with write:packages
pnpm run build
npm publish
```

## Host app setup

### Tailwind v4

Design tokens (`@theme` colors, fonts, etc.) stay in the **host** application (e.g. `src/index.css`). The library only emits class names; it does not ship a duplicate theme.

Register the built package so Tailwind scans classes used inside the package (production builds otherwise purge those classes). In the host CSS:

```css
@source "../node_modules/@efcnewlife/newlife-ui/dist";
```

Adjust the relative path if your `node_modules` layout differs.

### Peer dependencies

Ensure these match your app:

- `react`, `react-dom`
- `react-icons`
- `flatpickr` (used by `DatePicker`)

### Notifications

`NotificationProvider`, `NotificationContainer`, `useNotification`, and `notificationManager` are exported from this package so there is a single global registration for imperative `notificationManager.show(...)`.

### Router links

- `DropdownItem`: pass `LinkComponent={Link}` from `react-router` when using `tag="a"` and `to` for client-side navigation.
- `Alert`: pass `LinkComponent` for the optional link, or rely on a plain `<a href>`.

### `Select` copy

Pass a `labels` prop for translated placeholder, aria, and empty states (defaults are English).
