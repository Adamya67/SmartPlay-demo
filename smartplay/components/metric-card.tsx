import { ArrowRight } from "lucide-react";

import { TrendBadge } from "@/components/trend-badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  change,
  subtitle,
}: {
  label: string;
  value: string | number;
  change: number;
  subtitle?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
        </div>
        <TrendBadge value={change} />
      </CardHeader>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{subtitle ?? "Compared with the previous period"}</span>
        <ArrowRight className="size-4" />
      </div>
    </Card>
  );
}
