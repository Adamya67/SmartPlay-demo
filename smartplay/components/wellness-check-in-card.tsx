import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WellnessCheckInCard({
  readiness,
  summary,
}: {
  readiness: number;
  summary: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Today&apos;s readiness</CardDescription>
        <CardTitle className="text-4xl">{readiness}</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
    </Card>
  );
}
