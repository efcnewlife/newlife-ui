import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import DatePicker from "../src/date-picker";

describe("DatePicker", () => {
  it("renders a controlled Day.js calendar date in the field", () => {
    render(
      <DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} />
    );

    expect(screen.getByLabelText("Start date")).toHaveValue("2026-06-20");
  });

  it("renders a trailing calendar icon", () => {
    const { container } = render(
      <DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} />
    );

    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("button", { name: /open calendar/i })).toBeInTheDocument();
  });

  it("opens DateCalendar and commits selection via onChange with view meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        id="start-date"
        label="Start date"
        value={dayjs("2026-06-20")}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    await user.click(screen.getByRole("button", { name: "June 15, 2026" }));

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls[0];
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.format("YYYY-MM-DD")).toBe("2026-06-15");
    expect(meta).toEqual(
      expect.objectContaining({
        source: "view",
        validationError: null,
      })
    );
  });

  it("does not expose multiple, range, or time modes", () => {
    render(
      <DatePicker
        id="start-date"
        label="Start date"
        value={dayjs("2026-06-20")}
        // @ts-expect-error mode is removed from the public API
        mode="range"
      />
    );

    expect(screen.queryByText(/to/i)).not.toBeInTheDocument();
  });
});
