"use client";

import { useState } from "react";
import { DominiumHeader } from "@/components/dominium/DominiumHeader";
import { DominiumCommandInput } from "@/components/dominium/DominiumCommandInput";
import { DominiumActionButtons } from "@/components/dominium/DominiumActionButtons";
import { DominiumDayPanel } from "@/components/dominium/DominiumDayPanel";
import { DominiumCreatePanel } from "@/components/dominium/DominiumCreatePanel";
import { DominiumSearchPanel } from "@/components/dominium/DominiumSearchPanel";
import {
  mockActivityLog,
  mockDaySummary,
  mockProducts,
} from "@/lib/dominium/mock-data";

type ActivePanel = "create" | "search" | null;

export function DominiumShell() {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <DominiumHeader />

        <section className="flex flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-3xl">
            <DominiumCommandInput />

            <DominiumActionButtons
              onCreate={() => setActivePanel("create")}
              onSearch={() => setActivePanel("search")}
            />

            {activePanel === "create" && (
              <DominiumCreatePanel onClose={closePanel} />
            )}

            {activePanel === "search" && (
              <DominiumSearchPanel products={mockProducts} onClose={closePanel} />
            )}

            <DominiumDayPanel
              summary={mockDaySummary}
              activityLog={mockActivityLog}
            />

            <footer className="mt-8 text-center text-xs text-neutral-400">
              Dominium v1.0.0 · Ingreso rápido de inventario
            </footer>
          </div>
        </section>
      </section>
    </main>
  );
}
