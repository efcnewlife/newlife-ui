import type { Meta, StoryObj } from "@storybook/react";
import Banner from "./Banner";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
  args: {
    variant: "info",
    message: "Scheduled maintenance tonight from 11pm to 2am.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "error"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: { variant: "info" },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    message: "Some booking features are temporarily unavailable.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    message: "The portal is in read-only mode until the outage is resolved.",
  },
};

export const WithDismiss: Story = {
  args: {
    variant: "info",
    onDismiss: () => undefined,
  },
};

export const WithoutDismiss: Story = {
  args: {
    variant: "warning",
    message: "Required policy notice. This banner cannot be dismissed.",
  },
};

export const WithInlineLink: Story = {
  args: {
    variant: "info",
    message: (
      <>
        Scheduled maintenance tonight.{" "}
        <a href="#status" className="underline">
          View status
        </a>
      </>
    ),
  },
};
