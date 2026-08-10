# Custom DateCalendar with Field/Picker composition

Date-line UI no longer uses flatpickr. We expose an MUI-X-shaped stack — `DateCalendar` (calendar surface), `DateField` (no icon), `DatePicker` (Field + calendar icon + DateCalendar) — with Day.js values from ADR 0001. Flatpickr remains only for the current `DateTimePicker` until #12/#14. We rejected keeping flatpickr for DatePicker (theme/control limits vs the booking Figma calendar) and rejected a host-only `BookingDatePicker` fork so the design system owns one calendar surface.

## Consequences

- ADR 0001's "flatpickr as the UI engine" no longer applies to **DatePicker** / **DateCalendar**; it still applies to **DateTimePicker** until that migration.
- `DatePicker` drops multiple/range/time modes; single-day only.
- `DateCalendar` includes day, month, and year views (MUI-shaped); v1 does not require full MUI slots parity.
- Submit / Done copy uses a `labels` bag (as with Select), e.g. `labels.submit`, alongside FormField `label`.
- Time* and DateTime* Field/Picker follow the same composition in later tickets (#13, #14).
