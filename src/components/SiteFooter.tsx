"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  // /turno ya muestra este mismo enlace dentro de la tarjeta del paso 1.
  if (pathname === "/turno") return null;

  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-4 text-center">
      <Link
        href="/requisitos"
        className="text-sm font-medium text-brand-violet hover:text-brand-violet-dark hover:underline"
      >
        Ver requisitos de donación
      </Link>
    </footer>
  );
}
