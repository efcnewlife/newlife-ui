import type { FC, ReactNode } from "react";
import { MdClose } from "react-icons/md";
import SeverityIcon from "../alert/severity-icons";
import { cn } from "../cn";
import {
  alertErrorContainer,
  alertIconError,
  alertIconInfo,
  alertIconWarning,
  alertInfoContainer,
  alertMessage,
  alertWarningContainer,
} from "../theme/role-classes";

export type BannerVariant = "info" | "warning" | "error";

export interface BannerLabels {
  dismiss?: string;
}

export interface BannerProps {
  variant: BannerVariant;
  message: ReactNode;
  onDismiss?: () => void;
  labels?: BannerLabels;
  className?: string;
}

const variantClasses: Record<BannerVariant, { container: string; icon: string }> = {
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

const Banner: FC<BannerProps> = ({ variant, message, onDismiss, labels, className }) => {
  const styles = variantClasses[variant];
  const dismissLabel = labels?.dismiss ?? "Dismiss";

  return (
    <div
      role="status"
      className={cn("flex w-full items-center gap-3 rounded-none border-b px-4 py-2.5", styles.container, className)}
    >
      <SeverityIcon variant={variant} className={cn("size-5 shrink-0 fill-current", styles.icon)} />
      <div className={cn("min-w-0 flex-1 text-sm break-words", alertMessage)}>{message}</div>
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="shrink-0 text-on-surface-variant hover:text-on-surface"
        >
          <MdClose className="size-5" />
        </button>
      ) : null}
    </div>
  );
};

export default Banner;
