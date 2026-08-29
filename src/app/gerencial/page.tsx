import { GerencialDashboard } from "@/components/gerencial/GerencialDashboard";

export const metadata = {
  title: "Dashboard gerencial · Pluvie",
  description: "Panel gerencial de donaciones de Pluvie",
};

export default function GerencialPage() {
  return <GerencialDashboard />;
}
