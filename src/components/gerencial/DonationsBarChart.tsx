"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/lib/gerencial/types";

function formatNumber(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString("es-AR") : String(value ?? "");
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload?: ChartPoint }> }) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="rounded-md bg-brand-charcoal px-3 py-2 text-xs text-white shadow-lg">
      <span className="text-white/70">{point.label}: </span>
      <span className="font-semibold">{formatNumber(point.count)} donaciones</span>
    </div>
  );
}

export function DonationsBarChart({ title, points }: { title: string; points: ChartPoint[] }) {
  return (
    <div className="h-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        {title}
      </h2>

      <div className="mt-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 20, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
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
            <Tooltip content={ChartTooltip} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="count" fill="url(#donationsBarFill)" radius={[4, 4, 0, 0]} maxBarSize={24}>
              <LabelList dataKey="count" position="top" formatter={formatNumber} style={{ fill: "#52525b", fontSize: 11, fontWeight: 500 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
