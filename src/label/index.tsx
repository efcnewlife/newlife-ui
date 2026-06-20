import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { textOnSurface } from "../theme/role-classes";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label htmlFor={htmlFor} className={twMerge(`mb-1.5 block text-sm font-medium ${textOnSurface}`, className)}>
      {children}
    </label>
  );
};

export default Label;
