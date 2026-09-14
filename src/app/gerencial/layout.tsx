import { Inter, Poppins } from "next/font/google";
import { GerencialSidebar } from "@/components/gerencial/GerencialSidebar";
import { RoleGate } from "@/components/auth/RoleGate";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export default function GerencialLayout({ children }: LayoutProps<"/gerencial">) {
  return (
    <RoleGate role="gerencial">
      <div
        className={`${poppins.variable} ${inter.variable} flex min-h-full flex-1`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <GerencialSidebar />
        <main className="flex-1 bg-zinc-50">{children}</main>
      </div>
    </RoleGate>
  );
}
