"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  findMockProductByBarcode,
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

const AUTHORIZED_LIMIT_PER_CODE = 2;

type ReceiptItem = {
  product: DominiumMockProduct;
  quantity: number;
};

type LastReceiptScan =
  | {
      status: "waiting";
      barcode: null;
      product: null;
      message: string;
    }
  | {
      status: "added";
      barcode: string;
      product: DominiumMockProduct;
      quantity: number;
      message: string;
    }
  | {
      status: "completed";
      barcode: string;
      product: DominiumMockProduct;
      quantity: number;
      message: string;
    }
  | {
      status: "blocked";
      barcode: string;
      product: DominiumMockProduct;
      quantity: number;
      message: string;
    }
  | {
      status: "not-found";
      barcode: string;
      product: null;
      message: string;
    };

export function AuthorizedReceiptFlow() {
  const scanLockedRef = useRef(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [items, setItems] = useState<ReceiptItem[]>([]);

  const [lastScan, setLastScan] = useState<LastReceiptScan>({
    status: "waiting",
    barcode: null,
    product: null,
    message: "Escanea productos para ingresarlos contra el documento autorizado.",
  });

  const [pauseOverlay, setPauseOverlay] = useState<{
    title: string;
    productName: string;
    message: string;
  } | null>(null);

  const totalUnits = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const completedProducts = useMemo(() => {
    return items.filter((item) => item.quantity >= AUTHORIZED_LIMIT_PER_CODE)
      .length;
  }, [items]);

  function startOperationalPause({
    title,
    productName,
    message,
  }: {
    title: string;
    productName: string;
    message: string;
  }) {
    scanLockedRef.current = true;

    setPauseOverlay({
      title,
      productName,
      message,
    });

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    pauseTimeoutRef.current = setTimeout(() => {
      setPauseOverlay(null);
      scanLockedRef.current = false;
    }, 2600);
  }

const handleScan = useCallback(
  (barcode: string) => {
    if (scanLockedRef.current) {
      return;
    }

    scanLockedRef.current = true;

    const product = findMockProductByBarcode(barcode);

    if (!product) {
      setLastScan({
        status: "not-found",
        barcode,
        product: null,
        message: "El código fue leído, pero no existe en productos registrados.",
      });

      startOperationalPause({
        title: "Código no asociado",
        productName: barcode,
        message: "No se ingresó al documento.",
      });

      return;
    }

    const existingItem = items.find((item) => item.product.id === product.id);
    const currentQuantity = existingItem?.quantity ?? 0;

    if (currentQuantity >= AUTHORIZED_LIMIT_PER_CODE) {
      setLastScan({
        status: "blocked",
        barcode,
        product,
        quantity: currentQuantity,
        message: "Límite permitido alcanzado según documento.",
      });

      startOperationalPause({
        title: "Movimiento bloqueado",
        productName: product.name,
        message: "Límite permitido alcanzado según documento.",
      });

      return;
    }

    const nextQuantity = currentQuantity + 1;
    const isCompleted = nextQuantity >= AUTHORIZED_LIMIT_PER_CODE;

    setItems((currentItems) => {
      const itemExists = currentItems.some(
        (item) => item.product.id === product.id
      );

      if (!itemExists) {
        return [
          ...currentItems,
          {
            product,
            quantity: nextQuantity,
          },
        ];
      }

      return currentItems.map((item) => {
        if (item.product.id !== product.id) {
          return item;
        }

        return {
          ...item,
          quantity: nextQuantity,
        };
      });
    });

    if (isCompleted) {
      setLastScan({
        status: "completed",
        barcode,
        product,
        quantity: nextQuantity,
        message: "Producto ingresado en su totalidad.",
      });

      startOperationalPause({
        title: "Producto completo",
        productName: product.name,
        message: "Ingresado en su totalidad.",
      });

      return;
    }

    setLastScan({
      status: "added",
      barcode,
      product,
      quantity: nextQuantity,
      message: "Producto agregado con éxito.",
    });

    startOperationalPause({
      title: "Producto agregado",
      productName: product.name,
      message: "Agregado con éxito.",
    });
  },
  [items]
);


  function clearReceipt() {
    setItems([]);
    setPauseOverlay(null);
    scanLockedRef.current = false;

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    setLastScan({
      status: "waiting",
      barcode: null,
      product: null,
      message: "Escanea productos para ingresarlos contra el documento autorizado.",
    });
  }

  return (
    <section className="relative flex h-full min-h-0 flex-col gap-4">
      {pauseOverlay && (
        <ReceiptPauseOverlay
          title={pauseOverlay.title}
          productName={pauseOverlay.productName}
          message={pauseOverlay.message}
        />
      )}

      <div className="shrink-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--d-soft)]">
          Recepción autorizada
        </p>

        <h2 className="mt-1 text-3xl font-black tracking-[-0.07em] text-[var(--d-text)]">
          Ingreso por documento
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-[var(--d-radius-xl)] bg-[var(--d-surface)] p-4 shadow-[var(--d-shadow-soft)]">
        <ReceiptSummary
          totalUnits={totalUnits}
          completedProducts={completedProducts}
        />

        <LastReceiptScanPanel lastScan={lastScan} />

        <div className="mt-4">
          <DominiumBarcodeScanner onScan={handleScan} cooldownMs={1600} />
        </div>

        <ReceiptItemsPanel items={items} />

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={clearReceipt}
            className="h-12 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-transparent text-sm font-black text-[var(--d-muted)]"
          >
            Limpiar recepción
          </button>
        </div>
      </div>
    </section>
  );
}

function ReceiptSummary({
  totalUnits,
  completedProducts,
}: {
  totalUnits: number;
  completedProducts: number;
}) {
  return (
    <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
        Documento autorizado
      </p>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-black leading-tight tracking-[-0.06em] text-[var(--d-text)]">
            Límite por código
          </h3>

          <p className="mt-1 text-sm font-bold text-[var(--d-muted)]">
            Cada producto puede ingresarse hasta 2 veces.
          </p>
        </div>

        <span className="rounded-full bg-[var(--d-surface-strong)] px-3 py-2 text-xs font-black text-[var(--d-primary)]">
          {totalUnits} unidades
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ReceiptMetric label="Permitido" value="2 por código" />
        <ReceiptMetric label="Completos" value={`${completedProducts}`} />
      </div>
    </div>
  );
}

function LastReceiptScanPanel({
  lastScan,
}: {
  lastScan: LastReceiptScan;
}) {
  if (lastScan.status === "waiting") {
    return (
      <div className="mt-4 rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
          Última lectura
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
          Esperando producto
        </h3>

        <p className="mt-1 text-sm font-semibold leading-5 text-[var(--d-muted)]">
          {lastScan.message}
        </p>
      </div>
    );
  }

  if (lastScan.status === "not-found") {
    return (
      <div className="mt-4 rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
          Código no asociado
        </p>

        <h3 className="mt-2 font-mono text-2xl font-black tracking-[-0.05em] text-[var(--d-text)]">
          {lastScan.barcode}
        </h3>

        <p className="mt-1 text-sm font-semibold leading-5 text-[var(--d-muted)]">
          {lastScan.message}
        </p>
      </div>
    );
  }

  const statusLabel =
    lastScan.status === "blocked"
      ? "Bloqueado"
      : lastScan.status === "completed"
        ? "Completo"
        : "Agregado";

  return (
    <div className="mt-4 rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Última lectura
          </p>

          <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.06em] text-[var(--d-text)]">
            {lastScan.product.name}
          </h3>

          <p className="mt-1 text-sm font-black text-[var(--d-muted)]">
            {lastScan.product.sku}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[var(--d-surface-strong)] px-3 py-2 text-xs font-black text-[var(--d-primary)]">
          {statusLabel}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold leading-5 text-[var(--d-muted)]">
        {lastScan.message}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ReceiptMetric label="Código" value={lastScan.product.barcode} mono />
        <ReceiptMetric
          label="Ingresado"
          value={`${lastScan.quantity}/${AUTHORIZED_LIMIT_PER_CODE}`}
        />
        <ReceiptMetric
          label="Pendiente"
          value={`${Math.max(
            AUTHORIZED_LIMIT_PER_CODE - lastScan.quantity,
            0
          )}`}
        />
      </div>
    </div>
  );
}

function ReceiptItemsPanel({ items }: { items: ReceiptItem[] }) {
  return (
    <div className="mt-4 rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
        Productos ingresados
      </p>

      {items.length === 0 ? (
        <p className="mt-3 text-sm font-semibold leading-5 text-[var(--d-muted)]">
          Todavía no hay productos ingresados.
        </p>
      ) : (
        <div className="mt-3 grid gap-3">
          {items.map((item) => {
            const isComplete = item.quantity >= AUTHORIZED_LIMIT_PER_CODE;

            return (
              <div
                key={item.product.id}
                className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[var(--d-text)]">
                    {item.product.name}
                  </p>

                  <p className="mt-1 truncate text-xs font-bold text-[var(--d-muted)]">
                    {item.product.sku}
                  </p>
                </div>

                <span
                  className={[
                    "rounded-full px-3 py-2 text-xs font-black",
                    isComplete
                      ? "bg-[var(--d-primary)] text-[var(--d-bg)]"
                      : "bg-[var(--d-bg)] text-[var(--d-text)]",
                  ].join(" ")}
                >
                  {item.quantity}/{AUTHORIZED_LIMIT_PER_CODE}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReceiptMetric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--d-soft)]">
        {label}
      </p>

      <p
        className={[
          "mt-1 truncate text-sm font-black text-[var(--d-text)]",
          mono ? "font-mono" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function ReceiptPauseOverlay({
  title,
  productName,
  message,
}: {
  title: string;
  productName: string;
  message: string;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[var(--d-radius-xl)] bg-black/55 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[var(--d-radius-xl)] border border-white/15 bg-[var(--d-surface)] p-5 text-center shadow-[var(--d-shadow-strong)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--d-soft)]">
          {title}
        </p>

        <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.07em] text-[var(--d-text)]">
          {productName}
        </h3>

        <p className="mt-3 text-base font-black text-[var(--d-primary)]">
          {message}
        </p>

        <p className="mt-4 text-sm font-semibold leading-6 text-[var(--d-muted)]">
          Retira el producto y acerca el siguiente.
        </p>
      </div>
    </div>
  );
}
