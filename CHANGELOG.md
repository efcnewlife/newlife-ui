# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
