"use client";

import {
  ArrowLeft,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Link2,
  MessageCircle,
  PackageCheck,
  PackageMinus,
  PackagePlus,
  PackageSearch,
  ScanLine,
  Search,
  ShoppingCart,
  Store,
  UserRound,
  Warehouse,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const DominiumBarcodeScanner = dynamic(
  () =>
    import("@/components/dominium/DominiumBarcodeScanner").then(
      (module) => module.DominiumBarcodeScanner
    ),
  {
    ssr: false,
    loading: () => null,
  }
);

type EmployeeProduct = {
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  availableHere: number;
  availableStores: number;
  status: "disponible" | "bajo" | "crítico" | "agotado";
};

const initialProducts: EmployeeProduct[] = [
  {
    sku: "PEL-NEMO-MED",
    barcode: "750100000001",
    name: "Peluche Nemo mediano",
    category: "Peluches",
    brand: "Disney",
    availableHere: 4,
    availableStores: 10,
    status: "bajo",
  },
  {
    sku: "HOTW-SURT-001",
    barcode: "750100000002",
    name: "Carritos Hot Wheels surtidos",
    category: "Juguetes",
    brand: "Mattel",
    availableHere: 35,
    availableStores: 63,
    status: "disponible",
  },
  {
    sku: "DBZ-GOKU-ART",
    barcode: "750100000003",
    name: "Figura Goku articulada",
    category: "Anime",
    brand: "Bandai",
    availableHere: 3,
    availableStores: 5,
    status: "crítico",
  },
];

const connectedActions = [
  {
    title: "Vendra",
    description: "Consultar producto, link o apartado.",
    icon: ShoppingCart,
    actions: ["Consultar producto", "Ver apartado"],
  },
  {
    title: "Punto de venta",
    description: "Validar venta física o movimiento.",
    icon: Store,
    actions: ["Validar movimiento", "Consultar venta"],
  },
  {
    title: "Asistente WhatsApp",
    description: "Consultar disponibilidad para responder cliente.",
    icon: MessageCircle,
    actions: ["Consultar stock", "Confirmar apartado"],
  },
  {
    title: "Dominium",
    description: "Validar SKU, stock y movimientos.",
    icon: Warehouse,
    actions: ["Validar SKU", "Registrar movimiento"],
  },
];

export default function DominiumOperacionPage() {
  const router = useRouter();

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedSku, setSelectedSku] = useState(initialProducts[0].sku);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [lastAction, setLastAction] = useState(
    "Listo para escanear o buscar producto."
  );

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return products;

    return products.filter((product) => {
      return (
        product.sku.toLowerCase().includes(value) ||
        product.barcode.toLowerCase().includes(value) ||
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value) ||
        product.brand.toLowerCase().includes(value)
      );
    });
  }, [products, search]);

  const selectedProduct =
    products.find((product) => product.sku === selectedSku) || products[0];

  function updateProductStatus(stock: number): EmployeeProduct["status"] {
    if (stock <= 0) return "agotado";
    if (stock <= 3) return "crítico";
    if (stock <= 10) return "bajo";
    return "disponible";
  }

  function handleMovement(type: "entrada" | "salida" | "conteo" | "traslado") {
    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.sku !== selectedProduct.sku) return product;

        let nextAvailableHere = product.availableHere;
        let nextAvailableStores = product.availableStores;

        if (type === "entrada") {
          nextAvailableHere += quantity;
          nextAvailableStores += quantity;
        }

        if (type === "salida") {
          nextAvailableHere = Math.max(0, nextAvailableHere - quantity);
          nextAvailableStores = Math.max(0, nextAvailableStores - quantity);
        }

        if (type === "conteo") {
          nextAvailableHere = quantity;
        }

        if (type === "traslado") {
          nextAvailableHere = Math.max(0, nextAvailableHere - quantity);
        }

        return {
          ...product,
          availableHere: nextAvailableHere,
          availableStores: nextAvailableStores,
          status: updateProductStatus(nextAvailableStores),
        };
      })
    );

    const labels = {
      entrada: "Entrada registrada",
      salida: "Salida registrada",
      conteo: "Conteo actualizado",
      traslado: "Traslado registrado",
    };

    setLastAction(
      `${labels[type]} · ${selectedProduct.name} · Cantidad ${quantity}`
    );
  }

  function handleDetectedCode(code: string) {
    setScannerOpen(false);
    setSearch(code);

    const foundProduct = products.find(
      (product) => product.barcode === code || product.sku === code
    );

    if (foundProduct) {
      setSelectedSku(foundProduct.sku);
      setLastAction(`Código detectado · ${foundProduct.name}`);
      return;
    }

    setLastAction(`Código detectado · ${code}. No hay coincidencia exacta.`);
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0B1220]">
      <section className="mx-auto min-h-screen w-full max-w-3xl px-4 py-5 sm:px-6">
        <header className="mb-5">
          <button
            type="button"
            onClick={() => router.push("/acceso")}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Cambiar acceso
          </button>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-sm">
                <UserRound size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-[0.24em] text-slate-950 sm:text-3xl">
                  DOMINIUM
                </h1>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Operación empleado
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Tienda
              </p>
              <p className="text-sm font-black text-slate-950">Tienda 1</p>
            </div>
          </div>
        </header>

        <section className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <PackageSearch size={19} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Buscar o escanear
              </h2>
              <p className="text-sm text-slate-500">
                SKU, código, nombre, marca o categoría.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
              <Search size={19} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-full w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Ej. Nemo, PEL-NEMO-MED, Peluches"
              />
            </div>

            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition active:scale-[0.99] hover:bg-slate-800"
            >
              <ScanLine size={18} />
              Cámara
            </button>
          </div>

          {search && (
            <div className="mt-3 space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.sku}
                  type="button"
                  onClick={() => {
                    setSelectedSku(product.sku);
                    setLastAction(`Producto seleccionado · ${product.name}`);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-left ring-1 ring-slate-100 transition hover:bg-cyan-50"
                >
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {product.sku} · {product.category}
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                    Ver
                  </span>
                </button>
              ))}

              {filteredProducts.length === 0 && (
                <div className="rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
                  No se encontró producto con ese dato.
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[1.7rem] border border-white bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {selectedProduct.sku}
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {selectedProduct.name}
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {selectedProduct.category} · {selectedProduct.brand}
              </p>
            </div>

            <StatusBadge status={selectedProduct.status} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[1.3rem] bg-slate-950 p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Disponible aquí
              </p>
              <p className="mt-2 text-4xl font-black">
                {selectedProduct.availableHere}
              </p>
            </div>

            <div className="rounded-[1.3rem] bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Disponible en tiendas
              </p>
              <p className="mt-2 text-4xl font-black text-slate-950">
                {selectedProduct.availableStores}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-cyan-50 p-4">
            <p className="text-sm font-bold text-cyan-900">
              Vista operativa: el empleado ve stock resumido, no desglose por
              bodega o sucursal.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <ClipboardCheck size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Registrar movimiento
              </h2>
              <p className="text-sm text-slate-500">
                Acción interna sobre el producto seleccionado.
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
            <p className="text-sm font-black text-slate-700">Cantidad</p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-700 ring-1 ring-slate-200"
              >
                -
              </button>

              <div className="flex h-9 min-w-12 items-center justify-center rounded-xl bg-white px-4 text-sm font-black text-slate-950 ring-1 ring-slate-200">
                {quantity}
              </div>

              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-700 ring-1 ring-slate-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MovementButton
              label="Entrada"
              icon={PackagePlus}
              onClick={() => handleMovement("entrada")}
            />
            <MovementButton
              label="Salida"
              icon={PackageMinus}
              onClick={() => handleMovement("salida")}
            />
            <MovementButton
              label="Conteo"
              icon={ClipboardCheck}
              onClick={() => handleMovement("conteo")}
            />
            <MovementButton
              label="Traslado"
              icon={PackageCheck}
              onClick={() => handleMovement("traslado")}
            />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-teal-900">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm font-bold leading-6">{lastAction}</p>
          </div>
        </section>

        <section className="mt-5 rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <Link2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Acciones conectadas
              </h2>
              <p className="text-sm text-slate-500">
                Acciones operativas disponibles para empleado.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {connectedActions.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-800 ring-1 ring-slate-200">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.actions.map((action) => (
                      <span
                        key={action}
                        className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      {scannerOpen && (
        <DominiumBarcodeScanner
          onDetected={handleDetectedCode}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: EmployeeProduct["status"] }) {
  const styles = {
    disponible: "bg-teal-50 text-teal-700",
    bajo: "bg-amber-50 text-amber-700",
    crítico: "bg-red-50 text-red-700",
    agotado: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function MovementButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-black text-slate-800 ring-1 ring-slate-100 transition active:scale-[0.99] hover:bg-cyan-50"
    >
      <Icon size={22} />
      {label}
    </button>
  );
}
