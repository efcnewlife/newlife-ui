import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import TimePicker from "../src/time-picker";

describe("TimePicker", () => {
  it("renders a controlled time-of-day Day.js value with a clock icon", () => {
    const { container } = render(
      <TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} />
    );

    expect(screen.getByLabelText("Start time")).toHaveValue("14:30");
    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("button", { name: /open time picker/i })).toBeInTheDocument();
  });

  it("does not expose the legacy native-string value API", () => {
    render(<TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T09:30:00")} />);

    const input = screen.getByLabelText("Start time");
    expect(input).not.toHaveAttribute("type", "time");
    expect(input).toHaveValue("09:30");
  });

  it("onChange receives Day.js meta, not a DOM ChangeEvent", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker id="start-time" label="Start time" value={null} onChange={onChange} />);

    await user.type(screen.getByLabelText("Start time"), "08:15");
    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(meta).toEqual(
      expect.objectContaining({
        source: "field",
        validationError: null,
      })
    );
    expect(meta).not.toHaveProperty("target");
  });

  it("opens sections variant by default and commits selection via onChange with view meta", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    const hours = screen.getByRole("listbox", { name: /hours/i });
    expect(hours).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: /minutes/i })).toBeInTheDocument();

    await user.click(
      Array.from(hours.querySelectorAll('[role="option"]')).find((option) => option.textContent === "15")!
    );

    expect(onChange).toHaveBeenCalled();
    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(value.format("HH:mm")).toBe("15:30");
    expect(value.format("YYYY-MM-DD")).toBe("1970-01-01");
    expect(meta).toEqual(
      expect.objectContaining({
        source: "view",
        validationError: null,
      })
    );
  });

  it("renders a single digital list when variant is digital", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker
        id="start-time"
        label="Start time"
        value={dayjs("1970-01-01T09:00:00")}
        variant="digital"
        minuteStep={30}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    expect(screen.getByRole("listbox", { name: /times/i })).toBeInTheDocument();
    expect(screen.queryByRole("listbox", { name: /hours/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "09:30" }));

    const [value, meta] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm")).toBe("09:30");
    expect(meta.source).toBe("view");
  });

  it("shows seconds column when timePrecision is seconds", async () => {
    const user = userEvent.setup();

    render(
      <TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T09:00:00")} timePrecision="seconds" />
    );

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    expect(screen.getByRole("listbox", { name: /seconds/i })).toBeInTheDocument();
  });

  it("shows am/pm options when ampm is true", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T09:00:00")} ampm onChange={onChange} />
    );

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    expect(screen.getByRole("listbox", { name: /meridiem/i })).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "PM" }));
    const [value] = onChange.mock.calls.at(-1)!;
    expect(value.format("HH:mm")).toBe("21:00");
  });

  it("forwards ampm and format to the composed TimeField text", () => {
    render(<TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} ampm format="h:mm A" />);

    expect(screen.getByLabelText("Start time")).toHaveValue("2:30 PM");
  });

  it("clears the value when clearable and Clear is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} onChange={onChange} />
    );

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith(null, {
      validationError: null,
      source: "field",
    });

    rerender(
      <TimePicker
        id="start-time"
        label="Start time"
        value={dayjs("1970-01-01T14:30:00")}
        clearable={false}
        onChange={onChange}
      />
    );
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("defaults clearable, minuteStep, ampm, and timePrecision", async () => {
    const user = userEvent.setup();

    render(<TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} />);

    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    const hours = screen.getByRole("listbox", { name: /hours/i });
    expect(hours).toBeInTheDocument();
    expect(screen.queryByRole("listbox", { name: /seconds/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("listbox", { name: /meridiem/i })).not.toBeInTheDocument();
    expect(Array.from(hours.querySelectorAll('[role="option"]')).some((option) => option.textContent === "01")).toBe(
      true
    );
  });

  it("merges className with clear padding", () => {
    render(
      <TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} className="host-class" />
    );
    expect(screen.getByLabelText("Start time")).toHaveClass("host-class", "pr-16");
  });

  it("forwards Control size xs to the field without shrinking hour options", async () => {
    const user = userEvent.setup();
    render(<TimePicker id="start-time" label="Start time" value={dayjs("1970-01-01T14:30:00")} size="xs" />);
    expect(screen.getByLabelText("Start time")).toHaveClass("h-8", "text-xs", "px-2.5");

    await user.click(screen.getByRole("button", { name: /open time picker/i }));
    const hours = screen.getByRole("listbox", { name: /hours/i });
    const hourOption = hours.querySelector('[role="option"]');
    expect(hourOption).toHaveClass("py-2", "text-sm");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<TimePicker id="start-time" label="Start time" labelClassName="text-on-primary" />);
    expect(screen.getByText("Start time")).toHaveClass("text-on-primary");
  });
});
