"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function LineTrendChart({
  data,
  lines,
}: {
  data: Array<Record<string, string | number>>;
  lines: Array<{ key: string; color: string }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ stroke: "rgba(181,255,93,0.2)" }}
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              color: "#fff",
            }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={3}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
