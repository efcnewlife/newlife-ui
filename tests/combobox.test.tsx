import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ComboBox from "../src/combobox";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
];

describe("ComboBox", () => {
  it("defaults Control size to md on the input, not the wrapper", () => {
    const { container } = render(
      <ComboBox id="framework" label="Framework" options={options} className="wrapper-custom" />
    );
    expect(document.getElementById("framework")).toHaveClass("h-11", "text-sm", "px-4");
    expect(container.firstChild).not.toHaveClass("h-11");
    expect(container.querySelector(".wrapper-custom")).not.toBeNull();
    expect(document.getElementById("framework")).not.toHaveClass("wrapper-custom");
  });

  it("applies xs Control size on the input", () => {
    render(<ComboBox id="framework-xs" label="Framework" options={options} size="xs" />);
    expect(document.getElementById("framework-xs")).toHaveClass("h-8", "text-xs", "px-2.5");
  });

  it("applies inputClassName on the input", () => {
    render(
      <ComboBox id="framework-input" options={options} inputClassName="input-custom" />
    );
    expect(document.getElementById("framework-input")).toHaveClass("input-custom");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(
      <ComboBox id="framework-label" label="Framework" options={options} labelClassName="text-on-primary" />
    );
    expect(screen.getByText("Framework")).toHaveClass("text-on-primary");
  });

  it("keeps option row padding when the input is xs", async () => {
    const user = userEvent.setup();
    render(<ComboBox id="framework-options" label="Framework" options={options} size="xs" />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: /React/ })).toHaveClass("px-3", "py-2");
  });
});
