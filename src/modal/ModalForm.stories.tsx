import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useRef, useState } from "react";
import Button from "../button";
import Checkbox from "../checkbox";
import ComboBox, { type ComboBoxOption } from "../combobox";
import DatePicker from "../date-picker";
import DateTimePicker from "../date-time-picker";
import Input from "../input";
import { dayjs, type Dayjs } from "../lib/dayjs";
import { Select } from "../select";
import Switch from "../switch";
import TextArea from "../textarea";
import TimePicker from "../time-picker";
import Tooltip from "../tooltip";
import { ModalForm, type ModalFormHandle } from "./modal-form";

const STORYBOOK_MODAL_CLASS_NAME = "w-full max-w-lg mx-4 p-6";
const STORYBOOK_WIDE_MODAL_CLASS_NAME = "w-full max-w-2xl mx-4 p-6";

const roomOptions = [
  { value: "chapel", label: "Chapel" },
  { value: "fellowship-hall", label: "Fellowship Hall" },
  { value: "classroom-a", label: "Classroom A" },
  { value: "classroom-b", label: "Classroom B" },
];

const ministryOptions: ComboBoxOption<string>[] = [
  { value: "worship", label: "Worship Ministry" },
  { value: "youth", label: "Youth Ministry" },
  { value: "children", label: "Children Ministry" },
  { value: "outreach", label: "Outreach" },
];

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
  name: "Profile form",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("Jane Doe");
    const [email, setEmail] = useState("jane@example.com");
    const [bio, setBio] = useState("");
    const formRef = useRef<ModalFormHandle>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Edit profile</Button>
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
          <div className="space-y-4">
            <Input
              id="modal-name"
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Input
              id="modal-email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <TextArea
              id="modal-bio"
              label="Bio"
              rows={4}
              value={bio}
              onChange={setBio}
              placeholder="Short introduction"
              hint="Optional. Shown on the member directory."
            />
          </div>
        </ModalForm>
      </div>
    );
  },
};

export const BookingWithFloatingSurfaces: Story = {
  name: "Booking (floating surfaces)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [userId, setUserId] = useState<string | null>("jane");
    const [roomIds, setRoomIds] = useState<Array<string | number | null>>(["chapel"]);
    const [ministryId, setMinistryId] = useState<string | null>("worship");
    const [startAt, setStartAt] = useState<Dayjs | null>(dayjs.utc("2026-08-20T15:00:00.000Z"));
    const [endAt, setEndAt] = useState<Dayjs | null>(dayjs.utc("2026-08-20T17:00:00.000Z"));
    const [eventDate, setEventDate] = useState<Dayjs | null>(dayjs("2026-08-20"));
    const [setupTime, setSetupTime] = useState<Dayjs | null>(null);
    const [missionAligned, setMissionAligned] = useState(true);
    const [notifyTeam, setNotifyTeam] = useState(false);
    const [remark, setRemark] = useState("");
    const formRef = useRef<ModalFormHandle>(null);

    const userOptions = useMemo<ComboBoxOption<string>[]>(
      () => [
        { value: "jane", label: "Jane Doe" },
        { value: "john", label: "John Smith" },
        { value: "amy", label: "Amy Chen" },
        { value: "liu", label: "David Liu" },
      ],
      []
    );

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Create booking</Button>
        <ModalForm
          {...args}
          ref={formRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_WIDE_MODAL_CLASS_NAME}
          title="Create facility booking"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => formRef.current?.submit()}>Save booking</Button>
            </>
          }
          onSubmit={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
        >
          <div className="space-y-5">
            <p className="text-sm text-on-surface-variant">
              Sticky footer stays visible while the body scrolls. Open Select, ComboBox, or pickers near
              the bottom — Floating surfaces should paint above the footer.
            </p>

            <ComboBox<string>
              id="booking-user"
              label="Booked by"
              options={userOptions}
              value={userId}
              onChange={setUserId}
              placeholder="Search member"
              clearable
              required
            />

            <Select
              id="booking-rooms"
              label="Rooms"
              multiple
              clearable
              value={roomIds}
              onChange={(next) => setRoomIds(Array.isArray(next) ? next : [next])}
              options={roomOptions}
              required
            />

            <ComboBox<string>
              id="booking-ministry"
              label="Ministry"
              options={ministryOptions}
              value={ministryId}
              onChange={setMinistryId}
              placeholder="Search ministry"
              clearable
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <DateTimePicker
                id="booking-start"
                label="Start"
                value={startAt}
                timezone="UTC"
                onChange={(value) => setStartAt(value)}
                required
              />
              <DateTimePicker
                id="booking-end"
                label="End"
                value={endAt}
                timezone="UTC"
                onChange={(value) => setEndAt(value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DatePicker
                id="booking-event-date"
                label="Public event date"
                value={eventDate}
                onChange={(value) => setEventDate(value)}
                clearable
              />
              <TimePicker
                id="booking-setup-time"
                label="Setup time"
                value={setupTime}
                onChange={(value) => setSetupTime(value)}
                clearable
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <Checkbox
                id="booking-mission"
                label="Mission aligned"
                checked={missionAligned}
                onChange={setMissionAligned}
              />
              <div className="flex items-center gap-2">
                <Switch label="Notify ministry leads" defaultChecked={notifyTeam} onChange={setNotifyTeam} />
                <Tooltip content="Sends an email to ministry admins when the booking is saved." enterDelay={0}>
                  <button type="button" className="text-sm text-primary underline-offset-2 hover:underline">
                    Why?
                  </button>
                </Tooltip>
              </div>
            </div>

            <TextArea
              id="booking-remark"
              label="Remark"
              rows={3}
              value={remark}
              onChange={setRemark}
              placeholder="Setup notes, AV needs, etc."
            />
          </div>
        </ModalForm>
      </div>
    );
  },
};

export const ValidationErrors: Story = {
  name: "Validation errors",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [room, setRoom] = useState<string | number | null>(null);
    const [startAt, setStartAt] = useState<Dayjs | null>(null);
    const formRef = useRef<ModalFormHandle>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open invalid form</Button>
        <ModalForm
          {...args}
          ref={formRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Create booking"
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
          }}
        >
          <div className="space-y-4">
            <Input id="invalid-title" label="Title" value="" required error="Title is required" />
            <Select
              id="invalid-room"
              label="Room"
              value={room}
              onChange={(next) => setRoom(Array.isArray(next) ? next[0] ?? null : next)}
              options={roomOptions}
              required
              error="Select at least one room"
            />
            <DateTimePicker
              id="invalid-start"
              label="Start"
              value={startAt}
              timezone="UTC"
              onChange={(value) => setStartAt(value)}
              required
              error="Start time is required"
            />
          </div>
        </ModalForm>
      </div>
    );
  },
};

export const LongScrollBody: Story = {
  name: "Long scroll body",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [room, setRoom] = useState<string | number | null>(null);
    const formRef = useRef<ModalFormHandle>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open long form</Button>
        <ModalForm
          {...args}
          ref={formRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Policy acknowledgment"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => formRef.current?.submit()}>I agree</Button>
            </>
          }
          onSubmit={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
        >
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              Scroll the body — the footer actions stay pinned. The room Select at the end should still open
              above the footer.
            </p>
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index} className="text-sm text-on-surface">
                Section {index + 1}. Facility bookings must follow ministry approval rules, quiet hours, and
                cleanup expectations. Repeated violations may suspend booking privileges for the ministry.
              </p>
            ))}
            <Select
              id="long-form-room"
              label="Primary room"
              value={room}
              onChange={(next) => setRoom(Array.isArray(next) ? next[0] ?? null : next)}
              options={roomOptions}
              required
            />
          </div>
        </ModalForm>
      </div>
    );
  },
};

export const FooterAlignLeft: Story = {
  name: "Footer align left",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<ModalFormHandle>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <ModalForm
          {...args}
          ref={formRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Delete draft"
          footerAlign="left"
          footer={
            <>
              <Button onClick={() => formRef.current?.submit()}>Delete</Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Keep draft
              </Button>
            </>
          }
          onSubmit={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
        >
          <p className="text-sm text-on-surface">
            This removes the unsaved booking draft. You can recreate it later from the booking list.
          </p>
        </ModalForm>
      </div>
    );
  },
};

export const Submitting: Story = {
  name: "Submitting state",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<ModalFormHandle>(null);

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <ModalForm
          {...args}
          ref={formRef}
          isOpen={isOpen}
          onClose={() => {
            if (!submitting) {
              setIsOpen(false);
            }
          }}
          className={STORYBOOK_MODAL_CLASS_NAME}
          title="Publish schedule"
          showCloseButton={!submitting}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button
                disabled={submitting}
                onClick={() => {
                  setSubmitting(true);
                  window.setTimeout(() => {
                    setSubmitting(false);
                    setIsOpen(false);
                  }, 1600);
                }}
              >
                {submitting ? "Publishing…" : "Publish"}
              </Button>
            </>
          }
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="space-y-3">
            <p className="text-sm text-on-surface">
              Publishes the current weekly facility schedule to ministry leaders.
            </p>
            <Input id="publish-note" label="Release note" placeholder="Optional note" disabled={submitting} />
          </div>
        </ModalForm>
      </div>
    );
  },
};
