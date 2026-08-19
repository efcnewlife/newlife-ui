import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Banner from "../src/banner/Banner";

describe("Banner", () => {
  it("renders each variant as status with the message", () => {
    const { rerender } = render(<Banner variant="info" message="Info notice" />);
    expect(screen.getByRole("status")).toHaveTextContent("Info notice");

    rerender(<Banner variant="warning" message="Warning notice" />);
    expect(screen.getByRole("status")).toHaveTextContent("Warning notice");

    rerender(<Banner variant="error" message="Error notice" />);
    expect(screen.getByRole("status")).toHaveTextContent("Error notice");
  });

  it("renders host-composed message content including a link", () => {
    render(
      <Banner
        variant="info"
        message={
          <>
            Maintenance tonight. <a href="/status">Status page</a>
          </>
        }
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Maintenance tonight.");
    expect(screen.getByRole("link", { name: "Status page" })).toHaveAttribute("href", "/status");
  });

  it("does not render a dismiss control without onDismiss", () => {
    render(<Banner variant="info" message="Required notice" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("names the dismiss control Dismiss by default and calls onDismiss", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner variant="info" message="Optional notice" onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses labels.dismiss as the dismiss control name", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner variant="warning" message="Optional notice" onDismiss={onDismiss} labels={{ dismiss: "Close announcement" }} />);

    await user.click(screen.getByRole("button", { name: "Close announcement" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("merges custom className", () => {
    render(<Banner variant="info" message="Notice" className="mt-2" />);
    expect(screen.getByRole("status")).toHaveClass("mt-2");
  });
});
