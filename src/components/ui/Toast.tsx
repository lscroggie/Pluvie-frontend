"use client";

import { useCallback, useState } from "react";

export type ToastVariant = "success" | "security";

export type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

const TOAST_DURATION_MS = 4000;

// Los avisos de seguridad ("security") llevan fecha/hora que la persona
// puede querer volver a leer: no se cierran solos, requieren cierre manual.
const AUTO_DISMISS_VARIANTS: ToastVariant[] = ["success"];

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: "border-brand-green/30 bg-brand-green/10 text-brand-green",
  security: "border-brand-amber/30 bg-brand-amber/10 text-brand-amber",
};

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: "✓",
  security: "●",
};

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message, variant }]);
      if (AUTO_DISMISS_VARIANTS.includes(variant)) {
        window.setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
      }
    },
    [dismissToast],
  );

  return { toasts, showToast, dismissToast };
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss?: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${VARIANT_CLASSES[toast.variant]}`}
        >
          <span aria-hidden>{VARIANT_ICON[toast.variant]}</span>
          <span className="flex-1">{toast.message}</span>
          {!AUTO_DISMISS_VARIANTS.includes(toast.variant) && onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Cerrar aviso"
              className="shrink-0 text-base leading-none opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
