import { BookingFlow } from "@/components/donor-booking/BookingFlow";
import { RoleGate } from "@/components/auth/RoleGate";

export const metadata = {
  title: "Reservar turno · Pluvie",
  description: "Reservá tu turno de donación en Pluvie",
};

export default function TurnoPage() {
  return (
    <RoleGate role="donante">
      <div className="flex min-h-full flex-1 bg-zinc-50">
        <BookingFlow />
      </div>
    </RoleGate>
  );
}
