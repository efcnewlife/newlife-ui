import { MdCheckCircle, MdClose, MdError, MdInfo, MdWarning } from "react-icons/md";
import {
  notificationActionDanger,
  notificationActionPrimary,
  notificationActionSecondary,
  notificationBorderError,
  notificationBorderInfo,
  notificationBorderSuccess,
  notificationBorderWarning,
  notificationIconError,
  notificationIconInfo,
  notificationIconSuccess,
  notificationIconWarning,
  notificationSurface,
  textMuted,
  textOnSurface,
} from "../theme/role-classes";

interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}

interface NotificationProps {
  variant: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
  position?: string;
  onClose?: () => void;
  action?: NotificationAction;
}

const Notification: React.FC<NotificationProps> = ({ variant, title, description, onClose, action }) => {
  const variantStyles = {
    success: {
      borderColor: notificationBorderSuccess,
      iconBg: notificationIconSuccess,
      icon: <MdCheckCircle className="size-5" />,
    },
    info: {
      borderColor: notificationBorderInfo,
      iconBg: notificationIconInfo,
      icon: <MdInfo className="size-5" />,
    },
    warning: {
      borderColor: notificationBorderWarning,
      iconBg: notificationIconWarning,
      icon: <MdWarning className="size-5" />,
    },
    error: {
      borderColor: notificationBorderError,
      iconBg: notificationIconError,
      icon: <MdError className="size-5" />,
    },
  };

  const { borderColor, iconBg, icon } = variantStyles[variant];

  const handleClose = () => {
    onClose?.();
  };

  const getActionButtonStyles = (actionVariant: "primary" | "secondary" | "danger" = "primary"): string => {
    const baseStyles =
      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const styles = {
      primary: notificationActionPrimary,
      secondary: notificationActionSecondary,
      danger: notificationActionDanger,
    };
    return `${baseStyles} ${styles[actionVariant]}`;
  };

  const handleActionClick = () => {
    action?.onClick();
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 w-full min-w-[400px] rounded-md border-b-4 p-3 ${notificationSurface} ${borderColor}`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${iconBg}`}>{icon}</div>

        <div className="flex-1 min-w-0">
          <h4 className={`text-sm sm:text-base ${textOnSurface}`}>{title}</h4>
          {description && <p className={`mt-1 text-xs sm:text-sm ${textMuted}`}>{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {action && (
          <button onClick={handleActionClick} className={getActionButtonStyles(action.variant)}>
            {action.label}
          </button>
        )}
        <button onClick={handleClose} className={`${textMuted} hover:text-on-surface flex-shrink-0`}>
          <MdClose className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
