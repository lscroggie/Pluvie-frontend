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

export type DaySlotStatus = "closed" | "full" | "low" | "open" | "ineligible";

export type TimeSlot = {
  time: string;
  available: boolean;
  capacity: number;
  freeSpots: number;
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
// "continuous": una franja cada `slotEveryMinutes` a lo largo de la ventana,
// 1 turno por franja (sangre entera).
// "fixed": bloques horarios fijos, cada uno con cupo propio para varios
// donantes en simultáneo (plaquetas/plasma, por aféresis).
export type DonationSchedule =
  | {
      kind: "continuous";
      startMinutes: number; // minutos desde 00:00
      endMinutes: number;
      slotEveryMinutes: number; // separación entre franjas dentro de la ventana
    }
  | {
      kind: "fixed";
      blocks: { time: string; capacity: number }[];
    };
