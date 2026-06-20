import type { Meta, StoryObj } from "@storybook/react";
import Button from "../button";
import Notification from "./Notification";
import { useNotification } from "./NotificationContext";
import { notificationManager } from "./notificationManager";

const meta: Meta<typeof Notification> = {
  title: "Components/Notification",
  component: Notification,
  parameters: {
    withNotifications: true,
  },
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const InlineVariants: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Notification variant="success" title="Saved" description="Your changes were saved." />
      <Notification variant="info" title="Heads up" description="Maintenance starts at midnight." />
      <Notification variant="warning" title="Warning" description="Your session expires soon." />
      <Notification variant="error" title="Error" description="Unable to complete the request." />
    </div>
  ),
};

export const WithAction: Story = {
  args: {
    variant: "info",
    title: "Update ready",
    description: "Restart the app to apply updates.",
    action: { label: "Restart", onClick: () => undefined, variant: "primary" },
  },
  render: (args) => <Notification {...args} />,
};

export const ToastViaProvider: Story = {
  render: () => {
    const ToastDemo = () => {
      const { showNotification } = useNotification();

      return (
        <Button
          onClick={() =>
            showNotification({
              variant: "success",
              title: "Toast notification",
              description: "Shown via NotificationProvider.",
            })
          }
        >
          Show toast
        </Button>
      );
    };

    return <ToastDemo />;
  },
  parameters: {
    withNotifications: true,
  },
};

export const ManagerDemo: Story = {
  render: () => (
    <Button
      onClick={() => {
        notificationManager.show({
          variant: "warning",
          title: "Imperative toast",
          description: "Triggered through notificationManager.show().",
        });
      }}
    >
      Show via manager
    </Button>
  ),
  parameters: {
    withNotifications: true,
  },
};
