"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { DominiumDestination } from "@/types/dominium";

const DominiumBarcodeScanner = dynamic(
  () =>
    import("@/components/dominium/DominiumBarcodeScanner").then(
      (module) => module.DominiumBarcodeScanner
    ),
  {
    ssr: false,
    loading: () => null,
  }
);

type DominiumCreatePanelProps = {
  onClose: () => void;
};

export function DominiumCreatePanel({ onClose }: DominiumCreatePanelProps) {
  const [showScanner, setShowScanner] = useState(false);

  const [destination, setDestination] =
    useState<DominiumDestination>("aparta");

  const [form, setForm] = useState({
    code: "",
    name: "",
    initialPrice: "",
    quantity: "1",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleDetectedCode = useCallback((code: string) => {
    setForm((current) => ({
      ...current,
      code,
    }));

    setShowScanner(false);
  }, []);

  return (
    <section className="mt-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">Crear</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Registra productos nuevos desde teléfono, código o foto.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-500 transition hover:bg-neutral-50"
        >
          Cerrar
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Código
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={form.code}
              onChange={(event) => handleChange("code", event.target.value)}
              placeholder="Escanea, escribe o usa lector físico"
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-emerald-400 focus:bg-white"
            />

            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="shrink-0 rounded-2xl bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Escanear
            </button>
          </div>

          <p className="mt-2 text-xs text-neutral-400">
            En PC puedes usar lector USB. En teléfono puedes usar la cámara.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Imagen
          </label>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Nombre
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Ej. Zapatos Nike negros"
            className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-emerald-400 focus:bg-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Precio inicial
            </label>

            <input
              type="number"
              value={form.initialPrice}
              onChange={(event) =>
                handleChange("initialPrice", event.target.value)
              }
              placeholder="Q0.00"
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Destino
            </label>

            <select
              value={destination}
              onChange={(event) =>
                setDestination(event.target.value as DominiumDestination)
              }
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-emerald-400 focus:bg-white"
            >
              <option value="aparta">/aparta</option>
              <option value="tienda">/tienda</option>
            </select>
          </div>
        </div>

        {destination === "tienda" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Cantidad
            </label>

            <input
              type="number"
              value={form.quantity}
              onChange={(event) => handleChange("quantity", event.target.value)}
              min="1"
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-emerald-400 focus:bg-white"
            />
          </div>
        )}

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-2xl bg-emerald-700 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Guardar en Dominium
          </button>

          <a
            href="#"
            className="rounded-2xl border border-neutral-200 px-5 py-4 text-center text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            Editar en tienda
          </a>
        </div>
      </div>

      {showScanner && (
        <DominiumBarcodeScanner
          onDetected={handleDetectedCode}
          onClose={() => setShowScanner(false)}
        />
      )}
    </section>
  );
}
