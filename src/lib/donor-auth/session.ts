// Mock de autenticación passwordless. En producción esto viviría en el
// backend (envío real de SMS/WhatsApp, verificación de OTP y de biometría
// server-side). Acá usamos localStorage para simular sesión y credencial
// biométrica registrada, sin necesidad de un servidor.

const SESSION_KEY = "pluvie:session";
const CREDENTIAL_KEY = "pluvie:webauthn-credential-id";
const JUST_LOGGED_OUT_KEY = "pluvie:just-logged-out";
const LOGIN_DOCUMENT_KEY = "pluvie:login-document";

export type DocumentType = "dni" | "pasaporte";

export type LoginDocument = {
  type: DocumentType;
  number: string;
};

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

export function hasActiveSession(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(SESSION_KEY) === "1";
}

export function getBiometricCredentialId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(CREDENTIAL_KEY);
}

export function saveBiometricCredentialId(credentialId: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CREDENTIAL_KEY, credentialId);
  notifyListeners();
}

/**
 * Guarda con qué tipo de documento se identificó el donante en el login
 * (DNI o pasaporte). Todavía no se usa en ningún flujo, pero lo vamos a
 * necesitar para el cuestionario de elegibilidad médica de donantes
 * extranjeros (pendiente, no implementado).
 */
export function saveLoginDocument(document: LoginDocument): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(LOGIN_DOCUMENT_KEY, JSON.stringify(document));
}

export function getLoginDocument(): LoginDocument | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(LOGIN_DOCUMENT_KEY);
    return raw ? (JSON.parse(raw) as LoginDocument) : null;
  } catch {
    return null;
  }
}

/** Genera un código de 6 dígitos simulado, mostrado en pantalla (no se envía nada real). */
export function generateMockCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function login(): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_KEY, "1");
  notifyListeners();
}

/** Cierra la sesión y olvida la biometría registrada en este dispositivo. */
export function logout(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(CREDENTIAL_KEY);
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
