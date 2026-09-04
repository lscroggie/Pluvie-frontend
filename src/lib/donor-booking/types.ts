export type DonationTypeId = "sangre-entera" | "plaquetas" | "plasma";

export type DonationType = {
  id: DonationTypeId;
  name: string;
  description: string;
  durationLabel: string;
};

export type Locality = {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
};

export type Center = {
  id: string;
  name: string;
  localityId: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
};

export type CenterResult = {
  center: Center;
  distanceKm: number;
  isHome: boolean;
};

export type DaySlotStatus = "closed" | "full" | "low" | "open";

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type DaySlots = {
  date: Date;
  dateStr: string;
  status: DaySlotStatus;
  freeCount: number;
  totalCount: number;
  times: TimeSlot[];
};

// Franjas horarias reales del hospital piloto, por tipo de donación.
export type DonationSchedule = {
  startMinutes: number; // minutos desde 00:00
  endMinutes: number;
  slotEveryMinutes: number; // separación entre franjas dentro de la ventana
  dailyCap?: number; // tope de turnos/día en total (aféresis); sin tope = 1 por franja
};
