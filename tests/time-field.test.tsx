import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import TimeField from "../src/time-field";

describe("TimeField", () => {
  it("renders a controlled time-of-day Day.js value without a clock icon", () => {
    const { container } = render(<TimeField id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} />);

    expect(screen.getByLabelText("Start time")).toHaveValue("14:30");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("shows FormField label and error", () => {
    render(<TimeField id="start-time" label="Start time" error="Time is required" required />);

    expect(screen.getByText("Start time")).toBeInTheDocument();
    expect(screen.getByText("Time is required")).toBeInTheDocument();
  });

  it("calls onChange with a time-of-day Day.js value and field meta when typed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeField id="start-time" label="Start time" value={null} onChange={onChange} />);

    const input = screen.getByLabelText("Start time");
    await user.clear(input);
    await user.type(input, "09:45");

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.format("HH:mm:ss")).toBe("09:45:00");
    expect(value.format("YYYY-MM-DD")).toBe("1970-01-01");
    expect(meta).toEqual(
      expect.objectContaining({
        source: "field",
        validationError: null,
      })
    );
  });

  it("anchors the same clock time to the fixed conventional day for equality", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeField id="start-time" label="Start time" value={null} onChange={onChange} />);

    await user.type(screen.getByLabelText("Start time"), "11:00");
    const [first] = onChange.mock.calls.at(-1)!;

    onChange.mockClear();
    await user.clear(screen.getByLabelText("Start time"));
    await user.type(screen.getByLabelText("Start time"), "11:00");
    const [second] = onChange.mock.calls.at(-1)!;

    expect(first.isSame(second)).toBe(true);
    expect(first.valueOf()).toBe(second.valueOf());
  });

  it("parses HH:mm:ss when timePrecision is seconds", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeField id="start-time" label="Start time" value={null} timePrecision="seconds" onChange={onChange} />);

    await user.type(screen.getByLabelText("Start time"), "09:45:30");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm:ss")).toBe("09:45:30");
    expect(meta.validationError).toBeNull();
  });

  it("emits invalidDate meta for incomplete typed input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeField id="start-time" label="Start time" value={null} onChange={onChange} />);

    await user.type(screen.getByLabelText("Start time"), "094");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value).toBeNull();
    expect(meta).toEqual(
      expect.objectContaining({
        source: "field",
        validationError: "invalidDate",
      })
    );
  });

  it("auto-inserts colons so digits-only typing parses as a time-of-day", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeField id="start-time" label="Start time" value={null} onChange={onChange} />);

    const input = screen.getByLabelText("Start time");
    await user.type(input, "0945");

    expect(input).toHaveValue("09:45");
    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm:ss")).toBe("09:45:00");
    expect(meta.validationError).toBeNull();
  });

  it("keeps in-progress text when backspace makes the time incomplete", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<dayjs.Dayjs | null>(dayjs("1970-01-01T09:45:00"));
      return (
        <TimeField
          id="start-time"
          label="Start time"
          value={value}
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    const input = screen.getByLabelText("Start time");
    expect(input).toHaveValue("09:45");
    await user.type(input, "{Backspace}");

    expect(input).toHaveValue("09:4");
    expect(onChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ validationError: "invalidDate", source: "field" })
    );
  });

  it("displays a controlled value in 12-hour shape when ampm is true", () => {
    render(<TimeField id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} ampm />);

    expect(screen.getByLabelText("Start time")).toHaveValue("02:30 PM");
  });

  it("uses text inputMode when ampm is true", () => {
    render(<TimeField id="start-time" label="Start time" value={null} ampm />);
    expect(screen.getByLabelText("Start time")).not.toHaveAttribute("inputMode", "numeric");
  });

  it("parses a typed 12-hour time when ampm is true", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeField id="start-time" label="Start time" value={null} ampm onChange={onChange} />);

    await user.type(screen.getByLabelText("Start time"), "0230PM");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm:ss")).toBe("14:30:00");
    expect(meta.validationError).toBeNull();
  });

  it("accepts a pasted 24-hour time when ampm is true and redisplays 12-hour", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<dayjs.Dayjs | null>(null);
      return (
        <TimeField
          id="start-time"
          label="Start time"
          value={value}
          ampm
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    await user.type(screen.getByLabelText("Start time"), "1530");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm:ss")).toBe("15:30:00");
    expect(meta.validationError).toBeNull();
    expect(screen.getByLabelText("Start time")).toHaveValue("03:30 PM");
  });

  it("uses format only for committed display", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<dayjs.Dayjs | null>(null);
      return (
        <TimeField
          id="start-time"
          label="Start time"
          value={value}
          ampm
          format="h:mm A"
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    await user.type(screen.getByLabelText("Start time"), "0200PM");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm:ss")).toBe("14:00:00");
    expect(meta.validationError).toBeNull();
    expect(screen.getByLabelText("Start time")).toHaveValue("2:00 PM");
  });

  it("defaults Control size to md and accepts xs", () => {
    const { rerender } = render(<TimeField id="start-time" label="Start time" />);
    expect(screen.getByLabelText("Start time")).toHaveClass("h-11", "text-sm", "px-4");

    rerender(<TimeField id="start-time" label="Start time" size="xs" />);
    expect(screen.getByLabelText("Start time")).toHaveClass("h-8", "text-xs", "px-2.5");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<TimeField id="start-time" label="Start time" labelClassName="text-on-primary" />);
    expect(screen.getByText("Start time")).toHaveClass("text-on-primary");
  });
});
