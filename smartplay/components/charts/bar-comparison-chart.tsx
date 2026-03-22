"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function BarComparisonChart({
  data,
  keys,
}: {
  data: Array<Record<string, string | number>>;
  keys: Array<{ key: string; color: string }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              color: "#fff",
            }}
          />
          <Legend />
          {keys.map((entry) => (
            <Bar
              key={entry.key}
              dataKey={entry.key}
              fill={entry.color}
              radius={[10, 10, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
