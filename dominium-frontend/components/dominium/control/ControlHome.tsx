"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { DominiumThemeToggle } from "@/components/dominium/theme/DominiumThemeToggle";
import {
  initialControlAuthorizations,
  initialControlHistory,
  initialControlReport,
  type ControlAuthorizations,
  type ControlCustomerType,
  type ControlHistoryItem,
  type ControlMerchandiseAuthorization,
  type ControlMerchandiseAuthorizationStatus,
  type ControlOrderAuthorization,
  type ControlOrderAuthorizationStatus,
  type ControlReport,
} from "@/lib/dominium/mock-control";
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

const STORAGE_KEY = "dominium-control-state-v2";

type ControlSection = "reportes" | "autorizaciones" | "escanear";

type ControlState = {
  report: ControlReport;
  history: ControlHistoryItem[];
  authorizations: ControlAuthorizations;
};

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

export function ControlHome() {
  const [activeSection, setActiveSection] =
    useState<ControlSection>("reportes");

  const [controlState, setControlState] = useState<ControlState>(() => ({
    report: initialControlReport,
    history: initialControlHistory,
    authorizations: initialControlAuthorizations,
  }));

  useEffect(() => {
    const storedState = window.localStorage.getItem(STORAGE_KEY);

    if (!storedState) {
      return;
    }

    try {
      setControlState(JSON.parse(storedState) as ControlState);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(controlState));
  }, [controlState]);

  function updateOrderAuthorization(patch: Partial<ControlOrderAuthorization>) {
    setControlState((currentState) => ({
      ...currentState,
      authorizations: {
        ...currentState.authorizations,
        order: {
          ...currentState.authorizations.order,
          ...patch,
        },
      },
    }));
  }

  function updateMerchandiseAuthorization(
    patch: Partial<ControlMerchandiseAuthorization>
  ) {
    setControlState((currentState) => ({
      ...currentState,
      authorizations: {
        ...currentState.authorizations,
        merchandiseEntry: {
          ...currentState.authorizations.merchandiseEntry,
          ...patch,
        },
      },
    }));
  }

  function resetControlState() {
    setControlState({
      report: initialControlReport,
      history: initialControlHistory,
      authorizations: initialControlAuthorizations,
    });
  }

  return (
    <main className="min-h-dvh bg-[var(--d-bg)] text-[var(--d-text)]">
      <section className="flex min-h-dvh flex-col px-4 pb-5 pt-6 lg:hidden">
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

    <h1 className="mt-2 text-4xl font-black leading-none tracking-[-0.08em] text-[var(--d-text)]">
      Control
    </h1>
  </div>
</header>


        <MobileSectionTabs
          activeSection={activeSection}
          onChange={setActiveSection}
        />

        <div className="mt-4 min-h-0 flex-1 overflow-auto">
          <ControlSectionContent
            activeSection={activeSection}
            controlState={controlState}
            onOrderAuthorizationChange={updateOrderAuthorization}
            onMerchandiseAuthorizationChange={updateMerchandiseAuthorization}
            onReset={resetControlState}
          />
        </div>
      </section>

      <section className="hidden h-dvh grid-cols-[320px_1fr] overflow-hidden p-5 lg:grid">
        <aside className="flex min-h-0 flex-col rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-surface)] p-5 shadow-[var(--d-shadow-soft)]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--d-soft)]">
              Dominium
            </p>

            <h1 className="mt-2 text-5xl font-black leading-none tracking-[-0.09em] text-[var(--d-text)]">
              Control
            </h1>
          </div>

          <nav className="mt-8 grid gap-3">
            <ControlNavButton
              label="Reportes"
              active={activeSection === "reportes"}
              onClick={() => setActiveSection("reportes")}
            />
            <ControlNavButton
              label="Autorizaciones"
              active={activeSection === "autorizaciones"}
              onClick={() => setActiveSection("autorizaciones")}
            />
            <ControlNavButton
              label="Escanear"
              active={activeSection === "escanear"}
              onClick={() => setActiveSection("escanear")}
            />
          </nav>

       <div className="mt-auto grid gap-4">
  <Link
    href="/acceso"
    className="inline-flex h-10 w-fit items-center rounded-full px-1 text-sm font-black text-[var(--d-muted)] transition hover:text-[var(--d-text)]"
  >
    ← Volver
  </Link>

  <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-3">
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
      Apariencia
    </p>

    <div className="mt-3">
      <DominiumThemeToggle />
    </div>
  </div>
</div>
        </aside>

        <div className="min-w-0 overflow-hidden pl-5">
          <div className="h-full overflow-auto rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-surface)] p-5 shadow-[var(--d-shadow-strong)]">
            <ControlSectionContent
              activeSection={activeSection}
              controlState={controlState}
              onOrderAuthorizationChange={updateOrderAuthorization}
              onMerchandiseAuthorizationChange={updateMerchandiseAuthorization}
              onReset={resetControlState}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ControlSectionContent({
  activeSection,
  controlState,
  onOrderAuthorizationChange,
  onMerchandiseAuthorizationChange,
  onReset,
}: {
  activeSection: ControlSection;
  controlState: ControlState;
  onOrderAuthorizationChange: (patch: Partial<ControlOrderAuthorization>) => void;
  onMerchandiseAuthorizationChange: (
    patch: Partial<ControlMerchandiseAuthorization>
  ) => void;
  onReset: () => void;
}) {
  if (activeSection === "autorizaciones") {
    return (
      <AuthorizationsPanel
        authorizations={controlState.authorizations}
        onOrderAuthorizationChange={onOrderAuthorizationChange}
        onMerchandiseAuthorizationChange={onMerchandiseAuthorizationChange}
        onReset={onReset}
      />
    );
  }

  if (activeSection === "escanear") {
    return <AdminScanPanel />;
  }

  return (
    <ReportsPanel
      report={controlState.report}
      history={controlState.history}
    />
  );
}

function ReportsPanel({
  report,
  history,
}: {
  report: ControlReport;
  history: ControlHistoryItem[];
}) {
  return (
    <section>
      <PanelTitle
        eyebrow="Reportes"
        title="Qué está pasando"
        description="Estado actual de stock, ingreso de mercadería y pedidos enviados."
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <ControlCard>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Stock
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
            {report.stock.title}
          </h3>

          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--d-muted)]">
            {report.stock.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniMetric
              label="Bajo stock"
              value={`${report.stock.lowStockProducts}`}
            />
            <MiniMetric
              label="Estables"
              value={`${report.stock.stableProducts}`}
            />
          </div>
        </ControlCard>

        <ControlCard>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Ingreso de mercadería
          </p>

          <h3 className="mt-2 font-mono text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
            {report.merchandiseEntry.documentCode}
          </h3>

          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--d-muted)]">
            {report.merchandiseEntry.description}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniMetric
              label="Esperado"
              value={`${report.merchandiseEntry.expectedUnits}`}
            />
            <MiniMetric
              label="Ingresado"
              value={`${report.merchandiseEntry.receivedUnits}`}
            />
            <MiniMetric
              label="Pendiente"
              value={`${report.merchandiseEntry.pendingUnits}`}
            />
          </div>
        </ControlCard>

        <ControlCard>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Pedidos
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
            {report.sentOrders.total} enviados
          </h3>

          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--d-muted)]">
            {report.sentOrders.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniMetric
              label="Minorista"
              value={`${report.sentOrders.minorista}`}
            />
            <MiniMetric
              label="Mayorista"
              value={`${report.sentOrders.mayorista}`}
            />
          </div>
        </ControlCard>
      </div>

      <div className="mt-5">
        <ControlCard>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Historial
          </p>

          <div className="mt-4 grid gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[58px_1fr] gap-3 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] p-3"
              >
                <p className="font-mono text-xs font-black text-[var(--d-primary)]">
                  {item.time}
                </p>

                <div className="min-w-0">
                  <p className="text-sm font-black text-[var(--d-text)]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--d-muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ControlCard>
      </div>
    </section>
  );
}

function AuthorizationsPanel({
  authorizations,
  onOrderAuthorizationChange,
  onMerchandiseAuthorizationChange,
  onReset,
}: {
  authorizations: ControlAuthorizations;
  onOrderAuthorizationChange: (patch: Partial<ControlOrderAuthorization>) => void;
  onMerchandiseAuthorizationChange: (
    patch: Partial<ControlMerchandiseAuthorization>
  ) => void;
  onReset: () => void;
}) {
  return (
    <section>
      <PanelTitle
        eyebrow="Autorizaciones"
        title="Qué autoricé para operar"
        description="Prepara pedidos e ingresos de mercadería antes de que operación los ejecute."
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <OrderAuthorizationCard
          order={authorizations.order}
          onChange={onOrderAuthorizationChange}
        />

        <MerchandiseAuthorizationCard
          merchandiseEntry={authorizations.merchandiseEntry}
          onChange={onMerchandiseAuthorizationChange}
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 h-12 w-full rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-transparent text-sm font-black text-[var(--d-muted)]"
      >
        Restaurar autorizaciones
      </button>
    </section>
  );
}

function OrderAuthorizationCard({
  order,
  onChange,
}: {
  order: ControlOrderAuthorization;
  onChange: (patch: Partial<ControlOrderAuthorization>) => void;
}) {
  function authorizeOrder() {
    onChange({
      status: "autorizado",
      notes: "Pedido autorizado para operación.",
    });
  }

  return (
    <ControlCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Preparar pedido
          </p>

          <h3 className="mt-2 font-mono text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
            {order.orderCode}
          </h3>
        </div>

        <StatusPill label={getOrderStatusLabel(order.status)} />
      </div>

      <div className="mt-5 grid gap-3">
        <ControlField label="Cliente / destino">
          <input
            value={order.customerName}
            onChange={(event) =>
              onChange({
                customerName: event.target.value,
              })
            }
            className="h-11 w-full rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-3 text-sm font-black text-[var(--d-text)] outline-none"
          />
        </ControlField>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ customerType: "minorista" })}
            className={[
              "h-11 rounded-[var(--d-radius-md)] border text-sm font-black",
              order.customerType === "minorista"
                ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
                : "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-text)]",
            ].join(" ")}
          >
            Minorista
          </button>

          <button
            type="button"
            onClick={() => onChange({ customerType: "mayorista" })}
            className={[
              "h-11 rounded-[var(--d-radius-md)] border text-sm font-black",
              order.customerType === "mayorista"
                ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
                : "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-text)]",
            ].join(" ")}
          >
            Mayorista
          </button>
        </div>

        <ControlField label="Estado">
          <select
            value={order.status}
            onChange={(event) =>
              onChange({
                status: event.target.value as ControlOrderAuthorizationStatus,
              })
            }
            className="h-11 w-full rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-3 text-sm font-black text-[var(--d-text)] outline-none"
          >
            <option value="borrador">Borrador</option>
            <option value="autorizado">Autorizado</option>
            <option value="en_operacion">En operación</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </ControlField>

        <button
          type="button"
          onClick={authorizeOrder}
          className="h-12 rounded-[var(--d-radius-md)] bg-[var(--d-primary)] text-sm font-black text-[var(--d-bg)]"
        >
          Autorizar pedido
        </button>
      </div>
    </ControlCard>
  );
}

function MerchandiseAuthorizationCard({
  merchandiseEntry,
  onChange,
}: {
  merchandiseEntry: ControlMerchandiseAuthorization;
  onChange: (patch: Partial<ControlMerchandiseAuthorization>) => void;
}) {
  function authorizeEntry() {
    onChange({
      status: "autorizado",
    });
  }

  return (
    <ControlCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Ingreso de mercadería
          </p>

          <h3 className="mt-2 font-mono text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
            {merchandiseEntry.documentCode}
          </h3>
        </div>

        <StatusPill label={getMerchandiseStatusLabel(merchandiseEntry.status)} />
      </div>

      <div className="mt-5 grid gap-3">
        <ControlField label="Producto">
          <input
            value={merchandiseEntry.productName}
            onChange={(event) =>
              onChange({
                productName: event.target.value,
              })
            }
            className="h-11 w-full rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-3 text-sm font-black text-[var(--d-text)] outline-none"
          />
        </ControlField>

        <div className="grid grid-cols-2 gap-2">
          <MiniMetric label="Código asignado" value={merchandiseEntry.assignedCode} />
          <ControlField label="Cantidad">
            <input
              type="number"
              min={1}
              value={merchandiseEntry.authorizedQuantity}
              onChange={(event) =>
                onChange({
                  authorizedQuantity: Number(event.target.value || 1),
                })
              }
              className="h-11 w-full rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-3 text-sm font-black text-[var(--d-text)] outline-none"
            />
          </ControlField>
        </div>

        <ControlField label="Estado">
          <select
            value={merchandiseEntry.status}
            onChange={(event) =>
              onChange({
                status:
                  event.target.value as ControlMerchandiseAuthorizationStatus,
              })
            }
            className="h-11 w-full rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-3 text-sm font-black text-[var(--d-text)] outline-none"
          >
            <option value="borrador">Borrador</option>
            <option value="autorizado">Autorizado</option>
            <option value="en_recepcion">En recepción</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </ControlField>

        <button
          type="button"
          onClick={authorizeEntry}
          className="h-12 rounded-[var(--d-radius-md)] bg-[var(--d-primary)] text-sm font-black text-[var(--d-bg)]"
        >
          Autorizar ingreso
        </button>
      </div>
    </ControlCard>
  );
}

function AdminScanPanel() {
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

  const resultTitle = useMemo(() => {
    if (scanState.status === "found") {
      return scanState.product.name;
    }

    if (scanState.status === "not-found") {
      return "Producto no registrado";
    }

    return "Esperando producto";
  }, [scanState]);

  return (
    <section>
      <PanelTitle
        eyebrow="Escanear"
        title="Consulta de producto"
        description="Escanea un código para saber qué producto es."
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-[420px_1fr]">
        <ControlCard>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Resultado
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
            {resultTitle}
          </h3>

          {scanState.status === "waiting" && (
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--d-muted)]">
              La cámara está lista para leer el código.
            </p>
          )}

          {scanState.status === "not-found" && (
            <p className="mt-2 font-mono text-sm font-black text-[var(--d-muted)]">
              {scanState.barcode}
            </p>
          )}

          {scanState.status === "found" && (
            <>
              <p className="mt-1 text-sm font-black text-[var(--d-muted)]">
                {scanState.product.sku}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <MiniMetric label="Precio" value={`Q${scanState.product.price}`} />
                <MiniMetric
                  label="Estado"
                  value={getProductStatusLabel(scanState.product.status)}
                />
                <MiniMetric
                  label="Aquí"
                  value={`${scanState.product.locationStock}`}
                />
                <MiniMetric
                  label="Total"
                  value={`${scanState.product.totalStock}`}
                />
              </div>
            </>
          )}
        </ControlCard>

        <div>
          <DominiumBarcodeScanner onScan={handleScan} cooldownMs={1600} />
        </div>
      </div>
    </section>
  );
}

function MobileSectionTabs({
  activeSection,
  onChange,
}: {
  activeSection: ControlSection;
  onChange: (section: ControlSection) => void;
}) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2 overflow-hidden">
      <ControlMobileTab
        label="Reportes"
        active={activeSection === "reportes"}
        onClick={() => onChange("reportes")}
      />
      <ControlMobileTab
        label="Autorizar"
        active={activeSection === "autorizaciones"}
        onClick={() => onChange("autorizaciones")}
      />
      <ControlMobileTab
        label="Escanear"
        active={activeSection === "escanear"}
        onClick={() => onChange("escanear")}
      />
    </div>
  );
}

function ControlMobileTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-11 min-w-0 rounded-full border px-2 text-xs font-black",
        active
          ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
          : "border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-muted)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ControlNavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-[var(--d-radius-lg)] border px-4 py-4 text-left text-sm font-black transition",
        active
          ? "border-[var(--d-primary)] bg-[var(--d-primary)] text-[var(--d-bg)]"
          : "border-[var(--d-border)] bg-[var(--d-bg)] text-[var(--d-text)] hover:border-[var(--d-primary)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PanelTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--d-soft)]">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-3xl font-black tracking-[-0.07em] text-[var(--d-text)]">
        {title}
      </h2>

      <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[var(--d-muted)]">
        {description}
      </p>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="shrink-0 rounded-full bg-[var(--d-surface-strong)] px-3 py-2 text-xs font-black text-[var(--d-primary)]">
      {label}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--d-soft)]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-[var(--d-text)]">
        {value}
      </p>
    </div>
  );
}

function ControlField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--d-soft)]">
        {label}
      </span>

      <div className="mt-2">{children}</div>
    </label>
  );
}

function ControlCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4 shadow-[var(--d-shadow-soft)]">
      {children}
    </div>
  );
}

function getOrderStatusLabel(status: ControlOrderAuthorizationStatus) {
  if (status === "en_operacion") {
    return "En operación";
  }

  if (status === "autorizado") {
    return "Autorizado";
  }

  if (status === "cerrado") {
    return "Cerrado";
  }

  return "Borrador";
}

function getMerchandiseStatusLabel(
  status: ControlMerchandiseAuthorizationStatus
) {
  if (status === "en_recepcion") {
    return "En recepción";
  }

  if (status === "autorizado") {
    return "Autorizado";
  }

  if (status === "cerrado") {
    return "Cerrado";
  }

  return "Borrador";
}
