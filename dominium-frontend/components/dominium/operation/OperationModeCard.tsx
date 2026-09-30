"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type {
  DominiumOperationMode,
  DominiumOperationModeId,
} from "@/types/dominium";
import { DominiumBadge } from "@/components/dominium/ui/DominiumBadge";

type OperationModeCardProps = {
  mode: DominiumOperationMode;
  icon: ReactNode;
  isActive: boolean;
  onSelect: (modeId: DominiumOperationModeId) => void;
};

const shortLabels: Record<DominiumOperationModeId, string> = {
  "scan-product": "Producto",
  "guide-builder": "Lista",
  "authorized-receipt": "Importación",
};

export function OperationModeCard({
  mode,
  icon,
  isActive,
  onSelect,
}: OperationModeCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(mode.id)}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={[
        "group flex w-full flex-col justify-between rounded-[var(--d-radius-lg)] border p-4 text-left transition duration-200",
        "bg-[var(--d-surface)] shadow-[var(--d-shadow-soft)]",
        isActive
          ? "border-[var(--d-primary)]"
          : "border-[var(--d-border)] hover:border-[var(--d-primary)]/60",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--d-radius-md)] border transition",
            isActive
              ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
              : "border-[var(--d-border)] bg-[var(--d-surface-strong)] text-[var(--d-primary)]",
          ].join(" ")}
        >
          <div className="h-9 w-9">{icon}</div>
        </div>

        {isActive && <DominiumBadge tone="primary">Activo</DominiumBadge>}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--d-soft)]">
          {shortLabels[mode.id]}
        </p>

        <h3 className="mt-1 text-xl font-black tracking-[-0.05em] text-[var(--d-text)]">
          {mode.title}
        </h3>
      </div>

      <div className="mt-4">
        <span className="inline-flex rounded-full bg-[var(--d-primary)] px-4 py-2 text-xs font-black text-[var(--d-bg)] transition group-hover:brightness-110">
          {mode.actionLabel}
        </span>
      </div>
    </motion.button>
  );
}
