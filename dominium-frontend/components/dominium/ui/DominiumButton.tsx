import type { ButtonHTMLAttributes, ReactNode } from "react";

type DominiumButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type DominiumButtonSize = "sm" | "md" | "lg";

type DominiumButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: DominiumButtonVariant;
  size?: DominiumButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<DominiumButtonVariant, string> = {
  primary:
    "bg-[var(--d-primary)] text-[var(--d-bg)] shadow-[var(--d-shadow-soft)] hover:brightness-110",
  secondary:
    "bg-[var(--d-surface)] text-[var(--d-text)] border border-[var(--d-border)] hover:bg-[var(--d-surface-strong)]",
  ghost:
    "bg-transparent text-[var(--d-muted)] hover:bg-[var(--d-surface)] hover:text-[var(--d-text)]",
  danger:
    "bg-[var(--d-danger)] text-white shadow-[var(--d-shadow-soft)] hover:brightness-110",
};

const sizeClasses: Record<DominiumButtonSize, string> = {
  sm: "h-10 px-4 text-xs",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export function DominiumButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: DominiumButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-[var(--d-radius-md)] font-extrabold transition duration-200 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
