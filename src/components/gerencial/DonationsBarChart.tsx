"use client";

import { Bar, CartesianGrid, ComposedChart, LabelList, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/lib/gerencial/types";

function formatNumber(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString("es-AR") : String(value ?? "");
}

type ChartDatum = { label: string; actual: number | null; projected: number | null; trend: number | null };

function buildChartData(points: ChartPoint[], trend: ChartPoint[], projection: ChartPoint | null): ChartDatum[] {
  const data: ChartDatum[] = points.map((point, index) => ({
    label: point.label,
    actual: point.count,
    projected: null,
    trend: trend[index]?.count ?? null,
  }));

  if (projection) {
    data.push({ label: projection.label, actual: null, projected: projection.count, trend: projection.count });
  }

  return data;
}

export function DonationsBarChart({
  title,
  points,
  trend = [],
  projection = null,
}: {
  title: string;
  points: ChartPoint[];
  trend?: ChartPoint[];
  projection?: ChartPoint | null;
}) {
  const data = buildChartData(points, trend, projection);

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
          <ComposedChart data={data} margin={{ top: 20, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
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
              tick={{ fill: "#71717a", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              tickFormatter={formatNumber}
              width={40}
              allowDecimals={false}
            />
            {/* La línea se declara antes que las barras para que quede dibujada
                debajo: las barras y sus etiquetas numéricas siempre ganan el
                z-order en SVG y quedan completamente legibles. */}
            {trend.length > 0 && (
              <Line
                dataKey="trend"
                stroke="#5A4BD1"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
