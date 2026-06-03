export function DominiumCommandInput() {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white px-5 py-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-700">
          ▦
        </div>

        <input
          type="text"
          placeholder="Escanea código, toma foto o escribe..."
          className="h-12 w-full bg-transparent text-base text-neutral-800 outline-none placeholder:text-neutral-400 sm:text-lg"
        />

        <button
          type="button"
          className="hidden rounded-2xl border border-neutral-200 px-4 py-2 text-sm text-neutral-500 transition hover:bg-neutral-50 sm:block"
        >
          Cámara
        </button>
      </div>
    </div>
  );
}
