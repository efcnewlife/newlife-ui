/** Shared 12-hour meridian helpers for TimeField / DateTimeField masks. */

export const hour12To24 = (hour12: number, meridian: string): number => {
  const isPm = meridian.toUpperCase() === "PM";
  if (isPm) {
    return hour12 === 12 ? 12 : hour12 + 12;
  }
  return hour12 === 12 ? 0 : hour12;
};

export const extractMeridianSuffix = (text: string): { body: string; meridian: string } => {
  const match = /\s*([AaPp][Mm]?)\s*$/.exec(text);
  if (!match || match.index == null) {
    return { body: text, meridian: "" };
  }
  const token = match[1]!.toUpperCase();
  let meridian = "";
  if (token === "A" || token === "AM") {
    meridian = token.length === 1 ? "A" : "AM";
  } else if (token === "P" || token === "PM") {
    meridian = token.length === 1 ? "P" : "PM";
  }
  return { body: text.slice(0, match.index), meridian };
};

/** Hours 1-12 without a meridian are ambiguous when ampm typing is in progress. */
export const isUnambiguous24hHour = (hour: number): boolean => hour === 0 || hour >= 13;
