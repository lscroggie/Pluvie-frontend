import { ClockIcon } from "@/components/gerencial/icons";

export const metadata = {
  title: "Configuración de turnos · Pluvie",
  description: "Panel gerencial de configuración de turnos de Pluvie",
};

export default function ConfiguracionTurnosPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-violet/10">
        <ClockIcon className="h-7 w-7 text-brand-violet" />
      </div>
      <h1
        className="mt-6 text-xl font-semibold text-brand-charcoal"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Configuración de turnos
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        Panel de carga de horarios y capacidad — próximamente.
      </p>
    </div>
  );
}
