import { FC } from "react";
import { fileInputBase } from "../theme/role-classes";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: FC<FileInputProps> = ({ className = "", onChange }) => {
  return (
    <input
      type="file"
      className={`${fileInputBase} ${className}`}
      onChange={onChange}
    />
  );
};

export default FileInput;
