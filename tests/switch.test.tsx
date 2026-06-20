import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Switch from "../src/switch";

describe("Switch", () => {
  it("toggles and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Enable" onChange={onChange} />);

    await user.click(screen.getByText("Enable"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("supports deprecated blue alias", () => {
    render(<Switch label="Legacy blue" color="blue" defaultChecked />);
    expect(screen.getByText("Legacy blue")).toBeInTheDocument();
  });

  it("supports deprecated gray alias", () => {
    render(<Switch label="Legacy gray" color="gray" />);
    expect(screen.getByText("Legacy gray")).toBeInTheDocument();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Locked" disabled defaultChecked onChange={onChange} />);

    await user.click(screen.getByText("Locked"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
