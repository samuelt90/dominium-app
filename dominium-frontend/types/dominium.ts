export type DominiumDestination = "aparta" | "tienda";

export type ProductInternalStatus =
  | "pendiente"
  | "enviado"
  | "error";

export type ActivityLogType =
  | "create"
  | "send"
  | "duplicate"
  | "image"
  | "search"
  | "error";

export type ProductDraft = {
  id: string;
  code: string;
  name: string;
  destination: DominiumDestination;
  quantity: number;
  initialPrice: number;
  status: ProductInternalStatus;
  registeredBy: string;
  createdAt: string;
  strapiUrl?: string;
  storeUrl?: string;
};

export type ActivityLogItem = {
  id: string;
  type: ActivityLogType;
  message: string;
  user: string;
  createdAt: string;
};

export type DaySummary = {
  registeredToday: number;
  pending: number;
  sentToVendra: number;
  errors: number;
  activeUsers: number;
};
