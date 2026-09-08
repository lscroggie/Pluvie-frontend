"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/donor-auth/useSession";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const hasSession = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!hasSession) router.replace("/login");
  }, [hasSession, router]);

  if (!hasSession) return null;

  return <>{children}</>;
}
