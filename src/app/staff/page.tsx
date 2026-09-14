import { RoleGate } from "@/components/auth/RoleGate";

export const metadata = {
  title: "Portal de staff · Pluvie",
  description: "Agenda y escaneo de turnos para staff de Pluvie",
};

export default function StaffPage() {
  return (
    <RoleGate role="staff">
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-2 bg-zinc-50 px-6 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Portal de staff</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          Agenda y escaneo de turnos — próximamente.
        </p>
      </div>
    </RoleGate>
  );
}
