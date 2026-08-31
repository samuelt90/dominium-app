"use client";

import {
  ArrowRight,
  Boxes,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
  User,
  Warehouse,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DominiumLoginPage() {
  const router = useRouter();

  const [user, setUser] = useState("Samuel");
  const [password, setPassword] = useState("dominium");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorage.setItem(
      "dominium-session",
      JSON.stringify({
        user,
        access: "operativo",
        loggedAt: new Date().toISOString(),
      })
    );

    router.push("/acceso");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F7FA] text-[#0B1220]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-between px-5 py-6 sm:max-w-lg">
        <div className="pointer-events-none absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="relative pt-8">
          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur">
              <ShieldCheck size={14} />
              Acceso operativo
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
                  Inventory control
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-[15px] leading-7 text-slate-600">
              Inventario, escaneo, movimientos y conexiones para operación en
              tienda física.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <LockKeyhole size={20} />
              </div>

              <h2 className="text-xl font-bold text-slate-950">
                Entrar al sistema
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ingresa para continuar al entorno de control.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Usuario
                </label>

                <div className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                  <User size={18} className="text-slate-400" />

                  <input
                    value={user}
                    onChange={(event) => setUser(event.target.value)}
                    className="h-12 w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Usuario"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contraseña
                </label>

                <div className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                  <LockKeyhole size={18} className="text-slate-400" />

                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="h-12 w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Contraseña"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B1220] px-4 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition active:scale-[0.99] hover:bg-slate-800"
              >
                Entrar a Dominium
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-0.5"
                />
              </button>
            </form>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <ScanLine size={18} className="mb-2 text-cyan-600" />
                <p className="text-xs font-bold text-slate-800">Escaneo</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <Boxes size={18} className="mb-2 text-teal-600" />
                <p className="text-xs font-bold text-slate-800">Stock</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <ShieldCheck size={18} className="mb-2 text-slate-700" />
                <p className="text-xs font-bold text-slate-800">Control</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative pb-2 text-center">
          <p className="text-xs font-medium text-slate-400">
            Dominium · Control operativo de inventario
          </p>
        </div>
      </section>
    </main>
  );
}
