// Datos específicos del login de donante (documento, biometría). El estado
// de sesión (rol + token) vive en @/lib/auth/session, compartido con staff y
// gerencial.

const CREDENTIAL_KEY = "pluvie:webauthn-credential-id";
const LOGIN_DOCUMENT_KEY = "pluvie:login-document";

export type DocumentType = "dni" | "pasaporte";

export type LoginDocument = {
  type: DocumentType;
  number: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getBiometricCredentialId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(CREDENTIAL_KEY);
}

export function saveBiometricCredentialId(credentialId: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CREDENTIAL_KEY, credentialId);
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
