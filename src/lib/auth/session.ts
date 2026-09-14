// Estado de sesión compartido entre los tres portales (donante, staff,
// gerencial). En producción, `login` se llamaría con el rol y el token que
// devuelve el backend (Go) dentro del JWT al autenticarse. Acá, como no hay
// backend conectado, seguimos usando localStorage para simular la sesión.

import { isKnownRole, type Role } from "./index";

const SESSION_ROLE_KEY = "pluvie:session-role";
const TOKEN_KEY = "pluvie:token";
const JUST_LOGGED_OUT_KEY = "pluvie:just-logged-out";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const listeners = new Set<() => void>();

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

/** Suscripción para `useSyncExternalStore`: cambios propios + de otras pestañas. */
export function subscribeToSession(callback: () => void): () => void {
  listeners.add(callback);
  if (isBrowser()) window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    if (isBrowser()) window.removeEventListener("storage", callback);
  };
}

export function getRole(): Role | null {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(SESSION_ROLE_KEY);
  return stored && isKnownRole(stored) ? stored : null;
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function hasActiveSession(): boolean {
  return getRole() !== null;
}

export function login(role: Role, token: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_ROLE_KEY, role);
  window.localStorage.setItem(TOKEN_KEY, token);
  notifyListeners();
}

export function logout(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_ROLE_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.setItem(JUST_LOGGED_OUT_KEY, "1");
  notifyListeners();
}

/** Devuelve true una única vez si el logout se acaba de ejecutar (para mostrar un aviso en /login). */
export function consumeJustLoggedOut(): boolean {
  if (!isBrowser()) return false;
  const justLoggedOut = window.localStorage.getItem(JUST_LOGGED_OUT_KEY) === "1";
  if (justLoggedOut) window.localStorage.removeItem(JUST_LOGGED_OUT_KEY);
  return justLoggedOut;
}
