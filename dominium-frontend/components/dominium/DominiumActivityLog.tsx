import type { ActivityLogItem } from "@/types/dominium";

type DominiumActivityLogProps = {
  items: ActivityLogItem[];
};

export function DominiumActivityLog({ items }: DominiumActivityLogProps) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">
          Bitácora reciente
        </h3>

        <button
          type="button"
          className="text-sm font-medium text-emerald-700"
        >
          Ver todo
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 text-neutral-600">
            <span className="w-12 shrink-0 text-neutral-400">
              {item.createdAt}
            </span>

            <p>
              <span className="font-medium text-neutral-800">{item.user}</span>{" "}
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
