"use client";

import { motion } from "motion/react";
import type { DominiumOperationModeId } from "@/types/dominium";
import { DominiumBadge } from "@/components/dominium/ui/DominiumBadge";
import { DominiumCard } from "@/components/dominium/ui/DominiumCard";
import {
  mockAuthorizedReceipts,
  mockGuides,
  mockProducts,
} from "@/lib/dominium/mock-operation";
import { getReceiptProgress } from "@/lib/dominium/inventory-rules";

type OperationTerminalPreviewProps = {
  activeMode: DominiumOperationModeId;
};

const terminalCopy: Record<
  DominiumOperationModeId,
  {
    label: string;
    title: string;
    status: string;
    tone: "primary" | "success" | "warning" | "danger" | "neutral";
  }
> = {
  "scan-product": {
    label: "Lectura",
    title: "Producto detectado",
    status: "Consulta",
    tone: "primary",
  },
  "guide-builder": {
    label: "Guía activa",
    title: mockGuides[0]?.code ?? "GUIA-00018",
    status: "Sincronizado",
    tone: "success",
  },
  "authorized-receipt": {
    label: "Recepción activa",
    title: mockAuthorizedReceipts[0]?.code ?? "IMP-00031",
    status: "En recepción",
    tone: "warning",
  },
};

export function OperationTerminalPreview({
  activeMode,
}: OperationTerminalPreviewProps) {
  const copy = terminalCopy[activeMode];
  const product = mockProducts[0];
  const guide = mockGuides[0];
  const receipt = mockAuthorizedReceipts[0];
  const progress = receipt ? getReceiptProgress(receipt) : 0;

  return (
    <DominiumCard tone="terminal" className="h-full overflow-hidden p-0">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-terminal-muted)] sm:text-[11px]">
              {copy.label}
            </p>

            <h3 className="mt-2 truncate text-xl font-black tracking-[-0.05em] text-[var(--d-terminal-text)] sm:text-2xl">
              {copy.title}
            </h3>
          </div>

          <div className="shrink-0">
            <DominiumBadge tone={copy.tone}>{copy.status}</DominiumBadge>
          </div>
        </div>
      </div>

      <motion.div
        key={activeMode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="p-4 sm:p-5"
      >
        {activeMode === "scan-product" && (
          <div className="space-y-4">
            <div className="rounded-[var(--d-radius-md)] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--d-terminal-muted)] sm:text-xs">
                    Producto
                  </p>

                  <h4 className="mt-2 text-lg font-black leading-tight text-[var(--d-terminal-text)] sm:text-xl">
                    {product.name}
                  </h4>
                </div>

                <div className="rounded-full bg-[var(--d-terminal-accent)]/15 px-3 py-1 text-xs font-black text-[var(--d-terminal-accent)]">
                  {product.status === "low-stock" ? "Bajo" : "Activo"}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">SKU</p>
                  <p className="mt-1 font-black text-[var(--d-terminal-text)]">
                    {product.sku}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">Precio</p>
                  <p className="mt-1 font-black text-[var(--d-terminal-text)]">
                    Q{product.price}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">Ubicación</p>
                  <p className="mt-1 font-black text-[var(--d-terminal-text)]">
                    {product.locationStock} unidades
                  </p>
                </div>

                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">Total</p>
                  <p className="mt-1 font-black text-[var(--d-terminal-text)]">
                    {product.totalStock} unidades
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[var(--d-radius-md)] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-[var(--d-terminal-text)]">
                  Código leído
                </p>

                <p className="font-mono text-xs font-black text-[var(--d-terminal-accent)]">
                  {product.barcode}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeMode === "guide-builder" && (
          <div className="space-y-4">
            <div className="rounded-[var(--d-radius-md)] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--d-terminal-muted)] sm:text-xs">
                Cliente
              </p>

              <h4 className="mt-2 text-lg font-black leading-tight text-[var(--d-terminal-text)] sm:text-xl">
                {guide.customerName}
              </h4>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">Canal</p>
                  <p className="mt-1 capitalize font-black text-[var(--d-terminal-text)]">
                    {guide.channel}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">Líneas</p>
                  <p className="mt-1 font-black text-[var(--d-terminal-text)]">
                    {guide.items.length}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-[var(--d-terminal-muted)]">
                <span>Preparación</span>
                <span>64%</span>
              </div>

              <div className="rounded-full bg-white/10 p-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "64%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-2 rounded-full bg-[var(--d-terminal-accent)]"
                />
              </div>
            </div>
          </div>
        )}

        {activeMode === "authorized-receipt" && (
          <div className="space-y-4">
            <div className="rounded-[var(--d-radius-md)] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--d-terminal-muted)] sm:text-xs">
                Proveedor
              </p>

              <h4 className="mt-2 text-lg font-black leading-tight text-[var(--d-terminal-text)] sm:text-xl">
                {receipt.supplierName}
              </h4>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">Autorizado</p>
                  <p className="mt-1 font-black text-[var(--d-terminal-text)]">
                    {receipt.items[0]?.authorizedQuantity ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/15 p-3">
                  <p className="text-[var(--d-terminal-muted)]">Recibido</p>
                  <p className="mt-1 font-black text-[var(--d-terminal-text)]">
                    {receipt.items[0]?.receivedQuantity ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-[var(--d-terminal-muted)]">
                <span>Recepción</span>
                <span>{progress}%</span>
              </div>

              <div className="rounded-full bg-white/10 p-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-2 rounded-full bg-[var(--d-terminal-accent)]"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DominiumCard>
  );
}
