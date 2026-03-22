"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export function RadarPerformanceChart({
  data,
}: {
  data: Array<{ metric: string; current: number; target: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.18)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <Radar
            dataKey="current"
            stroke="#b5ff5d"
            fill="#b5ff5d"
            fillOpacity={0.4}
          />
          <Radar
            dataKey="target"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.12}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
