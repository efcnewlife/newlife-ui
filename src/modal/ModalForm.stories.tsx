import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import Button from "../button";
import Input from "../input";
import { Select } from "../select";
import { ModalForm, type ModalFormHandle } from "./modal-form";

const STORYBOOK_MODAL_CLASS_NAME = "w-full max-w-lg mx-4 p-6";

const meta: Meta<typeof ModalForm> = {
  title: "Components/ModalForm",
  component: ModalForm,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ModalForm>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<ModalFormHandle>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open form modal</Button>
        <ModalForm
          {...args}
          ref={formRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Edit profile"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => formRef.current?.submit()}>Save</Button>
            </>
          }
          onSubmit={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
        >
          <Input id="modal-name" label="Name" placeholder="Your name" />
        </ModalForm>
      </div>
    );
  },
};

export const WithFloatingSurfaces: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [room, setRoom] = useState<string | number | null>(null);
    const formRef = useRef<ModalFormHandle>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open form modal</Button>
        <ModalForm
          {...args}
          ref={formRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Booking"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => formRef.current?.submit()}>Save</Button>
            </>
          }
          onSubmit={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
        >
          <div className="space-y-4">
            <div className="h-40" />
            <Select
              id="modal-form-room"
              label="Room"
              value={room}
              onChange={(next) => setRoom(Array.isArray(next) ? next[0] ?? null : next)}
              options={[
                { value: "a", label: "Room A" },
                { value: "b", label: "Room B" },
                { value: "c", label: "Room C" },
              ]}
            />
          </div>
        </ModalForm>
      </div>
    );
  },
};
