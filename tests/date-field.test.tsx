import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
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
});
