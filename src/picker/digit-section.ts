/**
 * Two-digit section typing (month/day/hour/minute/second).
 * If appending a digit would exceed max (e.g. month 14, day 34), the new digit
 * becomes the section value instead — matching common date/time field UX.
 */
export const pushTwoDigitSection = (
  current: string,
  digit: string,
  max: number,
  min = 0
): { value: string; complete: boolean } => {
  const pad2 = (value: string): string => value.padStart(2, "0");

  const applyFirstDigit = (nextDigit: string): { value: string; complete: boolean } => {
    const numeric = Number(nextDigit);
    if (numeric * 10 > max) {
      if (numeric < min || numeric > max) {
        return { value: nextDigit, complete: false };
      }
      return { value: pad2(nextDigit), complete: true };
    }
    return { value: nextDigit, complete: false };
  };

  const base = current.length >= 2 ? "" : current;
  if (base.length === 0) {
    return applyFirstDigit(digit);
  }

  const candidate = `${base}${digit}`;
  const numeric = Number(candidate);
  if (numeric > max || numeric < min) {
    return applyFirstDigit(digit);
  }
  return { value: pad2(candidate), complete: true };
};
