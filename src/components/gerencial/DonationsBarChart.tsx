"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartAnnotation, ChartPoint } from "@/lib/gerencial/types";

function formatNumber(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString("es-AR") : String(value ?? "");
}

// Tick de eje X con marcador de anotación opcional (ícono + tooltip nativo
// via <title>, sin JS extra). Solo dibuja el marcador cuando el label del
// punto coincide con una anotación.
function AnnotatedTick({
  x,
  y,
  payload,
  annotations,
}: {
  x: number | string;
  y: number | string;
  payload: { value: string };
  annotations: ChartAnnotation[];
}) {
  const annotation = annotations.find((item) => item.pointLabel === payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="#71717a" fontSize={12}>
        {payload.value}
      </text>
      {annotation && (
        <g transform="translate(0,20)" style={{ cursor: "help" }}>
          <title>{annotation.label}</title>
          <circle r={3.5} fill="#6C5CE7" />
        </g>
      )}
    </g>
  );
}

type ChartDatum = { label: string; actual: number | null; projected: number | null };

function buildChartData(points: ChartPoint[], projection: ChartPoint | null): ChartDatum[] {
  const data: ChartDatum[] = points.map((point) => ({
    label: point.label,
    actual: point.count,
    projected: null,
  }));

  if (projection) {
    data.push({ label: projection.label, actual: null, projected: projection.count });
  }

  return data;
}

// Igual a buildChartData, pero además replica el último punto real en la
// serie "projected" para que el tramo punteado (variant="line") arranque
// pegado al último punto real en vez de quedar flotando — es solo un ajuste
// de cómo se dibuja el segmento, no toca el valor de la proyección.
function buildLineChartData(points: ChartPoint[], projection: ChartPoint | null): ChartDatum[] {
  const data = buildChartData(points, projection);
  if (projection && data.length >= 2) {
    data[data.length - 2] = { ...data[data.length - 2], projected: data[data.length - 2].actual };
  }
  return data;
}

function ActualDot({ cx, cy, payload }: { cx?: number; cy?: number; payload: ChartDatum }) {
  if (payload.actual == null || cx == null || cy == null) return null;
  return <circle cx={cx} cy={cy} r={4} fill="#5A4BD1" stroke="#ffffff" strokeWidth={1.5} />;
}

function makeProjectedDot(projectionLabel: string | undefined) {
  return function ProjectedDot({ cx, cy, payload }: { cx?: number; cy?: number; payload: ChartDatum }) {
    if (payload.label !== projectionLabel || cx == null || cy == null) return null;
    return <circle cx={cx} cy={cy} r={4} fill="#8D7FF5" stroke="#ffffff" strokeWidth={1.5} />;
  };
}

function LineTooltip({
  active,
  payload,
  label,
  metricLabel,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number | null }[];
  label?: string;
  metricLabel: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload.find((item) => item.value != null);
  if (!point) return null;

  return (
    <div className="rounded-lg border border-zinc-100 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="text-sm font-semibold text-brand-charcoal">
        {metricLabel}: {formatNumber(point.value)}
      </p>
    </div>
  );
}

export function DonationsBarChart({
  title,
  points,
  projection = null,
  annotations = [],
  variant = "bar",
  metricLabel = "Donaciones",
}: {
  title: string;
  points: ChartPoint[];
  projection?: ChartPoint | null;
  // Marcadores opcionales sobre puntos del eje X (ver ChartAnnotation) — hoy
  // solo se pasan datos de ejemplo desde la tendencia principal, ver
  // SAMPLE_CHART_ANNOTATIONS en data.ts.
  annotations?: ChartAnnotation[];
  // "bar" (default) mantiene el gráfico de barras tal cual — lo sigue usando
  // el desglose semanal dentro de cada alerta expandida (AlertsSection).
  // "line" es el estilo de línea + área que usa la tendencia principal.
  variant?: "bar" | "line";
  // Nombre de la métrica mostrado en el tooltip de variant="line" (ej.
  // "Donaciones: 97").
  metricLabel?: string;
}) {
  const xAxisHeight = annotations.length > 0 ? 34 : undefined;
  const xAxisDy = annotations.length > 0 ? 0 : 8;

  if (variant === "line") {
    const data = buildLineChartData(points, projection);

    return (
      <div className="h-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
            {title}
          </h2>
          {projection && <span className="text-xs text-zinc-400">Incluye estimación del próximo período</span>}
        </div>

        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="donationsAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid horizontal vertical={false} stroke="#f4f4f5" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={annotations.length > 0 ? (props) => <AnnotatedTick {...props} annotations={annotations} /> : { fill: "#71717a", fontSize: 12 }}
                height={xAxisHeight}
                dy={xAxisDy}
              />
              <YAxis
                type="number"
                domain={[0, (dataMax: number) => Math.ceil((dataMax + 1) / 30) * 30]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickFormatter={formatNumber}
                width={40}
                allowDecimals={false}
              />
              <Tooltip
                content={<LineTooltip metricLabel={metricLabel} />}
                cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
                allowEscapeViewBox={{ x: false, y: true }}
              />
              {/* El relleno va sin trazo propio (stroke="none") — si el Area
                  tuviera stroke, dibujaría el contorno de todo el polígono
                  (bordes verticales + base), no solo la curva de arriba, lo
                  que se ve como un recuadro y como un salto vertical en la
                  transición al tramo punteado. La curva visible la dibuja el
                  <Line> de abajo, superpuesto. */}
              <Area type="monotone" dataKey="actual" stroke="none" fill="url(#donationsAreaFill)" />
              {projection && (
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="none"
                  fill="url(#donationsAreaFill)"
                  fillOpacity={0.6}
                />
              )}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#6C5CE7"
                strokeWidth={2}
                dot={ActualDot}
                activeDot={{ r: 5, fill: "#5A4BD1", stroke: "#ffffff", strokeWidth: 2 }}
              />
              {projection && (
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#6C5CE7"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={makeProjectedDot(projection.label)}
                  activeDot={{ r: 5, fill: "#8D7FF5", stroke: "#ffffff", strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  const data = buildChartData(points, projection);

  return (
    <div className="h-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          {title}
        </h2>
        {projection && <span className="text-xs text-zinc-400">Incluye estimación del próximo período</span>}
      </div>

      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
            <defs>
              <linearGradient id="donationsBarFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8D7FF5" />
                <stop offset="100%" stopColor="#6C5CE7" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f4f4f5" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={annotations.length > 0 ? (props) => <AnnotatedTick {...props} annotations={annotations} /> : { fill: "#71717a", fontSize: 12 }}
              height={xAxisHeight}
              dy={xAxisDy}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              tickFormatter={formatNumber}
              width={40}
              allowDecimals={false}
            />
            <Bar dataKey="actual" fill="url(#donationsBarFill)" radius={[4, 4, 0, 0]} maxBarSize={24}>
              <LabelList
                dataKey="actual"
                position="top"
                formatter={formatNumber}
                style={{ fill: "#52525b", fontSize: 11, fontWeight: 500, paintOrder: "stroke" }}
                stroke="#ffffff"
                strokeWidth={4}
              />
            </Bar>
            {projection && (
              <Bar
                dataKey="projected"
                fill="#6C5CE7"
                fillOpacity={0.35}
                stroke="#6C5CE7"
                strokeOpacity={0.6}
                strokeDasharray="4 3"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              >
                <LabelList
                  dataKey="projected"
                  position="top"
                  formatter={formatNumber}
                  style={{ fill: "#6C5CE7", fontSize: 11, fontWeight: 500, paintOrder: "stroke" }}
                  stroke="#ffffff"
                  strokeWidth={4}
                />
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
