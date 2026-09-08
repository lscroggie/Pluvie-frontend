"use client";

import { useSyncExternalStore } from "react";
import { hasActiveSession, subscribeToSession } from "./session";

function getServerSnapshot(): boolean {
  return false;
}

export function useSession(): boolean {
  return useSyncExternalStore(subscribeToSession, hasActiveSession, getServerSnapshot);
}
