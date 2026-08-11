# DateRangeCalendar / DateRangeField / DateRangePicker stack

We need calendar-date range selection without reopening DatePicker's removed `mode="range"` path (ADR 0002). We publish a three-part stack parallel to DateCalendar / DateField / DatePicker: **DateRangeCalendar**, **DateRangeField**, and **DateRangePicker** (Picker = Field + calendar icon + DateRangeCalendar). Value is `{ start, end } | null` (half-selection allowed; empty is `null`; no end-only), both ends inclusive, same-day allowed, out-of-order second click normalized to `start ≤ end`, and a click after a complete range restarts like MUI (`{ start: clicked, end: null }`). DateRangeCalendar always shows **two** adjacent months (fixed; no `calendars` prop). Optional `showSubmitButton` / `labels` on the Picker (no `showTodayButton`); host-supplied **shortcuts** provide presets. Field editing is free-text parse (DateField-shaped), not MUI section editing; half-selection displays as `YYYY-MM-DD –`.

## Consequences

- DatePicker / DateCalendar remain single-day only; range is not a DatePicker mode.
- Public value shape deliberately differs from MUI's `[start, end]` array in favor of an explicit `{ start, end }` object.
- Hosts may use DateRangeCalendar inline without the field/picker chrome.
- Fixed dual-month layout; no MUI-style `calendars={1|2|3}` prop in v1.
- Shortcut labels and `getValue` logic live in the host; public item shape is `{ id?, label, getValue: () => DateRangeValue | null }`.
- "Today" as a one-click complete range is a host shortcut, not a first-class Today footer button on DateRangePicker.
