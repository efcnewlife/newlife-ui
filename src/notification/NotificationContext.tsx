import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { notificationManager } from "./notificationManager";
import type { NotificationItem } from "./types";

export type { NotificationAction, NotificationItem } from "./types";

interface NotificationContextType {
  notifications: NotificationItem[];
  showNotification: (notification: Omit<NotificationItem, "id">) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const showNotification = useCallback(
    (notification: Omit<NotificationItem, "id">): string => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: NotificationItem = {
        id,
        position: "bottom-right",
        autoClose: true,
        hideDuration: 3000,
        ...notification,
      };

      setNotifications((prev) => [...prev, newNotification]);

      if (newNotification.autoClose && newNotification.hideDuration) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.hideDuration);
      }

      return id;
    },
    [removeNotification]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    notificationManager.register(showNotification);
    return () => {
      notificationManager.unregister();
    };
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
