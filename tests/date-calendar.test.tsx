import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import DateCalendar from "../src/date-calendar";

describe("DateCalendar", () => {
  it("calls onChange with a Day.js value and picker change meta when a day is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateCalendar value={dayjs("2026-08-10")} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "August 15, 2026" }));

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls[0];
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.format("YYYY-MM-DD")).toBe("2026-08-15");
    expect(meta).toEqual(
      expect.objectContaining({
        source: "view",
        validationError: null,
      })
    );
  });

  it("renders weekday headers starting on Sunday by default", () => {
    render(<DateCalendar value={dayjs("2026-08-10")} />);

    const headers = screen.getByRole("row", { name: /weekday/i });
    const cells = within(headers).getAllByRole("columnheader");
    expect(cells.map((cell) => cell.textContent)).toEqual([
      "S",
      "M",
      "T",
      "W",
      "TH",
      "F",
      "S",
    ]);
  });

  it("shifts weekday headers when weekStartsOn is Monday", () => {
    render(<DateCalendar value={dayjs("2026-08-10")} weekStartsOn={1} />);

    const headers = screen.getByRole("row", { name: /weekday/i });
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

  it("shows submit chrome only when showSubmitButton is true and invokes onSubmit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const { rerender, container } = render(
      <DateCalendar value={dayjs("2026-08-10")} onSubmit={onSubmit} />
    );
    expect(screen.queryByRole("button", { name: "Done" })).not.toBeInTheDocument();

    rerender(
      <DateCalendar
        value={dayjs("2026-08-10")}
        showSubmitButton
        onSubmit={onSubmit}
        labels={{ submit: "Apply" }}
      />
    );

    const submit = screen.getByRole("button", { name: "Apply" });
    const root = container.firstElementChild;
    expect(root?.lastElementChild?.contains(submit)).toBe(true);

    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows Today in the footer when showTodayButton is true and selects today", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <DateCalendar value={dayjs("2026-08-10")} onChange={onChange} />
    );
    expect(screen.queryByRole("button", { name: "Today" })).not.toBeInTheDocument();

    rerender(
      <DateCalendar
        value={dayjs("2026-08-10")}
        showTodayButton
        onChange={onChange}
        labels={{ today: "今天" }}
      />
    );

    await user.click(screen.getByRole("button", { name: "今天" }));

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls[0];
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.format("YYYY-MM-DD")).toBe(dayjs().format("YYYY-MM-DD"));
    expect(meta).toEqual(
      expect.objectContaining({
        source: "view",
        validationError: null,
      })
    );
  });

  it("navigates day, month, and year views from the header", async () => {
    const user = userEvent.setup();

    render(<DateCalendar value={dayjs("2026-08-10")} />);

    expect(screen.getByRole("button", { name: "August 2026" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "August 2026" }));
    expect(screen.getByRole("button", { name: "Aug" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2026" }));
    expect(screen.getByRole("button", { name: "2025" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2027" }));
    expect(screen.getByRole("button", { name: "Sep" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sep" }));
    expect(screen.getByRole("button", { name: "September 2027" })).toBeInTheDocument();
  });

  it("keeps outside-month days visible and distinct", () => {
    render(<DateCalendar value={dayjs("2026-08-01")} />);

    const outside = screen.getByRole("button", { name: "July 26, 2026" });
    expect(outside).toHaveAttribute("data-outside-month", "true");
    expect(outside).toHaveTextContent("26");
  });
});
