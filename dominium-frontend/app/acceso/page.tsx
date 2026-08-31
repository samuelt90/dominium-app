"use client";

import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  ScanLine,
  ShieldCheck,
  Store,
  UserRound,
  Warehouse,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DominiumSession = {
  user: string;
  access: string;
  loggedAt: string;
};

export default function DominiumAccessPage() {
  const router = useRouter();
  const [session, setSession] = useState<DominiumSession | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem("dominium-session");

    if (!storedSession) {
      router.push("/login");
      return;
    }

    setSession(JSON.parse(storedSession));
  }, [router]);

  function selectAccess(role: "owner" | "employee") {
    localStorage.setItem(
      "dominium-session",
      JSON.stringify({
        ...session,
        role,
        selectedAt: new Date().toISOString(),
      })
    );

    if (role === "owner") {
      router.push("/control");
      return;
    }

    router.push("/operacion");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F7FA] text-[#0B1220]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6 sm:max-w-lg">
        <div className="pointer-events-none absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

        <header className="relative pt-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur">
            <ShieldCheck size={14} />
            Acceso autorizado
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1220] text-white shadow-sm">
              <Warehouse size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-[0.28em] text-[#0B1220]">
                DOMINIUM
              </h1>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Selección de panel
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-950">
              Hola, {session?.user || "usuario"}
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Selecciona el tipo de acceso para continuar.
            </p>
          </div>
        </header>

        <section className="relative mt-6 flex flex-1 flex-col gap-4">
          <button
            type="button"
            onClick={() => selectAccess("owner")}
            className="group rounded-[2rem] border border-white/80 bg-white/95 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition active:scale-[0.99] hover:border-cyan-200 hover:bg-white"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Building2 size={23} />
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition group-hover:bg-cyan-50 group-hover:text-cyan-700">
                <ArrowRight size={18} />
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-950">
              Dueño / Encargado
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Control general de stock, alertas, velocidad de venta, riesgo de
              agotamiento y conexiones amplias.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <BarChart3 size={18} className="mb-2 text-cyan-600" />
                <p className="text-xs font-bold text-slate-800">Alertas</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <Boxes size={18} className="mb-2 text-teal-600" />
                <p className="text-xs font-bold text-slate-800">Stock</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <Store size={18} className="mb-2 text-slate-700" />
                <p className="text-xs font-bold text-slate-800">Tiendas</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectAccess("employee")}
            className="group rounded-[2rem] border border-white/80 bg-white/95 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition active:scale-[0.99] hover:border-teal-200 hover:bg-white"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                <UserRound size={23} />
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition group-hover:bg-teal-50 group-hover:text-teal-700">
                <ArrowRight size={18} />
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-950">Empleado</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Escaneo desde teléfono, búsqueda por SKU, nombre o categoría,
              consulta de stock y movimientos operativos.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <ScanLine size={18} className="mb-2 text-cyan-600" />
                <p className="text-xs font-bold text-slate-800">Escaneo</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <Boxes size={18} className="mb-2 text-teal-600" />
                <p className="text-xs font-bold text-slate-800">SKU</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <Warehouse size={18} className="mb-2 text-slate-700" />
                <p className="text-xs font-bold text-slate-800">Movimientos</p>
              </div>
            </div>
          </button>
        </section>

        <footer className="relative mt-6 pb-2 text-center">
          <p className="text-xs font-medium text-slate-400">
            Dominium · Control operativo de inventario
          </p>
        </footer>
      </section>
    </main>
  );
}
