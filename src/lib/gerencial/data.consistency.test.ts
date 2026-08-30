import { describe, expect, it } from "vitest";
import { getDashboardViewModel, monthlyData } from "./data";
import type { DashboardViewModel } from "./types";

// Estos tests protegen la garantía de que los totales de "año" e "histórico"
// SIEMPRE se derivan sumando monthlyData, y nunca son números hardcodeados
// que puedan desincronizarse del detalle mensual real.

function sumDonationTypeTotal(vm: DashboardViewModel): number {
  return vm.donationTypeBreakdown.reduce((sum, item) => sum + item.count, 0);
}

describe("consistencia matemática de los datos mock gerenciales", () => {
  const year = Number(monthlyData[0].monthKey.slice(0, 4));
  const monthVMs = monthlyData.map((month) => getDashboardViewModel({ kind: "month", monthKey: month.monthKey }));
  const yearVM = getDashboardViewModel({ kind: "year", year });
  const historicVM = getDashboardViewModel({ kind: "historic" });

  it("cada mes: otorgados = ausentismo + no elegible + donación efectiva", () => {
    for (const month of monthlyData) {
      expect(month.absenteeismCount + month.notEligibleCount + month.donationsCount).toBe(month.scheduledAppointments);
    }
  });

  it("vista Año = suma de los meses de ese año", () => {
    expect(yearVM.kpis.donationsThisMonth.value).toBe(monthVMs.reduce((s, vm) => s + vm.kpis.donationsThisMonth.value, 0));
    expect(yearVM.kpis.peopleHelped.value).toBe(monthVMs.reduce((s, vm) => s + vm.kpis.peopleHelped.value, 0));
    expect(yearVM.kpis.scheduledAppointments.value).toBe(monthVMs.reduce((s, vm) => s + vm.kpis.scheduledAppointments.value, 0));
    expect(sumDonationTypeTotal(yearVM)).toBe(monthVMs.reduce((s, vm) => s + sumDonationTypeTotal(vm), 0));
    expect(yearVM.attendance.grantedAppointments).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.grantedAppointments, 0));
    expect(yearVM.attendance.absenteeismCount).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.absenteeismCount, 0));
    expect(yearVM.attendance.notEligibleCount).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.notEligibleCount, 0));
    expect(yearVM.attendance.effectiveDonations).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.effectiveDonations, 0));
  });

  it("vista Histórico = suma de todos los años disponibles", () => {
    // Hoy monthlyData solo cubre un año (year), así que la suma de "todos los
    // años disponibles" coincide exactamente con la vista Año de ese único
    // año. Si en el futuro se agrega otro año a monthlyData, este test sigue
    // siendo válido: seguirá comparando Histórico contra la suma real de
    // monthVMs (que entonces cubrirá más de un año).
    expect(historicVM.kpis.donationsThisMonth.value).toBe(monthVMs.reduce((s, vm) => s + vm.kpis.donationsThisMonth.value, 0));
    expect(historicVM.kpis.peopleHelped.value).toBe(monthVMs.reduce((s, vm) => s + vm.kpis.peopleHelped.value, 0));
    expect(historicVM.kpis.scheduledAppointments.value).toBe(monthVMs.reduce((s, vm) => s + vm.kpis.scheduledAppointments.value, 0));
    expect(sumDonationTypeTotal(historicVM)).toBe(monthVMs.reduce((s, vm) => s + sumDonationTypeTotal(vm), 0));
    expect(historicVM.attendance.grantedAppointments).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.grantedAppointments, 0));
    expect(historicVM.attendance.absenteeismCount).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.absenteeismCount, 0));
    expect(historicVM.attendance.notEligibleCount).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.notEligibleCount, 0));
    expect(historicVM.attendance.effectiveDonations).toBe(monthVMs.reduce((s, vm) => s + vm.attendance.effectiveDonations, 0));
  });
});
