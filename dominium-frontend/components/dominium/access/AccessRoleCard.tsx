"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type AccessRoleCardProps = {
  title: string;
  eyebrow: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: "control" | "operation";
  layout?: "mobile-card" | "desktop-row";
};

export function AccessRoleCard({
  title,
  eyebrow,
  description,
  icon,
  onClick,
  tone = "control",
  layout = "mobile-card",
}: AccessRoleCardProps) {
  const isOperation = tone === "operation";
  const isDesktopRow = layout === "desktop-row";

  if (isDesktopRow) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.992 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className={[
         "group grid w-full grid-cols-[54px_1fr_auto] items-center gap-4 rounded-[var(--d-radius-lg)] border p-4 text-left shadow-[var(--d-shadow-soft)] transition duration-200 sm:grid-cols-[64px_1fr_auto] sm:gap-5 sm:p-5",
          isOperation
            ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
            : "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-text)] hover:border-[var(--d-primary)]/60",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-14 w-14 items-center justify-center rounded-[var(--d-radius-md)] border sm:h-16 sm:w-16"
,
            isOperation
              ? "border-white/20 bg-white/10 text-[var(--d-bg)]"
              : "border-[var(--d-border)] bg-[var(--d-surface-strong)] text-[var(--d-primary)]",
          ].join(" ")}
        >
          <div className="h-9 w-9">{icon}</div>
        </div>

        <div className="min-w-0">
          <p
            className={[
              "text-[11px] font-black uppercase tracking-[0.18em]",
              isOperation ? "text-[var(--d-bg)]/65" : "text-[var(--d-soft)]",
            ].join(" ")}
          >
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-black tracking-[-0.05em] sm:text-2xl">
            {title}
          </h2>

          <p
            className={[
              "mt-1 text-xs font-semibold sm:mt-2 sm:text-sm",
              isOperation ? "text-[var(--d-bg)]/70" : "text-[var(--d-muted)]",
            ].join(" ")}
          >
            {description}
          </p>
        </div>

        <span
          className={[
            "rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition",
            isOperation
              ? "bg-white/10 text-[var(--d-bg)] group-hover:bg-white/15"
              : "bg-[var(--d-surface-strong)] text-[var(--d-soft)] group-hover:bg-[var(--d-primary)] group-hover:text-[var(--d-bg)]",
          ].join(" ")}
        >
          Entrar
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={[
        "group relative flex min-h-0 w-full flex-col overflow-hidden rounded-[var(--d-radius-xl)] border p-5 text-left shadow-[var(--d-shadow-soft)] transition duration-200",
        isOperation
          ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
          : "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-text)]",
      ].join(" ")}
    >
      <div
        className={[
          "absolute -right-12 -top-12 h-36 w-36 rounded-full blur-2xl",
          isOperation
            ? "bg-[var(--d-accent)]/24"
            : "bg-[var(--d-accent)]/12",
        ].join(" ")}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div
          className={[
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--d-radius-md)] border",
            isOperation
              ? "border-white/20 bg-white/10 text-[var(--d-bg)]"
              : "border-[var(--d-border)] bg-[var(--d-surface-strong)] text-[var(--d-primary)]",
          ].join(" ")}
        >
          <div className="h-9 w-9">{icon}</div>
        </div>

        <span
          className={[
            "rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]",
            isOperation
              ? "bg-white/10 text-[var(--d-bg)]"
              : "bg-[var(--d-surface-strong)] text-[var(--d-soft)]",
          ].join(" ")}
        >
          Entrar
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-5">
        <p
          className={[
            "text-[11px] font-black uppercase tracking-[0.18em]",
            isOperation ? "text-[var(--d-bg)]/65" : "text-[var(--d-soft)]",
          ].join(" ")}
        >
          {eyebrow}
        </p>

        <h2 className="mt-1 text-3xl font-black tracking-[-0.07em]">
          {title}
        </h2>

        <p
          className={[
            "mt-2 text-sm font-semibold leading-5",
            isOperation ? "text-[var(--d-bg)]/72" : "text-[var(--d-muted)]",
          ].join(" ")}
        >
          {description}
        </p>
      </div>
    </motion.button>
  );
}
