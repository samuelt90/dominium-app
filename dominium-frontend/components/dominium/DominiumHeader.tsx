export function DominiumHeader() {
  return (
    <header className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-[0.22em] text-emerald-950 sm:text-4xl">
          DOMINIUM
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Ingreso rápido de inventario
        </p>
      </div>

      <button
        type="button"
        className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm transition hover:bg-neutral-50"
      >
        Menú
      </button>
    </header>
  );
}
