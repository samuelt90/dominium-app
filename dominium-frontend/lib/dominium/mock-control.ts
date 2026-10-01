export type ControlCustomerType = "minorista" | "mayorista";

export type ControlReportStatus = "estable" | "atencion" | "completo" | "parcial";

export type ControlOrderAuthorizationStatus =
  | "borrador"
  | "autorizado"
  | "en_operacion"
  | "cerrado";

export type ControlMerchandiseAuthorizationStatus =
  | "borrador"
  | "autorizado"
  | "en_recepcion"
  | "cerrado";

export type ControlReport = {
  stock: {
    status: ControlReportStatus;
    title: string;
    description: string;
    lowStockProducts: number;
    stableProducts: number;
  };
  merchandiseEntry: {
    status: ControlReportStatus;
    documentCode: string;
    expectedUnits: number;
    receivedUnits: number;
    pendingUnits: number;
    description: string;
  };
  sentOrders: {
    total: number;
    minorista: number;
    mayorista: number;
    description: string;
  };
};

export type ControlHistoryItem = {
  id: string;
  time: string;
  title: string;
  description: string;
};

export type ControlOrderAuthorization = {
  id: string;
  orderCode: string;
  customerName: string;
  customerType: ControlCustomerType;
  status: ControlOrderAuthorizationStatus;
  notes: string;
};

export type ControlMerchandiseAuthorization = {
  id: string;
  documentCode: string;
  supplierName: string;
  productName: string;
  assignedCode: string;
  authorizedQuantity: number;
  status: ControlMerchandiseAuthorizationStatus;
};

export type ControlAuthorizations = {
  order: ControlOrderAuthorization;
  merchandiseEntry: ControlMerchandiseAuthorization;
};

export const initialControlReport: ControlReport = {
  stock: {
    status: "atencion",
    title: "Stock con atención",
    description: "Hay productos con bajo inventario que deben revisarse.",
    lowStockProducts: 2,
    stableProducts: 8,
  },
  merchandiseEntry: {
    status: "parcial",
    documentCode: "IMP-0091",
    expectedUnits: 20,
    receivedUnits: 18,
    pendingUnits: 2,
    description: "El ingreso de mercadería está pendiente de completar.",
  },
  sentOrders: {
    total: 3,
    minorista: 2,
    mayorista: 1,
    description: "Pedidos enviados a operación durante la jornada.",
  },
};

export const initialControlHistory: ControlHistoryItem[] = [
  {
    id: "history_001",
    time: "09:18",
    title: "Pedido autorizado",
    description: "PED-0091 quedó listo para operación.",
  },
  {
    id: "history_002",
    time: "10:04",
    title: "Pedido enviado",
    description: "Mostrador fue enviado para armado.",
  },
  {
    id: "history_003",
    time: "11:22",
    title: "Ingreso autorizado",
    description: "IMP-0091 quedó autorizado para recepción.",
  },
  {
    id: "history_004",
    time: "12:15",
    title: "Ingreso parcial",
    description: "Se ingresaron 18 de 20 unidades autorizadas.",
  },
];

export const initialControlAuthorizations: ControlAuthorizations = {
  order: {
    id: "order_auth_001",
    orderCode: "PED-0091",
    customerName: "Mostrador",
    customerType: "minorista",
    status: "autorizado",
    notes: "Pedido listo para que operación lo arme.",
  },
  merchandiseEntry: {
    id: "merch_auth_001",
    documentCode: "IMP-0091",
    supplierName: "Importadora Central",
    productName: "Mochila urbana negra",
    assignedCode: "1853666999",
    authorizedQuantity: 20,
    status: "autorizado",
  },
};
