"use client";

import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

const Provider =
  NextThemesProvider as ComponentType<PropsWithChildren<ThemeProviderProps>>;

type DominiumThemeProviderProps = {
  children: ReactNode;
};

export function DominiumThemeProvider({
  children,
}: DominiumThemeProviderProps) {
  return (
    <Provider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </Provider>
  );
}
