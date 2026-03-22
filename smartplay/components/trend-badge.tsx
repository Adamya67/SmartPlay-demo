import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function TrendBadge({ value }: { value: number }) {
  if (value > 0) {
    return (
      <Badge>
        <ArrowUpRight className="mr-1 size-3" />
        {value}%
      </Badge>
    );
  }

  if (value < 0) {
    return (
      <Badge variant="danger">
        <ArrowDownRight className="mr-1 size-3" />
        {Math.abs(value)}%
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      <Minus className="mr-1 size-3" />
      Stable
    </Badge>
  );
}
