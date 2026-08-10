import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { dayjs } from "../src/lib/dayjs";
import DateTimePicker from "../src/date-time-picker";

describe("DateTimePicker", () => {
  it("renders a controlled UTC value using the timezone prop for display", () => {
    const value = dayjs.utc("2026-06-20T15:30:00.000Z");

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={value}
        timezone="America/New_York"
      />
    );

    // 15:30 UTC -> 11:30 America/New_York (EDT, UTC-4)
    expect(screen.getByLabelText("Starts at")).toHaveValue("2026-06-20 11:30");
  });

  it("calls onChange with a UTC Day.js value when the calendar changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = dayjs.utc("2026-06-20T15:30:00.000Z");

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={value}
        timezone="UTC"
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText("Starts at");
    await user.click(input);

    const dayButton = document.querySelector(
      ".flatpickr-calendar.open .flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)"
    ) as HTMLElement | null;
    expect(dayButton).toBeTruthy();
    await user.click(dayButton!);

    expect(onChange).toHaveBeenCalled();
    const [nextValue, meta] = onChange.mock.calls[0];
    expect(dayjs.isDayjs(nextValue)).toBe(true);
    expect(nextValue.isUTC()).toBe(true);
    expect(meta).toEqual(
      expect.objectContaining({
        source: expect.stringMatching(/^(field|view|unknown)$/),
      })
    );
    expect(meta).toHaveProperty("validationError");
  });

  it("falls back to system display when value and defaultValue are empty", () => {
    render(<DateTimePicker id="starts-at" label="Starts at" value={null} />);

    expect(screen.getByLabelText("Starts at")).toHaveValue("");
  });

  it("clears to null when the clear control is used", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = dayjs.utc("2026-06-20T15:30:00.000Z");

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={value}
        timezone="UTC"
        clearable
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(onChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ source: "field", validationError: null })
    );
  });

  it("shows clear for uncontrolled defaultValue", () => {
    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        defaultValue={dayjs.utc("2026-06-20T15:30:00.000Z")}
        timezone="UTC"
        clearable
      />
    );

    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("reports minDateTime validationError in onChange meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const minDateTime = dayjs.utc("2026-06-20T12:00:00.000Z");
    const value = dayjs.utc("2026-06-20T15:00:00.000Z");

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={value}
        timezone="UTC"
        minDateTime={minDateTime}
        onChange={onChange}
      />
    );

    await user.click(screen.getByLabelText("Starts at"));

    const hourInput = document.querySelector(
      ".flatpickr-calendar.open .flatpickr-hour"
    ) as HTMLInputElement | null;
    expect(hourInput).toBeTruthy();

    await user.tripleClick(hourInput!);
    await user.keyboard("00");
    hourInput!.dispatchEvent(new Event("change", { bubbles: true }));
    hourInput!.blur();

    const selectedDay = document.querySelector(
      ".flatpickr-calendar.open .flatpickr-day.selected"
    ) as HTMLElement | null;
    if (selectedDay) {
      await user.click(selectedDay);
    }

    expect(onChange).toHaveBeenCalled();
    const withError = onChange.mock.calls.find(
      (call) => call[1]?.validationError === "minDateTime"
    );
    expect(withError).toBeTruthy();
    expect(withError![0].isUTC()).toBe(true);
  });

  it("reports maxDateTime validationError in onChange meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const maxDateTime = dayjs.utc("2026-06-20T12:00:00.000Z");
    const value = dayjs.utc("2026-06-20T10:00:00.000Z");

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={value}
        timezone="UTC"
        maxDateTime={maxDateTime}
        onChange={onChange}
      />
    );

    await user.click(screen.getByLabelText("Starts at"));

    const hourInput = document.querySelector(
      ".flatpickr-calendar.open .flatpickr-hour"
    ) as HTMLInputElement | null;
    expect(hourInput).toBeTruthy();

    await user.tripleClick(hourInput!);
    await user.keyboard("23");
    hourInput!.dispatchEvent(new Event("change", { bubbles: true }));
    hourInput!.blur();

    const selectedDay = document.querySelector(
      ".flatpickr-calendar.open .flatpickr-day.selected"
    ) as HTMLElement | null;
    if (selectedDay) {
      await user.click(selectedDay);
    }

    expect(onChange).toHaveBeenCalled();
    const withError = onChange.mock.calls.find(
      (call) => call[1]?.validationError === "maxDateTime"
    );
    expect(withError).toBeTruthy();
  });

  it("applies minuteStep to the time spinner", async () => {
    const user = userEvent.setup();

    render(
      <DateTimePicker
        id="starts-at"
        label="Starts at"
        value={dayjs.utc("2026-06-20T15:00:00.000Z")}
        timezone="UTC"
        minuteStep={15}
      />
    );

    await user.click(screen.getByLabelText("Starts at"));

    const minuteInput = document.querySelector(
      ".flatpickr-calendar.open .flatpickr-minute"
    ) as HTMLInputElement | null;
    expect(minuteInput).toBeTruthy();
    expect(minuteInput!.step).toBe("15");
  });
});
