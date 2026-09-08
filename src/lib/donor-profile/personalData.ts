import type { DonorEditablePersonalData } from "./types";
import { INITIAL_PERSONAL_DATA } from "./data";

// Mock de persistencia de los datos personales editables del donante. En
// producción esto viviría en el backend, asociado al donante autenticado.
// Acá usamos localStorage para simularlo.

const STORAGE_KEY = "pluvie:personal-data";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const listeners = new Set<() => void>();

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

/** Suscripción para `useSyncExternalStore`: cambios propios + de otras pestañas. */
export function subscribeToPersonalData(callback: () => void): () => void {
  listeners.add(callback);
  if (isBrowser()) window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    if (isBrowser()) window.removeEventListener("storage", callback);
  };
}

let cachedRaw: string | null = null;
let cachedData: DonorEditablePersonalData = INITIAL_PERSONAL_DATA;

/**
 * Devuelve una referencia estable mientras el localStorage no cambie
 * (requisito de `useSyncExternalStore.getSnapshot` para no re-renderizar
 * en loop).
 */
export function getPersonalData(): DonorEditablePersonalData {
  if (!isBrowser()) return INITIAL_PERSONAL_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedData = raw
        ? { ...INITIAL_PERSONAL_DATA, ...(JSON.parse(raw) as Partial<DonorEditablePersonalData>) }
        : INITIAL_PERSONAL_DATA;
    }
    return cachedData;
  } catch {
    return INITIAL_PERSONAL_DATA;
  }
}

export function savePersonalData(data: DonorEditablePersonalData): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notifyListeners();
}
