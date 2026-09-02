export type MiniBreakdownItem = {
  label: string;
  count: number;
  dotClassName?: string;
};

export function MiniBreakdownList({ title, items }: { title?: string; items: MiniBreakdownItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      {title && <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">{title}</p>}
      <ul className={title ? "mt-1.5 space-y-1" : "space-y-1"}>
        {items.map((item) => {
          const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);
          return (
            <li key={item.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-zinc-600">
                {item.dotClassName && <span className={`h-1.5 w-1.5 rounded-full ${item.dotClassName}`} />}
                {item.label}
              </span>
              <span className="font-semibold text-zinc-700">
                {item.count} · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
