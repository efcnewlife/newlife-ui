/** Storybook-only light/dark toggle (see theme/reference.css). */
export type StorybookThemeId = "light" | "dark";

const THEME_CLASS_NAMES = ["dark"] as const;

const THEME_CLASS_MAP: Record<StorybookThemeId, readonly string[]> = {
  light: [],
  dark: ["dark"],
};

export function applyStorybookTheme(theme_id: StorybookThemeId): void {
  const root = document.documentElement;

  THEME_CLASS_NAMES.forEach((class_name) => {
    root.classList.remove(class_name);
  });

  const classes = THEME_CLASS_MAP[theme_id] ?? THEME_CLASS_MAP.light;
  classes.forEach((class_name) => {
    root.classList.add(class_name);
  });

  root.dataset.storybookTheme = theme_id;
}

export function resolveStorybookTheme(value: string | undefined): StorybookThemeId {
  if (value && value in THEME_CLASS_MAP) {
    return value as StorybookThemeId;
  }

  return "light";
}
