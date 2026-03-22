import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NutritionSummaryCard({
  calories,
  protein,
  carbs,
  fats,
}: {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Nutrition Summary</CardTitle>
        <CardDescription>Average over recent logs.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Calories</div>
          <div className="mt-2 text-2xl font-semibold text-white">{calories}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Protein</div>
          <div className="mt-2 text-2xl font-semibold text-white">{protein}g</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Carbs</div>
          <div className="mt-2 text-2xl font-semibold text-white">{carbs}g</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Fats</div>
          <div className="mt-2 text-2xl font-semibold text-white">{fats}g</div>
        </div>
      </div>
    </Card>
  );
}
