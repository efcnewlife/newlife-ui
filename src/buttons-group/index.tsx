import { cn } from "../cn";
import { ReactNode } from "react";
import {
  buttonGroupActivePrimary,
  buttonGroupActiveSecondary,
  buttonGroupContainer,
  buttonGroupInactivePrimary,
  buttonGroupInactiveSecondary,
  borderOutlineVariant,
  textOnSurface,
} from "../theme/role-classes";

export interface ButtonGroupButton {
  text: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  /** When true, render icon only; `text` is used for aria-label / title. */
  iconOnly?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

export interface ButtonGroupProps {
  variant?: "primary" | "secondary";
  buttons: ButtonGroupButton[];
  className?: string;
  minWidth?: string;
}

const ButtonGroup = ({ variant = "primary", buttons, className, minWidth = "309px" }: ButtonGroupProps) => {
  const lastIndex = buttons.length - 1;

  const getButtonClassName = (button: ButtonGroupButton, index: number, isActive: boolean) => {
    const baseClasses =
      "inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition first:rounded-l-lg last:rounded-r-lg";
    const isFirstButton = index === 0;
    const isLastButton = index === lastIndex;

    let buttonClassName = baseClasses;
    switch (variant) {
      case "primary":
        if (isActive) {
          if (isFirstButton) {
            buttonClassName = cn(buttonClassName, `border-r ${borderOutlineVariant}`, buttonGroupActivePrimary);
          } else if (isLastButton) {
            buttonClassName = cn(buttonClassName, `border-l ${borderOutlineVariant}`, buttonGroupActivePrimary);
          } else {
            buttonClassName = cn(buttonClassName, `border-x ${borderOutlineVariant}`, buttonGroupActivePrimary);
          }
        } else {
          if (isFirstButton) {
            buttonClassName = cn(buttonClassName, `border-r ${borderOutlineVariant}`);
          } else if (isLastButton) {
            buttonClassName = cn(buttonClassName, `border-l ${borderOutlineVariant}`);
          } else {
            buttonClassName = cn(buttonClassName, `border-x ${borderOutlineVariant}`);
          }
          buttonClassName = cn(buttonClassName, buttonGroupInactivePrimary);
        }
        buttonClassName = cn(buttonClassName, button.className);
        break;
      case "secondary":
        if (isActive) {
          if (isFirstButton) {
            buttonClassName = cn(buttonClassName, `border-r ${borderOutlineVariant}`, buttonGroupActiveSecondary);
          } else if (isLastButton) {
            buttonClassName = cn(buttonClassName, `border-l ${borderOutlineVariant}`, buttonGroupActiveSecondary);
          } else {
            buttonClassName = cn(buttonClassName, `border-x ${borderOutlineVariant}`, buttonGroupActiveSecondary);
          }
        } else {
          if (isFirstButton) {
            buttonClassName = cn(buttonClassName, `border-r ${borderOutlineVariant}`);
          } else if (isLastButton) {
            buttonClassName = cn(buttonClassName, `border-l ${borderOutlineVariant}`);
          } else {
            buttonClassName = cn(buttonClassName, `border-x ${borderOutlineVariant}`);
          }
          buttonClassName = cn(buttonClassName, buttonGroupInactiveSecondary);
        }
        buttonClassName = cn(buttonClassName, button.className);
        break;
      default:
        buttonClassName = cn(baseClasses, buttonGroupInactiveSecondary, button.className);
        break;
    }

    return buttonClassName;
  };

  const renderIcon = (button: ButtonGroupButton) => {
    if (!button.icon) return null;

    if (variant === "secondary") {
      return <span className={textOnSurface}>{button.icon}</span>;
    }

    return button.icon;
  };

  const renderButtonContent = (button: ButtonGroupButton) => {
    const icon = renderIcon(button);
    const iconPosition = button.iconPosition || "left";

    if (button.iconOnly && icon) {
      return icon;
    }

    if (!icon) {
      return button.text;
    }

    if (iconPosition === "left") {
      return (
        <>
          {icon}
          {button.text}
        </>
      );
    } else {
      return (
        <>
          {button.text}
          {icon}
        </>
      );
    }
  };

  return (
    <div className={cn("max-w-full pb-3 overflow-x-auto custom-scrollbar", className)}>
      <div style={{ minWidth }}>
        <div className={`inline-flex items-center ${buttonGroupContainer}`}>
          {buttons.map((button, index) => {
            const isActive = button.active !== undefined ? button.active : index === 0;
            const buttonClassName = getButtonClassName(button, index, isActive);

            return (
              <button
                key={`button-${index}-${button.text}`}
                type="button"
                className={buttonClassName}
                onClick={button.onClick}
                disabled={button.disabled}
                aria-label={button.iconOnly ? button.text : undefined}
                title={button.iconOnly ? button.text : undefined}
              >
                {renderButtonContent(button)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ButtonGroup;
