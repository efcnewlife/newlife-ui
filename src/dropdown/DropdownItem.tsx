import type React from "react";

export type DropdownLinkComponentProps = {
  to: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

interface DropdownItemProps {
  tag?: "a" | "button";
  to?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
  /** e.g. `Link` from react-router for client-side navigation when `tag="a"` and `to` is set */
  LinkComponent?: React.ComponentType<DropdownLinkComponentProps>;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  to,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
  LinkComponent,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: React.MouseEvent) => {
    if (tag === "button") {
      event.preventDefault();
    }
    if (onClick) onClick();
    if (onItemClick) onItemClick();
  };

  if (tag === "a" && to) {
    if (LinkComponent) {
      return (
        <LinkComponent to={to} className={combinedClasses} onClick={handleClick}>
          {children}
        </LinkComponent>
      );
    }
    return (
      <a href={to} className={combinedClasses} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};
