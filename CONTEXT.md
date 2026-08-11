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
A form field that displays or edits a time-of-day without a trailing clock icon and without a `timezone` prop. Its controlled value is a time-of-day Day.js value, not a wall-clock string. Users may type a wall-clock string in the field (for example `HH:mm` / `HH:mm:ss`); that text is parsed into the Day.js value and is not the public contract.
_Avoid_: native `type="time"` string field as the public contract, TimePicker (the field-only surface), display `timezone` on time-only controls

**TimePicker**:
A form control built on TimeField that adds clock-affordance chrome (including a clock icon) and a digital time-selection surface (MUI Digital Clock–shaped — not an analog clock face). v1 supports `variant="digital" | "sections"` (default **`sections`**): a single time list or multi-section hours / minutes [/ seconds] lists. The surface itself is composed privately inside TimePicker (not a separate public export) and is shared internally with DateTimePicker. Defaults include `clearable=true`, `minuteStep=1`, `ampm=false`, `timePrecision="minutes"`. Replaces the legacy native-string TimePicker as the public TimePicker product.
_Avoid_: native `type="time"` string API as the public contract, TimeClock / analog clock face as the time UI, public DigitalClock export as a v1 requirement, `timezone` on time-only controls

**Time-of-day Day.js value**:
A Day.js value used by TimeField / TimePicker where only the time-of-day matters. The calendar date is anchored to a fixed conventional day (for example `1970-01-01`) so the same clock time always compares equal; hosts should treat hour / minute / second as the meaningful parts.
_Avoid_: using "today" as the date anchor, wall-clock `HH:mm` strings as the public contract, requiring hosts to ignore an arbitrary date part

**DateTimeField**:
A form field that displays or edits a date and time-of-day in a **single** typed field without a trailing calendar icon. Its controlled **stored value** is a UTC Day.js value; optional `timezone` affects display only (same store-UTC / display-zone rules as DateTimePicker). Planned as the Field half of the DateTime stack under ADR 0003 / #14.
_Avoid_: DateTimeInput, datetime-local, DateTimePicker (the field-only surface), splitting into two public fields as the DateTimeField product

**DateTimePicker**:
A form control for date and time-of-day. Stored value remains UTC Day.js; `timezone` is display-only with the same fallbacks as before. Under ADR 0003 / #14 it becomes DateTimeField + calendar icon + side-by-side DateCalendar and the shared digital time surface (preserving time when the date changes, with `variant` and DateCalendar-style submit chrome), and flatpickr is removed from the package. Until #14 lands, the shipped control remains the existing flatpickr-based DateTimePicker.
_Avoid_: DateTimeInput, datetime-local, DatePicker (when time is included), wall-clock strings as the public contract, flatpickr as the long-term DateTime UI engine

**Day.js value**:
The canonical controlled value type for date/time fields and pickers (`dayjs` / `Dayjs` | `null`). Day.js is shipped as a library dependency of `@efcnewlife/newlife-ui`.
_Avoid_: moment, raw `Date` as the public contract, `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm` / `HH:mm` strings as the public contract

**Picker change meta**:
The optional second argument to field/picker `onChange`, carrying change context (`validationError`, `source`) rather than a parallel string or flatpickr instance.
_Avoid_: dateStr-as-second-truth, flatpickr `instance` in the public contract
