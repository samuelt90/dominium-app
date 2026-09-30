import type { DominiumOperationMode } from "@/types/dominium";

export type DominiumProductStatus = "active" | "low-stock" | "blocked";

export type DominiumMockProduct = {
  id: string;
  sku: string;
  barcode: string;
  barcodes: string[];
  name: string;
  category: string;
  price: number;
  locationStock: number;
  totalStock: number;
  status: DominiumProductStatus;
  location: string;
};

export type DominiumGuideItem = {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
};

export type DominiumMockGuide = {
  id: string;
  code: string;
  customerName: string;
  channel: "mayorista" | "tienda" | "whatsapp" | "traslado";
  status: "preparing" | "ready" | "synced";
  items: DominiumGuideItem[];
};

export type DominiumAuthorizedReceiptItem = {
  productId: string;
  sku: string;
  name: string;
  authorizedQuantity: number;
  receivedQuantity: number;
};

export type DominiumMockAuthorizedReceipt = {
  id: string;
  code: string;
  supplierName: string;
  status: "pending" | "receiving" | "difference" | "closed";
  items: DominiumAuthorizedReceiptItem[];
};

export const operationModes: DominiumOperationMode[] = [
  {
    id: "scan-product",
    title: "Escanear producto",
    description: "Verifica producto, precio y disponibilidad.",
    actionLabel: "Iniciar escaneo",
    terminalLabel: "Consulta",
  },
  {
    id: "guide-builder",
    title: "Armar guía",
    description: "Prepara una lista de empaque con productos activos.",
    actionLabel: "Preparar guía",
    terminalLabel: "Guía",
  },
  {
    id: "authorized-receipt",
    title: "Recepción autorizada",
    description: "Recibe mercadería contra una autorización registrada.",
    actionLabel: "Abrir recepción",
    terminalLabel: "Recepción",
  },
];

export const mockProducts: DominiumMockProduct[] = [
  {
    id: "prod_001",
    sku: "PEL-NEMO-MED",
    barcode: "1853666001",
    barcodes: ["1853666001"],
    name: "Peluche Nemo mediano",
    category: "Peluches",
    price: 95,
    locationStock: 4,
    totalStock: 18,
    status: "low-stock",
    location: "Bodega central",
  },
  {
    id: "prod_002",
    sku: "AUD-BT-PRO",
    barcode: "1853666002",
    barcodes: ["1853666002"],
    name: "Audífonos bluetooth Pro",
    category: "Electrónica",
    price: 125,
    locationStock: 12,
    totalStock: 85,
    status: "active",
    location: "Bodega central",
  },
  {
    id: "prod_003",
    sku: "LED-RGB-5M",
    barcode: "1853666003",
    barcodes: ["1853666003"],
    name: "Tira LED RGB 5 metros",
    category: "Iluminación",
    price: 65,
    locationStock: 9,
    totalStock: 42,
    status: "active",
    location: "Bodega central",
  },
  {
    id: "prod_004",
    sku: "PARL-MINI-BT",
    barcode: "1853666004",
    barcodes: ["1853666004"],
    name: "Parlante mini bluetooth",
    category: "Audio",
    price: 110,
    locationStock: 6,
    totalStock: 26,
    status: "active",
    location: "Bodega central",
  },
  {
    id: "prod_005",
    sku: "MOCH-URB-NEG",
    barcode: "1853666005",
    barcodes: ["1853666005"],
    name: "Mochila urbana negra",
    category: "Accesorios",
    price: 145,
    locationStock: 2,
    totalStock: 14,
    status: "low-stock",
    location: "Bodega central",
  },
];

export const mockGuides: DominiumMockGuide[] = [
  {
    id: "guide_001",
    code: "GUIA-00018",
    customerName: "Mayorista San Miguel",
    channel: "mayorista",
    status: "preparing",
    items: [
      {
        productId: "prod_001",
        sku: "PEL-NEMO-MED",
        name: "Peluche Nemo mediano",
        quantity: 4,
      },
      {
        productId: "prod_002",
        sku: "AUD-BT-PRO",
        name: "Audífonos bluetooth Pro",
        quantity: 8,
      },
      {
        productId: "prod_003",
        sku: "LED-RGB-5M",
        name: "Tira LED RGB 5 metros",
        quantity: 12,
      },
    ],
  },
];

export const mockAuthorizedReceipts: DominiumMockAuthorizedReceipt[] = [
  {
    id: "receipt_001",
    code: "IMP-00031",
    supplierName: "Importadora Central",
    status: "receiving",
    items: [
      {
        productId: "prod_001",
        sku: "PEL-NEMO-MED",
        name: "Peluche Nemo mediano",
        authorizedQuantity: 400,
        receivedQuantity: 386,
      },
      {
        productId: "prod_002",
        sku: "AUD-BT-PRO",
        name: "Audífonos bluetooth Pro",
        authorizedQuantity: 120,
        receivedQuantity: 92,
      },
      {
        productId: "prod_003",
        sku: "LED-RGB-5M",
        name: "Tira LED RGB 5 metros",
        authorizedQuantity: 240,
        receivedQuantity: 240,
      },
    ],
  },
];

export function normalizeBarcode(barcode: string) {
  return barcode.trim();
}

export function findMockProductByBarcode(barcode: string) {
  const normalizedBarcode = normalizeBarcode(barcode);

  return mockProducts.find((product) =>
    product.barcodes.some((registeredBarcode) => registeredBarcode === normalizedBarcode)
  );
}

export function getProductStatusLabel(status: DominiumProductStatus) {
  if (status === "low-stock") {
    return "Bajo stock";
  }

  if (status === "blocked") {
    return "Bloqueado";
  }

  return "Activo";
}
