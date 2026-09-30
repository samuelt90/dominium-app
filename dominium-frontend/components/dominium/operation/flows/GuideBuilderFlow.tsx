"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState, useRef } from "react";
import {
  findMockProductByBarcode,
  type DominiumMockProduct,
} from "@/lib/dominium/mock-operation";
import {
  createGuideCode,
  createGuideSheetPayload,
  syncGuideItemToSheet,
  type DominiumCustomerType,
  type GuideSyncResult,
} from "@/lib/dominium/guide-sync";

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

type GuideItem = {
  product: DominiumMockProduct;
  quantity: number;
  lastSyncStatus: GuideSyncResult["status"];
};

type LastScan =
  | {
      status: "waiting";
      barcode: null;
      product: null;
      message: string;
    }
  | {
      status: "sending";
      barcode: string;
      product: DominiumMockProduct;
      message: string;
    }
  | {
      status: "sent";
      barcode: string;
      product: DominiumMockProduct;
      message: string;
    }
  | {
      status: "not-configured";
      barcode: string;
      product: DominiumMockProduct;
      message: string;
    }
  | {
      status: "failed";
      barcode: string;
      product: DominiumMockProduct;
      message: string;
    }
  | {
      status: "not-found";
      barcode: string;
      product: null;
      message: string;
    };

export function GuideBuilderFlow() {
  const [guideCode] = useState(() => createGuideCode());
  const scanLockedRef = useRef(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [customerType, setCustomerType] =
    useState<DominiumCustomerType>("minorista");
  const [customerName, setCustomerName] = useState("Mostrador");
  const [items, setItems] = useState<GuideItem[]>([]);

  const [lastScan, setLastScan] = useState<LastScan>({
    status: "waiting",
    barcode: null,
    product: null,
    message: "Escanea productos para agregarlos al pedido.",
  });


  const [pauseOverlay, setPauseOverlay] = useState<{
  productName: string;
  message: string;
} | null>(null);

  const totalUnits = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  }, [items]);

  function startOperationalPause({
  productName,
  message,
}: {
  productName: string;
  message: string;
}) {
  scanLockedRef.current = true;

  setPauseOverlay({
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
  async (barcode: string) => {
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

  scanLockedRef.current = false;

  return;
}


      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id
        );

        if (!existingItem) {
          return [
            ...currentItems,
            {
              product,
              quantity: 1,
              lastSyncStatus: "not-configured",
            },
          ];
        }

        return currentItems.map((item) => {
          if (item.product.id !== product.id) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + 1,
            lastSyncStatus: "not-configured",
          };
        });
      });

      setLastScan({
        status: "sending",
        barcode,
        product,
        message: "Producto agregado. Enviando al archivo conectado.",
      });



      const payload = createGuideSheetPayload({
        guideCode,
        customerType,
        customerName: customerName.trim() || "Mostrador",
        operatorName: "Operador Dominium",
        product,
      });

      const result = await syncGuideItemToSheet(payload);

      setItems((currentItems) =>
        currentItems.map((item) => {
          if (item.product.id !== product.id) {
            return item;
          }

          return {
            ...item,
            lastSyncStatus: result.status,
          };
        })
      );

      setLastScan({
        status: result.status,
        barcode,
        product,
        message: result.message,
      });
      startOperationalPause({
  productName: product.name,
  message:
    result.status === "sent"
      ? "Enviado al archivo"
      : result.message,
});
    },
    [customerName, customerType, guideCode]
  );

function clearGuide() {
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
    message: "Escanea productos para agregarlos al pedido.",
  });
}

  return (
  <section className="relative flex h-full min-h-0 flex-col gap-4">
    {pauseOverlay && (
      <OperationalPauseOverlay
        productName={pauseOverlay.productName}
        message={pauseOverlay.message}
      />
    )}
      <div className="shrink-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--d-soft)]">
          Armar guía
        </p>

        <h2 className="mt-1 text-3xl font-black tracking-[-0.07em] text-[var(--d-text)]">
          Pedido por escaneo
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-[var(--d-radius-xl)] bg-[var(--d-surface)] p-4 shadow-[var(--d-shadow-soft)]">
        <GuideSetupPanel
          guideCode={guideCode}
          customerType={customerType}
          customerName={customerName}
          totalUnits={totalUnits}
          totalAmount={totalAmount}
          onCustomerTypeChange={setCustomerType}
          onCustomerNameChange={setCustomerName}
        />

        <LastScanPanel lastScan={lastScan} />

        <div className="mt-4">
          <DominiumBarcodeScanner onScan={handleScan} cooldownMs={1600} />
        </div>

        <GuideItemsPanel items={items} />

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={clearGuide}
            className="h-12 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-transparent text-sm font-black text-[var(--d-muted)]"
          >
            Limpiar guía
          </button>
        </div>
      </div>
    </section>
  );
}

function GuideSetupPanel({
  guideCode,
  customerType,
  customerName,
  totalUnits,
  totalAmount,
  onCustomerTypeChange,
  onCustomerNameChange,
}: {
  guideCode: string;
  customerType: DominiumCustomerType;
  customerName: string;
  totalUnits: number;
  totalAmount: number;
  onCustomerTypeChange: (customerType: DominiumCustomerType) => void;
  onCustomerNameChange: (customerName: string) => void;
}) {
  return (
    <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Guía activa
          </p>

          <h3 className="mt-2 truncate font-mono text-xl font-black tracking-[-0.04em] text-[var(--d-text)]">
            {guideCode}
          </h3>
        </div>

        <span className="shrink-0 rounded-full bg-[var(--d-surface-strong)] px-3 py-2 text-xs font-black text-[var(--d-primary)]">
          {totalUnits} unidades
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onCustomerTypeChange("minorista")}
          className={[
            "h-11 rounded-[var(--d-radius-md)] border text-sm font-black",
            customerType === "minorista"
              ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
              : "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-text)]",
          ].join(" ")}
        >
          Minorista
        </button>

        <button
          type="button"
          onClick={() => onCustomerTypeChange("mayorista")}
          className={[
            "h-11 rounded-[var(--d-radius-md)] border text-sm font-black",
            customerType === "mayorista"
              ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
              : "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-text)]",
          ].join(" ")}
        >
          Mayorista
        </button>
      </div>

      <label className="mt-4 block">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--d-soft)]">
          Cliente / destino
        </span>

        <input
          value={customerName}
          onChange={(event) => onCustomerNameChange(event.target.value)}
          className="mt-2 h-12 w-full rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-4 text-sm font-black text-[var(--d-text)] outline-none"
          placeholder="Mostrador"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <GuideMetric label="Unidades" value={`${totalUnits}`} />
        <GuideMetric label="Total" value={`Q${totalAmount}`} />
      </div>
    </div>
  );
}

function LastScanPanel({ lastScan }: { lastScan: LastScan }) {
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
    lastScan.status === "sending"
      ? "Enviando"
      : lastScan.status === "sent"
        ? "En archivo"
        : lastScan.status === "failed"
          ? "Falló"
          : "Pendiente";

  return (
    <div className="mt-4 rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Producto agregado
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
        <GuideMetric label="Código" value={lastScan.product.barcode} mono />
        <GuideMetric label="Precio" value={`Q${lastScan.product.price}`} />
        <GuideMetric label="Cantidad" value="1" />
      </div>
    </div>
  );
}

function GuideItemsPanel({ items }: { items: GuideItem[] }) {
  return (
    <div className="mt-4 rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
        Productos del pedido
      </p>

      {items.length === 0 ? (
        <p className="mt-3 text-sm font-semibold leading-5 text-[var(--d-muted)]">
          Todavía no hay productos agregados.
        </p>
      ) : (
        <div className="mt-3 grid gap-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[var(--d-text)]">
                  {item.product.name}
                </p>

                <p className="mt-1 truncate text-xs font-bold text-[var(--d-muted)]">
                  {item.product.sku} · Q{item.product.price}
                </p>
              </div>

              <span className="rounded-full bg-[var(--d-bg)] px-3 py-2 text-xs font-black text-[var(--d-text)]">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GuideMetric({
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
function OperationalPauseOverlay({
  productName,
  message,
}: {
  productName: string;
  message: string;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[var(--d-radius-xl)] bg-black/55 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[var(--d-radius-xl)] border border-white/15 bg-[var(--d-surface)] p-5 text-center shadow-[var(--d-shadow-strong)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--d-soft)]">
          Producto registrado
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