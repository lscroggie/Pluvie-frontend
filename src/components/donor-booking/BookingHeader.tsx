import { Inter } from "next/font/google";
import Link from "next/link";
import { BackButton } from "./BackButton";
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
        <BackButton onClick={onBack} />
      ) : backHref ? (
        <BackButton href={backHref} />
      ) : null}

      <Link href="/" className="flex items-center gap-3">
        <PluvieLogo className="h-9 w-[27px]" />
        <span className={`${brandFont.className} text-3xl text-[#2D3436]`}>Pluvie</span>
      </Link>
    </header>
  );
}
