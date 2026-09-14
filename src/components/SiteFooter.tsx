import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-4 text-center">
      <Link
        href="/requisitos"
        className="text-base font-medium text-brand-violet hover:text-brand-violet-dark hover:underline"
      >
        Ver requisitos de donación
      </Link>
    </footer>
  );
}
