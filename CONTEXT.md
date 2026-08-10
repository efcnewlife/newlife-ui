# Newlife UI

Shared React UI vocabulary for the `@efcnewlife/newlife-ui` component library consumed by Newlife Portal hosts.

## Language

**DateCalendar**:
The calendar surface for browsing and choosing a single calendar date (Day.js). It supports day, month, and year views in the MUI Date Calendar sense, is composed by DatePicker (and later by datetime flows), and may be used inline on its own. Week start is configurable (for example `weekStartsOn`), defaulting to Sunday to match the booking calendar design.
_Avoid_: CalendarPanel, BookingDatePicker (host-local name), flatpickr calendar chrome as the public surface

**DateField**:
A form field that displays or edits a calendar date without a time-of-day and without a trailing calendar icon. Its controlled value is a Day.js calendar date. An optional `timezone` prop may be supplied when the calendar day must be interpreted in a zone; otherwise the value is zone-agnostic.
_Avoid_: Date input, date text field, DatePicker (the field-only surface)

**DatePicker**:
A form control built on DateField that adds calendar-affordance chrome (including a calendar icon) and opens or embeds a DateCalendar for choosing a single calendar date. Same Day.js value contract as DateField.
_Avoid_: Date input, CalendarPanel (as a separate product name), `YYYY-MM-DD` string as the public contract, multiple/range/time modes as part of DatePicker

**TimeField**:
A form field that displays or edits a time-of-day without a trailing clock icon. Its controlled value is a Day.js value (time-of-day), not a wall-clock string.
_Avoid_: native `type="time"` string field as the public contract, TimePicker (the field-only surface)

**TimePicker**:
A form control built on TimeField that adds clock-affordance chrome (including a clock icon) and a time-selection surface. Replaces the legacy native-string TimePicker as the public TimePicker product.
_Avoid_: native `type="time"` string API as the public contract

**DateTimeField**:
A form field that displays or edits a date and time-of-day without a trailing calendar icon. Its controlled **stored value** is a UTC Day.js value; optional `timezone` affects display only (same store-UTC / display-zone rules as DateTimePicker).
_Avoid_: DateTimeInput, datetime-local, DateTimePicker (the field-only surface)

**DateTimePicker**:
A form control built on DateTimeField that adds calendar-affordance chrome (including a calendar icon) and surfaces for choosing date and time. Stored value remains UTC Day.js; `timezone` is display-only with the same fallbacks as before.
_Avoid_: DateTimeInput, datetime-local, DatePicker (when time is included), wall-clock strings as the public contract

**Day.js value**:
The canonical controlled value type for date/time fields and pickers (`dayjs` / `Dayjs` | `null`). Day.js is shipped as a library dependency of `@efcnewlife/newlife-ui`.
_Avoid_: moment, raw `Date` as the public contract, `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm` / `HH:mm` strings as the public contract

**Picker change meta**:
The optional second argument to field/picker `onChange`, carrying change context (`validationError`, `source`) rather than a parallel string or flatpickr instance.
_Avoid_: dateStr-as-second-truth, flatpickr `instance` in the public contract
