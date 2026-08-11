import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { dayjs, type Dayjs } from "../src/lib/dayjs";
import DateTimeField from "../src/date-time-field";

describe("DateTimeField", () => {
  it("renders a controlled UTC value using the timezone prop for display without a calendar icon", () => {
    const value = dayjs.utc("2026-06-20T15:30:00.000Z");
    const { container } = render(
      <DateTimeField
        id="starts-at"
        label="Starts at"
        value={value}
        timezone="America/New_York"
      />
    );

    // 15:30 UTC -> 11:30 America/New_York (EDT, UTC-4)
    expect(screen.getByLabelText("Starts at")).toHaveValue("2026-06-20 11:30");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("shows FormField label and error", () => {
    render(
      <DateTimeField
        id="starts-at"
        label="Starts at"
        error="Start time is required"
        required
      />
    );

    expect(screen.getByText("Starts at")).toBeInTheDocument();
    expect(screen.getByText("Start time is required")).toBeInTheDocument();
  });

  it("calls onChange with a UTC Day.js value and field meta when typed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimeField
        id="starts-at"
        label="Starts at"
        value={null}
        timezone="UTC"
        onChange={onChange}
      />
    );

    await user.type(screen.getByLabelText("Starts at"), "202606201530");

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.isUTC()).toBe(true);
    expect(value.toISOString()).toBe("2026-06-20T15:30:00.000Z");
    expect(meta).toEqual(
      expect.objectContaining({
        source: "field",
        validationError: null,
      })
    );
  });

  it("parses HH:mm:ss when timePrecision is seconds", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimeField
        id="starts-at"
        label="Starts at"
        value={null}
        timezone="UTC"
        timePrecision="seconds"
        onChange={onChange}
      />
    );

    await user.type(screen.getByLabelText("Starts at"), "20260620153045");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.toISOString()).toBe("2026-06-20T15:30:45.000Z");
    expect(meta.validationError).toBeNull();
  });

  it("emits invalidDate meta for incomplete typed input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimeField
        id="starts-at"
        label="Starts at"
        value={null}
        timezone="UTC"
        onChange={onChange}
      />
    );

    await user.type(screen.getByLabelText("Starts at"), "20260620");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value).toBeNull();
    expect(meta).toEqual(
      expect.objectContaining({
        source: "field",
        validationError: "invalidDate",
      })
    );
  });

  it("reports minDateTime validationError in onChange meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const minDateTime = dayjs.utc("2026-06-20T12:00:00.000Z");

    render(
      <DateTimeField
        id="starts-at"
        label="Starts at"
        value={null}
        timezone="UTC"
        minDateTime={minDateTime}
        onChange={onChange}
      />
    );

    await user.type(screen.getByLabelText("Starts at"), "202606201000");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.isUTC()).toBe(true);
    expect(meta.validationError).toBe("minDateTime");
  });

  it("keeps in-progress text when backspace makes the datetime incomplete", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<Dayjs | null>(
        dayjs.utc("2026-06-20T15:30:00.000Z")
      );
      return (
        <DateTimeField
          id="starts-at"
          label="Starts at"
          value={value}
          timezone="UTC"
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    const input = screen.getByLabelText("Starts at");
    expect(input).toHaveValue("2026-06-20 15:30");
    await user.type(input, "{Backspace}");

    expect(input).toHaveValue("2026-06-20 15:3");
    expect(onChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ validationError: "invalidDate", source: "field" })
    );
  });

  it("falls back to system display when value and defaultValue are empty", () => {
    render(<DateTimeField id="starts-at" label="Starts at" value={null} />);

    expect(screen.getByLabelText("Starts at")).toHaveValue("");
  });
});
