import type { Decorator, Preview } from "@storybook/react";
import NotificationContainer from "../src/notification/NotificationContainer";
import { NotificationProvider } from "../src/notification/NotificationContext";
import { applyStorybookTheme, resolveStorybookTheme, type StorybookThemeId } from "./apply-storybook-theme";
import "./storybook.css";

const STORYBOOK_THEMES: { value: StorybookThemeId; title: string }[] = [
  { value: "light", title: "Light" },
  { value: "dark", title: "Dark" },
];

const withNotifications: Decorator = (Story, context) => {
  if (context.parameters.withNotifications) {
    return (
      <NotificationProvider>
        <Story />
        <NotificationContainer />
      </NotificationProvider>
    );
  }

  return <Story />;
};

const withCenteredCanvas: Decorator = (Story, context) => {
  if (context.parameters.layout === "fullscreen") {
    return <Story />;
  }

  return (
    <div className="box-border flex min-h-screen w-full items-center justify-center p-6">
      <Story />
    </div>
  );
};

const withColorTheme: Decorator = (Story, context) => {
  applyStorybookTheme(resolveStorybookTheme(context.globals.colorTheme));
  return <Story />;
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    colorTheme: {
      description: "M3 color roles from theme/reference.css (light or dark)",
      defaultValue: "light",
      toolbar: {
        title: "Color theme",
        icon: "paintbrush",
        items: STORYBOOK_THEMES,
        dynamicTitle: true,
      },
    },
  },
  decorators: [withCenteredCanvas, withNotifications, withColorTheme],
};

export default preview;
