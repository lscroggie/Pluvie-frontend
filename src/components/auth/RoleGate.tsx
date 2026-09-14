"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthRole } from "@/lib/auth/useAuthRole";
import type { Role } from "@/lib/auth";

/** Protege una ruta para un único rol. Sin sesión, o con el rol equivocado, redirige al login. */
export function RoleGate({ role, children }: { role: Role; children: React.ReactNode }) {
  const currentRole = useAuthRole();
  const router = useRouter();
  const isAuthorized = currentRole === role;

  useEffect(() => {
    if (!isAuthorized) router.replace("/login");
  }, [isAuthorized, router]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}
