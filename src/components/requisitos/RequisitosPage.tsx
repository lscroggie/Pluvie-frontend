import Link from "next/link";
import { BookingHeader } from "@/components/donor-booking/BookingHeader";

const CONDICIONES_GENERALES = [
  "Tener entre 18 y 65 años.",
  "Pesar al menos 50 kg.",
  "Sentirte bien de salud, sin síntomas de enfermedad.",
  "Haber descansado al menos 6 horas la noche anterior.",
  "Haber desayunado o almorzado antes de donar (evitando comidas grasas).",
];

const EXCLUSIONES_TEMPORALES = [
  "No haberte hecho tatuajes, piercings o perforaciones en el último año.",
  "No haber tenido cirugías en el último año.",
  "No haber tenido fiebre, gripe o alguna infección en los últimos 7 días.",
  "No haber tomado antibióticos en los últimos 7 días.",
  "No haber estado embarazada o dado a luz en los últimos 6 meses.",
];

export function RequisitosPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <BookingHeader backHref="/" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-semibold text-zinc-900">¿Podés donar?</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Estas son las condiciones generales para donar. Ante la duda, sacá el turno igual: el
          personal del centro te confirma si podés donar el mismo día.
        </p>

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900">Condiciones generales</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {CONDICIONES_GENERALES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violet" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900">Te excluyen temporalmente</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {EXCLUSIONES_TEMPORALES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violet" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-6 text-xs text-zinc-400">
          El personal del centro puede pedirte información adicional el día de la donación.
        </p>

        <div className="mt-8">
          <Link
            href="/turno"
            className="inline-flex w-full items-center justify-center rounded-full bg-brand-violet px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md sm:w-auto"
          >
            Sacar turno
          </Link>
        </div>
      </main>
    </div>
  );
}
