"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

const themeOrder = ["light", "dark", "system"] as const;

type ThemeValue = (typeof themeOrder)[number];

const themeLabels: Record<ThemeValue, string> = {
  light: "Claro",
  dark: "Oscuro",
  system: "Auto",
};

function isThemeValue(value: string | undefined): value is ThemeValue {
  return value === "light" || value === "dark" || value === "system";
}

export function DominiumThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = useMemo<ThemeValue>(() => {
    if (isThemeValue(theme)) {
      return theme;
    }

    return "system";
  }, [theme]);

  function cycleTheme() {
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];

    setTheme(nextTheme);
  }

  if (!mounted) {
    return (
      <div className="h-9 w-36 rounded-full border border-[var(--d-border)] bg-[var(--d-bg)]" />
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="inline-flex h-9 w-fit max-w-full items-center gap-2 rounded-full border border-[var(--d-border)] bg-[var(--d-bg)] px-3 text-xs font-black text-[var(--d-muted)] shadow-[var(--d-shadow-soft)] transition hover:text-[var(--d-text)]"
      aria-label="Cambiar apariencia"
    >
      <span className="h-2 w-2 rounded-full bg-[var(--d-primary)]" />
      <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--d-soft)]">
        Apariencia
      </span>
      <span className="text-[var(--d-text)]">{themeLabels[currentTheme]}</span>
    </button>
  );
}