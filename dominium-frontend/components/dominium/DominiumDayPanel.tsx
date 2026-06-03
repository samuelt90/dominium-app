"use client";

import { useState } from "react";
import type { ActivityLogItem, DaySummary } from "@/types/dominium";
import { DominiumActivityLog } from "@/components/dominium/DominiumActivityLog";

type DominiumDayPanelProps = {
  summary: DaySummary;
  activityLog: ActivityLogItem[];
};

export function DominiumDayPanel({
  summary,
  activityLog,
}: DominiumDayPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mt-8 rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between px-5 py-5 text-left sm:px-6"
      >
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Panel del día
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Resumen, usuarios activos y bitácora reciente.
          </p>
        </div>

        <span className="text-2xl text-neutral-500">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-neutral-100 px-5 pb-6 pt-5 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-2xl font-semibold text-emerald-700">
                {summary.registeredToday}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Registrados hoy
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-2xl font-semibold text-amber-600">
                {summary.pending}
              </p>
              <p className="mt-1 text-xs text-neutral-500">Pendientes</p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-2xl font-semibold text-blue-700">
                {summary.sentToVendra}
              </p>
              <p className="mt-1 text-xs text-neutral-500">Enviados</p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-2xl font-semibold text-red-600">
                {summary.errors}
              </p>
              <p className="mt-1 text-xs text-neutral-500">Errores</p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-2xl font-semibold text-neutral-700">
                {summary.activeUsers}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Usuarios activos
              </p>
            </div>
          </div>

          <DominiumActivityLog items={activityLog} />
        </div>
      )}
    </section>
  );
}
