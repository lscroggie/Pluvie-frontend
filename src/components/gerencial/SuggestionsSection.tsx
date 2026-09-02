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
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Sugerencias
      </h2>
      <div className="mt-4 space-y-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-3 rounded-2xl border border-brand-violet/40 bg-brand-violet/10 px-4 py-3"
          >
            <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet" />
            <p className="flex-1 text-sm text-brand-charcoal">{suggestion.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
