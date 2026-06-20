import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Badge from "../src/badge/Badge";

describe("Badge", () => {
  it("renders light primary badge", () => {
    render(
      <Badge variant="light" color="primary">
        New
      </Badge>
    );
    expect(screen.getByText("New")).toHaveClass("bg-primary-container");
  });

  it("renders solid error badge", () => {
    render(
      <Badge variant="solid" color="error">
        Failed
      </Badge>
    );
    expect(screen.getByText("Failed")).toHaveClass("bg-error");
  });
});
