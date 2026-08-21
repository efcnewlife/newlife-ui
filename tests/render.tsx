import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import NotificationContainer from "../src/notification/NotificationContainer";
import { NotificationProvider } from "../src/notification/NotificationContext";

interface ProviderOptions {
  withNotifications?: boolean;
}

export function renderWithProviders(ui: ReactElement, options?: RenderOptions & ProviderOptions): RenderResult {
  const { withNotifications = false, ...renderOptions } = options ?? {};

  const Wrapper = ({ children }: { children: ReactNode }) => {
    if (!withNotifications) {
      return children;
    }

    return (
      <NotificationProvider>
        {children}
        <NotificationContainer />
      </NotificationProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
