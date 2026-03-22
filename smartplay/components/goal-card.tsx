import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GoalCard({
  title,
  category,
  progress,
  unit,
  currentValue,
  targetValue,
}: {
  title: string;
  category: string;
  progress: number;
  unit: string;
  currentValue: number;
  targetValue: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <Badge variant="secondary">{category}</Badge>
          <CardTitle className="mt-3">{title}</CardTitle>
          <CardDescription className="mt-1">
            {currentValue} / {targetValue} {unit}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
}
