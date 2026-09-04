import type {
  Center,
  CenterResult,
  DaySlots,
  DaySlotStatus,
  DonationSchedule,
  Locality,
} from "./types";
import type { DonationTypeId } from "./types";
import type { Appointment } from "./appointments";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distancia entre dos coordenadas fijas (carga de la clínica), no geolocalización del donante. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.min(1, Math.sqrt(h)));
  return EARTH_RADIUS_KM * c;
}

/**
 * Centros de la institución del donante (Pluvie se vende institución por
 * institución: nunca se listan centros de otras instituciones). Si se
 * conoce la localidad del donante, se ordenan por cercanía real
 * (coordenadas fijas de cada centro) — sin necesidad de que el donante
 * busque ni escriba nada.
 */
export function getInstitutionCenters(
  centers: Center[],
  institutionCenterIds: string[],
  donorLocality?: Locality,
): CenterResult[] {
  const institutionCenters = centers.filter((c) => institutionCenterIds.includes(c.id));

  if (!donorLocality) {
    return institutionCenters.map((center) => ({ center, distanceKm: 0, isHome: false }));
  }

  return institutionCenters
    .map((center) => ({
      center,
      distanceKm: haversineKm(donorLocality, center),
      isHome: center.localityId === donorLocality.id,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

function hashStr(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Configuración real de franjas del hospital piloto, por tipo de donación.
// Plasma no tiene rango horario confirmado todavía: se deja con el mismo
// criterio de plaquetas (ventana acotada, cupo diario bajo) como valor
// provisorio.
// TODO: confirmar con el hospital piloto el rango horario exacto de plasma.
export const DONATION_SCHEDULES: Record<DonationTypeId, DonationSchedule> = {
  "sangre-entera": { startMinutes: 8 * 60, endMinutes: 13 * 60 + 30, slotEveryMinutes: 5 },
  plaquetas: {
    startMinutes: 8 * 60,
    endMinutes: 11 * 60,
    slotEveryMinutes: 5,
    minDailyCap: 2,
    maxDailyCap: 4,
  },
  plasma: {
    startMinutes: 8 * 60,
    endMinutes: 11 * 60,
    slotEveryMinutes: 5,
    minDailyCap: 2,
    maxDailyCap: 4,
  },
};

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Franjas horarias del día para un tipo de donación. Sangre entera admite
 * una franja cada 5 minutos en toda la ventana (hasta 1 turno por franja).
 * Plaquetas y plasma tienen un tope diario bajo (aféresis): el total de
 * franjas de ESE día (`dailyCount`) varía entre `minDailyCap` y
 * `maxDailyCap` y se distribuye a lo largo de la ventana — también 1 turno
 * por franja.
 */
function buildTimeSlots(schedule: DonationSchedule, dailyCount?: number): string[] {
  const { startMinutes, endMinutes, slotEveryMinutes } = schedule;

  if (!dailyCount) {
    const times: string[] = [];
    for (let m = startMinutes; m <= endMinutes; m += slotEveryMinutes) {
      times.push(minutesToTime(m));
    }
    return times;
  }

  const span = endMinutes - startMinutes;
  const step = dailyCount > 1 ? span / (dailyCount - 1) : 0;
  const times: string[] = [];
  for (let i = 0; i < dailyCount; i++) {
    const raw = startMinutes + i * step;
    const rounded = Math.round(raw / slotEveryMinutes) * slotEveryMinutes;
    times.push(minutesToTime(rounded));
  }
  return times;
}

/** Cuántos turnos totales tiene ESE día, para tipos con tope diario variable. */
function resolveDailyCount(schedule: DonationSchedule, seedKey: string): number | undefined {
  if (!schedule.minDailyCap || !schedule.maxDailyCap) return undefined;
  const rng = mulberry32(hashStr(`${seedKey}|dailyCount`));
  const span = schedule.maxDailyCap - schedule.minDailyCap;
  return schedule.minDailyCap + Math.floor(rng() * (span + 1));
}

const LOW_AVAILABILITY_THRESHOLD = 3;

function dateStrOf(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Disponibilidad simulada, determinística por centro + fecha (mock, no backend real). */
export function getDaySlots(
  center: Center,
  date: Date,
  donationTypeId: DonationTypeId,
  activeAppointment?: Appointment | null,
): DaySlots {
  const dateStr = dateStrOf(date);
  const isSunday = date.getDay() === 0;

  if (isSunday) {
    return { date, dateStr, status: "closed", freeCount: 0, totalCount: 0, times: [] };
  }

  const schedule = DONATION_SCHEDULES[donationTypeId];
  const seedKey = `${center.id}|${dateStr}|${donationTypeId}`;
  const dailyCount = resolveDailyCount(schedule, seedKey);
  const timeSlots = buildTimeSlots(schedule, dailyCount);

  const rng = mulberry32(hashStr(seedKey));
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  // Variamos la probabilidad de disponibilidad para mostrar una mezcla de
  // días llenos, con poca disponibilidad y con cupos normales.
  const bucket = dayIndex % 4;
  const availableProbability = bucket === 0 ? 0.15 : bucket === 1 ? 0.35 : 0.75;

  const takenByActiveAppointment =
    activeAppointment &&
    activeAppointment.centerId === center.id &&
    activeAppointment.dateStr === dateStr &&
    activeAppointment.donationTypeId === donationTypeId
      ? activeAppointment.time
      : null;

  const times = timeSlots.map((time) => ({
    time,
    available: time !== takenByActiveAppointment && rng() < availableProbability,
  }));
  const freeCount = times.filter((t) => t.available).length;
  const totalCount = times.length;

  let status: DaySlotStatus = "open";
  if (freeCount === 0) status = "full";
  else if (freeCount <= LOW_AVAILABILITY_THRESHOLD) status = "low";

  return { date, dateStr, status, freeCount, totalCount, times };
}

export function getUpcomingDays(count: number, startDate = new Date()): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}
