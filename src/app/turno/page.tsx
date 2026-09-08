import { BookingFlow } from "@/components/donor-booking/BookingFlow";
import { AuthGate } from "@/components/donor-auth/AuthGate";

export const metadata = {
  title: "Reservar turno · Pluvie",
  description: "Reservá tu turno de donación en Pluvie",
};

export default function TurnoPage() {
  return (
    <AuthGate>
      <div className="flex min-h-full flex-1 bg-zinc-50">
        <BookingFlow />
      </div>
    </AuthGate>
  );
}
