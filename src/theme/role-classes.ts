/**
 * M3-aligned color role Tailwind class maps.
 * Components must use these instead of primitive scales (brand-*, gray-*, etc.).
 */

export const accentPrimarySolid =
  "bg-primary text-on-primary hover:bg-primary-hover disabled:bg-primary/40 shadow-theme-xs";

export const accentPrimaryContainer =
  "bg-primary-container text-on-primary-container";

export const buttonOutline =
  "bg-surface text-on-surface ring-1 ring-inset ring-outline hover:bg-surface-variant";

export const fieldShell =
  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3";

export const fieldBase =
  `${fieldShell} border-outline bg-surface text-on-surface placeholder:text-on-surface-variant focus:border-outline-focus focus:ring-primary/20`;

export const fieldDisabled =
  "text-on-surface-variant border-outline opacity-40 bg-surface-variant cursor-not-allowed";

export const fieldError =
  "border-error text-on-surface focus:border-error focus:ring-error/20";

export const fieldSuccess =
  "border-success text-on-surface focus:border-success focus:ring-success/20";

export const textareaBase =
  "w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden border-outline bg-surface text-on-surface focus:border-outline-focus focus:ring-3 focus:ring-primary/10";

export const textareaDisabled =
  "opacity-50 bg-surface-variant text-on-surface-variant cursor-not-allowed border-outline";

export const textareaError =
  "border-error focus:border-error focus:ring-error/10";

export const textareaSuccess =
  "border-success focus:border-success focus:ring-success/10";

export const surfacePanel =
  "bg-surface text-on-surface border border-outline-variant shadow-theme-lg";

export const surfaceContainerHigh =
  "bg-surface-container-high text-on-surface border border-outline-variant";

export const inversePanel = "bg-inverse-surface text-inverse-on-surface";

export const inversePanelHeader = "bg-surface-variant border-b border-outline-variant";

export const overlayScrim = "bg-on-surface/40";

export const textMuted = "text-on-surface-variant";

export const textOnSurface = "text-on-surface";

export const borderOutline = "border-outline";

export const borderOutlineVariant = "border-outline-variant";

export const focusRingPrimary = "focus:ring-primary/20 focus:border-outline-focus";

export const checkboxBase =
  "w-5 h-5 appearance-none cursor-pointer border border-outline rounded-md checked:border-transparent checked:bg-primary checked:text-on-primary disabled:opacity-60";

export const radioChecked = "border-primary bg-primary";

export const radioUnchecked = "bg-transparent border-outline";

export const switchTrackOn = "bg-primary";

export const switchTrackOff = "bg-outline-variant";

export const switchTrackDisabled = "bg-surface-variant pointer-events-none";

export const switchKnob = "bg-surface shadow-theme-sm";

export const spinnerPrimary = "border-primary";

export const progressFill = "bg-primary";

export const sliderTrack = "bg-surface-variant";

export const sliderRange = progressFill;

export const sliderThumb =
  "bg-surface border border-outline shadow-theme-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20";

export const sliderDisabled = "opacity-50 pointer-events-none";

export const tabActive =
  "border-primary text-primary";

export const tabInactive =
  "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant";

export const dropdownItemActive =
  "bg-primary-container text-on-primary-container";

export const dropdownItemHover =
  "hover:bg-primary text-on-primary";

export const selectOptionActive =
  "bg-primary-container text-on-primary-container";

export const tagPrimary =
  "bg-primary-container text-on-primary-container";

export const modalSurface = "bg-surface text-on-surface";

export const modalCloseButton =
  "bg-surface-variant text-on-surface-variant hover:bg-error-container hover:text-on-error-container";

export const notificationSurface = "bg-surface text-on-surface shadow-theme-sm";

export const notificationIconSuccess =
  "bg-success-container text-success";

export const notificationIconInfo = "bg-info-container text-info";

export const notificationIconWarning =
  "bg-warning-container text-warning";

export const notificationIconError = "bg-error-container text-error";

export const notificationBorderSuccess = "border-success";

export const notificationBorderInfo = "border-info";

export const notificationBorderWarning = "border-warning";

export const notificationBorderError = "border-error";

export const badgeLightPrimary = accentPrimaryContainer;

export const badgeSolidPrimary = "bg-primary text-on-primary";

export const badgeLightSuccess =
  "bg-success-container text-on-success-container";

export const badgeSolidSuccess = "bg-success text-on-success";

export const badgeLightError = "bg-error-container text-on-error-container";

export const badgeSolidError = "bg-error text-on-error";

export const badgeLightWarning =
  "bg-warning-container text-on-warning-container";

export const badgeSolidWarning = "bg-warning text-on-warning";

export const badgeLightInfo = "bg-info-container text-on-info-container";

export const badgeSolidInfo = "bg-info text-on-info";

export const badgeLightNeutral =
  "bg-surface-variant text-on-surface-variant";

export const badgeSolidNeutral = "bg-on-surface-variant text-on-primary";

export const calendarDayBase =
  "mx-auto flex size-6 items-center justify-center rounded-full text-sm font-semibold transition-colors";

export const calendarDayHover =
  "hover:bg-primary-container hover:text-on-primary-container";

export const calendarDaySelected = "bg-primary text-on-primary";

export const calendarDayInRange =
  "bg-primary-container text-on-primary-container rounded-none";

export const calendarNavButton =
  "flex size-5 items-center justify-center rounded transition-colors hover:bg-surface-variant";

export const calendarGridOption =
  "rounded-lg px-2 py-2 text-sm font-semibold transition-colors hover:bg-primary-container hover:text-on-primary-container";

export const calendarGridOptionSelected = "bg-primary text-on-primary";

export const alertSuccessContainer =
  "border-success bg-success-container text-on-success-container";

export const alertErrorContainer =
  "border-error bg-error-container text-on-error-container";

export const alertWarningContainer =
  "border-warning bg-warning-container text-on-warning-container";

export const alertInfoContainer =
  "border-info bg-info-container text-on-info-container";

export const alertIconSuccess = "text-success";

export const alertIconError = "text-error";

export const alertIconWarning = "text-warning";

export const alertIconInfo = "text-info";

export const alertTitle = "text-on-surface";

export const alertMessage = "text-on-surface-variant";

export const alertLink = "text-on-surface-variant underline";

export const fileInputBase =
  "h-11 w-full overflow-hidden rounded-lg border border-outline bg-surface text-sm text-on-surface-variant shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-outline-variant file:bg-surface-variant file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-on-surface placeholder:text-on-surface-variant hover:file:bg-surface-container focus:outline-hidden focus:border-outline-focus focus:file:ring-primary/20";

export const comboboxCheckboxChecked =
  "border-transparent bg-primary text-on-primary";

export const comboboxCheckboxUnchecked =
  "border-outline bg-surface";

export const comboboxOptionFocused = "bg-primary text-on-primary";

export const comboboxOptionDefault = "text-on-surface";

export const comboboxSpinner =
  "border-outline border-t-primary";

export const buttonGroupActivePrimary =
  "bg-primary text-on-primary border-primary";

export const buttonGroupInactivePrimary =
  "bg-surface text-primary hover:bg-primary hover:text-on-primary border-outline-variant";

export const buttonGroupActiveSecondary =
  "bg-surface text-on-surface border-outline-variant";

export const buttonGroupInactiveSecondary =
  "bg-transparent text-on-surface-variant hover:bg-surface-variant border-outline-variant";

export const buttonGroupContainer =
  "border rounded-lg border-outline-variant";

export const notificationActionPrimary =
  "bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary/30";

export const notificationActionSecondary =
  "bg-surface-variant text-on-surface hover:bg-surface-container focus:ring-outline";

export const notificationActionDanger =
  "bg-error text-on-error hover:bg-error/90 focus:ring-error/30";
