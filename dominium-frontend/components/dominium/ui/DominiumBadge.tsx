import type { ReactNode } from "react";

type DominiumBadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "primary";

type DominiumBadgeProps = {
  children: ReactNode;
  tone?: DominiumBadgeTone;
};

const toneClasses: Record<DominiumBadgeTone, string> = {
  neutral:
    "bg-[var(--d-surface-strong)] text-[var(--d-muted)] border-[var(--d-border)]",
  success:
    "bg-[color-mix(in_srgb,var(--d-success)_14%,transparent)] text-[var(--d-success)] border-[color-mix(in_srgb,var(--d-success)_28%,transparent)]",
  warning:
    "bg-[color-mix(in_srgb,var(--d-accent)_16%,transparent)] text-[var(--d-accent)] border-[color-mix(in_srgb,var(--d-accent)_32%,transparent)]",
  danger:
    "bg-[color-mix(in_srgb,var(--d-danger)_14%,transparent)] text-[var(--d-danger)] border-[color-mix(in_srgb,var(--d-danger)_30%,transparent)]",
  primary:
    "bg-[color-mix(in_srgb,var(--d-primary)_14%,transparent)] text-[var(--d-primary)] border-[color-mix(in_srgb,var(--d-primary)_30%,transparent)]",
};

export function DominiumBadge({
  children,
  tone = "neutral",
}: DominiumBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em]",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
