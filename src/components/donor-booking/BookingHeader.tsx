import { Inter } from "next/font/google";
import Link from "next/link";
import { PluvieLogo } from "./PluvieLogo";

const brandFont = Inter({ subsets: ["latin"], weight: "800" });

export function BookingHeader({
  onBack,
  backHref,
}: {
  onBack?: () => void;
  backHref?: string;
}) {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="-ml-1.5 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
        >
          ←
        </button>
      ) : backHref ? (
        <Link
          href={backHref}
          aria-label="Volver"
          className="-ml-1.5 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
        >
          ←
        </Link>
      ) : null}

      <Link href="/perfil" className="flex items-center gap-3">
        <PluvieLogo className="h-9 w-[27px]" />
        <span className={`${brandFont.className} text-3xl text-[#2D3436]`}>Pluvie</span>
      </Link>
    </header>
  );
}
