import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DateTimePicker from "../src/date-time-picker";
import { dayjs } from "../src/lib/dayjs";

describe("DateTimePicker", () => {
  it("renders a controlled UTC value using the timezone prop for display", () => {
    const value = dayjs.utc("2026-06-20T15:30:00.000Z");

    render(<DateTimePicker id="starts-at" label="Starts at" value={value} timezone="America/New_York" />);

    // 15:30 UTC -> 11:30 America/New_York (EDT, UTC-4)
    expect(screen.getByLabelText("Starts at")).toHaveValue("2026-06-20 11:30");
  });

  it("renders a trailing calendar icon", () => {
    const { container } = render(
      <DateTimePicker id="starts-at" label="Starts at" value={dayjs.utc("2026-06-20T15:30:00.000Z")} timezone="UTC" />,
    );

    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("button", { name: /open calendar/i })).toBeInTheDocument();
  });

  it("opens side-by-side DateCalendar and digital time surfaces", async () => {
    const user = userEvent.setup();

    render(<DateTimePicker id="starts-at" label="Starts at" value={dayjs.utc("2026-06-20T15:30:00.000Z")} timezone="UTC" />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));

    expect(screen.getByRole("button", { name: "June 15, 2026" })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: /hours/i })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: /minutes/i })).toBeInTheDocument();
  });

  it("preserves time-of-day when the calendar date changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = dayjs.utc("2026-06-20T15:30:00.000Z");

    render(<DateTimePicker id="starts-at" label="Starts at" value={value} timezone="UTC" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "June 15, 2026" }));

    expect(onChange).toHaveBeenCalled();
    const [nextValue, meta] = onChange.mock.calls.at(-1)!;
    expect(nextValue.isUTC()).toBe(true);
    expect(nextValue.toISOString()).toBe("2026-06-15T15:30:00.000Z");
    expect(meta).toEqual(
      expect.objectContaining({
        source: "view",
        validationError: null,
      }),
    );
  });

  it("defaults time to 00:00 when selecting a date with no current value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker id="starts-at" label="Starts at" value={null} defaultValue={null} timezone="UTC" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    // Calendar opens on the current month when empty; pick a day in view.
    const dayButton = screen.getByRole("button", { name: /August 15, 2026/i });
    await user.click(dayButton);

    const [nextValue] = onChange.mock.calls.at(-1)!;
    expect(nextValue.toISOString()).toBe("2026-08-15T00:00:00.000Z");
  });

  it("commits time selection while preserving the current date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker id="starts-at" label="Starts at" value={dayjs.utc("2026-06-20T15:30:00.000Z")} timezone="UTC" onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    const hours = screen.getByRole("listbox", { name: /hours/i });
    await user.click(Array.from(hours.querySelectorAll('[role="option"]')).find((option) => option.textContent === "16")!);

    const [nextValue, meta] = onChange.mock.calls.at(-1)!;
    expect(nextValue.toISOString()).toBe("2026-06-20T16:30:00.000Z");
    expect(meta.source).toBe("view");
  });

  it("renders a single digital list when variant is digital", async () => {
    const user = userEvent.setup();

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:00:00.000Z")}
        timezone="UTC"
        variant="digital"
        minuteStep={30}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    expect(screen.getByRole("listbox", { name: /times/i })).toBeInTheDocument();
    expect(screen.queryByRole("listbox", { name: /hours/i })).not.toBeInTheDocument();
  });

  it("falls back to system display when value and defaultValue are empty", () => {
    render(<DateTimePicker id="starts-at" label="Starts at" value={null} />);

    expect(screen.getByLabelText("Starts at")).toHaveValue("");
  });

  it("clears to null when the clear control is used", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = dayjs.utc("2026-06-20T15:30:00.000Z");

    render(<DateTimePicker id="starts-at" label="Starts at" value={value} timezone="UTC" clearable onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(onChange).toHaveBeenCalledWith(null, expect.objectContaining({ source: "field", validationError: null }));
  });

  it("shows clear for uncontrolled defaultValue", () => {
    render(
      <DateTimePicker id="starts-at" label="Starts at" defaultValue={dayjs.utc("2026-06-20T15:30:00.000Z")} timezone="UTC" clearable />,
    );

    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("reports minDateTime validationError in onChange meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const minDateTime = dayjs.utc("2026-06-20T12:00:00.000Z");
    const value = dayjs.utc("2026-06-20T15:00:00.000Z");

    render(<DateTimePicker id="starts-at" label="Starts at" value={value} timezone="UTC" minDateTime={minDateTime} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    const hours = screen.getByRole("listbox", { name: /hours/i });
    await user.click(Array.from(hours.querySelectorAll('[role="option"]')).find((option) => option.textContent === "00")!);

    expect(onChange).toHaveBeenCalled();
    const withError = onChange.mock.calls.find((call) => call[1]?.validationError === "minDateTime");
    expect(withError).toBeTruthy();
    expect(withError![0].isUTC()).toBe(true);
  });

  it("reports maxDateTime validationError in onChange meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const maxDateTime = dayjs.utc("2026-06-20T12:00:00.000Z");
    const value = dayjs.utc("2026-06-20T10:00:00.000Z");

    render(<DateTimePicker id="starts-at" label="Starts at" value={value} timezone="UTC" maxDateTime={maxDateTime} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    const hours = screen.getByRole("listbox", { name: /hours/i });
    await user.click(Array.from(hours.querySelectorAll('[role="option"]')).find((option) => option.textContent === "23")!);

    expect(onChange).toHaveBeenCalled();
    const withError = onChange.mock.calls.find((call) => call[1]?.validationError === "maxDateTime");
    expect(withError).toBeTruthy();
  });

  it("does not gate onChange when showSubmitButton is true", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:30:00.000Z")}
        timezone="UTC"
        showSubmitButton
        onSubmit={onSubmit}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    expect(screen.getByRole("button", { name: "Now" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "June 15, 2026" }));
    expect(onChange).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("closes the popover on Cancel without calling onSubmit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:30:00.000Z")}
        timezone="UTC"
        showSubmitButton
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "OK" })).not.toBeInTheDocument();
  });

  it("sets the current UTC time when Now is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:30:00.000Z")}
        timezone="UTC"
        showSubmitButton
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "Now" }));

    expect(onChange).toHaveBeenCalled();
    const [nextValue, meta] = onChange.mock.calls.at(-1)!;
    expect(nextValue.isUTC()).toBe(true);
    expect(Math.abs(nextValue.diff(dayjs.utc(), "minute"))).toBeLessThanOrEqual(1);
    expect(meta).toEqual(
      expect.objectContaining({
        source: "view",
      }),
    );
  });

  it("shows am/pm options when ampm is true", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:30:00.000Z")}
        timezone="UTC"
        ampm
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    expect(screen.getByRole("listbox", { name: /meridiem/i })).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "AM" }));
    const [nextValue] = onChange.mock.calls.at(-1)!;
    expect(nextValue.toISOString()).toBe("2026-06-20T03:30:00.000Z");
  });

  it("forwards ampm and format to the composed DateTimeField text", () => {
    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:30:00.000Z")}
        timezone="UTC"
        ampm
        format="MMM D, YYYY h:mm A"
      />,
    );

    expect(screen.getByLabelText("Starts at")).toHaveValue("Jun 20, 2026 3:30 PM");
  });

  it("applies minuteStep to the digital time surface", async () => {
    const user = userEvent.setup();

    render(
      <DateTimePicker id="starts-at" label="Starts at" value={dayjs.utc("2026-06-20T15:00:00.000Z")} timezone="UTC" minuteStep={15} />,
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    const minutes = screen.getByRole("listbox", { name: /minutes/i });
    const labels = Array.from(minutes.querySelectorAll('[role="option"]')).map((option) => option.textContent);
    expect(labels).toEqual(["00", "15", "30", "45"]);
  });

  it("forwards className and Control size xs to the field", () => {
    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:00:00.000Z")}
        timezone="UTC"
        size="xs"
        className="host-class"
      />,
    );
    expect(screen.getByLabelText("Starts at")).toHaveClass("h-8", "text-xs", "px-2.5", "host-class", "pr-16");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<DateTimePicker id="starts-at" label="Starts at" labelClassName="text-on-primary" />);
    expect(screen.getByText("Starts at")).toHaveClass("text-on-primary");
  });
});
