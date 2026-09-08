// Mock de biometría con WebAuthn. En producción, el challenge lo genera y
// firma el backend, y la respuesta (attestation/assertion) se le envía de
// vuelta para verificarla contra la clave pública registrada. Acá, como no
// hay backend, generamos el challenge en el cliente y consideramos exitoso
// el login apenas el navegador completa la verificación biométrica del
// sistema operativo (Face ID / huella).

import { DONOR_DNI, DONOR_NAME } from "@/lib/donor-profile/data";

export function isWebAuthnSupported(): boolean {
  return typeof window !== "undefined" && typeof window.PublicKeyCredential !== "undefined";
}

function randomBytes(length: number): ArrayBuffer {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes.buffer as ArrayBuffer;
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBuffer(base64Url: string): ArrayBuffer {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** Registra una credencial biométrica (Face ID / huella) en este dispositivo. */
export async function registerBiometricCredential(): Promise<string | null> {
  if (!isWebAuthnSupported()) return null;

  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: { name: "Pluvie", id: window.location.hostname },
        user: {
          id: randomBytes(16),
          name: DONOR_DNI,
          displayName: DONOR_NAME,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        attestation: "none",
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;

    if (!credential) return null;
    // En producción: enviar `credential` (id + attestationObject + clientDataJSON)
    // al backend para verificarlo y guardar la clave pública asociada al donante.
    return bufferToBase64Url(credential.rawId);
  } catch {
    return null;
  }
}

/** Verifica la biometría del dispositivo contra la credencial ya registrada. */
export async function verifyBiometricCredential(credentialId: string): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        allowCredentials: [{ type: "public-key", id: base64UrlToBuffer(credentialId) }],
        userVerification: "required",
        timeout: 60000,
      },
    });

    // En producción: enviar la assertion (firma + clientDataJSON) al backend
    // para verificarla contra la clave pública guardada en el registro. Acá,
    // como no hay backend, completar la verificación biométrica del sistema
    // operativo ya alcanza para simular el login.
    return assertion !== null;
  } catch {
    return false;
  }
}
