# Day.js pickers with UTC stored values

`DateTimePicker` (and the breaking `DatePicker` Day.js migration) use Day.js as a library dependency, not a peer. Controlled datetime values are stored as UTC Day.js values; an optional `timezone` prop only changes how the value is rendered (MUI-style), defaulting display to the zone on `value` / `defaultValue`, or `"system"` when both are empty. We rejected wall-clock strings (`datetime-local`) and moment as the public contract so the library owns one date model while hosts keep API UTC conversion at their boundary.

## Considered options

- Wall-clock `YYYY-MM-DDTHH:mm` strings (current portal `datetime-local`) — easy drop-in, weak timezone story
- Native `Date` as the public contract — light, but easy to confuse with local wall time
- Day.js as peer + adapter (full MUI shape) — flexible, higher host setup cost for a small library
- **Chosen**: Day.js dependency, UTC stored values, optional display `timezone`; date-line UI in ADR 0002; Time* / DateTime composition and removing flatpickr in ADR 0003

## Consequences

- `DatePicker` value API becomes Day.js (breaking for existing string consumers)
- Portal keeps moment for now; migration to these pickers is a separate ticket
- `onChange` is `(value, meta)` with MUI-like `validationError` / `source`, not flatpickr `dateStr` / `instance`
- Date-line calendar chrome is superseded by ADR 0002 (`DateCalendar` / Field / Picker)
- DateTime UI leaves flatpickr under ADR 0003 / issue #14 (which absorbs #12); Time-of-day values use a fixed date anchor (see ADR 0003), distinct from UTC-stored DateTime values
