import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Slider from "../src/slider";

describe("Slider", () => {
  it("renders a single thumb", () => {
    const { container } = render(<Slider defaultValue={[50]} max={100} aria-label="Volume" />);

    expect(screen.getByRole("group", { name: "Volume" })).toBeInTheDocument();
    expect(container.querySelectorAll('input[type="range"]')).toHaveLength(1);
  });

  it("renders two thumbs for a range slider", () => {
    const { container } = render(<Slider defaultValue={[25, 75]} max={100} aria-label="Range" />);

    expect(container.querySelectorAll('input[type="range"]')).toHaveLength(2);
  });

  it("calls onValueChange when a thumb value changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { container } = render(
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        aria-label="Brightness"
        onValueChange={onValueChange}
      />
    );

    const input = container.querySelector('input[type="range"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    input?.focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalled();
  });

  it("does not call onValueChange when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { container } = render(
      <Slider
        defaultValue={[50]}
        max={100}
        disabled
        aria-label="Locked"
        onValueChange={onValueChange}
      />
    );

    const input = container.querySelector('input[type="range"]') as HTMLInputElement | null;
    expect(input).toBeDisabled();
    input?.focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
