import { SiteFooter } from "@/components/SiteFooter";

// Layout solo del portal donante: el pie con el enlace a requisitos no
// aparece en /gerencial ni en /staff, que tienen su propio diseño.
export default function DonanteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
