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
            <li key={item.label} className="flex items-start justify-between gap-2 text-xs">
              <span className="flex min-w-0 flex-1 items-center gap-1.5 text-zinc-600">
                {item.dotClassName && (
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.dotClassName}`} />
                )}
                {item.label}
              </span>
              <span className="shrink-0 whitespace-nowrap text-right font-semibold tabular-nums text-zinc-700">
                {item.count} · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
