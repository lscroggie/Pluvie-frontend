"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateMockCode,
  getBiometricCredentialId,
  saveBiometricCredentialId,
  saveLoginDocument,
  type DocumentType,
} from "@/lib/donor-auth/session";
import { isWebAuthnSupported, registerBiometricCredential, verifyBiometricCredential } from "@/lib/donor-auth/webauthn";
import { consumeJustLoggedOut, login } from "@/lib/auth/session";
import { getRoleHome, type Role } from "@/lib/auth";
import { ToastStack, useToasts } from "@/components/ui/Toast";

type Step = "biometric" | "dni" | "code" | "role" | "enable-biometric" | "error";

function getInitialStep(): Step {
  return getBiometricCredentialId() ? "biometric" : "dni";
}

/** Simula el token que en producción vendría del backend (Go) junto con el rol. */
function generateMockToken(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const ROLE_OPTIONS: { role: Role; label: string; description: string }[] = [
  { role: "donante", label: "Donante", description: "Reservar turno y ver mi perfil" },
  { role: "staff", label: "Staff", description: "Agenda y escaneo de turnos" },
  { role: "gerencial", label: "Gerencial", description: "Dashboard de donaciones" },
];

export function LoginFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(getInitialStep);
  const [docType, setDocType] = useState<DocumentType>("dni");
  const [dni, setDni] = useState("");
  const [code, setCode] = useState("");
  const [mockCode, setMockCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);
  const { toasts, showToast } = useToasts();

  useEffect(() => {
    if (consumeJustLoggedOut()) showToast("Sesión cerrada.", "success");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToCodeStep() {
    setMockCode(generateMockCode());
    setCode("");
    setError(null);
    setStep("code");
  }

  function isDocumentValid(): boolean {
    const value = dni.trim();
    if (docType === "dni") return /^\d{8}$/.test(value);
    return /^[A-Za-z0-9]{6,12}$/.test(value);
  }

  function handleContinueFromDni() {
    if (!isDocumentValid()) return;
    saveLoginDocument({ type: docType, number: dni.trim() });
    goToCodeStep();
  }

  function handleDocTypeChange(nextType: DocumentType) {
    setDocType(nextType);
    setDni("");
  }

  function handleVerifyCode() {
    if (code.trim().length !== 6) return;
    if (code.trim() !== mockCode) {
      setError("Código incorrecto. Probá con el código de prueba que te mostramos arriba.");
      return;
    }
    setError(null);
    setStep("role");
  }

  // El ingreso rápido con Face ID/huella solo lo activa el flujo de donante,
  // así que sabemos el rol sin pedirlo de nuevo.
  function completeLogin(role: Role) {
    login(role, generateMockToken());
    const home = getRoleHome(role);
    if (!home) {
      setStep("error");
      return;
    }
    if (role === "donante" && isWebAuthnSupported() && !getBiometricCredentialId()) {
      setStep("enable-biometric");
    } else {
      router.replace(home);
    }
  }

  async function handleEnableBiometric() {
    const credentialId = await registerBiometricCredential();
    if (credentialId) saveBiometricCredentialId(credentialId);
    router.replace(getRoleHome("donante")!);
  }

  async function handleVerifyBiometric() {
    const credentialId = getBiometricCredentialId();
    if (!credentialId) {
      setStep("dni");
      return;
    }
    setIsVerifyingBiometric(true);
    setError(null);
    const success = await verifyBiometricCredential(credentialId);
    setIsVerifyingBiometric(false);
    if (success) {
      completeLogin("donante");
    } else {
      setError("No pudimos verificarte con Face ID / huella. Probá de nuevo o usá el código por SMS.");
    }
  }

  if (step === "biometric") {
    return (
      <div className="w-full max-w-sm text-center">
        <ToastStack toasts={toasts} />
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-violet/10 text-2xl text-brand-violet">
          ●
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Ingresá con Face ID o huella</h1>
        <p className="mt-1 text-sm text-zinc-500">Este dispositivo ya tiene el ingreso rápido activado.</p>

        {error && <p className="mt-4 text-sm text-brand-coral">{error}</p>}

        <button
          type="button"
          onClick={handleVerifyBiometric}
          disabled={isVerifyingBiometric}
          className="mt-6 w-full rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {isVerifyingBiometric ? "Verificando..." : "Ingresar con Face ID / huella"}
        </button>

        <button
          type="button"
          onClick={goToCodeStep}
          className="mt-3 w-full text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Enviar código por SMS en su lugar
        </button>
      </div>
    );
  }

  if (step === "enable-biometric") {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-2xl text-brand-green">
          ✓
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">¿Activar ingreso rápido?</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Con Face ID o huella vas a poder entrar sin pedir código la próxima vez, en este mismo dispositivo.
        </p>

        <button
          type="button"
          onClick={handleEnableBiometric}
          className="mt-6 w-full rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white"
        >
          Activar Face ID / huella
        </button>

        <button
          type="button"
          onClick={() => router.replace(getRoleHome("donante")!)}
          className="mt-3 w-full text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Ahora no
        </button>
      </div>
    );
  }

  if (step === "role") {
    return (
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">¿Con qué cuenta ingresás?</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Como es un mockup sin backend, elegí el rol que en producción vendría dentro del JWT.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {ROLE_OPTIONS.map(({ role, label, description }) => (
            <button
              key={role}
              type="button"
              onClick={() => completeLogin(role)}
              className="flex flex-col items-start gap-0.5 rounded-2xl border border-zinc-200 p-4 text-left transition-colors hover:border-brand-violet hover:bg-brand-violet/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
            >
              <span className="font-semibold text-zinc-900">{label}</span>
              <span className="text-sm text-zinc-500">{description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-coral/10 text-2xl text-brand-coral">
          ✕
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">No pudimos ingresarte</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tu cuenta tiene un rol que no reconocemos. Contactá a soporte para que lo revisen.
        </p>

        <button
          type="button"
          onClick={() => setStep("dni")}
          className="mt-6 w-full rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-brand-violet hover:text-brand-violet"
        >
          Volver
        </button>
      </div>
    );
  }

  if (step === "dni") {
    const isDni = docType === "dni";
    return (
      <div className="w-full max-w-sm">
        <ToastStack toasts={toasts} />
        <h1 className="text-2xl font-semibold text-zinc-900">
          Ingresá tu {isDni ? "DNI" : "pasaporte"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Te vamos a enviar un código para confirmar que sos vos.</p>

        <div className="mt-4 flex rounded-full border border-zinc-200 p-0.5 text-sm font-medium">
          <DocTypeButton label="DNI" active={isDni} onClick={() => handleDocTypeChange("dni")} />
          <DocTypeButton
            label="Pasaporte"
            active={!isDni}
            onClick={() => handleDocTypeChange("pasaporte")}
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleContinueFromDni();
          }}
        >
          <input
            type="text"
            inputMode={isDni ? "numeric" : "text"}
            maxLength={isDni ? 8 : 12}
            value={dni}
            onChange={(e) => {
              const raw = e.target.value;
              const sanitized = isDni
                ? raw.replace(/\D/g, "").slice(0, 8)
                : raw.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
              setDni(sanitized);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleContinueFromDni();
              }
            }}
            placeholder={isDni ? "Ej: 34567890" : "Ej: AAA123456"}
            autoFocus
            className="mt-4 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-brand-violet"
          />

          <button
            type="submit"
            disabled={!isDocumentValid()}
            className="mt-4 w-full rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            Continuar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">Te enviamos un código</h1>
      <p className="mt-1 text-sm text-zinc-500">a tu WhatsApp/SMS registrado.</p>

      <div className="mt-4 flex gap-3 rounded-2xl bg-brand-violet/5 p-4">
        <span className="mt-0.5 shrink-0 text-brand-green">●</span>
        <p className="text-sm text-zinc-700">
          Como es un mockup, no enviamos nada real: tu código de prueba es{" "}
          <span className="font-semibold">{mockCode}</span>.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyCode();
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleVerifyCode();
            }
          }}
          placeholder="Código de 6 dígitos"
          autoFocus
          className="mt-6 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-center text-lg tracking-[0.4em] text-zinc-900 outline-none focus:border-brand-violet"
        />

        {error && <p className="mt-2 text-sm text-brand-coral">{error}</p>}

        <button
          type="submit"
          disabled={code.trim().length !== 6}
          className="mt-4 w-full rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Ingresar
        </button>
      </form>

      <button
        type="button"
        onClick={() => setStep(getBiometricCredentialId() ? "biometric" : "dni")}
        className="mt-3 w-full text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
      >
        Volver
      </button>
    </div>
  );
}

function DocTypeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${
        active ? "bg-brand-violet text-white" : "text-zinc-500 hover:text-zinc-800"
      }`}
    >
      {label}
    </button>
  );
}
