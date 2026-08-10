# Newlife UI

Shared React UI vocabulary for the `@efcnewlife/newlife-ui` component library consumed by Newlife Portal hosts.

## Language

**DatePicker**:
A form control for selecting a calendar date without a time-of-day. Its controlled value is a Day.js value representing a calendar date. An optional `timezone` prop may be supplied when the calendar day must be interpreted in a zone; otherwise the value is zone-agnostic calendar date.
_Avoid_: Date input, calendar input, `YYYY-MM-DD` string as the public contract

**DateTimePicker**:
A form control for selecting a single calendar date together with a time-of-day. Its controlled **stored value** is a UTC Day.js value. By default the UI uses the timezone carried by `value` / `defaultValue`; when `timezone` is set, the UI renders in that zone while `onChange` still returns UTC (MUI-style store-UTC / display-zone). When both `value` and `defaultValue` are empty and `timezone` is omitted, display falls back to `"system"`.
_Avoid_: DateTimeInput, datetime-local, DatePicker (when time is included), wall-clock strings as the public contract

**Day.js value**:
The canonical controlled value type for date/time pickers (`dayjs` / `Dayjs` | `null`). Day.js is shipped as a library dependency of `@efcnewlife/newlife-ui`.
_Avoid_: moment, raw `Date` as the public contract, `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm` strings as the public contract

**Picker change meta**:
The optional second argument to picker `onChange`, carrying change context (`validationError`, `source`) rather than a parallel string or flatpickr instance.
_Avoid_: dateStr-as-second-truth, flatpickr `instance` in the public contract
