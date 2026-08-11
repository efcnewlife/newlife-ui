import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import TimeField from "../src/time-field";

describe("TimeField", () => {
  it("renders a controlled time-of-day Day.js value without a clock icon", () => {
    const { container } = render(
      <TimeField id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} />
    );

    expect(screen.getByLabelText("Start time")).toHaveValue("14:30");
    expect(container.querySelector("svg")).toBeNull();
  });

  it("shows FormField label and error", () => {
    render(
      <TimeField id="start-time" label="Start time" error="Time is required" required />
    );

    expect(screen.getByText("Start time")).toBeInTheDocument();
    expect(screen.getByText("Time is required")).toBeInTheDocument();
  });

  it("calls onChange with a time-of-day Day.js value and field meta when typed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimeField
        id="start-time"
        label="Start time"
        value={null}
        onChange={onChange}
      />
    );

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

    render(
      <TimeField
        id="start-time"
        label="Start time"
        value={null}
        onChange={onChange}
      />
    );

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

    render(
      <TimeField
        id="start-time"
        label="Start time"
        value={null}
        timePrecision="seconds"
        onChange={onChange}
      />
    );

    await user.type(screen.getByLabelText("Start time"), "09:45:30");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm:ss")).toBe("09:45:30");
    expect(meta.validationError).toBeNull();
  });

  it("emits invalidDate meta for incomplete typed input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimeField
        id="start-time"
        label="Start time"
        value={null}
        onChange={onChange}
      />
    );

    await user.type(screen.getByLabelText("Start time"), "09:");

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value).toBeNull();
    expect(meta).toEqual(
      expect.objectContaining({
        source: "field",
        validationError: "invalidDate",
      })
    );
  });
});
