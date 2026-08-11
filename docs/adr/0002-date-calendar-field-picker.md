# Custom DateCalendar with Field/Picker composition

Date-line UI no longer uses flatpickr. We expose an MUI-X-shaped stack — `DateCalendar` (calendar surface), `DateField` (no icon), `DatePicker` (Field + calendar icon + DateCalendar) — with Day.js values from ADR 0001. Flatpickr on DateTime is removed under ADR 0003 / #14. We rejected keeping flatpickr for DatePicker (theme/control limits vs the booking Figma calendar) and rejected a host-only `BookingDatePicker` fork so the design system owns one calendar surface.

## Consequences

- ADR 0001's "flatpickr as the UI engine" no longer applies to **DatePicker** / **DateCalendar**; DateTime leaves flatpickr in ADR 0003.
- `DatePicker` drops multiple/range/time modes; single-day only.
- `DateCalendar` includes day, month, and year views (MUI-shaped); v1 does not require full MUI slots parity.
- Submit / Done copy uses a `labels` bag (as with Select), e.g. `labels.submit`, alongside FormField `label`.
- Time* (#13) and DateTime Field/Picker (#14, absorbs #12) follow ADR 0003.
