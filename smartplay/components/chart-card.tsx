import { type ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
