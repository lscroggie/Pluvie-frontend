"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClockIcon, DashboardIcon, DropIcon, GearIcon } from "./icons";

const navItems = [
  { label: "Dashboard", href: "/gerencial", Icon: DashboardIcon },
  { label: "Configuración", href: null, Icon: GearIcon },
  { label: "Configuración de turnos", href: "/gerencial/configuracion-turnos", Icon: ClockIcon },
];

export function GerencialSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-60 shrink-0 flex-col gap-1 bg-brand-charcoal px-3 py-6">
      <div className="mb-6 flex items-center gap-2 px-3">
        <DropIcon className="h-5 w-5 text-brand-violet" />
        <span
          className="text-lg font-semibold text-white"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Pluvie · Gerencial
        </span>
      </div>

      {navItems.map(({ label, href, Icon }) =>
        href ? (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold ${
              pathname === href ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 text-brand-violet" />
            {label}
          </Link>
        ) : (
          <span
            key={label}
            className="flex cursor-not-allowed items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400"
          >
            <Icon className="h-4 w-4" />
            {label}
          </span>
        ),
      )}
    </nav>
  );
}
