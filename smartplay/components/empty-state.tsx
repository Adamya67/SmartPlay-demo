import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <Card className="text-center">
      <CardTitle>{title}</CardTitle>
      <CardDescription className="mx-auto mt-2 max-w-lg">
        {description}
      </CardDescription>
      {href && action ? (
        <div className="mt-5">
          <Button asChild>
            <Link href={href}>{action}</Link>
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
