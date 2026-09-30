export type DominiumOperationModeId =
  | "scan-product"
  | "guide-builder"
  | "authorized-receipt";

export type DominiumOperationMode = {
  id: DominiumOperationModeId;
  title: string;
  description: string;
  actionLabel: string;
  terminalLabel: string;
};

export type DominiumProductStatus = "available" | "low-stock" | "blocked";

export type DominiumProduct = {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  locationStock: number;
  totalStock: number;
  status: DominiumProductStatus;
};

export type DominiumGuideStatus = "draft" | "preparing" | "ready" | "review";

export type DominiumGuideItem = {
  productId: string;
  quantity: number;
};

export type DominiumGuide = {
  id: string;
  code: string;
  customerName: string;
  channel: "mayorista" | "tienda" | "whatsapp" | "traslado";
  status: DominiumGuideStatus;
  connectedFileStatus: "synced" | "pending";
  items: DominiumGuideItem[];
};

export type DominiumReceiptStatus =
  | "authorized"
  | "receiving"
  | "completed"
  | "difference"
  | "blocked";

export type DominiumReceiptItem = {
  productId: string;
  authorizedQuantity: number;
  receivedQuantity: number;
};

export type DominiumAuthorizedReceipt = {
  id: string;
  code: string;
  supplierName: string;
  status: DominiumReceiptStatus;
  items: DominiumReceiptItem[];
};

export type DominiumReviewCase = {
  id: string;
  code: string;
  reason: "unknown-code" | "excess-quantity" | "product-mismatch";
  createdBy: string;
  status: "pending" | "resolved";
};

/**
 * Compatibilidad temporal con componentes anteriores.
 * Luego lo eliminamos cuando refactoricemos DominiumActivityLog.
 */
export type ActivityLogItem = {
  id?: string;
  title?: string;
  description?: string;
  timestamp?: string;
  time?: string;
  user?: string;
  action?: string;
  type?: string;
  status?: string;
  productName?: string;
  productCode?: string;
  quantity?: number;
  location?: string;
  [key: string]: string | number | boolean | null | undefined;
};

export type DominiumDestination = "aparta" | "tienda" | "predios";

export type DaySummary = {
  id?: string;
  title?: string;
  date?: string;
  createdCount?: number;
  updatedCount?: number;
  completedCount?: number;
  pendingCount?: number;
  totalMovements?: number;
  totalProducts?: number;
  totalGuides?: number;
  totalReceipts?: number;
  [key: string]: string | number | boolean | null | undefined;
};

export type ProductDraft = {
  id?: string;
  code?: string;
  barcode?: string;
  sku?: string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  destination?: DominiumDestination;
  category?: string;
  status?: string;
  imageUrl?: string;
  strapiUrl?: string;
  storeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: string | number | boolean | null | undefined;
};
