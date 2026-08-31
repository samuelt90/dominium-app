"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Boxes,
  ChevronRight,
  Link2,
  MessageCircle,
  PackageSearch,
  Search,
  ShoppingCart,
  Store,
  TrendingUp,
  UsersRound,
  Warehouse,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ownerProducts = [
  {
    sku: "PEL-NEMO-MED",
    name: "Peluche Nemo mediano",
    category: "Peluches",
    totalStock: 70,
    storeOne: 6,
    storeTwo: 4,
    warehouse: 50,
    online: 10,
    sold7d: 49,
    dailyAverage: 7,
    status: "crítico",
  },
  {
    sku: "HOTW-SURT-001",
    name: "Carritos Hot Wheels surtidos",
    category: "Juguetes",
    totalStock: 135,
    storeOne: 35,
    storeTwo: 28,
    warehouse: 62,
    online: 10,
    sold7d: 64,
    dailyAverage: 9,
    status: "alto movimiento",
  },
  {
    sku: "DBZ-GOKU-ART",
    name: "Figura Goku articulada",
    category: "Anime",
    totalStock: 18,
    storeOne: 3,
    storeTwo: 2,
    warehouse: 10,
    online: 3,
    sold7d: 21,
    dailyAverage: 3,
    status: "bajo",
  },
];

const connectedActions = [
  {
    title: "Vendra",
    description: "Catálogo, links, apartados y pedidos.",
    icon: ShoppingCart,
    actions: ["Ver pedidos", "Revisar apartados", "Generar link"],
  },
  {
    title: "Punto de venta",
    description: "Ventas físicas, sincronización y movimientos.",
    icon: Store,
    actions: ["Ver ventas", "Sincronizar stock", "Ver movimientos"],
  },
  {
    title: "Asistente WhatsApp",
    description: "Disponibilidad, apartados y respuestas.",
    icon: MessageCircle,
    actions: ["Consultar stock", "Revisar conversaciones", "Validar apartado"],
  },
  {
    title: "Exhiba",
    description: "Clientes, leads y seguimiento.",
    icon: UsersRound,
    actions: ["Ver clientes", "Crear seguimiento"],
  },
];

export default function DominiumControlPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return ownerProducts;

    return ownerProducts.filter((product) => {
      return (
        product.sku.toLowerCase().includes(value) ||
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value)
      );
    });
  }, [search]);

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0B1220]">
      <section className="mx-auto min-h-screen w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={() => router.push("/acceso")}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <ArrowLeft size={15} />
              Cambiar acceso
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                <Warehouse size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-[0.24em] text-slate-950 sm:text-3xl">
                  DOMINIUM
                </h1>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Panel dueño / encargado
                </p>
              </div>
            </div>
          </div>

          <div className="hidden rounded-2xl bg-white px-4 py-3 text-right shadow-sm ring-1 ring-slate-200 sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Estado
            </p>
            <p className="mt-1 text-sm font-black text-teal-600">
              Operación activa
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <p className="text-2xl font-black text-slate-950">3</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Alertas críticas
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <TrendingUp size={20} />
            </div>
            <p className="text-2xl font-black text-slate-950">134</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Unidades vendidas 7 días
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Boxes size={20} />
            </div>
            <p className="text-2xl font-black text-slate-950">223</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Stock total visible
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Search size={19} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Buscar inventario
              </h2>
              <p className="text-sm text-slate-500">
                Busca por SKU, nombre o categoría.
              </p>
            </div>
          </div>

          <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
            <PackageSearch size={19} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-full w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
              placeholder="Ej. Nemo, PEL-NEMO-MED, Peluches"
            />
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">
                Stock detallado
              </h2>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Vista de control
              </p>
            </div>

            {filteredProducts.map((product) => (
              <article
                key={product.sku}
                className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      {product.sku}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {product.category}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
                      product.status === "crítico"
                        ? "bg-red-50 text-red-700"
                        : product.status === "bajo"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-cyan-50 text-cyan-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <StockBox label="Total" value={product.totalStock} />
                  <StockBox label="Tienda 1" value={product.storeOne} />
                  <StockBox label="Tienda 2" value={product.storeTwo} />
                  <StockBox label="Bodega" value={product.warehouse} />
                  <StockBox label="Online" value={product.online} />
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Velocidad de venta
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {product.sold7d} unidades en 7 días · promedio{" "}
                        {product.dailyAverage}/día
                      </p>
                    </div>

                    <BarChart3 size={22} className="text-cyan-700" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-white bg-slate-950 p-4 text-white shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <AlertTriangle size={20} />
              </div>

              <h2 className="text-lg font-black">Riesgo de agotamiento</h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Peluche Nemo mediano puede agotarse en tiendas si mantiene su
                velocidad actual.
              </p>

              <button className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950">
                Revisar reposición
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                  <Link2 size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Acciones conectadas
                  </h2>
                  <p className="text-sm text-slate-500">
                    Acceso amplio para control.
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
                      <div className="mb-2 flex items-start gap-3">
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
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function StockBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}
