import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Alert from "../src/alert/Alert";

describe("Alert", () => {
  it("renders title and message", () => {
    render(<Alert variant="info" title="Notice" message="Details here" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Notice")).toBeInTheDocument();
    expect(screen.getByText("Details here")).toBeInTheDocument();
  });

  it("renders a title-only notice without a message element", () => {
    render(<Alert variant="info" title="Notice" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Notice")).toBeInTheDocument();
    expect(screen.getByRole("alert").querySelector("p")).toBeNull();
  });

  it("hides the message element when message is empty", () => {
    render(<Alert variant="info" title="Notice" message="" />);
    expect(screen.getByText("Notice")).toBeInTheDocument();
    expect(screen.getByRole("alert").querySelector("p")).toBeNull();
  });

  it("applies size classes", () => {
    const { rerender } = render(
      <Alert variant="info" title="Notice" message="Details" size="sm" />
    );
    expect(screen.getByRole("alert")).toHaveClass("p-3");

    rerender(<Alert variant="info" title="Notice" message="Details" size="lg" />);
    expect(screen.getByRole("alert")).toHaveClass("p-5");
  });

  it("applies width classes", () => {
    const { rerender } = render(
      <Alert variant="info" title="Notice" message="Details" width="full" />
    );
    expect(screen.getByRole("alert")).toHaveClass("w-full");

    rerender(<Alert variant="info" title="Notice" message="Details" width="md" />);
    expect(screen.getByRole("alert")).toHaveClass("max-w-md");

    rerender(<Alert variant="info" title="Notice" message="Details" width="auto" />);
    expect(screen.getByRole("alert")).toHaveClass("w-fit");
  });

  it("defaults to full width", () => {
    render(<Alert variant="info" title="Notice" message="Details" />);
    expect(screen.getByRole("alert")).toHaveClass("w-full");
  });

  it("clamps message to messageLines by default", () => {
    render(<Alert variant="info" title="Notice" message="Details" />);
    const message = screen.getByText("Details");
    expect(message).toHaveStyle({ display: "-webkit-box" });
    expect(message).toHaveStyle({ webkitLineClamp: "3" });
  });

  it("applies custom messageLines clamp", () => {
    render(<Alert variant="info" title="Notice" message="Details" messageLines={5} />);
    expect(screen.getByText("Details")).toHaveStyle({ webkitLineClamp: "5" });
  });

  it("clamps to at least one line when messageLines is below 1", () => {
    render(<Alert variant="info" title="Notice" message="Details" messageLines={0} />);
    expect(screen.getByText("Details")).toHaveStyle({ webkitLineClamp: "1" });
  });

  it("merges custom className", () => {
    render(
      <Alert variant="info" title="Notice" message="Details" className="shadow-lg" />
    );
    expect(screen.getByRole("alert")).toHaveClass("shadow-lg");
  });
});
