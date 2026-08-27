import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">Pluvie</h1>
      <p className="max-w-sm text-sm text-zinc-500">
        Mockup del flujo de turno del donante: tipo de donación, centro, fecha y hora, y
        confirmación.
      </p>
      <div className="flex gap-3">
        <Link
          href="/turno"
          className="rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white"
        >
          Ver flujo de turno
        </Link>
        <Link
          href="/perfil"
          className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900"
        >
          Ver mi perfil
        </Link>
      </div>
    </div>
  );
}
