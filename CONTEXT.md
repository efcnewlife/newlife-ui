# Newlife UI

Shared React UI vocabulary for the `@efcnewlife/newlife-ui` component library consumed by Newlife Portal hosts.

## Language

**DateCalendar**:
The calendar surface for browsing and choosing a single calendar date (Day.js). It supports day, month, and year views in the MUI Date Calendar sense, is composed by DatePicker (and later by datetime flows), and may be used inline on its own. Week start is configurable (for example `weekStartsOn`), defaulting to Sunday to match the booking calendar design. It is not the range-selection surface — that is DateRangeCalendar.
_Avoid_: CalendarPanel, BookingDatePicker (host-local name), flatpickr calendar chrome as the public surface, range selection as part of DateCalendar

**DateField**:
A form field that displays or edits a calendar date without a time-of-day and without a trailing calendar icon. Its controlled value is a Day.js calendar date. An optional `timezone` prop may be supplied when the calendar day must be interpreted in a zone; otherwise the value is zone-agnostic.
_Avoid_: Date input, date text field, DatePicker (the field-only surface)

**DatePicker**:
A form control built on DateField that adds calendar-affordance chrome (including a calendar icon) and opens or embeds a DateCalendar for choosing a single calendar date. Same Day.js value contract as DateField.
_Avoid_: Date input, CalendarPanel (as a separate product name), `YYYY-MM-DD` string as the public contract, multiple/range/time modes as part of DatePicker

**Date range value**:
An object `{ start, end }` of calendar-day Day.js values (no time-of-day), or `null` when cleared / unset. Both ends are inclusive when both are set. Same-day ranges (`start` and `end` on the same calendar day) are allowed. `start` and `end` may each be `Dayjs | null` so a half-selection (`start` set, `end` null) is a valid value for `onChange`. The library does not emit or treat as valid `{ start: null, end: Dayjs }`. When both are set, the value is normalized so `start ≤ end` (out-of-order second click is swapped). A later day click after a complete range replaces the value with a new half-selection rather than expanding the previous range.
_Avoid_: length-coded `Dayjs[]` / tuple unions as the public contract, `{ start: null, end: null }` as the empty representation (use `null` instead), putting range selection into DatePicker via `mode`, exclusive-end as the library default, From/To dual fields as the reason to choose this shape, expand-on-click after a complete range

**DateRangeCalendar**:
The calendar surface for browsing and choosing a calendar-date range (Day.js). It always shows **two** adjacent months (fixed; not a `calendars` prop), uses the same date range value contract as DateRangeField / DateRangePicker, and may be used inline on its own. Composed by DateRangePicker into a popover. Week start is configurable (`weekStartsOn`), defaulting like DateCalendar. Optional `showSubmitButton` footer and host-supplied date range shortcuts in a left/right side column (`shortcutsPlacement`); there is no `showTodayButton`.
_Avoid_: putting range selection into DateCalendar, configurable 1–3 month layout as a v1 requirement, `showTodayButton`, shortcuts below the calendar, flatpickr range chrome as the public surface

**DateRangeField**:
A form field that displays or edits a calendar-date range without a trailing calendar icon. Same date range value contract as DateRangePicker. Single input presentation (for example `YYYY-MM-DD – YYYY-MM-DD`), not From/To multiple fields. Keyboard editing is free-text parse on the whole string (DateField-shaped), not MUI section editing: successful parses update the value (including half-selection and `null`), and parse failures surface via `PickerChangeMeta.validationError`. Half-selection displays as `YYYY-MM-DD –` (trailing separator, empty end). Field half of the DateRange stack.
_Avoid_: Multi-input From/To as the DateRangeField product, DateRangePicker (the field-only surface), `YYYY-MM-DD` strings as the public contract, MUI section-field editing as a v1 requirement, hiding half-selection behind a single-date-looking string

**Date range shortcut**:
A host-supplied preset that applies a date range value in one action. Public item shape: optional `id`, required `label`, and `getValue: () => DateRangeValue | null`. Rendered in a **side column** when DateRangePicker or DateRangeCalendar receives a non-empty `shortcuts` array; placement is controlled by `shortcutsPlacement` (`left` | `right`, default `left`) — not below the calendar. The library does not define built-in presets such as "This week" or "Today". Applying a complete range follows the same close-on-complete rules as calendar selection when used inside DateRangePicker; `null` clears.
_Avoid_: shipping business-specific default shortcuts inside `@efcnewlife/newlife-ui`, treating shortcuts as required chrome, footer/bottom shortcut rows, `showTodayButton` as the way to express "today" on DateRangePicker

**DateRangePicker**:
A form control built on DateRangeField that adds calendar-affordance chrome (including a calendar icon) and opens or embeds a DateRangeCalendar for choosing a calendar-date range. Same date range value contract as DateRangeField. Optional footer chrome includes `showSubmitButton` with a `labels` bag (DatePicker-shaped Done/OK); there is **no** `showTodayButton` — presets use host-supplied date range shortcuts instead. Without submit, the popover closes when a complete range is selected and stays open during half-selection. Defaults align with DatePicker where applicable: `clearable=true`, configurable `weekStartsOn`, optional `timezone` (DateField-shaped), and `minDate` / `maxDate`.
_Avoid_: `mode="range"` on DatePicker, datetime range as part of this product, flatpickr range chrome as the public surface, From/To dual fields as the library default presentation, baking host business presets into default shortcuts, `showTodayButton` on DateRangePicker

**TimeField**:
A form field that displays or edits a time-of-day without a trailing clock icon and without a `timezone` prop. Its controlled value is a time-of-day Day.js value, not a wall-clock string. Users may type a wall-clock string in the field; that text is parsed into the Day.js value and is not the public contract. `ampm` selects the **parse / default display** clock: 24-hour (`HH:mm` / `HH:mm:ss`) or 12-hour with English `AM`/`PM` (`hh:mm A` / `hh:mm:ss A`); 12-hour mode still accepts a pasted 24-hour string and normalizes display. Optional `format` is a Day.js token string used **only** to render an already-committed value into the input; it does not change parse rules, typing mask, or placeholder. When `format` is set it wins for committed display; `ampm` still governs parse defaults and (via TimePicker) the digital time surface.
_Avoid_: native `type="time"` string field as the public contract, TimePicker (the field-only surface), display `timezone` on time-only controls, free-form `format` as the parse contract

**TimePicker**:
A form control built on TimeField that adds clock-affordance chrome (including a clock icon) and a digital time-selection surface (MUI Digital Clock–shaped — not an analog clock face). v1 supports `variant="digital" | "sections"` (default **`sections`**): a single time list or multi-section hours / minutes [/ seconds] lists. The surface itself is composed privately inside TimePicker (not a separate public export) and is shared internally with DateTimePicker. Defaults include `clearable=true`, `minuteStep=1`, `ampm=false`, `timePrecision="minutes"`. Passes `ampm` and optional display-only `format` through to TimeField; `ampm` also drives the digital time surface. Replaces the legacy native-string TimePicker as the public TimePicker product.
_Avoid_: native `type="time"` string API as the public contract, TimeClock / analog clock face as the time UI, public DigitalClock export as a v1 requirement, `timezone` on time-only controls

**Time-of-day Day.js value**:
A Day.js value used by TimeField / TimePicker where only the time-of-day matters. The calendar date is anchored to a fixed conventional day (for example `1970-01-01`) so the same clock time always compares equal; hosts should treat hour / minute / second as the meaningful parts.
_Avoid_: using "today" as the date anchor, wall-clock `HH:mm` strings as the public contract, requiring hosts to ignore an arbitrary date part

**DateTimeField**:
A form field that displays or edits a date and time-of-day in a **single** typed field without a trailing calendar icon. Its controlled **stored value** is a UTC Day.js value; optional `timezone` affects display only (same store-UTC / display-zone rules as DateTimePicker). Field half of the DateTime stack under ADR 0003. Same `ampm` / display-only `format` contract as TimeField: `ampm` selects parse and default wall-clock shape (`YYYY-MM-DD HH:mm` vs `YYYY-MM-DD hh:mm A`, with seconds variants); optional `format` overrides **committed** input text only. When `ampm` is true, the field uses a text-capable `inputMode` so `AM`/`PM` can be typed.
_Avoid_: DateTimeInput, datetime-local, DateTimePicker (the field-only surface), splitting into two public fields as the DateTimeField product, `format` as a parse or mask API

**DateTimePicker**:
A form control built on DateTimeField that adds calendar-affordance chrome (including a calendar icon) and a popover with **side-by-side** DateCalendar and the shared private digital time surface. Stored value remains UTC Day.js; `timezone` is display-only with the same fallbacks as before. Selecting a calendar date preserves the current time-of-day (defaulting to `00:00` when unset). Supports `variant` and DateCalendar-style submit chrome. Passes `ampm` and optional display-only `format` through to DateTimeField; `ampm` also drives the digital time surface. Flatpickr is not used.
_Avoid_: DateTimeInput, datetime-local, DatePicker (when time is included), wall-clock strings as the public contract, flatpickr as the DateTime UI engine

**Day.js value**:
The canonical controlled value type for date/time fields and pickers (`dayjs` / `Dayjs` | `null`). Day.js is shipped as a library dependency of `@efcnewlife/newlife-ui`.
_Avoid_: moment, raw `Date` as the public contract, `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm` / `HH:mm` strings as the public contract

**Picker change meta**:
The optional second argument to field/picker `onChange`, carrying change context (`validationError`, `source`) rather than a parallel string or flatpickr instance.
_Avoid_: dateStr-as-second-truth, flatpickr `instance` in the public contract

**Alert**:
An inline status notice bound to nearby content (a form, section, or panel). It has a title and an optional message. It is not a page-level announcement and not a toast.
_Avoid_: Banner, Notification, toast, parentBanner as the library product

**Banner**:
A page- or app-level announcement strip placed above host navigation. It occupies layout space and pushes the nav and content down; it does not overlay them. It is a full-bleed top strip of its parent (hosts place it as the outermost first child when it must span the full window, including above a sidebar). It is not an Alert-shaped card: no title, no control size or Alert width scale. It has one message; the message is host-composed copy and may include inline links. Severity is info, warning, or error — not success. A severity icon is part of the strip. It is dismissible only when the host supplies a dismiss action (icon control; accessible name from host labels, defaulting to "Dismiss"); whether it stays dismissed is a host concern. The library does not stack Banners — a host that needs two announcements renders two instances. Portal and booking hosts share this meaning. The host renders it and decides when it is shown. It is not a local form status, not a toast, and not a Floating surface.
_Avoid_: Alert, Notification, Hero, marketing banner, parentBanner as the library product, success as a Banner severity, overlaying or covering the host nav, Alert size/width as the Banner chrome

**Notification**:
A transient floating toast for a completed or imminent event. It is not a persistent page announcement and not an inline form status.
_Avoid_: Banner, Alert, snackbar as a separate product name

**Floating surface**:
The layer that opens from a control trigger and paints above surrounding UI — Select/ComboBox listboxes, picker popovers, Dropdown menus, Popover panels, and Tooltip bubbles. It is not the Modal shell or scrim, and it is not a Banner.
_Avoid_: dropdown (as the umbrella term), overlay panel (ambiguous with Modal), portal (implementation mechanism, not the product concept)

**Control size**:
A density step on a single-line form control (Input, PhoneInput, Select, ComboBox, DateField, TimeField, DateTimeField, DateRangeField, and the pickers built on those fields). Steps are xs, sm, md (the default), and lg. It sizes the control shell and in-shell adornments only. It does not size the floating surface and does not size the label.
_Avoid_: Button size (a different contract; not unified with this scale), using className as the official compact density, FileInput / TextArea as part of this scale until they join it, Tailwind font-size names (`base`, `xl`, `2xl`) as control size steps
