type DominiumActionButtonsProps = {
  onCreate: () => void;
  onSearch: () => void;
};

export function DominiumActionButtons({
  onCreate,
  onSearch,
}: DominiumActionButtonsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={onCreate}
        className="group rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100 active:scale-[0.99]"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-2xl text-white transition group-hover:scale-105">
          +
        </div>

        <h2 className="text-xl font-semibold text-emerald-900">Crear</h2>

        <p className="mt-2 text-sm leading-6 text-emerald-950/70">
          Registrar producto nuevo o abrir edición en tienda.
        </p>
      </button>

      <button
        type="button"
        onClick={onSearch}
        className="group rounded-3xl border border-blue-100 bg-blue-50 px-6 py-8 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-100 active:scale-[0.99]"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-2xl text-white transition group-hover:scale-105">
          +
        </div>

        <h2 className="text-xl font-semibold text-blue-900">Buscar</h2>

        <p className="mt-2 text-sm leading-6 text-blue-950/70">
          Consultar productos, códigos, registros o bitácora.
        </p>
      </button>
    </div>
  );
}
