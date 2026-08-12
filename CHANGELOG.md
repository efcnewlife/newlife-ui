# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.3.3] - 2026-08-12

### Summary

DateTime / Time field wall-clock text follows `ampm`, with an optional display-only `format` prop.

### Changed

- **`DateTimeField` / `TimeField`**: `ampm` now drives parse and default wall-clock display (12-hour with English `AM`/`PM`), not only the picker digital surface. When `ampm` is true, `inputMode` is text-capable. Unambiguous 24-hour complete strings (hour `00` or `13`–`23`) still parse and normalize to the 12-hour default display; hours `01`–`12` without a meridian stay incomplete so progressive 12-hour typing is not committed early.
- **`DateTimePicker` / `TimePicker`**: forward `ampm` (and optional display-only `format`) to the composed Field so field text matches the digital time surface.

### Added

- **`format` prop** on `DateTimeField`, `TimeField`, `DateTimePicker`, and `TimePicker`: optional Day.js token string for **committed display only** (does not change parse, typing mask, or default placeholder).

## [0.3.2] - 2026-08-11

### Summary

Select multiple option checkmarks no longer require the host `@tailwindcss/forms` plugin.

### Fixed

- **`Select` multiple options**: selection checkmarks no longer depend on the host installing `@tailwindcss/forms`. Options use the same `MdCheck` indicator as `ComboBox` / `Checkbox`, so checked rows show a visible tick without the forms plugin background-image.

## [0.3.1] - 2026-08-11

### Summary

Portal Floating surfaces (Select, ComboBox, pickers, Dropdown, Popover, Tooltip) above Modal / ModalForm sticky footers so open panels are no longer clipped or covered.

### Fixed

- **Floating surfaces in Modal / ModalForm**: Select, ComboBox, DatePicker, DateTimePicker, TimePicker, DateRangePicker, Dropdown, Popover, and Tooltip now render through a shared portal above the Modal shell, so sticky footers no longer clip or cover open surfaces. Escape and outside press dismiss the open Floating surface before closing the Modal.

## [0.3.0] - 2026-08-11

### Summary

Ship the Day.js Field→Picker date/time family (and remove flatpickr), add the DateRange stack, and fix ComboBox / light theme surface contrast.

### Added

- **`DateRangeCalendar`**: dual-month inclusive calendar-date range surface with half-selection, swap normalization, restart-after-complete, optional host `shortcuts` in a side column (`shortcutsPlacement`: `left` | `right`, default `left`), optional `showSubmitButton` (no `showTodayButton`), and Day.js `{ start, end } | null` `onChange(value, meta)`.
- **`DateRangeField`**: FormField-parity single typed range field without a trailing calendar icon; half-selection displays as `YYYY-MM-DD –`; free-text parse with `PickerChangeMeta.validationError`.
- **`DateRangePicker`**: `DateRangeField` + calendar icon + popover `DateRangeCalendar`. Defaults `clearable=true`; closes on complete range when submit is off; stays open on half-selection; optional submit / host side shortcuts (`shortcutsPlacement`).
- Exported range types: `DateRangeValue`, `DateRangeShortcut`, `DateRangeCalendarProps`, `DateRangeFieldProps`, `DateRangePickerProps`.
- **`DateCalendar`**: standalone single-date calendar surface with day / month / year views, configurable `weekStartsOn` (default Sunday), outside-month days, optional footer divider with `showTodayButton` / `showSubmitButton` / `onSubmit` / `labels.today` / `labels.submit`, and Day.js `onChange(value, meta)`.
- **`DateField`**: FormField-parity date input without a trailing calendar icon; controlled Day.js values and `onChange(value, meta)`.
- **`TimeField`**: FormField-parity time-of-day input without a trailing clock icon; controlled time-of-day Day.js values anchored to `1970-01-01`, typed `HH:mm` / `HH:mm:ss` (via `timePrecision`), and `onChange(value, meta)`. No `timezone` prop.
- **`DateTimeField`**: FormField-parity datetime input without a trailing calendar icon; controlled **UTC** Day.js stored values, optional display `timezone`, typed `YYYY-MM-DD HH:mm` / `HH:mm:ss`, bounds (`minDate` / `maxDate` / `minDateTime` / `maxDateTime`), and `onChange(value, meta)`.
- **`DateTimePicker`**: rebuilt on `DateTimeField` + calendar icon + side-by-side `DateCalendar` and private digital time surface. UTC Day.js store, optional display `timezone`, retained bounds / `clearable` / `minuteStep` / `timePrecision` / `ampm`, plus `variant` (`digital` | `sections`, default `sections`) and optional footer `showSubmitButton` with Now (left) and Cancel / OK (right) (`labels.now` / `labels.cancel` / `labels.submit`; never gates `onChange`). Selecting a calendar date preserves the current time-of-day (defaults to `00:00` when unset).
- Runtime dependency **`dayjs`** (with utc / timezone plugins used internally).
- Exported picker types: `DateCalendarProps`, `DateFieldProps`, `DatePickerProps`, `DateTimeFieldProps`, `DateTimePickerProps`, `TimeFieldProps`, `TimePickerProps`, `PickerChangeMeta`, `TimePrecision`.

### Changed

- **`DatePicker`**: rebuilt on `DateField` + `DateCalendar` (calendar icon + popover calendar). Controlled `value` / `defaultValue` / `onChange` use Day.js (`Dayjs | null`) and `PickerChangeMeta`. Optional `timezone`, `weekStartsOn`, `clearable` (default `true`), and submit / today chrome props. No longer uses flatpickr.
- **`TimePicker`**: rebuilt on `TimeField` + private digital time surface (MUI Digital Clock–shaped). Controlled `value` / `defaultValue` / `onChange` use time-of-day Day.js (`Dayjs | null`) and `PickerChangeMeta`. Supports `variant` (`digital` | `sections`, default `sections`), `clearable` (default `true`), `minuteStep` (default `1`), `ampm` (default `false`), and `timePrecision` (default `minutes`). Selection commits immediately (no confirm step). No `timezone` prop.
- **`DateTimePicker`**: no longer uses flatpickr; composed from design-system `DateCalendar` + shared digital time surface. When `showSubmitButton` is true, Cancel / OK actions sit in a full-width footer under both surfaces (right-aligned), not inside the calendar panel.

### Breaking changes

- **`DatePicker` value API**: hosts must pass Day.js (`Dayjs | null`) instead of `YYYY-MM-DD` strings; `onChange` no longer receives flatpickr `dateStr` / `instance`.
- **`DatePicker` `defaultDate`**: renamed to **`defaultValue`**.
- **`DatePicker` modes removed**: `mode` (`multiple` / `range` / `time`) is no longer part of the public API — single calendar day only. Use Time* / DateTime* components for time or datetime.
- **`DatePickerMode` / `Dayjs[]` value**: removed from exports; array values are no longer accepted.
- **`TimePicker` value API**: hosts must pass time-of-day Day.js (`Dayjs | null`) instead of native `type="time"` strings; `onChange` is `(value, meta)` instead of a DOM `ChangeEvent`. Migrate string values by parsing into Day.js (anchor date is conventional `1970-01-01`).
- **`TimePicker` native props removed**: `name`, `min`, `max`, and `step` are no longer part of the public API (use `minuteStep` / `timePrecision` / bounds via host form logic as needed).
- **`DateTimePicker` composition**: hosts that customized flatpickr chrome or CSS must switch to Field→Picker surfaces (`DateTimeField` alone, or `DateTimePicker` popover). Value contract remains UTC Day.js + display `timezone`.
- **`flatpickr` peer removed**: the package no longer depends on or peers `flatpickr`. Hosts can drop the peer install when nothing else needs it.

### Fixed

- **`ComboBox` dropdown**: panel uses `surface` background (same as `Select`) for readable contrast in light theme.
- **Theme light roles**: `--color-surface-container-high` maps to `gray-100` instead of `gray-dark`.

## [0.2.1] - 2026-08-08

### Summary

Add **`iconOnly`** support to **`ButtonGroup`** for compact icon toggles (e.g. list / calendar view switchers), with accessibility via `aria-label` / `title` from `text`.

### Added

- **`ButtonGroupButton.iconOnly`**: when `true` and an `icon` is provided, render the icon only; keep `text` for `aria-label` and `title`.
- Storybook **`ButtonGroup` / IconOnly** story demonstrating square icon-only toggles.

## [0.2.0] - 2026-06-20

### Summary

Adopt M3-aligned color roles across all components; ship theme contract CSS and documentation for host integration. Add **Storybook** and **Vitest** for component development, **`FormField`** for consistent form layout, **`Slider`**, and **`Alert`** sizing/width options.

### Added

- **`theme/reference.css`**: full primitive palette + color role mappings (light + dark baseline).
- **`theme/required-roles.css`**: role mappings only for hosts with existing primitives.
- **`theme/token-contract.md`**: required roles, pairing rules, deprecated tokens.
- **`theme/preview.html`**: local role preview page.
- **`src/theme/role-classes.ts`**: centralized Tailwind class maps for components.
- Package exports: `@efcnewlife/newlife-ui/theme/reference.css`, `theme/required-roles.css`.
- Docs in **newlife-docs**: color system and host theme integration guides.
- **`Slider`**: range input built on `@base-ui/react/slider` with M3 role styling; supports single value, range, multiple thumbs, vertical orientation, and disabled state.
- Runtime dependency **`@base-ui/react`** for Slider headless behavior.
- Exported **`FormField`** wrapper for custom host fields (label, error, hint, `wrapperClassName`); exported **`FormFieldProps`**.
- **`wrapperClassName`** on Input, TextArea, PhoneInput, Select, ComboBox, DatePicker, and TimePicker.
- **`Alert`**: optional `size` (`sm` | `md` | `lg`), `width` (`auto` | `full` | `sm` | `md` | `lg` | `xl`, default `full`), and `messageLines` (default `3`, minimum `1`); exported **`AlertSize`**, **`AlertWidth`**.
- **Storybook 8** with Tailwind v4 + `theme/reference.css`; co-located `*.stories.tsx` for all exported components; stories use explicit `render` callbacks.
- Storybook **Color theme** toolbar: **Light** and **Dark** presets (`.storybook/apply-storybook-theme.ts`).
- **Vitest** + Testing Library (`pnpm run test`, `pnpm run test:watch`); unit/render tests under `tests/`.
- CI **Verify** job runs `test` and `build-storybook`.

### Changed

- **All components** now use semantic color roles (`primary`, `on-surface`, `error-container`, etc.) instead of `brand-*`, `gray-*`, `blue-light-*`, or hardcoded hex.
- **`Switch.color`**: `"primary"` | `"neutral"` preferred; `"blue"` | `"gray"` deprecated aliases.
- Composite form fields (Input, TextArea, PhoneInput, Select, ComboBox, DatePicker, TimePicker) now render a single wrapper DOM node via **`FormField`** instead of a React Fragment root; use **`wrapperClassName`** for field-level layout.
- Storybook color theme toolbar simplified to **Light** / **Dark** only (removed Portal/Booking accent presets).

### Fixed

- **Storybook / dark themes**: dark presets use plain CSS variables on `.dark` selectors (nested `@theme` was merged into `:root` by Tailwind v4, so presets looked identical).
- **`Select` dropdown options**: panel uses `surface` background instead of `surface-container-high`; option hover/focus/selected colors align with `ComboBox` (readable contrast in light theme).
- **Storybook `Modal` / `ModalForm`**: fullscreen layout and portal-style panel sizing (`max-w-lg mx-4 p-6`) matching host usage; default stories open via trigger button.

### Breaking changes

- **Host apps** must define color roles (import `reference.css` or `required-roles.css`) **before** upgrading to `0.2.0`, or component colors will not render.
- Composite form fields no longer expose a Fragment root; host CSS that relied on direct sibling selectors between label and control may need updating (use **`wrapperClassName`** instead).

### Host app / consumers

1. Add `@import "@efcnewlife/newlife-ui/theme/reference.css"` (or `required-roles.css`) to host CSS after Tailwind.
2. Keep `@source` on `newlife-ui/dist`.
3. Bump to `@efcnewlife/newlife-ui@^0.2.0`.
4. Audit form-field layout CSS after the **`FormField`** wrapper change; use **`wrapperClassName`** on inputs or export **`FormField`** for custom fields.
5. See newlife-docs: `color_system.md`, `host_theme_integration.md`.

## [0.1.1] - 2026-03-21

### Summary

Patch release: `Button` consumer `className` ordering and stricter publish guard (package version must match the pushed tag).

### Fixed

- **Button**: Apply consumer `className` after built-in variant and size classes so hosts can override styles as intended.

### Changed

- **CI**: Fail publish job when `package.json` `version` does not equal the semver tag name.

### Breaking changes

None.

## [0.1.0] - 2026-03-21

First public release. Covers all commits from initial extract through CI workflow updates on this date (`43fbfe8` … `16fbce4`).

### Summary

Shared React UI was extracted from Newlife Portal into a standalone TypeScript library built with `tsup` (ESM + declarations), published as `@efcnewlife/newlife-ui` on GitHub Packages with automated publishing on `x.y.z` tags.

### Added

- **Build & package**: TypeScript package with `tsup` (ESM + `.d.ts`), `exports` map, and peer dependencies for React 18–19, `react-icons`, and `flatpickr`.
- **Styling helper**: `cn` (`clsx` + `tailwind-merge`).
- **Types & hooks**: `CountryCode`, `PopoverPosition`, `useHtmlDarkClass`.
- **Notifications**: `NotificationProvider`, `useNotification`, `notificationManager`, `Notification`, `NotificationContainer`, and related types for one shared imperative API across host apps.
- **Form & input**: `Button`, `ButtonGroup`, `Label`, `Input`, `TextArea`, `Checkbox`, `Radio`, `Switch`, `Spinner`, `Select` / `SelectOption`, `FileInput`, `ComboBox`, `DatePicker`, `TimePicker`, `PhoneInput`.
- **Layout, overlay & feedback**: `Tabs`; `Table` (`TableBody`, `TableCell`, `TableHeader`, `TableRow`); `Modal`, `ModalForm` (+ `ModalFormHandle`); `Tooltip` (+ `TooltipPlacement`); `Popover`; `Dropdown`, `DropdownItem` (+ `DropdownLinkComponentProps`); `ProgressBar`; `Badge`; `Alert` (+ `AlertLinkComponentProps`).
- **Host decoupling**: Optional `LinkComponent` on `DropdownItem` and `Alert` for router-agnostic navigation; `Select` uses optional `labels` instead of `react-i18next`; `Tooltip` follows document dark-mode class instead of app `ThemeContext`; `PopoverPosition` and `CountryCode` live in the package to avoid portal-only imports.
- **Documentation**: README for Tailwind v4 (`@source` for `dist`), peers, notifications, router links, `Select` labels, install from GitHub Packages, and maintainer publish flow.
- **Distribution & CI**: `@efcnewlife/newlife-ui` with `publishConfig` for `npm.pkg.github.com`, consumer `.npmrc` guidance, GitHub Actions publish on semantic tags; tag pattern `x.y.z` (no `v`); pnpm version from `package.json` `packageManager`; `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`; `actions/checkout@v5` and `actions/setup-node@v5`.

### Breaking changes

None (initial release).

### Host app / consumers

- Tailwind v4: register `@source` for this package’s `dist` in the host so classes used inside the library are not purged (see README).
- Install peers: `react`, `react-dom`, `react-icons`, `flatpickr` where date/time pickers are used.
- Install from GitHub Packages with `.npmrc` scoped to `@efcnewlife` (see README).
