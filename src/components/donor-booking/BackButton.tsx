import Link from "next/link";

const BUTTON_CLASSES =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-all duration-150 hover:border-brand-violet/30 hover:bg-brand-violet/5 hover:text-brand-violet hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet";

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

export function BackButton({ onClick, href, className }: { onClick?: () => void; href?: string; className?: string }) {
  const classes = [BUTTON_CLASSES, className].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link href={href} aria-label="Volver" className={classes}>
        <ArrowLeftIcon />
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label="Volver" className={classes}>
      <ArrowLeftIcon />
    </button>
  );
}
