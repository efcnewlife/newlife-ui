import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import DateField from "../src/date-field";

describe("DateField", () => {
  it("renders a controlled Day.js calendar date without a calendar icon", () => {
    const { container } = render(
      <DateField id="start-date" label="Start date" value={dayjs("2026-06-20")} />
    );

    expect(screen.getByLabelText("Start date")).toHaveValue("2026-06-20");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("shows FormField label and error", () => {
    render(
      <DateField id="start-date" label="Start date" error="Date is required" required />
    );

    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByText("Date is required")).toBeInTheDocument();
  });

  it("calls onChange with a Day.js value and field meta when typed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateField
        id="start-date"
        label="Start date"
        value={null}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText("Start date");
    await user.clear(input);
    await user.type(input, "2026-08-15");

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.format("YYYY-MM-DD")).toBe("2026-08-15");
    expect(meta).toEqual(
      expect.objectContaining({
        source: "field",
        validationError: null,
      })
    );
  });

  it("auto-inserts dashes so digits-only typing parses as a calendar date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateField
        id="start-date"
        label="Start date"
        value={null}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText("Start date");
    await user.type(input, "20260815");

    expect(input).toHaveValue("2026-08-15");
    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("YYYY-MM-DD")).toBe("2026-08-15");
    expect(meta.validationError).toBeNull();
  });

  it("keeps in-progress text when backspace makes the date incomplete", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<dayjs.Dayjs | null>(dayjs("2026-08-15"));
      return (
        <DateField
          id="start-date"
          label="Start date"
          value={value}
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    const input = screen.getByLabelText("Start date");
    expect(input).toHaveValue("2026-08-15");
    await user.type(input, "{Backspace}");

    expect(input).toHaveValue("2026-08-1");
    expect(onChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ validationError: "invalidDate", source: "field" })
    );
  });

  it("does not overflow impossible calendar dates into another day", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const Harness = () => {
      const [value, setValue] = useState<dayjs.Dayjs | null>(null);
      return (
        <DateField
          id="start-date"
          label="Start date"
          value={value}
          onChange={(next, meta) => {
            onChange(next, meta);
            setValue(next);
          }}
        />
      );
    };

    render(<Harness />);

    const input = screen.getByLabelText("Start date");
    await user.type(input, "20201234");

    // Day 34 exceeds 31, so the second digit restarts the day section as 04.
    expect(input).toHaveValue("2020-12-04");
    const [value] = onChange.mock.calls.at(-1)!;
    expect(value.format("YYYY-MM-DD")).toBe("2020-12-04");
  });

  it("restarts month section when digits would exceed 12", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateField
        id="start-date"
        label="Start date"
        value={null}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText("Start date");
    await user.type(input, "20201415");

    // Month 14 exceeds 12, so 4 restarts the month as 04; following 15 is the day.
    expect(input).toHaveValue("2020-04-15");
    const [value] = onChange.mock.calls.at(-1)!;
    expect(value.format("YYYY-MM-DD")).toBe("2020-04-15");
  });

  it("parses digit-only 20201224 as 2020-12-24", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateField
        id="start-date"
        label="Start date"
        value={null}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText("Start date");
    await user.type(input, "20201224");

    expect(input).toHaveValue("2020-12-24");
    const [value] = onChange.mock.calls.at(-1)!;
    expect(value.format("YYYY-MM-DD")).toBe("2020-12-24");
  });

  it("defaults Control size to md and accepts xs", () => {
    const { rerender } = render(<DateField id="start-date" label="Start date" />);
    expect(screen.getByLabelText("Start date")).toHaveClass("h-11", "text-sm", "px-4");

    rerender(<DateField id="start-date" label="Start date" size="xs" />);
    expect(screen.getByLabelText("Start date")).toHaveClass("h-8", "text-xs", "px-2.5");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<DateField id="start-date" label="Start date" labelClassName="text-on-primary" />);
    expect(screen.getByText("Start date")).toHaveClass("text-on-primary");
  });
});
