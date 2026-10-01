"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import {
  findMockProductByBarcode,
  getProductStatusLabel,
  type DominiumMockProduct,
} from "@/lib/dominium/mock-operation";


function playScanFeedback() {
  navigator.vibrate?.(80);

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;

    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.13);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.14);

    oscillator.onended = () => {
      void audioContext.close();
    };
  } catch {
    // El sonido puede ser bloqueado por el navegador. No rompemos el scanner.
  }
}


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
  const [scannerKey, setScannerKey] = useState(1);

  const [scanState, setScanState] = useState<ScanState>({
    status: "waiting",
    barcode: null,
    product: null,
  });

  const handleScan = useCallback((barcode: string) => {
    playScanFeedback();
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

    setScannerKey((currentKey) => currentKey + 1);
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
        <ScanResultPanel scanState={scanState} />

        <div className="mt-4">
          <DominiumBarcodeScanner key={scannerKey} onScan={handleScan} />
        </div>

        <ScanActions scanState={scanState} onReset={resetScan} />
      </div>
    </section>
  );
}

function ScanResultPanel({ scanState }: { scanState: ScanState }) {
  if (scanState.status === "waiting") {
    return (
      <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
          Estado
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-[var(--d-text)]">
          Esperando código
        </h3>

        <p className="mt-1 text-sm font-semibold leading-5 text-[var(--d-muted)]">
          La cámara está lista para leer el código de barras.
        </p>
      </div>
    );
  }

  if (scanState.status === "not-found") {
    return (
      <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
          Código no asociado
        </p>

        <h3 className="mt-2 font-mono text-2xl font-black tracking-[-0.05em] text-[var(--d-text)]">
          {scanState.barcode}
        </h3>

        <p className="mt-1 text-sm font-semibold leading-5 text-[var(--d-muted)]">
          El código fue leído, pero no existe en productos registrados.
        </p>
      </div>
    );
  }

  return <ProductCompactResult product={scanState.product} />;
}

function ProductCompactResult({ product }: { product: DominiumMockProduct }) {
  return (
    <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Producto detectado
          </p>

          <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.06em] text-[var(--d-text)]">
            {product.name}
          </h3>

          <p className="mt-1 text-sm font-black text-[var(--d-muted)]">
            {product.sku}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[var(--d-surface-strong)] px-3 py-2 text-xs font-black text-[var(--d-primary)]">
          {getProductStatusLabel(product.status)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <CompactMetric label="Precio" value={`Q${product.price}`} />
        <CompactMetric label="Aquí" value={`${product.locationStock}`} />
        <CompactMetric label="Total" value={`${product.totalStock}`} />
        <CompactMetric label="Código" value={product.barcode} mono />
      </div>
    </div>
  );
}

function ScanActions({
  scanState,
  onReset,
}: {
  scanState: ScanState;
  onReset: () => void;
}) {
  if (scanState.status === "waiting") {
    return (
      <div className="mt-4 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-bg)] px-4 py-3">
        <p className="text-sm font-bold text-[var(--d-muted)]">
          Apunta al código de barras. El resultado aparecerá arriba de la cámara.
        </p>
      </div>
    );
  }

  if (scanState.status === "not-found") {
    return (
      <div className="mt-4 grid gap-3">
        <button
          type="button"
          className="h-12 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-bg)] text-sm font-black text-[var(--d-text)]"
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
    );
  }

  return (
    <button
      type="button"
      onClick={onReset}
      className="mt-4 h-12 w-full rounded-[var(--d-radius-md)] bg-[var(--d-primary)] text-sm font-black text-[var(--d-bg)]"
    >
      Escanear otro
    </button>
  );
}

function CompactMetric({
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
