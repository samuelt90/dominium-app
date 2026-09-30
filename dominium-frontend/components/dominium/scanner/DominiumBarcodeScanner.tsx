"use client";

import { useEffect, useRef, useState } from "react";

type DominiumBarcodeScannerProps = {
  onScan: (barcode: string) => void;
};

export function DominiumBarcodeScanner({ onScan }: DominiumBarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const lastCodeRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!scannerRef.current || !mounted) return;

        const scannerId = "dominium-product-scanner";

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

            if (!barcode || barcode === lastCodeRef.current) {
              return;
            }

            lastCodeRef.current = barcode;
            onScan(barcode);
          },
          () => {
            // No mostramos errores por cada frame no leído.
          }
        );
      } catch {
        setError("No se pudo activar la cámara.");
      }
    }

    startScanner();

    return () => {
      mounted = false;

      const scanner = instanceRef.current;

      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => undefined);
      }
    };
  }, [onScan]);

  return (
    <div className="overflow-hidden rounded-[var(--d-radius-xl)] border border-white/10 bg-black shadow-[var(--d-shadow-strong)]">
      <div
        id="dominium-product-scanner"
        ref={scannerRef}
        className="min-h-[260px] w-full overflow-hidden"
      />

      {error && (
        <div className="border-t border-white/10 bg-[var(--d-terminal-bg)] px-4 py-3 text-sm font-bold text-[var(--d-terminal-accent)]">
          {error}
        </div>
      )}
    </div>
  );
}
