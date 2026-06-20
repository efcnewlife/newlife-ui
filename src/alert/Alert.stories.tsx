import type { Meta, StoryObj } from "@storybook/react";
import Alert from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  args: {
    variant: "info",
    title: "Update available",
    message: "A new version of the portal is ready to install.",
    size: "md",
    width: "lg",
    messageLines: 3,
  },
  argTypes: {
    messageLines: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    width: {
      control: "select",
      options: ["auto", "full", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => <Alert {...args} />,
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Something went wrong",
    message: "Please try again later. Please try again later. Please try again later. Please try again later.",
  },
  render: (args) => <Alert {...args} />,
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => <Alert {...args} />,
};

export const Info: Story = {
  args: { variant: "info" },
  render: (args) => <Alert {...args} />,
};

export const WithLink: Story = {
  args: {
    variant: "info",
    showLink: true,
    linkText: "View details",
    linkHref: "#details",
  },
  render: (args) => <Alert {...args} />,
};

export const Small: Story = {
  args: {
    size: "sm",
    width: "sm",
  },
  render: (args) => <Alert {...args} />,
};

export const Large: Story = {
  args: {
    size: "lg",
    width: "lg",
  },
  render: (args) => <Alert {...args} />,
};

export const FullWidth: Story = {
  render: (args) => (
    <div className="w-full max-w-2xl">
      <Alert {...args} width="full" />
    </div>
  ),
};

export const AutoWidth: Story = {
  args: {
    width: "auto",
    message: "Short message.",
  },
  render: (args) => <Alert {...args} />,
};

const longMessage =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio suscipit quos assumenda ad quasi praesentium adipisci laboriosam " +
  "temporibus vitae necessitatibus id ut neque alias, quisquam tenetur molestiae quo rerum sequi dicta quas repellendus qui? " +
  "Eligendi voluptate fugiat possimus sit accusamus libero suscipit molestias velit incidunt quisquam! Voluptatem earum non eaque.";

export const LongMessage: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <Alert {...args} variant="warning" title="Maintenance notice" message={longMessage} width="full" />
    </div>
  ),
};

export const LongMessageFiveLines: Story = {
  render: (args) => <Alert {...args} variant="info" title="Release notes" message={longMessage} messageLines={5} width="lg" />,
};
