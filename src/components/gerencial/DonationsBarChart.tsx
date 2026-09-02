"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/lib/gerencial/types";

function formatNumber(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString("es-AR") : String(value ?? "");
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

export function DonationsBarChart({
  title,
  points,
  projection = null,
}: {
  title: string;
  points: ChartPoint[];
  projection?: ChartPoint | null;
}) {
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
