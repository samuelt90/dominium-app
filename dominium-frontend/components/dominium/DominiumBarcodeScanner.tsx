"use client";

import { useEffect, useRef } from "react";

type DominiumBarcodeScannerProps = {
  onDetected: (code: string) => void;
  onClose: () => void;
};

export function DominiumBarcodeScanner({
  onDetected,
  onClose,
}: DominiumBarcodeScannerProps) {
  const scannerRef = useRef<any>(null);
  const hasDetectedRef = useRef(false);
  const readerId = "dominium-barcode-reader";

  useEffect(() => {
    let isMounted = true;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!isMounted) return;

        const scanner = new Html5Qrcode(readerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 8,
            qrbox: { width: 260, height: 160 },
          },
          async (decodedText: string) => {
            if (hasDetectedRef.current) return;

            hasDetectedRef.current = true;
            onDetected(decodedText);

            try {
              await scanner.stop();
              scanner.clear();
            } catch {
              // El scanner puede estar cerrado o detenido.
            }
          },
          () => {
            // Ignoramos lecturas fallidas mientras la cámara está activa.
          }
        );
      } catch (error) {
        console.error("No se pudo iniciar el escáner:", error);
      }
    }

    startScanner();

    return () => {
      isMounted = false;

      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {
            // El scanner puede estar detenido.
          });
      }
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              Escanear código
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Abre la cámara de este dispositivo. En teléfono usará la cámara
              del teléfono.
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

        <div
          id={readerId}
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950"
        />
      </div>
    </div>
  );
}
