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

## Development

Component development uses **Storybook** (visual) and **Vitest** (unit/render tests). Both load `theme/reference.css` via Tailwind v4 so M3 color roles render correctly without a host app.

```bash
pnpm install
pnpm run typecheck
pnpm run build
pnpm run test
pnpm run storybook          # http://localhost:6006
pnpm run build-storybook    # static output in storybook-static/
```

Stories live next to components as `*.stories.tsx`. Tests live under `tests/`.

### Storybook color themes

Use the **Color theme** toolbar (top bar) to toggle **Light** or **Dark** M3 role mappings from `theme/reference.css`:

| Preset | What it does |
|--------|----------------|
| **Light** | Default roles from `reference.css` |
| **Dark** | Adds `.dark` on `<html>` for dark role remap |

Implementation: `.storybook/apply-storybook-theme.ts` toggles the `dark` class on `<html>`. Per-story default:

```tsx
export const OnDark: Story = {
  globals: { colorTheme: "dark" },
};
```

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

Design tokens (`@theme` colors, fonts, etc.) stay in the **host** application (e.g. `src/index.css`). The library emits **M3-aligned color role** class names (`bg-primary`, `text-on-surface`, etc.).

Register the built package so Tailwind scans classes used inside the package:

```css
@source "../node_modules/@efcnewlife/newlife-ui/dist";
```

### Color system (0.2.0+)

Components require **color roles** defined in the host. The package ships reference theme files:

```css
/* Full defaults (primitives + roles) */
@import "@efcnewlife/newlife-ui/theme/reference.css";

/* Or roles only, if you already define brand/gray scales */
@import "@efcnewlife/newlife-ui/theme/required-roles.css";
```

Import **after** `@import "tailwindcss"`. Override brand or roles in your own `@theme` block.

**Breaking for hosts:** upgrade CSS **before** bumping to `0.2.0`. See `theme/token-contract.md` in this repo and [newlife-docs host integration guide](https://github.com/efcnewlife/newlife-docs).

`Switch.color`: prefer `"primary"` | `"neutral"`; `"blue"` and `"gray"` remain as deprecated aliases.

### Peer dependencies

Ensure these match your app:

- `react`, `react-dom`
- `react-icons`
- `flatpickr` (used by `DateTimePicker`; date-line `DateCalendar` / `DateField` / `DatePicker` do not require it)

### Notifications

`NotificationProvider`, `NotificationContainer`, `useNotification`, and `notificationManager` are exported from this package so there is a single global registration for imperative `notificationManager.show(...)`.

### Router links

- `DropdownItem`: pass `LinkComponent={Link}` from `react-router` when using `tag="a"` and `to` for client-side navigation.
- `Alert`: pass `LinkComponent` for the optional link, or rely on a plain `<a href>`.

### `Select` copy

Pass a `labels` prop for translated placeholder, aria, and empty states (defaults are English).

### Form fields

Composite inputs (`Input`, `TextArea`, `PhoneInput`, `Select`, `ComboBox`, `DatePicker`, `TimePicker`) wrap label, control, and messages in a single DOM node via **`FormField`**. Use **`wrapperClassName`** for field-level layout (e.g. `space-y-1.5`); **`className`** still applies to the native input or trigger as before. Export **`FormField`** directly when building custom fields in host apps.
