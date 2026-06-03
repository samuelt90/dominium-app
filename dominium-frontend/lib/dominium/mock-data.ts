import type { ActivityLogItem, DaySummary, ProductDraft } from "@/types/dominium";

export const mockDaySummary: DaySummary = {
  registeredToday: 34,
  pending: 9,
  sentToVendra: 18,
  errors: 0,
  activeUsers: 3,
};

export const mockProducts: ProductDraft[] = [
  {
    id: "1",
    code: "XTZ-001",
    name: "Zapatos Nike negros",
    destination: "tienda",
    quantity: 6,
    initialPrice: 450,
    status: "enviado",
    registeredBy: "Ana",
    createdAt: "2026-05-23T10:15:00",
    strapiUrl: "#",
    storeUrl: "#",
  },
  {
    id: "2",
    code: "BLU-014",
    name: "Blusa negra",
    destination: "aparta",
    quantity: 1,
    initialPrice: 95,
    status: "pendiente",
    registeredBy: "Luis",
    createdAt: "2026-05-23T10:22:00",
    strapiUrl: "#",
    storeUrl: "#",
  },
  {
    id: "3",
    code: "TEN-045",
    name: "Tenis blancos",
    destination: "tienda",
    quantity: 5,
    initialPrice: 380,
    status: "error",
    registeredBy: "Ana",
    createdAt: "2026-05-23T10:30:00",
    strapiUrl: "#",
    storeUrl: "#",
  },
];

export const mockActivityLog: ActivityLogItem[] = [
  {
    id: "1",
    type: "create",
    message: "registró producto XTZ-001",
    user: "Ana",
    createdAt: "10:15",
  },
  {
    id: "2",
    type: "send",
    message: "envió 5 productos a Vendra",
    user: "Luis",
    createdAt: "10:17",
  },
  {
    id: "3",
    type: "duplicate",
    message: "detectó código duplicado TEN-045",
    user: "Sistema",
    createdAt: "10:22",
  },
  {
    id: "4",
    type: "image",
    message: "agregó imagen a BLU-014",
    user: "Ana",
    createdAt: "10:24",
  },
];