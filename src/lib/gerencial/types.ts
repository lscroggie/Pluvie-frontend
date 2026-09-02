import type { DonationTypeId } from "@/lib/donor-booking/types";

export type ChartPoint = {
  label: string;
  count: number;
};

export type DonationTypeBreakdownItem = {
  id: DonationTypeId;
  label: string;
  count: number;
};

export type BrandAccent = "violet" | "green" | "coral";

// Los 3 estados reales de un turno otorgado (mutuamente excluyentes):
// ausentismo (no vino), asistió pero no pudo donar (motivo clínico evaluado
// por el staff), y donación efectiva (único estado que dispara impacto 3x
// y nivel Donate).
export type AttendanceBreakdown = {
  grantedAppointments: number;
  absenteeismCount: number;
  notEligibleCount: number;
  effectiveDonations: number;
};

// Motivo registrado por el staff para "asistió pero no pudo donar". Pluvie
// solo lo agrega y visibiliza, no diagnostica.
export type NotEligibleReason = {
  label: string;
  count: number;
};

export type MonthlyGerencialData = {
  monthKey: string; // "2026-08"
  monthLabel: string; // "Agosto 2026"
  donationsCount: number; // donación efectiva
  scheduledAppointments: number;
  absenteeismCount: number;
  notEligibleCount: number;
  // PENDIENTE (integración con backend real): weeklyDonations asume siempre
  // un mes ya cerrado, repartiendo donationsCount entre 4 semanas con pesos
  // fijos (ver splitIntoWeeks en data.ts). Si el mes actual llega del backend
  // como un total parcial (mes todavía en curso), ese reparto le atribuiría
  // datos a semanas que no ocurrieron todavía, y la media móvil / proyección
  // de tendencia se calcularían sobre esa distribución inventada — mismo
  // espíritu del problema que ya evitamos en la vista de año, pero acá
  // ninguna semana da 0 explícito, así que es más difícil de notar. Antes de
  // conectar datos reales, agregar algo como `elapsedWeeks: number` acá (o el
  // nombre que se prefiera) para que weeklyDonations/movingAverage/
  // linearRegressionProjection solo usen semanas realmente transcurridas del
  // mes en curso. No se implementa todavía porque no hay forma honesta de
  // mockear "semanas transcurridas" sin inventar un dato que no existe hoy.
  weeklyDonations: ChartPoint[];
  donationTypeCounts: Record<DonationTypeId, number>;
  // Segmentación simple de los donantes detrás de donationsCount. Mock: no
  // existe hoy un modelo de donante individual con historial, así que se
  // estima como proporción fija del total en vez de derivarse de datos reales
  // por donante.
  newDonorsCount: number;
  recurringDonorsCount: number;
};

export type Period = { kind: "month"; monthKey: string } | { kind: "year"; year: number } | { kind: "historic" };

export type PeriodOption = {
  value: string;
  label: string;
};

export type KpiDelta = {
  direction: "up" | "down" | "neutral";
  text: string; // "12%" or "3 puntos", without arrow or "vs ..." suffix
};

export type KpiValue = {
  value: number;
  delta?: KpiDelta;
};

export type Alert = {
  id: string;
  message: string;
  shortLabel: string; // versión corta en minúscula, para insertar en el resumen ejecutivo (ej. "ausentismo")
  detailTitle: string; // título del desglose al expandir la alerta (ej. "Ausentismo por semana — Julio 2026")
  // Puntos del gráfico de desglose al expandir. Según el tipo de alerta puede
  // ser semanal (ausentismo, caída de donaciones), mensual (tendencia de
  // nivel de donantes) o una comparación puntual (turnos reservados vs.
  // capacidad) — siempre son datos reales ya calculados, nunca proyectados.
  breakdown: ChartPoint[];
};

// Sugerencia accionable derivada de una regla simple sobre datos ya
// existentes (ej. baja disponibilidad de turnos de un tipo). No es una
// predicción ni sale de un modelo: es texto honesto sobre lo que ya sabemos.
export type Suggestion = {
  id: string;
  message: string;
};

export type BloodType = "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";

export type DonorLevelId = "bronce" | "plata" | "oro" | "diamante";

export type DonorLevelBreakdownItem = {
  id: DonorLevelId;
  label: string;
  count: number;
};

// Donantes nuevos (primera donación efectiva dentro del período) vs.
// recurrentes (ya habían donado antes del período seleccionado).
export type DonorSegmentation = {
  newDonors: number;
  recurringDonors: number;
};

// Retención simple por cohorte: de los donantes que donaron por primera vez
// en monthLabel, qué proporción volvió a donar dentro de los siguientes 3
// meses. Solo se calcula para meses que ya tienen 3 meses posteriores
// completos en los datos.
export type RetentionCohort = {
  monthKey: string;
  monthLabel: string;
  firstTimeDonors: number;
  returnedWithin3Months: number;
  returnRatePct: number;
};

// Versión simple del impacto 3x ya usado en el KPI "Personas ayudadas",
// sin ponerle valor monetario.
export type SocialImpact = {
  litersOfBlood: number;
  livesHelped: number;
};

export type BloodTypeBreakdownItem = {
  bloodType: BloodType;
  count: number;
};

// Detalle de "Donantes nuevos" del período: sub-estado (ya donó por primera
// vez vs. se registró pero todavía no donó) y por tipo de sangre. Mock: no
// existe hoy un modelo de donante individual con estado de registro, así que
// pendingCount se estima como proporción del grupo ya activado, y la
// distribución por tipo de sangre reutiliza las proporciones institucionales
// de bloodTypeDonorCounts en vez de derivarse del grupo real.
export type NewDonorDetail = {
  activatedCount: number;
  pendingCount: number;
  byBloodType: BloodTypeBreakdownItem[];
};

export type DashboardViewModel = {
  periodLabel: string;
  // Nombre del período contra el que se compara, listo para insertar en una
  // frase (ej. "julio"). undefined cuando no hay comparación válida.
  previousPeriodLabel?: string;
  kpis: {
    donationsThisMonth: KpiValue;
    peopleHelped: KpiValue;
    scheduledAppointments: KpiValue;
    attendanceRate: KpiValue;
  };
  // Igual a donationTypeBreakdown, multiplicado por PEOPLE_HELPED_PER_DONATION.
  // Sirve para explicar de dónde sale el KPI "Personas ayudadas".
  peopleHelpedBreakdown: DonationTypeBreakdownItem[];
  chart: {
    title: string;
    points: ChartPoint[];
    // Estimación del próximo período por regresión lineal simple sobre los
    // últimos períodos reales. null cuando no corresponde proyectar (ej. la
    // vista de año, que ya rellena meses futuros con 0 y rompería el cálculo).
    projection: ChartPoint | null;
  };
  donationTypeBreakdown: DonationTypeBreakdownItem[];
  attendance: AttendanceBreakdown;
  notEligibleReasons: NotEligibleReason[];
  donorSegmentation: DonorSegmentation;
  newDonorDetail: NewDonorDetail;
  // Distribución por nivel Donate del grupo de donantes recurrentes del
  // período. Mock: el nivel es histórico/de por vida (no hay un desglose
  // real por período), así que se estima aplicando las proporciones
  // institucionales de donorLevelCounts sobre donorSegmentation.recurringDonors.
  recurringDonorLevelBreakdown: DonorLevelBreakdownItem[];
  impact: SocialImpact;
  alerts: Alert[];
  suggestions: Suggestion[];
};
