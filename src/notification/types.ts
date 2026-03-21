export type NotificationVariant = "success" | "info" | "warning" | "error";
export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export interface NotificationItem {
  id: string;
  variant: NotificationVariant;
  title: string;
  description?: string;
  position?: NotificationPosition;
  hideDuration?: number;
  autoClose?: boolean;
  action?: NotificationAction;
}
