import Link from "next/link";
import { BuildingIcon, DashboardIcon, DropIcon, GearIcon, ReportsIcon } from "./icons";

const navItems = [
  { label: "Dashboard", href: "/gerencial", Icon: DashboardIcon },
  { label: "Sedes", href: null, Icon: BuildingIcon },
  { label: "Reportes", href: null, Icon: ReportsIcon },
  { label: "Configuración", href: null, Icon: GearIcon },
];

export function GerencialSidebar() {
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
            className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white"
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
