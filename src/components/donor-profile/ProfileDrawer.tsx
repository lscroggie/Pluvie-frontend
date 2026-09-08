"use client";

import { useState } from "react";
import { BackButton } from "@/components/donor-booking/BackButton";
import { logout } from "@/lib/donor-auth/session";
import { DONOR_BLOOD_TYPE, DONOR_NAME } from "@/lib/donor-profile/data";
import { MyAppointmentSection } from "./MyAppointmentSection";
import { PersonalDataSection } from "./PersonalDataSection";

type DrawerView = "menu" | "mis-datos" | "mis-turnos";

export function ProfileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<DrawerView>("menu");

  const initial = DONOR_NAME.charAt(0).toUpperCase();

  function open() {
    setView("menu");
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Abrir menú de perfil"
        className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-full border-2 border-brand-violet bg-brand-bone shadow-sm transition-transform hover:scale-105 hover:opacity-90 active:scale-95"
      >
        <span className="h-0.5 w-4 rounded-full bg-brand-violet" />
        <span className="h-0.5 w-4 rounded-full bg-brand-violet" />
        <span className="h-0.5 w-4 rounded-full bg-brand-violet" />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-zinc-900/40" onClick={close} />

        <div
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-lg transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-zinc-100 p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-charcoal text-xl font-semibold text-white">
              {initial}
            </span>
            <div>
              <p className="font-semibold text-zinc-900">{DONOR_NAME}</p>
              <span className="mt-0.5 inline-flex items-center rounded-full bg-brand-violet px-2.5 py-0.5 text-xs font-bold text-white">
                {DONOR_BLOOD_TYPE}
              </span>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="ml-auto text-xl text-zinc-400 hover:text-zinc-700"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {view === "menu" ? (
              <nav className="flex flex-col gap-1">
                <DrawerMenuItem label="Mis datos" onClick={() => setView("mis-datos")} />
                <DrawerMenuItem label="Mis turnos" onClick={() => setView("mis-turnos")} />
                <div className="my-2 border-t border-zinc-100" />
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    close();
                  }}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-brand-coral hover:bg-brand-coral/5"
                >
                  Cerrar sesión
                </button>
              </nav>
            ) : (
              <div>
                <div className="mb-4">
                  <BackButton onClick={() => setView("menu")} />
                </div>
                {view === "mis-datos" && <PersonalDataSection />}
                {view === "mis-turnos" && <MyAppointmentSection />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DrawerMenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-50"
    >
      {label}
      <span className="text-zinc-300">→</span>
    </button>
  );
}
