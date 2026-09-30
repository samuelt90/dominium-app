import type { ReactNode } from "react";

type DominiumPanelHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function DominiumPanelHeader({
  eyebrow,
  title,
  description,
  action,
}: DominiumPanelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-xl font-black tracking-[-0.04em] text-[var(--d-text)]">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--d-muted)]">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
