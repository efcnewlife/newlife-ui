# Time digital surfaces and DateTime Field/Picker composition

TimeField / TimePicker use Day.js **time-of-day** values anchored to a fixed conventional calendar day (for example `1970-01-01`), with no `timezone` prop — clock time is zone-agnostic. The time UI is MUI Digital Clock–shaped (`variant="digital" | "sections"`, default `sections`), not an analog TimeClock, and stays a **private** shared module composed by TimePicker and DateTimePicker (not a public DigitalClock export). DateTimeField is a single typed field (UTC store, display `timezone` per ADR 0001); DateTimePicker is Field + calendar icon + side-by-side DateCalendar and that digital time surface, preserving time when the date changes, keeping existing datetime props plus `variant` and DateCalendar-style submit chrome, and **removing flatpickr** from the package. We rejected anchoring time-of-day to "today", exposing DigitalClock publicly in v1, analog clocks, and shipping DateTime Field split while still on flatpickr.

## Consequences

- Implement **#13** (TimeField + TimePicker) before merged DateTime work.
- Merged ticket **#14** absorbs **#12** (Field→Picker + off flatpickr); close #12 as duplicate when #14 is rewritten.
- ADR 0001 / 0002 no longer treat flatpickr as the DateTime UI engine after #14 lands.
- Defaults for Time*: `clearable=true`, `minuteStep=1`, `ampm=false`, `timePrecision="minutes"`.
