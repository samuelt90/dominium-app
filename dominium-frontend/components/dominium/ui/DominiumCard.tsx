import type { HTMLAttributes, ReactNode } from "react";

type DominiumCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: "surface" | "strong" | "terminal";
};

const toneClasses = {
  surface:
    "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-text)] shadow-[var(--d-shadow-soft)]",
  strong:
    "border-[var(--d-border)] bg-[var(--d-surface-strong)] text-[var(--d-text)] shadow-[var(--d-shadow-soft)]",
  terminal:
    "border-black/10 bg-[var(--d-terminal-bg)] text-[var(--d-terminal-text)] shadow-[var(--d-shadow-strong)]",
};

export function DominiumCard({
  children,
  tone = "surface",
  className = "",
  ...props
}: DominiumCardProps) {
  return (
    <div
      className={[
        "rounded-[var(--d-radius-lg)] border p-5",
        toneClasses[tone],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
