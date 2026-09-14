"use client";

import { useSyncExternalStore } from "react";
import { getRole, subscribeToSession } from "./session";
import type { Role } from "./types";

function getServerSnapshot(): Role | null {
  return null;
}

export function useAuthRole(): Role | null {
  return useSyncExternalStore(subscribeToSession, getRole, getServerSnapshot);
}
