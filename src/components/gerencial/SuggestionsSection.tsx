import type { Suggestion } from "@/lib/gerencial/types";

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M8 1.5a4.5 4.5 0 0 0-2.5 8.25c.4.28.5.6.5 1v.25h4v-.25c0-.4.1-.72.5-1A4.5 4.5 0 0 0 8 1.5Z" strokeLinejoin="round" />
      <path d="M6.5 13.5h3M7 15h2" strokeLinecap="round" />
    </svg>
  );
}

export function SuggestionsSection({ suggestions }: { suggestions: Suggestion[] }) {
  if (suggestions.length === 0) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Sugerencias
      </h2>
      <div className="mt-3 space-y-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-2.5 rounded-xl border border-brand-violet/40 bg-brand-violet/10 px-3 py-2.5"
          >
            <LightbulbIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-violet" />
            <p className="flex-1 text-xs text-brand-charcoal">{suggestion.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
