import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DashboardViewModel } from "./types";

function fileSlug(periodLabel: string): string {
  return periodLabel
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function deltaText(delta: DashboardViewModel["kpis"]["donationsThisMonth"]["delta"]): string {
  if (!delta) return "Sin período anterior";
  const arrow = delta.direction === "up" ? "+" : "-";
  return `${arrow}${delta.text} vs. período anterior`;
}

function totalDonations(viewModel: DashboardViewModel): number {
  return viewModel.donationTypeBreakdown.reduce((sum, item) => sum + item.count, 0);
}

export function exportToExcel(viewModel: DashboardViewModel, institutionName: string): void {
  const total = totalDonations(viewModel);
  const rows: (string | number)[][] = [
    ["Pluvie · Reporte gerencial"],
    [institutionName],
    [`Período: ${viewModel.periodLabel}`],
    [],
    ["KPIs"],
    ["Indicador", "Valor", "Variación"],
    ["Donaciones totales", viewModel.kpis.donationsThisMonth.value, deltaText(viewModel.kpis.donationsThisMonth.delta)],
    ["Personas ayudadas (impacto 3x)", viewModel.kpis.peopleHelped.value, deltaText(viewModel.kpis.peopleHelped.delta)],
    ["Turnos programados", viewModel.kpis.scheduledAppointments.value, deltaText(viewModel.kpis.scheduledAppointments.delta)],
    ["Tasa de asistencia", `${viewModel.kpis.attendanceRate.value}%`, deltaText(viewModel.kpis.attendanceRate.delta)],
    [],
    ["Desglose por tipo de donación"],
    ["Tipo", "Cantidad", "Porcentaje"],
    ...viewModel.donationTypeBreakdown.map((item) => [
      item.label,
      item.count,
      total === 0 ? "0%" : `${Math.round((item.count / total) * 100)}%`,
    ]),
    [],
    ["Turnos y asistencia"],
    ["Indicador", "Valor"],
    ["Turnos otorgados", viewModel.attendance.grantedAppointments],
    ["Turnos efectivamente donados", viewModel.attendance.completedDonations],
    ["% de ausentismo", `${Math.round(viewModel.attendance.absenteeismRate * 100)}%`],
  ];

  const sheet = utils.aoa_to_sheet(rows);
  sheet["!cols"] = [{ wch: 32 }, { wch: 18 }, { wch: 26 }];

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet, "Reporte");
  writeFile(workbook, `reporte-pluvie-${fileSlug(viewModel.periodLabel)}.xlsx`);
}

export function exportToPdf(viewModel: DashboardViewModel, institutionName: string): void {
  const total = totalDonations(viewModel);
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Pluvie", 14, 18);
  doc.setFontSize(12);
  doc.text("Reporte gerencial", 14, 26);
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`${institutionName} · Período: ${viewModel.periodLabel}`, 14, 33);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 40,
    head: [["Indicador", "Valor", "Variación"]],
    body: [
      ["Donaciones totales", String(viewModel.kpis.donationsThisMonth.value), deltaText(viewModel.kpis.donationsThisMonth.delta)],
      ["Personas ayudadas (impacto 3x)", viewModel.kpis.peopleHelped.value.toLocaleString("es-AR"), deltaText(viewModel.kpis.peopleHelped.delta)],
      ["Turnos programados", String(viewModel.kpis.scheduledAppointments.value), deltaText(viewModel.kpis.scheduledAppointments.delta)],
      ["Tasa de asistencia", `${viewModel.kpis.attendanceRate.value}%`, deltaText(viewModel.kpis.attendanceRate.delta)],
    ],
  });

  const afterKpis = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  autoTable(doc, {
    startY: afterKpis + 10,
    head: [["Tipo de donación", "Cantidad", "Porcentaje"]],
    body: viewModel.donationTypeBreakdown.map((item) => [
      item.label,
      String(item.count),
      total === 0 ? "0%" : `${Math.round((item.count / total) * 100)}%`,
    ]),
  });

  const afterBreakdown = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  autoTable(doc, {
    startY: afterBreakdown + 10,
    head: [["Turnos y asistencia", "Valor"]],
    body: [
      ["Turnos otorgados", String(viewModel.attendance.grantedAppointments)],
      ["Turnos efectivamente donados", String(viewModel.attendance.completedDonations)],
      ["% de ausentismo", `${Math.round(viewModel.attendance.absenteeismRate * 100)}%`],
    ],
  });

  doc.save(`reporte-pluvie-${fileSlug(viewModel.periodLabel)}.pdf`);
}
