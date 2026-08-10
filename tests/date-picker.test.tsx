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

  it("calls onChange with a Day.js value and picker change meta", async () => {
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

    const input = screen.getByLabelText("Start date");
    await user.click(input);

    const dayButton = document.querySelector(
      ".flatpickr-calendar.open .flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)"
    ) as HTMLElement | null;
    expect(dayButton).toBeTruthy();
    await user.click(dayButton!);

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls[0];
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.format("YYYY-MM-DD")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(meta).toEqual(
      expect.objectContaining({
        source: expect.stringMatching(/^(field|view|unknown)$/),
      })
    );
    expect(meta).toHaveProperty("validationError");
  });
});
