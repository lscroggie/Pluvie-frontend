import { BookingHeader } from "@/components/donor-booking/BookingHeader";
import { LoginFlow } from "@/components/donor-auth/LoginFlow";

export const metadata = {
  title: "Ingresar · Pluvie",
  description: "Ingresá con tu DNI a Pluvie",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <BookingHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-12">
        <LoginFlow />
      </main>
    </div>
  );
}
