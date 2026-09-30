import type { DominiumMockProduct } from "@/lib/dominium/mock-operation";

export type DominiumCustomerType = "minorista" | "mayorista";

export type GuideSheetPayload = {
  guideCode: string;
  customerType: DominiumCustomerType;
  customerName: string;
  operatorName: string;
  scannedAt: string;
  product: {
    sku: string;
    barcode: string;
    name: string;
    category: string;
    price: number;
  };
  quantity: number;
};

export type GuideSyncResult =
  | {
      status: "sent";
      message: string;
    }
  | {
      status: "not-configured";
      message: string;
    }
  | {
      status: "failed";
      message: string;
    };

export function createGuideCode() {
  const now = new Date();

  const datePart = now
    .toISOString()
    .slice(2, 10)
    .replaceAll("-", "");

  const timePart = now
    .toTimeString()
    .slice(0, 8)
    .replaceAll(":", "");

  return `GUIA-${datePart}-${timePart}`;
}

export function createGuideSheetPayload({
  guideCode,
  customerType,
  customerName,
  operatorName,
  product,
}: {
  guideCode: string;
  customerType: DominiumCustomerType;
  customerName: string;
  operatorName: string;
  product: DominiumMockProduct;
}): GuideSheetPayload {
  return {
    guideCode,
    customerType,
    customerName,
    operatorName,
    scannedAt: new Date().toISOString(),
    product: {
      sku: product.sku,
      barcode: product.barcode,
      name: product.name,
      category: product.category,
      price: product.price,
    },
    quantity: 1,
  };
}

export async function syncGuideItemToSheet(
  payload: GuideSheetPayload
): Promise<GuideSyncResult> {
  const webhookUrl = process.env.NEXT_PUBLIC_DOMINIUM_GUIDE_SHEETS_URL;

  if (!webhookUrl) {
    return {
      status: "not-configured",
      message: "Archivo conectado pendiente.",
    };
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return {
      status: "sent",
      message: "Producto enviado al archivo.",
    };
  } catch {
    return {
      status: "failed",
      message: "No se pudo enviar al archivo.",
    };
  }
}
