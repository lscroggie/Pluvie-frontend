import Link from "next/link";
import { Inter } from "next/font/google";
import { PluvieLogo } from "@/components/donor-booking/PluvieLogo";

const brandFont = Inter({ subsets: ["latin"], weight: "800" });

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center">
      <div className="flex items-center gap-3">
        <PluvieLogo className="h-9 w-[27px]" />
        <span className={`${brandFont.className} text-3xl text-[#2D3436]`}>Pluvie</span>
      </div>
      <p className="max-w-sm text-sm text-zinc-500">
        Mockup del flujo de turno del donante: tipo de donación, centro, fecha y hora, y
        confirmación.
      </p>
      <div className="flex gap-3">
        <Link
          href="/turno"
          className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-zinc-900 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-900 transition-all duration-200 ease-out hover:scale-[1.02] hover:border-transparent hover:bg-[linear-gradient(135deg,#6C5CE7,#FF7675)] hover:text-white hover:shadow-md"
        >
          Turnos
        </Link>
        <Link
          href="/perfil"
          className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-zinc-900 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-900 transition-all duration-200 ease-out hover:scale-[1.02] hover:border-transparent hover:bg-[linear-gradient(135deg,#6C5CE7,#FF7675)] hover:text-white hover:shadow-md"
        >
          Pluviómetro
        </Link>
      </div>
    </div>
  );
}
