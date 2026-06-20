import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import Checkbox from "../src/checkbox";

const ControlledCheckbox = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox label="Accept" checked={checked} onChange={setChecked} id="accept" />;
};

describe("Checkbox", () => {
  it("toggles when clicked", async () => {
    const user = userEvent.setup();
    render(<ControlledCheckbox />);

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    await user.click(input);
    expect(input).toBeChecked();
  });

  it("calls onChange with next value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Terms" checked={false} onChange={onChange} id="terms" />);

    await user.click(screen.getByRole("checkbox", { name: "Terms" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
