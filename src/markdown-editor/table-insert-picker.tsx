import { useRef, useState, type FC } from "react";
import { MdTableChart } from "react-icons/md";
import { cn } from "../cn";
import { FloatingSurface } from "../floating-surface";
import { accentPrimaryContainer, borderOutlineVariant, textMuted, textOnSurface } from "../theme/role-classes";

const TABLE_PICKER_MAX_ROWS = 6;
const TABLE_PICKER_MAX_COLS = 6;

export interface TableInsertPickerProps {
  disabled?: boolean;
  label: string;
  insertTitle: string;
  onInsert: (rows: number, cols: number) => void;
}

const TableInsertPicker: FC<TableInsertPickerProps> = ({ disabled = false, label, insertTitle, onInsert }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [hoverRows, setHoverRows] = useState(0);
  const [hoverCols, setHoverCols] = useState(0);

  const closePicker = () => {
    setOpen(false);
    setHoverRows(0);
    setHoverCols(0);
  };

  const handleInsert = (rows: number, cols: number) => {
    onInsert(rows, cols);
    closePicker();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="grid"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
        }}
        className={cn(
          "group/icon relative inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
          "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30",
          "disabled:cursor-not-allowed disabled:opacity-40",
          open ? accentPrimaryContainer : cn(textOnSurface, "hover:bg-surface-variant")
        )}
      >
        <span className="flex size-4 items-center justify-center [&_svg]:size-4" aria-hidden>
          <MdTableChart />
        </span>
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2",
            "opacity-0 transition-opacity duration-150",
            "group-hover/icon:opacity-100 group-focus-visible/icon:opacity-100"
          )}
        >
          <span className="relative block">
            <span
              className={cn(
                "block whitespace-nowrap rounded-md bg-inverse-surface px-2 py-0.5",
                "text-[11px] font-medium leading-snug text-inverse-on-surface shadow-lg"
              )}
            >
              {label}
            </span>
            <span
              aria-hidden
              className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-inverse-surface"
            />
          </span>
        </span>
      </button>

      <FloatingSurface
        open={open}
        anchorRef={triggerRef}
        placement="bottom-start"
        offset={8}
        onDismiss={closePicker}
        className="rounded-lg"
      >
        <div className={cn("w-44 rounded-lg border bg-surface p-3 shadow-lg", borderOutlineVariant)}>
          <p className={cn("text-xs font-medium", textOnSurface)}>{insertTitle}</p>
          <p className={cn("mt-1 min-h-4 text-xs", textMuted)} aria-live="polite">
            {hoverRows > 0 && hoverCols > 0 ? `${hoverRows} × ${hoverCols}` : "\u00a0"}
          </p>
          <div
            role="grid"
            aria-label={insertTitle}
            className="mt-2 grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${TABLE_PICKER_MAX_COLS}, minmax(0, 1fr))` }}
            onMouseLeave={() => {
              setHoverRows(0);
              setHoverCols(0);
            }}
          >
            {Array.from({ length: TABLE_PICKER_MAX_ROWS * TABLE_PICKER_MAX_COLS }, (_, index) => {
              const row = Math.floor(index / TABLE_PICKER_MAX_COLS) + 1;
              const col = (index % TABLE_PICKER_MAX_COLS) + 1;
              const isHighlighted = row <= hoverRows && col <= hoverCols;

              return (
                <button
                  key={`${row}-${col}`}
                  type="button"
                  role="gridcell"
                  aria-label={`${row} × ${col}`}
                  className={cn(
                    "size-4 rounded-sm border transition-colors",
                    isHighlighted
                      ? "border-primary bg-primary"
                      : cn("border-outline-variant bg-surface-variant/60 hover:border-outline")
                  )}
                  onMouseEnter={() => {
                    setHoverRows(row);
                    setHoverCols(col);
                  }}
                  onFocus={() => {
                    setHoverRows(row);
                    setHoverCols(col);
                  }}
                  onClick={() => handleInsert(row, col)}
                />
              );
            })}
          </div>
        </div>
      </FloatingSurface>
    </>
  );
};

export default TableInsertPicker;
