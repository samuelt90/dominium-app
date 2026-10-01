"use client";

import { useEffect, useRef, useState } from "react";

type DominiumBarcodeScannerProps = {
  onScan?: (barcode: string) => void;
  onDetected?: (barcode: string) => void;
  onClose?: () => void;
  cooldownMs?: number;
};

let scannerAbortGuardInstalled = false;

function isCameraAbortError(error: unknown) {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? `${error.name} ${error.message}`
        : "";

  return (
    message.includes("AbortError") ||
    message.includes("play() request was interrupted") ||
    message.includes("media was removed from the document")
  );
}

function installScannerAbortGuard() {
  if (typeof window === "undefined" || scannerAbortGuardInstalled) {
    return;
  }

  window.addEventListener("unhandledrejection", (event) => {
    if (isCameraAbortError(event.reason)) {
      event.preventDefault();
    }
  });

  window.addEventListener("error", (event) => {
    if (isCameraAbortError(event.error) || isCameraAbortError(event.message)) {
      event.preventDefault();
    }
  });

  scannerAbortGuardInstalled = true;
}

export function DominiumBarcodeScanner({
  onScan,
  onDetected,
  onClose,
  cooldownMs = 1400,
}: DominiumBarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const onScanRef = useRef<(barcode: string) => void>(
    onScan ?? onDetected ?? (() => undefined)
  );

  const scannerIdRef = useRef(
    `dominium-scanner-${Math.random().toString(36).slice(2)}`
  );

  const lastScanRef = useRef<{
    barcode: string;
    timestamp: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan ?? onDetected ?? (() => undefined);
  }, [onScan, onDetected]);

  useEffect(() => {
    installScannerAbortGuard();

    let cancelled = false;
    let startTimeout: ReturnType<typeof setTimeout> | null = null;

    async function stopScanner(scanner: any) {
      if (!scanner) {
        return;
      }

      try {
        const state = scanner.getState?.();

        if (state === 2 || state === 3) {
          await scanner.stop();
        }
      } catch {
        // La cámara puede estar detenida o desmontándose.
      }

      try {
        scanner.clear();
      } catch {
        // La librería puede haber limpiado el nodo internamente.
      }
    }

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!scannerRef.current || cancelled) {
          return;
        }

        const scannerId = scannerIdRef.current;
        scannerRef.current.id = scannerId;

        const scanner = new Html5Qrcode(scannerId);
        instanceRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 8,
            qrbox: { width: 280, height: 160 },
            aspectRatio: 1.6,
          },
          (decodedText: string) => {
            const barcode = decodedText.trim();
            const now = Date.now();

            if (!barcode) {
              return;
            }

            const lastScan = lastScanRef.current;

            if (
              lastScan &&
              lastScan.barcode === barcode &&
              now - lastScan.timestamp < cooldownMs
            ) {
              return;
            }

            lastScanRef.current = {
              barcode,
              timestamp: now,
            };

            onScanRef.current(barcode);
          },
          () => {
            // No mostramos errores por cada frame sin lectura.
          }
        );

        if (cancelled) {
          await stopScanner(scanner);
        }
      } catch (caughtError) {
        if (isCameraAbortError(caughtError)) {
          return;
        }

        if (!cancelled) {
          setError("No se pudo activar la cámara.");
        }
      }
    }

    startTimeout = setTimeout(() => {
      void startScanner();
    }, 180);

    return () => {
      cancelled = true;

      if (startTimeout) {
        clearTimeout(startTimeout);
      }

      const scanner = instanceRef.current;
      instanceRef.current = null;

      void stopScanner(scanner);
    };
  }, [cooldownMs]);

  return (
    <div className="overflow-hidden rounded-[var(--d-radius-xl)] border border-white/10 bg-black shadow-[var(--d-shadow-strong)]">
      {onClose && (
        <div className="flex justify-end border-b border-white/10 bg-black px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1 text-xs font-black text-white/70"
          >
            Cerrar
          </button>
        </div>
      )}

      <div ref={scannerRef} className="min-h-[260px] w-full overflow-hidden" />

      {error && (
        <div className="border-t border-white/10 bg-[var(--d-terminal-bg)] px-4 py-3 text-sm font-bold text-[var(--d-terminal-accent)]">
          {error}
        </div>
      )}
    </div>
  );
}
