"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DominiumThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-[152px] rounded-full bg-[var(--d-surface-strong)]" />
    );
  }

  const activeTheme = theme || "system";

  return (
    <div className="inline-flex rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] p-1 shadow-[var(--d-shadow-soft)]">
      {[
        { label: "Claro", value: "light" },
        { label: "Oscuro", value: "dark" },
        { label: "Auto", value: "system" },
      ].map((item) => {
        const isActive = activeTheme === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setTheme(item.value)}
            className={`rounded-full px-3 py-2 text-xs font-extrabold transition ${
              isActive
                ? "bg-[var(--d-primary)] text-[var(--d-bg)]"
                : "text-[var(--d-muted)] hover:text-[var(--d-text)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
