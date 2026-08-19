import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import DateRangeField from "../src/date-range-field";
import type { DateRangeValue } from "../src/picker/date-range";

describe("DateRangeField", () => {
  it("renders a controlled complete range without a calendar icon", () => {
    const { container } = render(
      <DateRangeField
        id="range"
        label="Date range"
        value={{ start: dayjs("2026-08-10"), end: dayjs("2026-08-15") }}
      />
    );

    expect(screen.getByLabelText("Date range")).toHaveValue("2026-08-10 – 2026-08-15");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("displays half-selection with a trailing separator", () => {
    render(
      <DateRangeField
        id="range"
        label="Date range"
        value={{ start: dayjs("2026-08-10"), end: null }}
      />
    );

    expect(screen.getByLabelText("Date range")).toHaveValue("2026-08-10 – ");
  });

  it("shows FormField label and error", () => {
    render(
      <DateRangeField id="range" label="Date range" error="Range is required" required />
    );

    expect(screen.getByText("Date range")).toBeInTheDocument();
    expect(screen.getByText("Range is required")).toBeInTheDocument();
  });

  it("parses a typed complete range with field meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangeField id="range" label="Date range" value={null} onChange={onChange} />
    );

    const input = screen.getByLabelText("Date range");
    await user.clear(input);
    await user.type(input, "2026-08-10 – 2026-08-15");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(value.end.format("YYYY-MM-DD")).toBe("2026-08-15");
    expect(meta).toEqual(
      expect.objectContaining({ source: "field", validationError: null })
    );
  });

  it("parses a single date as half-selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangeField id="range" label="Date range" value={null} onChange={onChange} />
    );

    await user.type(screen.getByLabelText("Date range"), "2026-08-10");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(value.end).toBeNull();
    expect(meta.validationError).toBeNull();
  });

  it("emits null with invalidDate when typed text cannot be parsed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<DateRangeValue | null>(null);
      return (
        <DateRangeField
          id="range"
          label="Date range"
          value={value}
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    await user.type(screen.getByLabelText("Date range"), "2026-08-");

    expect(onChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ validationError: "invalidDate", source: "field" })
    );
  });

  it("clears to null when the field is emptied", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangeField
        id="range"
        label="Date range"
        value={{ start: dayjs("2026-08-10"), end: dayjs("2026-08-15") }}
        onChange={onChange}
      />
    );

    await user.clear(screen.getByLabelText("Date range"));

    expect(onChange).toHaveBeenCalledWith(null, {
      validationError: null,
      source: "field",
    });
  });

  it("defaults Control size to md and accepts xs", () => {
    const { rerender } = render(<DateRangeField id="range" label="Date range" />);
    expect(screen.getByLabelText("Date range")).toHaveClass("h-11", "text-sm", "px-4");

    rerender(<DateRangeField id="range" label="Date range" size="xs" />);
    expect(screen.getByLabelText("Date range")).toHaveClass("h-8", "text-xs", "px-2.5");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<DateRangeField id="range" label="Date range" labelClassName="text-on-primary" />);
    expect(screen.getByText("Date range")).toHaveClass("text-on-primary");
  });
});
