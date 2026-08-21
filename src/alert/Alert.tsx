import type { ComponentType, CSSProperties, FC, ReactNode } from "react";
import { cn } from "../cn";
import {
  alertErrorContainer,
  alertIconError,
  alertIconInfo,
  alertIconSuccess,
  alertIconWarning,
  alertInfoContainer,
  alertLink,
  alertMessage,
  alertSuccessContainer,
  alertTitle,
  alertWarningContainer,
} from "../theme/role-classes";
import SeverityIcon from "./severity-icons";

export type AlertLinkComponentProps = {
  to: string;
  className?: string;
  children?: ReactNode;
};

export type AlertSize = "sm" | "md" | "lg";

export type AlertWidth = "auto" | "full" | "sm" | "md" | "lg" | "xl";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  /** Max visible message lines before ellipsis (minimum 1). */
  messageLines?: number;
  size?: AlertSize;
  width?: AlertWidth;
  className?: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
  LinkComponent?: ComponentType<AlertLinkComponentProps>;
}

const sizeStyles: Record<
  AlertSize,
  {
    container: string;
    gap: string;
    icon: string;
    title: string;
    titleSpacing: string;
    message: string;
    link: string;
  }
> = {
  sm: {
    container: "rounded-lg p-3",
    gap: "gap-2",
    icon: "size-5",
    title: "text-xs font-semibold",
    titleSpacing: "mb-0.5",
    message: "text-xs",
    link: "mt-2 text-xs",
  },
  md: {
    container: "rounded-xl p-4",
    gap: "gap-3",
    icon: "size-6",
    title: "text-sm font-semibold",
    titleSpacing: "mb-1",
    message: "text-sm",
    link: "mt-3 text-sm",
  },
  lg: {
    container: "rounded-xl p-5",
    gap: "gap-4",
    icon: "size-7",
    title: "text-base font-semibold",
    titleSpacing: "mb-1.5",
    message: "text-sm",
    link: "mt-4 text-sm",
  },
};

const widthStyles: Record<AlertWidth, string> = {
  auto: "w-fit max-w-full",
  full: "w-full",
  sm: "w-full max-w-sm",
  md: "w-full max-w-md",
  lg: "w-full max-w-lg",
  xl: "w-full max-w-xl",
};

const getMessageStyle = (messageLines: number): CSSProperties => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: Math.max(1, messageLines),
  overflow: "hidden",
});

const Alert: FC<AlertProps> = ({
  variant,
  title,
  message,
  messageLines = 3,
  size = "md",
  width = "md",
  className,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
  LinkComponent,
}) => {
  const variantClasses = {
    success: {
      container: alertSuccessContainer,
      icon: alertIconSuccess,
    },
    error: {
      container: alertErrorContainer,
      icon: alertIconError,
    },
    warning: {
      container: alertWarningContainer,
      icon: alertIconWarning,
    },
    info: {
      container: alertInfoContainer,
      icon: alertIconInfo,
    },
  };

  const styles = sizeStyles[size];
  const iconClassName = cn("fill-current shrink-0", styles.icon, variantClasses[variant].icon);
  const hasMessage = Boolean(message);
  const hasBody = hasMessage || showLink;
  const linkClassName = cn("inline-block font-medium", styles.link, alertLink);

  return (
    <div
      className={cn("border", styles.container, widthStyles[width], variantClasses[variant].container, className)}
      role="alert"
    >
      <div className={cn("flex", hasBody ? "items-start" : "items-center", styles.gap)}>
        <div className={cn("shrink-0", hasBody && "-mt-0.5")}>
          <SeverityIcon variant={variant} className={iconClassName} />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className={cn(styles.title, hasMessage && styles.titleSpacing, alertTitle)}>{title}</h4>

          {hasMessage ? (
            <p className={cn(styles.message, alertMessage, "break-words")} style={getMessageStyle(messageLines)}>
              {message}
            </p>
          ) : null}

          {showLink &&
            (LinkComponent ? (
              <LinkComponent to={linkHref} className={linkClassName}>
                {linkText}
              </LinkComponent>
            ) : (
              <a href={linkHref} className={linkClassName}>
                {linkText}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Alert;
