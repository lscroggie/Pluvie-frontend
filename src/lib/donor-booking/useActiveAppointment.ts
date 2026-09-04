"use client";

import { useSyncExternalStore } from "react";
import { getActiveAppointment, subscribeToActiveAppointment, type Appointment } from "./appointments";

function getServerSnapshot(): Appointment | null {
  return null;
}

export function useActiveAppointment(): Appointment | null {
  return useSyncExternalStore(subscribeToActiveAppointment, getActiveAppointment, getServerSnapshot);
}
