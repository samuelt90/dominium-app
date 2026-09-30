"use client";

import { useEffect, useRef, useState } from "react";

type DominiumBarcodeScannerProps = {
  onScan: (barcode: string) => void;
  cooldownMs?: number;
};

export function DominiumBarcodeScanner({
  onScan,
  cooldownMs = 1400,
}: DominiumBarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const lastScanRef = useRef<{
    barcode: string;
    timestamp: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!scannerRef.current || !mounted) return;

        const scannerId = `dominium-product-scanner-${crypto.randomUUID()}`;
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

            onScan(barcode);
          },
          () => {
            // No mostramos errores por cada frame sin lectura.
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
  }, [cooldownMs, onScan]);

  return (
    <div className="overflow-hidden rounded-[var(--d-radius-xl)] border border-white/10 bg-black shadow-[var(--d-shadow-strong)]">
      <div ref={scannerRef} className="min-h-[260px] w-full overflow-hidden" />

      {error && (
        <div className="border-t border-white/10 bg-[var(--d-terminal-bg)] px-4 py-3 text-sm font-bold text-[var(--d-terminal-accent)]">
          {error}
        </div>
      )}
    </div>
  );
}
