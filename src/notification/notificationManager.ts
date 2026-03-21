import type { NotificationItem } from "./types";

type ShowNotificationFn = (notification: Omit<NotificationItem, "id">) => string;

class NotificationManager {
  private show_notification_fn: ShowNotificationFn | null = null;

  register(show_notification: ShowNotificationFn): void {
    this.show_notification_fn = show_notification;
  }

  unregister(): void {
    this.show_notification_fn = null;
  }

  show(notification: Omit<NotificationItem, "id">): string | null {
    if (!this.show_notification_fn) {
      console.warn("NotificationManager: showNotification function not registered");
      return null;
    }
    return this.show_notification_fn(notification);
  }
}

export const notificationManager = new NotificationManager();
