"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DominiumOperationModeId } from "@/types/dominium";
import { operationModes } from "@/lib/dominium/mock-operation";
import { DominiumThemeToggle } from "@/components/dominium/theme/DominiumThemeToggle";
import { ScanProductFlow } from "@/components/dominium/operation/flows/ScanProductFlow";
import { GuideBuilderFlow } from "@/components/dominium/operation/flows/GuideBuilderFlow";
import { AuthorizedReceiptFlow } from "@/components/dominium/operation/flows/AuthorizedReceiptFlow";

export function OperationHome() {
  const [activeModeId, setActiveModeId] =
    useState<DominiumOperationModeId>("scan-product");

  const [mobileFlowOpen, setMobileFlowOpen] = useState(false);

  const activeMode = useMemo(
    () =>
      operationModes.find((mode) => mode.id === activeModeId) ??
      operationModes[0],
    [activeModeId]
  );

  function openMobileFlow(modeId: DominiumOperationModeId) {
    setActiveModeId(modeId);
    setMobileFlowOpen(true);
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-[var(--d-bg)] text-[var(--d-text)]">
      <section className="flex h-dvh flex-col overflow-hidden px-4 pb-5 pt-6 lg:hidden">
        {!mobileFlowOpen ? (
          <>
            <header className="shrink-0">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/acceso"
                  className="inline-flex h-10 items-center rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] px-4 text-sm font-black text-[var(--d-text)] shadow-[var(--d-shadow-soft)]"
                >
                  ← Volver
                </Link>

                <DominiumThemeToggle />
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--d-soft)]">
                  Dominium
                </p>

                <h1 className="mt-2 text-5xl font-black leading-none tracking-[-0.09em] text-[var(--d-text)]">
                  Operación
                </h1>
              </div>
            </header>

            <div className="mt-8 shrink-0 px-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--d-soft)]">
                Acciones disponibles
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
                Selecciona una operación
              </h2>
            </div>

            <div className="flex min-h-0 flex-1 items-center">
              <div className="grid w-full gap-4">
                {operationModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => openMobileFlow(mode.id)}
                    className="grid min-h-[132px] grid-cols-[1fr_auto] items-center gap-4 rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-surface)] p-5 text-left shadow-[var(--d-shadow-soft)] active:scale-[0.99]"
                  >
                    <span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
                        {mode.terminalLabel}
                      </span>

                      <span className="mt-2 block text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
                        {mode.title}
                      </span>

                      <span className="mt-2 block text-sm font-semibold leading-5 text-[var(--d-muted)]">
                        {mode.description}
                      </span>
                    </span>

                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--d-primary)] text-lg font-black text-[var(--d-bg)]">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <footer className="flex h-12 shrink-0 items-center justify-between rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] px-4 text-xs font-black text-[var(--d-muted)] shadow-[var(--d-shadow-soft)]">
              <span>Sesión operativa</span>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--d-success)]" />
            </footer>
          </>
        ) : (
          <div className="flex h-full min-h-0 flex-col">
            <header className="mb-4 flex shrink-0 items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMobileFlowOpen(false)}
                className="h-11 rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] px-4 text-sm font-black text-[var(--d-text)] shadow-[var(--d-shadow-soft)]"
              >
                ← Opciones
              </button>

              <DominiumThemeToggle />
            </header>

            <div className="min-h-0 flex-1">
              <OperationFlow modeId={activeMode.id} />
            </div>
          </div>
        )}
      </section>

      <section className="hidden h-dvh grid-cols-[320px_1fr] overflow-hidden p-5 lg:grid">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-surface)] p-5 shadow-[var(--d-shadow-soft)]">
          <div className="shrink-0">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--d-soft)]">
              Dominium
            </p>

            <h1 className="mt-2 text-5xl font-black leading-none tracking-[-0.09em] text-[var(--d-text)]">
              Operación
            </h1>
          </div>

          <div className="mt-7 grid shrink-0 gap-3">
            {operationModes.map((mode) => {
              const isActive = mode.id === activeModeId;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveModeId(mode.id)}
                  className={[
                    "rounded-[var(--d-radius-lg)] border p-4 text-left transition",
                    isActive
                      ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
                      : "border-[var(--d-border)] bg-[var(--d-bg)] text-[var(--d-text)] hover:border-[var(--d-primary)]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block text-[10px] font-black uppercase tracking-[0.18em]",
                      isActive
                        ? "text-[var(--d-bg)]/70"
                        : "text-[var(--d-soft)]",
                    ].join(" ")}
                  >
                    {mode.terminalLabel}
                  </span>

                  <span className="mt-2 block text-xl font-black tracking-[-0.05em]">
                    {mode.title}
                  </span>

                  <span
                    className={[
                      "mt-2 block text-sm font-semibold leading-5",
                      isActive
                        ? "text-[var(--d-bg)]/75"
                        : "text-[var(--d-muted)]",
                    ].join(" ")}
                  >
                    {mode.description}
                  </span>
                </button>
              );
            })}
          </div>

        <div className="mt-8 shrink-0">
  <Link
    href="/acceso"
    className="inline-flex h-10 w-fit items-center rounded-full px-1 text-sm font-black text-[var(--d-muted)] transition hover:text-[var(--d-text)]"
  >
    ← Volver
  </Link>
</div>
        </aside>

        <div className="min-w-0 overflow-hidden pl-5">
          <div className="h-full overflow-hidden rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-surface)] p-5 shadow-[var(--d-shadow-strong)]">
            <OperationFlow modeId={activeMode.id} />
          </div>
        </div>
      </section>
    </main>
  );
}

function OperationFlow({ modeId }: { modeId: DominiumOperationModeId }) {
  if (modeId === "scan-product") {
    return <ScanProductFlow />;
  }

  if (modeId === "guide-builder") {
    return <GuideBuilderFlow />;
  }

  return <AuthorizedReceiptFlow />;
}
