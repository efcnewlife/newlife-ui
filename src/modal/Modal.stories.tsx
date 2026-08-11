import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Button from "../button";
import { Select } from "../select";
import Tooltip from "../tooltip";
import { Modal } from "./index";

const STORYBOOK_MODAL_CLASS_NAME = "w-full max-w-lg mx-4 p-6";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Confirm action"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p className="text-on-surface">Are you sure you want to continue?</p>
        </Modal>
      </div>
    );
  },
};

export const WithoutFooter: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Simple modal"
        >
          <p className="text-on-surface">Modal body content only.</p>
        </Modal>
      </div>
    );
  },
};

export const OpenByDefault: Story = {
  render: (args) => (
    <Modal
      {...args}
      isOpen
      onClose={() => undefined}
      className={STORYBOOK_MODAL_CLASS_NAME}
      title="Confirm action"
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </>
      }
    >
      <p className="text-on-surface">Modal opened by default for visual review.</p>
    </Modal>
  ),
};

export const WithFloatingSurfaces: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [room, setRoom] = useState<string | number | null>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Booking"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-on-surface-variant text-sm">
              Open the Select near the footer — the listbox should paint above the sticky footer.
            </p>
            <div className="h-40" />
            <Select
              id="story-room"
              label="Room"
              value={room}
              onChange={(next) => setRoom(Array.isArray(next) ? next[0] ?? null : next)}
              options={[
                { value: "a", label: "Room A" },
                { value: "b", label: "Room B" },
                { value: "c", label: "Room C" },
              ]}
            />
            <Tooltip content="Capacity and setup notes" enterDelay={0} leaveDelay={0}>
              <Button variant="outline">Hover for tooltip</Button>
            </Tooltip>
          </div>
        </Modal>
      </div>
    );
  },
};
