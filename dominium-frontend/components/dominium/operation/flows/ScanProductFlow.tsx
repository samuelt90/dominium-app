"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import {
  findMockProductByBarcode,
  getProductStatusLabel,
  type DominiumMockProduct,
} from "@/lib/dominium/mock-operation";

const DominiumBarcodeScanner = dynamic(
  () =>
    import("@/components/dominium/scanner/DominiumBarcodeScanner").then(
      (module) => module.DominiumBarcodeScanner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[260px] items-center justify-center rounded-[var(--d-radius-xl)] border border-white/10 bg-black text-sm font-black text-white/60">
        Preparando cámara
      </div>
    ),
  }
);

type ScanState =
  | {
      status: "waiting";
      barcode: null;
      product: null;
    }
  | {
      status: "found";
      barcode: string;
      product: DominiumMockProduct;
    }
  | {
      status: "not-found";
      barcode: string;
      product: null;
    };

export function ScanProductFlow() {
  const [scanState, setScanState] = useState<ScanState>({
    status: "waiting",
    barcode: null,
    product: null,
  });

  const handleScan = useCallback((barcode: string) => {
    const product = findMockProductByBarcode(barcode);

    if (product) {
      setScanState({
        status: "found",
        barcode,
        product,
      });

      return;
    }

    setScanState({
      status: "not-found",
      barcode,
      product: null,
    });
  }, []);

  function resetScan() {
    setScanState({
      status: "waiting",
      barcode: null,
      product: null,
    });
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--d-soft)]">
          Escanear producto
        </p>

        <h2 className="mt-1 text-3xl font-black tracking-[-0.07em] text-[var(--d-text)]">
          Lectura de código
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-[var(--d-radius-xl)] bg-[var(--d-surface)] p-4 shadow-[var(--d-shadow-soft)]">
        <DominiumBarcodeScanner onScan={handleScan} />

        <div className="mt-4">
          {scanState.status === "waiting" && (
            <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
                Estado
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[var(--d-text)]">
                Cámara activa
              </h3>

              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--d-muted)]">
                Apunta al código de barras del producto.
              </p>
            </div>
          )}

          {scanState.status === "found" && (
            <ProductFoundResult product={scanState.product} onReset={resetScan} />
          )}

          {scanState.status === "not-found" && (
            <CodeNotFoundResult barcode={scanState.barcode} onReset={resetScan} />
          )}
        </div>
      </div>
    </section>
  );
}

function ProductFoundResult({
  product,
  onReset,
}: {
  product: DominiumMockProduct;
  onReset: () => void;
}) {
  return (
    <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Producto detectado
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[var(--d-text)]">
            {product.name}
          </h3>

          <p className="mt-1 text-sm font-semibold text-[var(--d-muted)]">
            {product.sku}
          </p>
        </div>

        <span className="rounded-full bg-[var(--d-surface-strong)] px-3 py-2 text-xs font-black text-[var(--d-primary)]">
          {getProductStatusLabel(product.status)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoTile label="Precio" value={`Q${product.price}`} />
        <InfoTile label="Categoría" value={product.category} />
        <InfoTile label="Aquí" value={`${product.locationStock} unidades`} />
        <InfoTile label="Total" value={`${product.totalStock} unidades`} />
      </div>

      <div className="mt-4 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] p-3">
        <p className="text-xs font-bold text-[var(--d-muted)]">Código leído</p>
        <p className="mt-1 font-mono text-sm font-black text-[var(--d-text)]">
          {product.barcode}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 h-12 w-full rounded-[var(--d-radius-md)] bg-[var(--d-primary)] text-sm font-black text-[var(--d-bg)]"
      >
        Escanear otro
      </button>
    </div>
  );
}

function CodeNotFoundResult({
  barcode,
  onReset,
}: {
  barcode: string;
  onReset: () => void;
}) {
  return (
    <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
        Código no asociado
      </p>

      <h3 className="mt-2 font-mono text-2xl font-black tracking-[-0.05em] text-[var(--d-text)]">
        {barcode}
      </h3>

      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--d-muted)]">
        El código fue leído, pero no existe en los productos registrados.
      </p>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          className="h-12 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] text-sm font-black text-[var(--d-text)]"
        >
          Buscar producto existente
        </button>

        <button
          type="button"
          className="h-12 rounded-[var(--d-radius-md)] bg-[var(--d-primary)] text-sm font-black text-[var(--d-bg)]"
        >
          Enviar a revisión
        </button>

        <button
          type="button"
          onClick={onReset}
          className="h-12 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-transparent text-sm font-black text-[var(--d-muted)]"
        >
          Escanear otro
        </button>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] p-3">
      <p className="text-xs font-bold text-[var(--d-muted)]">{label}</p>
      <p className="mt-1 text-sm font-black text-[var(--d-text)]">{value}</p>
    </div>
  );
}
