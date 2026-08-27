import { Inter } from "next/font/google";
import { PluvieLogo } from "./PluvieLogo";

const brandFont = Inter({ subsets: ["latin"], weight: "800" });

export function BookingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pt-6">
      <PluvieLogo className="h-9 w-[27px]" />
      <span className={`${brandFont.className} text-3xl text-[#2D3436]`}>Pluvie</span>
    </header>
  );
}
