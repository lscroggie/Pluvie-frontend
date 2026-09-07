import type { DonationTypeId } from "./types";

// Mock de persistencia de turnos reservados. En producción esto viviría en
// el backend, asociado al donante autenticado. Acá usamos localStorage
// para simular "1 turno activo por donante" sin necesidad de un servidor.

const STORAGE_KEY = "pluvie:active-appointment";

export type Appointment = {
  donationTypeId: DonationTypeId;
  centerId: string;
  centerName: string;
  centerAddress: string;
  dateStr: string; // YYYY-MM-DD
  time: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const listeners = new Set<() => void>();

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

/** Suscripción para `useSyncExternalStore`: cambios propios + de otras pestañas. */
export function subscribeToActiveAppointment(callback: () => void): () => void {
  listeners.add(callback);
  if (isBrowser()) window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    if (isBrowser()) window.removeEventListener("storage", callback);
  };
}

let cachedRaw: string | null = null;
let cachedAppointment: Appointment | null = null;

/**
 * Devuelve una referencia estable mientras el localStorage no cambie
 * (requisito de `useSyncExternalStore.getSnapshot` para no re-renderizar
 * en loop).
 */
export function getActiveAppointment(): Appointment | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedAppointment = raw ? (JSON.parse(raw) as Appointment) : null;
    }
    return cachedAppointment;
  } catch {
    return null;
  }
}

export function saveAppointment(appointment: Appointment): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointment));
  notifyListeners();
}

// Turnos cancelados por el donante ANTES de la fecha (fuerza mayor, cambio
// de planes): evento separado de "ausentismo" para las métricas de
// /gerencial (ver DonorCancellations en lib/gerencial/types.ts). El cupo se
// liberó a tiempo, así que no debe computar como no-show.
const CANCELLATIONS_KEY = "pluvie:donor-cancellations-early";

export type DonorCancellationEvent = {
  appointment: Appointment;
  cancelledAt: string; // ISO timestamp
  reason: "cancelled_early_by_donor";
};

function recordDonorCancellation(appointment: Appointment): void {
  try {
    const raw = window.localStorage.getItem(CANCELLATIONS_KEY);
    const events: DonorCancellationEvent[] = raw ? JSON.parse(raw) : [];
    events.push({ appointment, cancelledAt: new Date().toISOString(), reason: "cancelled_early_by_donor" });
    window.localStorage.setItem(CANCELLATIONS_KEY, JSON.stringify(events));
  } catch {
    // Registro best-effort: no debe impedir que la cancelación se complete.
  }
}

export function cancelActiveAppointment(appointment?: Appointment | null): void {
  if (!isBrowser()) return;
  const cancelled = appointment ?? getActiveAppointment();
  if (cancelled) recordDonorCancellation(cancelled);
  window.localStorage.removeItem(STORAGE_KEY);
  notifyListeners();
}
