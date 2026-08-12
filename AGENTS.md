# AGENT.md — AI Entry Guide for newlife-ui

This document helps AI agents quickly understand **`@efcnewlife/newlife-ui`**: purpose, layout, conventions, and where to make changes. For host install and theme wiring narrative, see [`README.md`](README.md). For enforceable coding rules, see [`.cursor/rules/standard.mdc`](.cursor/rules/standard.mdc).

---

## 1. What This Project Is

| Item | Value |
| ---- | ----- |
| **Purpose** | Shared React UI component library for Newlife Portal consumers |
| **Package** | `@efcnewlife/newlife-ui` (GitHub Packages) |
| **Framework** | React 18–19 (peer), TypeScript |
| **Styling** | Tailwind CSS v4 **class names**; design tokens / `@theme` live in the **host** app |
| **Color model** | M3-aligned **color roles** (`bg-primary`, `text-on-surface`, …) via `src/theme/role-classes.ts` |
| **Build** | `tsup` → ESM + `.d.ts` in `dist/` |
| **Package manager** | `pnpm` only (`packageManager` in `package.json`) |
| **Dev UI** | Storybook 8 |
| **Tests** | Vitest + Testing Library |

### Related repositories

| Repo | Role |
| ---- | ---- |
| `newlife-portal-frontend` | Primary host / admin SPA consumer |
| `newlife-docs` | Product / host theme integration docs |
| `newlife-core-api` | Backend API (not a consumer of this package) |

---

## 2. Quick Commands

```bash
pnpm install
pnpm run typecheck
pnpm run build
pnpm run test
pnpm run storybook          # http://localhost:6006
pnpm run build-storybook
```

CI (`.github/workflows/ci.yml`) runs `typecheck` and `build` on PRs to `main` and pushes to `main`.

Copy consumer auth for local install of published packages: PAT with `read:packages` → `NODE_AUTH_TOKEN` (see README).

---

## 3. Repository Layout

```
/
├── src/                    # Component source (kebab-case folders)
│   ├── index.ts            # Public package entry — re-export everything consumers need
│   ├── cn.ts               # clsx + tailwind-merge helper
│   ├── theme/role-classes.ts
│   ├── form-field/         # Shared label / error / hint wrapper
│   ├── date-calendar/      # custom calendar surface
│   ├── date-field/         # date field without calendar icon
│   ├── date-picker/        # DateField + DateCalendar
│   ├── date-time-field/    # datetime typed field (UTC Day.js, no icon)
│   ├── date-time-picker/   # DateTimeField + DateCalendar + digital time
│   ├── time-field/         # time-of-day field without clock icon
│   ├── time-picker/        # TimeField + private digital time surface
│   ├── picker/             # shared Day.js helpers + private digital time surface
│   ├── notification/       # Provider, container, imperative manager
│   └── …                   # One folder per component family
├── theme/                  # Shipable CSS + token docs (not under src/)
│   ├── reference.css
│   ├── required-roles.css
│   ├── token-contract.md
│   └── preview.html
├── tests/                  # Vitest suites
├── .storybook/             # Storybook config + light/dark theme toggle
├── docs/agents/            # Matt Pocock skill config (issue tracker, domain docs)
├── CHANGELOG.md            # Keep a Changelog; release notes source
├── package.json
├── tsup.config.ts
└── AGENTS.md
```

Stories live **next to** components as `*.stories.tsx` (e.g. `src/button/Button.stories.tsx`).

---

## 4. Public API Surface

**Single entry:** `src/index.ts`. After adding or changing a public component/type, **re-export it here**.

Package exports (see `package.json`):

| Export | Path |
| ------ | ---- |
| `.` | `dist/index.js` + `dist/index.d.ts` |
| `./theme/reference.css` | Full primitives + role mappings |
| `./theme/required-roles.css` | Roles only (host already has brand/gray scales) |

`tsup` marks these as **external** (must be peer/host-provided): `react`, `react-dom`, `react-icons`.

### Component catalog (high level)

| Area | Examples |
| ---- | -------- |
| **Primitives** | `Button`, `Badge`, `Spinner`, `Label`, `ProgressBar`, `Slider` |
| **Form** | `FormField`, `Input`, `TextArea`, `Checkbox`, `Radio`, `Switch`, `Select`, `ComboBox`, `PhoneInput`, `FileInput`, `DateCalendar`, `DateField`, `DatePicker`, `DateTimeField`, `DateTimePicker`, `TimeField`, `TimePicker` |
| **Overlay** | `Modal`, `ModalForm`, `Popover`, `Tooltip`, `Dropdown` / `DropdownItem` |
| **Feedback** | `Alert`, `Notification*` + `notificationManager` |
| **Layout / data** | `Tabs`, `Table*`, `ButtonGroup` |
| **Utils** | `cn`, `useHtmlDarkClass` |

---

## 5. Architecture Rules (Library vs Host)

1. **This package does not own the Tailwind theme.** Hosts define `@theme` tokens and import `theme/reference.css` or `theme/required-roles.css`.
2. **Hosts must `@source` the built package** so utilities used inside components are not purged:

   ```css
   @source "../node_modules/@efcnewlife/newlife-ui/dist";
   ```

3. **Components use M3 role classes**, centralized in `src/theme/role-classes.ts` — prefer those constants over raw `brand-*` / `gray-*` primitives.
4. **Merge class names with `cn`** from `src/cn.ts` — do not concatenate Tailwind strings by hand.
5. **Peer dependencies stay accurate.** New React-ecosystem deps used by hosts belong in `peerDependencies` (and usually `devDependencies` for Storybook/tests), not as bundled runtime deps unless intentional and minimal (`@base-ui/react`, `clsx`, `tailwind-merge` are current runtime deps).

---

## 6. Component Conventions

### Naming and files

| Kind | Convention | Example |
| ---- | ---------- | ------- |
| Folder under `src/` | `kebab-case` | `date-picker/`, `buttons-group/` |
| Component / public types | `PascalCase` | `DatePicker`, `FormFieldProps` |
| Utils / hooks | `camelCase` | `cn`, `useHtmlDarkClass` |
| Public module entry | `index.tsx` or `index.ts` | `src/input/index.tsx` |
| Stories | `*.stories.tsx` beside source | `Input.stories.tsx` |
| Comments / default copy | English only | Use `labels` props for i18n |

### Form fields pattern

Composite inputs (`Input`, `TextArea`, `PhoneInput`, `Select`, `ComboBox`, `DatePicker`, `TimePicker`, …) wrap **label + control + error/hint** via **`FormField`**.

- **`wrapperClassName`** — layout on the outer field wrapper (e.g. `space-y-1.5`)
- **`className`** — classes on the native control / trigger
- Export **`FormField`** when hosts need custom composites that match library spacing and error chrome

Match existing fields for props like `id`, `label`, `error`, `required`, `disabled`, `hint` where applicable.

### Date / time

- **`DateCalendar`**: custom calendar surface (day / month / year views); `weekStartsOn` default Sunday; optional submit chrome.
- **`DateField`**: Day.js calendar date field without trailing calendar icon (`FormField` parity).
- **`DatePicker`**: `DateField` + calendar icon + `DateCalendar`; single-day only (no multiple / range / time). Flatpickr is not used.
- **`TimeField`**: typed time-of-day field without trailing clock icon; Day.js time-of-day value (fixed day anchor); no `timezone`; `ampm` drives parse/default display; optional display-only `format`.
- **`TimePicker`**: `TimeField` + clock icon + private digital time surface (`variant="digital" | "sections"`, default `sections`); defaults `clearable=true`, `minuteStep=1`, `ampm=false`, `timePrecision="minutes"`; forwards `ampm` / `format` to TimeField.
- **`DateTimeField`**: single typed datetime field without trailing calendar icon; UTC Day.js store; optional display `timezone`; `ampm` drives parse/default display; optional display-only `format`.
- **`DateTimePicker`**: `DateTimeField` + calendar icon + side-by-side `DateCalendar` and private digital time surface; preserves time on date change; `variant` + submit chrome; forwards `ampm` / `format` to DateTimeField; no flatpickr.

### Icons

Import from `react-icons`; prefer the **`md`** set (e.g. `MdCalendarToday`).

### i18n-facing defaults

Default strings in components are English. For host-translated UI, expose a `labels` (or similar) prop — see `Select`.

### Router-aware links

- `DropdownItem`: accept `LinkComponent` from the host (`react-router` `Link`) when using `tag="a"` + `to`.
- `Alert`: optional `LinkComponent` for the link slot.

### Notifications

`NotificationProvider`, `NotificationContainer`, `useNotification`, and `notificationManager` are the single registration path for imperative `notificationManager.show(...)`.

---

## 7. Styling Checklist (when changing UI)

1. Prefer tokens from `src/theme/role-classes.ts`.
2. If a new recurring class pattern appears, add it to `role-classes.ts` rather than scattering duplicates.
3. Do not hardcode hex colors in components when a role exists.
4. Verify light **and** dark via Storybook Color theme toolbar (`.storybook/apply-storybook-theme.ts` toggles `.dark` on `<html>`).
5. Read `theme/token-contract.md` before changing role names or breaking host contracts.

---

## 8. Adding a Component (Checklist)

1. Create `src/<kebab-name>/` with `index.tsx` (and types as needed).
2. Use `cn` + `role-classes`; wrap forms with `FormField` when it is an input-like control.
3. Add `*.stories.tsx` covering primary variants and at least one dark-friendly story if relevant.
4. Add or extend Vitest coverage under `tests/` (render smoke + critical behavior).
5. Re-export from `src/index.ts`.
6. Update `peerDependencies` if you introduce a new host-provided library.
7. Note the change under `CHANGELOG.md` → `## [Unreleased]` (Added / Changed / Fixed / Breaking).
8. Run `pnpm run typecheck`, `pnpm run test`, `pnpm run build` before handing off.

---

## 9. Testing

| Location | Role |
| -------- | ---- |
| `tests/*.test.tsx` | Component / hook unit tests |
| `tests/smoke/components.test.tsx` | Broad import/render smoke |
| `tests/render.tsx`, `tests/setup.ts` | Shared test helpers |

```bash
pnpm run test
pnpm run test:watch
```

Prefer Testing Library queries; assert accessible names and critical props rather than brittle class snapshots.

---

## 10. Git, CI, and Release

### Git

- Land work on `main` **via Pull Request** only (see `.cursor/rules/standard.mdc`).
- Agents: do **not** `git commit` / `push` / `tag` / merge to `main` unless the user explicitly asks.

### Release (default)

1. Feature PRs merge to `main` with Verify green.
2. Dedicated **`chore: release x.y.z`** PR: bump `package.json` `version` + `## [x.y.z]` in `CHANGELOG.md`.
3. After merge: `git pull`, tag **`x.y.z`** (no `v` prefix) on `origin/main`, push the tag.
4. Tag push → `.github/workflows/publish.yml` → GitHub Packages + GitHub Release notes from CHANGELOG.

Tag name **must** equal `package.json` version and the `## [x.y.z]` header.

---

## 11. Do NOT (Agent Guardrails)

| Action | Reason |
| ------ | ------ |
| Ship a duplicate host Tailwind `@theme` inside components | Tokens belong to the host |
| Use primitive color scales when a role exists | Breaks M3 contract / dark mode |
| Skip `src/index.ts` re-export for public APIs | Consumers cannot import the symbol |
| Add heavy runtime deps without need | Library size and peer surface |
| Apply `newlife-core-api` Python/Poetry/Alembic conventions here | Wrong stack |
| Commit / push / tag without explicit user request | Automation policy |
| Treat local `main` merge as release | Must go through PR + tag workflow |

---

## 12. Key Files Index

| File | Why read it |
| ---- | ----------- |
| `README.md` | Install, host Tailwind/`@source`, theme CSS, peers |
| `.cursor/rules/standard.mdc` | Naming, git, release rules |
| `src/index.ts` | Canonical public exports |
| `src/theme/role-classes.ts` | Shared M3 role class maps |
| `src/form-field/index.tsx` | Form chrome pattern |
| `theme/token-contract.md` | Host token / role contract |
| `theme/reference.css` | Default primitives + roles |
| `CHANGELOG.md` | Consumer-facing change history |
| `tsup.config.ts` | Bundle entry and externals |
| `package.json` | Version, peers, exports, scripts |

---

## 13. Mental Model for AI Agents

| Task type | Start here |
| --------- | ---------- |
| New UI component | Mirror a similar folder under `src/` → stories → tests → `src/index.ts` → Unreleased changelog |
| Restyle existing control | `role-classes.ts` + component `index.tsx`; check Storybook light/dark |
| Form field behavior | `FormField` + closest sibling (`Input`, `DatePicker`, …) |
| Host integration / theme break | `theme/token-contract.md`, `README.md` Host app setup |
| Notification API | `src/notification/` |
| Release | `CHANGELOG.md` + `package.json` version; do not tag unless asked |
| Spec / tickets for library work | GitHub Issues via `docs/agents/issue-tracker.md` |

**Prefer minimal diffs.** Match existing component patterns before introducing new abstractions.

---

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (via `gh`). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
