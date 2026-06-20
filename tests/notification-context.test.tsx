import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Button from "../src/button";
import { useNotification } from "../src/notification/NotificationContext";
import { renderWithProviders } from "./render";

const NotificationDemo = () => {
  const { showNotification, notifications } = useNotification();

  return (
    <>
      <Button
        onClick={() =>
          showNotification({
            variant: "success",
            title: "Saved",
            description: "Changes stored.",
          })
        }
      >
        Notify
      </Button>
      <div data-testid="count">{notifications.length}</div>
    </>
  );
};

describe("NotificationProvider", () => {
  it("shows and tracks notifications", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationDemo />, { withNotifications: true });

    await user.click(screen.getByRole("button", { name: "Notify" }));

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });
});
