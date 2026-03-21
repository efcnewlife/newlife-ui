# newlife-ui

Shared React UI components for Newlife Portal. Built with TypeScript, Tailwind CSS v4 design tokens (consumed by the host app), `clsx`, and `tailwind-merge`.

## Install

From a sibling repo (local development):

```json
{
  "dependencies": {
    "newlife-ui": "file:../newlife-ui"
  }
}
```

After publishing to your registry, pin a semver range instead of `file:`.

## Build

```bash
pnpm install
pnpm run build
```

Outputs `dist/` (ESM + `.d.ts`).

## Host app setup

### Tailwind v4

Design tokens (`@theme` colors, fonts, etc.) stay in the **host** application (e.g. `src/index.css`). The library only emits class names; it does not ship a duplicate theme.

Register the built package so Tailwind scans classes used inside `newlife-ui` (production builds otherwise purge those classes). In the host CSS (see Newlife Portal `src/index.css`):

```css
@source "../node_modules/newlife-ui/dist";
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

## Publishing (CI / registry)

1. Bump version in `package.json` (semver).
2. `pnpm run build`
3. Publish to your private npm registry or GitHub Packages, for example:

```bash
npm publish --access restricted
```

Configure `publishConfig` in `package.json` or `.npmrc` for your registry scope. Consumers should depend on a fixed or caret range and run `pnpm install` in CI with registry auth.
