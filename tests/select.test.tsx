import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select } from "../src/select/Select";

const options = [
  { value: "en", label: "English" },
  { value: "zh-TW", label: "Traditional Chinese" },
];

describe("Select", () => {
  it("defaults Control size to md height", () => {
    render(<Select id="locale" label="Locale" options={options} />);
    expect(screen.getByRole("combobox")).toHaveClass("h-11", "text-sm", "px-4");
  });

  it("applies sm and xs Control size on the trigger", () => {
    const { rerender } = render(<Select id="locale-sm" label="Locale" options={options} size="sm" />);
    expect(screen.getByRole("combobox")).toHaveClass("h-9", "text-sm", "px-3");
    expect(screen.getByRole("combobox")).not.toHaveClass("h-11");

    rerender(<Select id="locale-xs" label="Locale" options={options} size="xs" />);
    expect(screen.getByRole("combobox")).toHaveClass("h-8", "text-xs", "px-2.5");
  });

  it("lets host className override Control size height", () => {
    render(<Select id="locale-override" options={options} size="xs" className="h-10" />);
    expect(screen.getByRole("combobox")).toHaveClass("h-10");
    expect(screen.getByRole("combobox")).not.toHaveClass("h-8");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<Select id="locale-label" label="Locale" options={options} labelClassName="text-on-primary" />);
    expect(screen.getByText("Locale")).toHaveClass("text-on-primary");
  });

  it("keeps option row padding when the trigger is xs", async () => {
    const user = userEvent.setup();
    render(<Select id="locale-options" label="Locale" options={options} size="xs" />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "English" })).toHaveClass("px-4", "py-2");
  });

  it("rounds the first and last option rows to match the listbox", async () => {
    const user = userEvent.setup();
    render(<Select id="locale-corners" label="Locale" options={options} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "English" })).toHaveClass("rounded-t-lg");
    expect(screen.getByRole("option", { name: "Traditional Chinese" })).toHaveClass("rounded-b-lg");
  });

  it("does not round the first option when Search options is shown", async () => {
    const user = userEvent.setup();
    render(<Select id="locale-search" label="Locale" options={options} searchable />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "English" })).not.toHaveClass("rounded-t-lg");
    expect(screen.getByRole("option", { name: "Traditional Chinese" })).toHaveClass("rounded-b-lg");
  });
});
