import type { ProductDraft } from "@/types/dominium";

type DominiumSearchPanelProps = {
  products: ProductDraft[];
  onClose: () => void;
};

export function DominiumSearchPanel({
  products,
  onClose,
}: DominiumSearchPanelProps) {
  return (
    <section className="mt-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">Buscar</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Consulta productos registrados, códigos o estado interno.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-500 transition hover:bg-neutral-50"
        >
          Cerrar
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <input
          type="text"
          placeholder="Buscar por código, nombre o destino..."
          className="h-10 w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </div>

      <div className="mt-5 space-y-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-neutral-950">
                  {product.code}
                </p>
                <p className="mt-1 text-sm text-neutral-600">{product.name}</p>
              </div>

              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                {product.destination === "aparta" ? "/aparta" : "/tienda"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-neutral-500 sm:grid-cols-4">
              <div>
                <p className="font-medium text-neutral-800">Precio</p>
                <p>Q{product.initialPrice}</p>
              </div>

              <div>
                <p className="font-medium text-neutral-800">Cantidad</p>
                <p>{product.quantity}</p>
              </div>

              <div>
                <p className="font-medium text-neutral-800">Estado</p>
                <p>{product.status}</p>
              </div>

              <div>
                <p className="font-medium text-neutral-800">Registró</p>
                <p>{product.registeredBy}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={product.strapiUrl ?? "#"}
                className="rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50"
              >
                Editar en tienda
              </a>

              <a
                href={product.storeUrl ?? "#"}
                className="rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50"
              >
                Ver en tienda
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
