import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import DateRangePicker from "../src/date-range-picker";
import type { DateRangeValue } from "../src/picker/date-range";

describe("DateRangePicker", () => {
  it("renders a controlled range in the field", () => {
    render(
      <DateRangePicker id="range" label="Date range" value={{ start: dayjs("2026-08-10"), end: dayjs("2026-08-15") }} />
    );

    expect(screen.getByLabelText("Date range")).toHaveValue("2026-08-10 – 2026-08-15");
  });

  it("renders a trailing calendar icon", () => {
    const { container } = render(<DateRangePicker id="range" label="Date range" value={null} />);

    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("button", { name: /open calendar/i })).toBeInTheDocument();
  });

  it("opens DateRangeCalendar and stays open on half-selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<DateRangeValue | null>(null);
      return (
        <DateRangePicker
          id="range"
          label="Date range"
          value={value}
          defaultMonth={dayjs("2026-08-01")}
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "August 10, 2026" }));

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls[0];
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(value.end).toBeNull();
    expect(meta.source).toBe("view");
    expect(screen.getByRole("button", { name: "August 2026" })).toBeInTheDocument();
  });

  it("closes when a complete range is selected without submit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<DateRangeValue | null>(null);
      return (
        <DateRangePicker
          id="range"
          label="Date range"
          value={value}
          defaultMonth={dayjs("2026-08-01")}
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "August 10, 2026" }));
    await user.click(screen.getByRole("button", { name: "August 15, 2026" }));

    const [value] = onChange.mock.calls.at(-1)!;
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(value.end.format("YYYY-MM-DD")).toBe("2026-08-15");
    expect(screen.queryByRole("button", { name: "August 2026" })).not.toBeInTheDocument();
  });

  it("keeps the popover open until submit when showSubmitButton is true", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<DateRangeValue | null>(null);
      return (
        <DateRangePicker
          id="range"
          label="Date range"
          value={value}
          defaultMonth={dayjs("2026-08-01")}
          showSubmitButton
          onSubmit={onSubmit}
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "August 10, 2026" }));
    await user.click(screen.getByRole("button", { name: "August 15, 2026" }));

    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "Done" })).not.toBeInTheDocument();
  });

  it("applies shortcuts and closes on a complete shortcut value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        id="range"
        label="Date range"
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
        shortcuts={[
          {
            label: "Last 7 days",
            getValue: () => ({
              start: dayjs("2026-08-04"),
              end: dayjs("2026-08-10"),
            }),
          },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "Last 7 days" }));

    const [value] = onChange.mock.calls[0];
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-04");
    expect(value.end.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(screen.queryByRole("button", { name: "Last 7 days" })).not.toBeInTheDocument();
  });

  it("clears the value when Clear is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangePicker
        id="range"
        label="Date range"
        value={{ start: dayjs("2026-08-10"), end: dayjs("2026-08-15") }}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith(null, {
      validationError: null,
      source: "field",
    });
  });

  it("does not expose showTodayButton", () => {
    render(
      <DateRangePicker
        id="range"
        label="Date range"
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        // @ts-expect-error showTodayButton is not part of the public API
        showTodayButton
      />
    );

    expect(screen.queryByRole("button", { name: "Today" })).not.toBeInTheDocument();
  });

  it("forwards className and Control size xs to the field", () => {
    render(
      <DateRangePicker
        id="range"
        label="Date range"
        value={{ start: dayjs("2026-08-10"), end: dayjs("2026-08-15") }}
        size="xs"
        className="host-class"
      />
    );
    expect(screen.getByLabelText("Date range")).toHaveClass("h-8", "text-xs", "px-2.5", "host-class", "pr-16");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<DateRangePicker id="range" label="Date range" labelClassName="text-on-primary" />);
    expect(screen.getByText("Date range")).toHaveClass("text-on-primary");
  });
});
