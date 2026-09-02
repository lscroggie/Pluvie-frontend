// Navegación interna desde una alerta a la sección del dashboard donde vive
// ese dato — solo hace scroll (y, si hace falta, cambia el período a
// Histórico), nunca dispara ningún envío ni preselecciona nada fuera de esta
// misma pantalla. No cubre "low-slot-availability-*": esa alerta apuntaría a
// configuración de turnos, que hoy es un placeholder sin contenido real.
export type AlertNavigationTarget = {
  anchorId: string;
  label: string;
  requiresHistoricPeriod?: boolean;
};

export function getAlertNavigationTarget(alertId: string): AlertNavigationTarget | null {
  if (alertId === "absenteeism-spike") {
    return { anchorId: "attendance-section", label: "Ver turnos: desglose de estados" };
  }

  if (alertId.startsWith("donation-drop-")) {
    return { anchorId: "kpi-donations-card", label: "Ver desglose de donaciones por tipo" };
  }

  if (alertId.startsWith("donor-level-drop-")) {
    return { anchorId: "donor-levels-section", label: "Ver donantes por nivel", requiresHistoricPeriod: true };
  }

  return null;
}
