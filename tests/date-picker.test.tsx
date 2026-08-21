import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import DatePicker from "../src/date-picker";

describe("DatePicker", () => {
  it("renders a controlled Day.js calendar date in the field", () => {
    render(<DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} />);

    expect(screen.getByLabelText("Start date")).toHaveValue("2026-06-20");
  });

  it("renders a trailing calendar icon", () => {
    const { container } = render(<DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} />);

    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("button", { name: /open calendar/i })).toBeInTheDocument();
  });

  it("opens DateCalendar and commits selection via onChange with view meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} onChange={onChange} />);

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

  it("clears the value when clearable and Clear is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} onChange={onChange} />
    );

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith(null, {
      validationError: null,
      source: "field",
    });

    rerender(
      <DatePicker
        id="start-date"
        label="Start date"
        value={dayjs("2026-06-20")}
        clearable={false}
        onChange={onChange}
      />
    );
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("merges className with clear padding and still applies className when clear is hidden", () => {
    const { rerender } = render(
      <DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} className="host-class" />
    );
    expect(screen.getByLabelText("Start date")).toHaveClass("host-class", "pr-16");

    rerender(
      <DatePicker
        id="start-date"
        label="Start date"
        value={dayjs("2026-06-20")}
        clearable={false}
        className="host-class"
      />
    );
    expect(screen.getByLabelText("Start date")).toHaveClass("host-class");
    expect(screen.getByLabelText("Start date")).not.toHaveClass("pr-16");
  });

  it("forwards Control size xs to the field without shrinking calendar day cells", async () => {
    const user = userEvent.setup();
    render(<DatePicker id="start-date" label="Start date" value={dayjs("2026-06-20")} size="xs" />);
    expect(screen.getByLabelText("Start date")).toHaveClass("h-8", "text-xs", "px-2.5");

    await user.click(screen.getByRole("button", { name: /open calendar/i }));
    expect(screen.getByRole("button", { name: "June 15, 2026" })).toHaveClass("size-6");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<DatePicker id="start-date" label="Start date" labelClassName="text-on-primary" />);
    expect(screen.getByText("Start date")).toHaveClass("text-on-primary");
  });
});
