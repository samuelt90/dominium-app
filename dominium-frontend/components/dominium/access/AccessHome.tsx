"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { DominiumThemeToggle } from "@/components/dominium/theme/DominiumThemeToggle";
import { AccessRoleCard } from "@/components/dominium/access/AccessRoleCard";

function ControlIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect
        x="10"
        y="14"
        width="44"
        height="36"
        rx="12"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M20 40V31"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M32 40V24"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M44 40V28"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M18 48H46"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OperationIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect
        x="15"
        y="9"
        width="34"
        height="46"
        rx="12"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M25 18H39"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 35H42"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M23 42H41"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="49" r="3" fill="currentColor" />
      <path
        d="M12 25V18C12 14.7 14.7 12 18 12"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M52 25V18C52 14.7 49.3 12 46 12"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AccessHome() {
  const router = useRouter();

  return (
    <main className="min-h-dvh overflow-hidden bg-[var(--d-bg)] text-[var(--d-text)]">
 {/* MOBILE */}
<section className="flex h-dvh flex-col overflow-hidden px-4 pb-8 pt-9 lg:hidden">

  <header className="flex shrink-0 items-start justify-between gap-3">
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--d-soft)]">
        Dominium
      </p>

      <h1 className="mt-1 text-3xl font-black tracking-[-0.07em]">
        Acceso
      </h1>
    </div>

    <div className="origin-top-right scale-90">
      <DominiumThemeToggle />
    </div>
  </header>

  <motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.28, ease: "easeOut" }}
  className="mt-8 flex min-h-0 flex-1 flex-col"
>
  <div className="shrink-0 px-1 pb-2">
  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
    Paneles disponibles
  </p>

  <h2 className="mt-1 text-xl font-black tracking-[-0.05em] text-[var(--d-text)]">
    Selecciona cómo continuar
  </h2>

  <p className="mt-1 max-w-[300px] text-xs font-semibold leading-5 text-[var(--d-muted)]">
    Elige el acceso correspondiente a tu operación.
  </p>
</div>


  <div className="flex flex-1 items-center">
    <div className="grid w-full gap-8">

        {/* Control */}
        <button
          type="button"
          onClick={() => router.push("/control")}
          className="grid min-h-[148px] grid-cols-[58px_1fr_auto] items-center gap-4 rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-surface)] p-4 text-left text-[var(--d-text)] shadow-[var(--d-shadow-soft)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface-strong)] text-[var(--d-primary)]">
            <ControlIcon className="h-9 w-9" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--d-soft)]">
              Dueño / encargado
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-[-0.06em]">
              Control
            </h2>

            <p className="mt-1 text-xs font-semibold text-[var(--d-muted)]">
              Stock · alertas · recepciones
            </p>
          </div>

          <span className="rounded-full bg-[var(--d-surface-strong)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--d-soft)]">
            Entrar
          </span>
        </button>

        {/* Operación */}
        <button
          type="button"
          onClick={() => router.push("/operacion")}
          className="grid min-h-[148px] grid-cols-[58px_1fr_auto] items-center gap-4 rounded-[var(--d-radius-xl)] border border-[var(--d-primary)] bg-[var(--d-primary)] p-4 text-left text-[var(--d-bg)] shadow-[var(--d-shadow-strong)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--d-radius-md)] border border-white/20 bg-white/10 text-[var(--d-bg)]">
            <OperationIcon className="h-9 w-9" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--d-bg)]/65">
              Empleado
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-[-0.06em]">
              Operación
            </h2>

            <p className="mt-1 text-xs font-semibold text-[var(--d-bg)]/72">
              Escaneo · guías · recepción
            </p>
          </div>

          <span className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--d-bg)]">
            Entrar
          </span>
        </button>
      </div>
    </div>

    <footer className="mb-1 flex h-12 shrink-0 items-center justify-between rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] px-4 text-xs font-black text-[var(--d-muted)] shadow-[var(--d-shadow-soft)]">
      <span>Sesión autorizada</span>
      <span className="h-2 w-2 rounded-full bg-[var(--d-success)]" />
    </footer>
  </motion.div>
</section>



      {/* DESKTOP */}
      <section className="hidden h-dvh overflow-hidden lg:grid lg:grid-cols-[360px_1fr]">
        <aside className="relative flex min-h-0 flex-col border-r border-[var(--d-border)] bg-[var(--d-terminal-bg)] p-8 text-[var(--d-terminal-text)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(224,162,47,0.22),transparent_34%),radial-gradient(circle_at_74%_82%,rgba(86,160,109,0.14),transparent_36%)]" />

          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--d-terminal-muted)]">
              Dominium
            </p>

            <h1 className="mt-3 text-5xl font-black leading-[0.92] tracking-[-0.08em]">
              Selección de acceso.
            </h1>
          </div>

          <div className="relative z-10 mt-auto rounded-[var(--d-radius-xl)] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-terminal-muted)]">
              Sesión
            </p>

            <p className="mt-2 text-xl font-black tracking-[-0.05em]">
              Acceso autorizado
            </p>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col px-8 py-6">
          <header className="flex shrink-0 items-center justify-end">
            <DominiumThemeToggle />
          </header>

          <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col justify-center gap-5">
            <div className="mb-2">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--d-soft)]">
                Panel disponible
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-[-0.07em]">
                Elige cómo continuar.
              </h2>
            </div>

            <AccessRoleCard
              layout="desktop-row"
              title="Control"
              eyebrow="Dueño / encargado"
              description="Stock · alertas · recepciones"
              icon={<ControlIcon className="h-full w-full" />}
              onClick={() => router.push("/control")}
            />

            <AccessRoleCard
              layout="desktop-row"
              title="Operación"
              eyebrow="Empleado"
              description="Escaneo · guías · recepción"
              icon={<OperationIcon className="h-full w-full" />}
              tone="operation"
              onClick={() => router.push("/operacion")}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
