"use client";

import { useState } from "react";
import { DominiumThemeToggle } from "@/components/dominium/theme/DominiumThemeToggle";

type DominiumLoginPanelProps = {
  onEnter: () => void;
  disabled?: boolean;
};

export function DominiumLoginPanel({
  onEnter,
  disabled = false,
}: DominiumLoginPanelProps) {
  const [operator, setOperator] = useState("operador.bodega");
  const [pin, setPin] = useState("1234");

  const canEnter = operator.trim().length > 0 && pin.trim().length > 0;

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canEnter || disabled) {
      return;
    }

    onEnter();
  }

  return (
   <section className="flex h-full flex-col rounded-[var(--d-radius-xl)] border border-[var(--d-border)] bg-[var(--d-surface)] px-5 pb-5 pt-14 shadow-[var(--d-shadow-strong)] sm:p-6">


      <header className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--d-soft)]">
            Dominium
          </p>
<h1 className="mt-18 text-4xl font-black leading-[0.94] tracking-[-0.08em] text-[var(--d-text)] lg:mt-3 lg:text-5xl">
  Control operativo
</h1>
        </div>

        <DominiumThemeToggle />
      </header>

      <form onSubmit={submitLogin} className="mt-20 grid gap-5 lg:mt-auto">
        <div className="rounded-[var(--d-radius-lg)] border border-[var(--d-border)] bg-[var(--d-bg)] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--d-soft)]">
            Acceso
          </p>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--d-soft)]">
                Usuario
              </span>

              <input
                value={operator}
                onChange={(event) => setOperator(event.target.value)}
                autoComplete="username"
                className="h-12 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-4 text-base font-black text-[var(--d-text)] outline-none transition placeholder:text-[var(--d-soft)] focus:border-[var(--d-primary)]"
                placeholder="operador.bodega"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--d-soft)]">
                PIN
              </span>

              <input
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                className="h-12 rounded-[var(--d-radius-md)] border border-[var(--d-border)] bg-[var(--d-surface)] px-4 text-base font-black text-[var(--d-text)] outline-none transition placeholder:text-[var(--d-soft)] focus:border-[var(--d-primary)]"
                placeholder="••••"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || !canEnter}
          className="h-14 w-full rounded-[var(--d-radius-md)] bg-[var(--d-primary)] text-base font-black text-[var(--d-bg)] shadow-[var(--d-shadow-soft)] transition hover:brightness-110 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50"
        >
          Ingresar
        </button>
      </form>
    </section>
  );
}
