const STEPS = ["Tipo de donación", "Centro", "Fecha y hora", "Confirmación"];

export function Stepper({ currentIndex }: { currentIndex: number }) {
  return (
    <ol className="flex w-full items-center gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "pending";
        return (
          <li key={label} className="flex flex-1 items-center gap-1 sm:gap-2">
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  state === "done" && "bg-brand-violet text-white",
                  state === "active" && "bg-brand-violet text-white ring-4 ring-brand-violet/20",
                  state === "pending" && "bg-zinc-100 text-zinc-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {state === "done" ? "✓" : i + 1}
              </div>
              <span
                className={[
                  "hidden text-center text-xs leading-tight sm:block",
                  state === "pending" ? "text-zinc-400" : "text-zinc-700 font-medium",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "mb-5 h-0.5 flex-1 rounded sm:mb-6",
                  state === "done" ? "bg-brand-violet" : "bg-zinc-100",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
