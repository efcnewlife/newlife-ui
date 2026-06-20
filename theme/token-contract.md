# Color token contract

`@efcnewlife/newlife-ui` components use **M3-aligned color roles** only. Host apps define primitives and map them to roles in `@theme`.

Reference: [M3 Color roles](https://m3.material.io/styles/color/roles)

## Layers

1. **Primitives** — hue scales (`brand-*`, `gray-*`, `success-*`, …). Host-owned hex values.
2. **Roles** — purpose-based tokens (`primary`, `on-surface`, `error-container`, …). Library components depend on these.

No component-level tokens (e.g. `--button-primary-bg`).

## Required color roles

| Group | CSS variable | Typical primitive (portal baseline) |
|-------|--------------|-------------------------------------|
| Accent | `--color-primary` | `--color-brand-500` |
| | `--color-on-primary` | `--color-white` |
| | `--color-primary-hover` | `--color-brand-600` |
| | `--color-primary-container` | `--color-brand-50` |
| | `--color-on-primary-container` | `--color-brand-700` |
| Surface | `--color-surface` | `--color-white` |
| | `--color-on-surface` | `--color-gray-800` |
| | `--color-on-surface-variant` | `--color-gray-500` |
| | `--color-surface-variant` | `--color-gray-100` |
| | `--color-surface-container` | `--color-gray-50` |
| | `--color-surface-container-high` | `--color-gray-dark` |
| | `--color-surface-dim` | `--color-gray-50` |
| Error | `--color-error`, `--color-on-error`, `--color-error-container`, `--color-on-error-container` | `error-*` scale |
| Success | `--color-success`, `--color-on-success`, `--color-success-container`, `--color-on-success-container` | `success-*` scale |
| Warning | `--color-warning`, `--color-on-warning`, `--color-warning-container`, `--color-on-warning-container` | `warning-*` scale |
| Info | `--color-info`, `--color-on-info`, `--color-info-container`, `--color-on-info-container` | `blue-light-*` or custom |
| Outline | `--color-outline`, `--color-outline-variant`, `--color-outline-focus` | `gray-300`, `gray-200`, `brand-300` |
| Inverse | `--color-inverse-surface`, `--color-inverse-on-surface`, `--color-inverse-primary` | `#1e2634`, white/90, `brand-200` |

## Misc primitives (not roles)

Shadows and typography used by components:

- `--shadow-theme-xs`, `--shadow-theme-sm`, `--shadow-theme-lg`
- `--text-theme-xs`, `--text-theme-sm`

Defined in `theme/reference.css`.

## Pairing rules

- `bg-primary` → `text-on-primary`
- `bg-primary-container` → `text-on-primary-container`
- `bg-surface` → `text-on-surface`; muted text → `text-on-surface-variant`
- `bg-*-container` → `text-on-*-container`
- `bg-inverse-surface` → `text-inverse-on-surface`

Host is responsible for accessible contrast when remapping.

## Dark theme

Remap **role values** with plain CSS on a `.dark` ancestor (see `theme/reference.css`). Do **not** nest `@theme` inside `.dark` — Tailwind v4 merges nested `@theme` into `:root` and breaks runtime switching. Do not add `dark:bg-brand-*` in library code.

See `theme/reference.css` for a light + dark baseline.

## Deprecated (library no longer uses)

- Direct `brand-*`, `blue-light-*`, `gray-dark` in component class strings
- Hardcoded hex in components

## Host integration

| File | Purpose |
|------|---------|
| `theme/reference.css` | Full primitives + roles (greenfield / minimal hosts) |
| `theme/required-roles.css` | Role mappings only (hosts with existing primitives) |

Import **after** `@import "tailwindcss"`. Register `@source` on `newlife-ui/dist`.

See newlife-docs: `host_theme_integration.md`.
