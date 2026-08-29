import type { PeriodOption } from "@/lib/gerencial/types";

export function PeriodSelector({
  options,
  value,
  onChange,
}: {
  options: PeriodOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-brand-charcoal"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
