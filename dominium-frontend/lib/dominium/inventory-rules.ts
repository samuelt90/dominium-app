import type { DominiumAuthorizedReceipt, DominiumProduct } from "@/types/dominium";

type ReceiptProgressItem = {
  authorizedQuantity: number;
  receivedQuantity: number;
};

type ReceiptWithProgressItems = {
  items: ReceiptProgressItem[];
};

type ProductWithBarcode = {
  barcode?: string;
  barcodes?: string[];
};

export function findProductByBarcode<TProduct extends ProductWithBarcode>(
  products: TProduct[],
  barcode: string
) {
  const normalizedBarcode = barcode.trim();

  return (
    products.find((product) => {
      if (product.barcode === normalizedBarcode) {
        return true;
      }

      if (product.barcodes?.includes(normalizedBarcode)) {
        return true;
      }

      return false;
    }) ?? null
  );
}

export function getReceiptItemByProductId<
  TReceipt extends {
    items: Array<{
      productId: string;
      authorizedQuantity: number;
      receivedQuantity: number;
    }>;
  },
>(receipt: TReceipt, productId: string) {
  return receipt.items.find((item) => item.productId === productId) ?? null;
}

export function getRemainingAuthorizedQuantity(item: ReceiptProgressItem) {
  return Math.max(item.authorizedQuantity - item.receivedQuantity, 0);
}

export function canReceiveMore(item: ReceiptProgressItem) {
  return getRemainingAuthorizedQuantity(item) > 0;
}

export function getReceiptProgress(receipt: ReceiptWithProgressItems) {
  const authorizedTotal = receipt.items.reduce(
    (sum, item) => sum + item.authorizedQuantity,
    0
  );

  const receivedTotal = receipt.items.reduce(
    (sum, item) => sum + item.receivedQuantity,
    0
  );

  if (authorizedTotal === 0) {
    return 0;
  }

  return Math.min(Math.round((receivedTotal / authorizedTotal) * 100), 100);
}

/**
 * Compatibilidad temporal con tipos anteriores.
 * Mantener mientras terminamos de migrar pantallas viejas.
 */
export type LegacyInventoryProduct = DominiumProduct;
export type LegacyAuthorizedReceipt = DominiumAuthorizedReceipt;
