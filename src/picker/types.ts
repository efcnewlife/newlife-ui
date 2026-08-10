export type PickerChangeSource = "field" | "view" | "unknown";

export type PickerValidationError =
  | "invalidDate"
  | "minDate"
  | "maxDate"
  | "minDateTime"
  | "maxDateTime"
  | null;

export interface PickerChangeMeta {
  validationError: PickerValidationError;
  source: PickerChangeSource;
}
