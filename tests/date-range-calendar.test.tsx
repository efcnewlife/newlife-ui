import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import DateRangeCalendar from "../src/date-range-calendar";

describe("DateRangeCalendar", () => {
  it("renders two adjacent month panels", () => {
    render(<DateRangeCalendar value={null} defaultMonth={dayjs("2026-08-01")} />);

    expect(screen.getByRole("button", { name: "August 2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "September 2026" })).toBeInTheDocument();
  });

  it("emits half-selection on the first day click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangeCalendar
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "August 10, 2026" }));

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls[0];
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(value.end).toBeNull();
    expect(meta).toEqual(
      expect.objectContaining({ source: "view", validationError: null })
    );
  });

  it("completes the range on the second click and normalizes out-of-order clicks", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <DateRangeCalendar
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "August 15, 2026" }));
    const half = onChange.mock.calls[0][0];
    rerender(
      <DateRangeCalendar
        value={half}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "August 10, 2026" }));
    const [value] = onChange.mock.calls[1];
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(value.end.format("YYYY-MM-DD")).toBe("2026-08-15");
  });

  it("allows same-day start and end", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <DateRangeCalendar
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "August 12, 2026" }));
    rerender(
      <DateRangeCalendar
        value={onChange.mock.calls[0][0]}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "August 12, 2026" }));

    const [value] = onChange.mock.calls[1];
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-12");
    expect(value.end.format("YYYY-MM-DD")).toBe("2026-08-12");
  });

  it("restarts selection after a complete range", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const complete = {
      start: dayjs("2026-08-10"),
      end: dayjs("2026-08-15"),
    };

    render(
      <DateRangeCalendar
        value={complete}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "August 20, 2026" }));

    const [value] = onChange.mock.calls[0];
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-20");
    expect(value.end).toBeNull();
  });

  it("marks start, end, and in-range days", () => {
    render(
      <DateRangeCalendar
        value={{ start: dayjs("2026-08-10"), end: dayjs("2026-08-12") }}
        defaultMonth={dayjs("2026-08-01")}
      />
    );

    expect(screen.getByRole("button", { name: "August 10, 2026" })).toHaveAttribute(
      "data-range",
      "start"
    );
    expect(screen.getByRole("button", { name: "August 11, 2026" })).toHaveAttribute(
      "data-range",
      "in-range"
    );
    expect(screen.getByRole("button", { name: "August 12, 2026" })).toHaveAttribute(
      "data-range",
      "end"
    );
  });

  it("marks same-day ranges as start-end", () => {
    render(
      <DateRangeCalendar
        value={{ start: dayjs("2026-08-12"), end: dayjs("2026-08-12") }}
        defaultMonth={dayjs("2026-08-01")}
      />
    );

    expect(screen.getByRole("button", { name: "August 12, 2026" })).toHaveAttribute(
      "data-range",
      "start-end"
    );
  });

  it("disables days outside minDate and maxDate", () => {
    render(
      <DateRangeCalendar
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        minDate={dayjs("2026-08-10")}
        maxDate={dayjs("2026-08-20")}
      />
    );

    expect(screen.getByRole("button", { name: "August 9, 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "August 10, 2026" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "August 21, 2026" })).toBeDisabled();
  });

  it("shifts weekday headers when weekStartsOn is Monday", () => {
    render(
      <DateRangeCalendar
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        weekStartsOn={1}
      />
    );

    const headers = screen.getAllByRole("row", { name: /weekday/i })[0];
    const cells = within(headers).getAllByRole("columnheader");
    expect(cells.map((cell) => cell.textContent)).toEqual([
      "M",
      "T",
      "W",
      "TH",
      "F",
      "S",
      "S",
    ]);
  });

  it("renders host shortcuts and applies getValue on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateRangeCalendar
        value={null}
        defaultMonth={dayjs("2026-08-01")}
        onChange={onChange}
        shortcuts={[
          {
            id: "week",
            label: "Last 7 days",
            getValue: () => ({
              start: dayjs("2026-08-04"),
              end: dayjs("2026-08-10"),
            }),
          },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Last 7 days" }));

    const [value, meta] = onChange.mock.calls[0];
    expect(value.start.format("YYYY-MM-DD")).toBe("2026-08-04");
    expect(value.end.format("YYYY-MM-DD")).toBe("2026-08-10");
    expect(meta.source).toBe("view");
  });

  it("shows submit chrome when showSubmitButton is true", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <DateRangeCalendar
        value={{ start: dayjs("2026-08-10"), end: dayjs("2026-08-12") }}
        defaultMonth={dayjs("2026-08-01")}
        showSubmitButton
        onSubmit={onSubmit}
        labels={{ submit: "Apply" }}
      />
    );

    expect(screen.queryByRole("button", { name: "Today" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
