import { NutritionSummaryCard } from "@/components/nutrition-summary-card";
import { QuickNutritionForm } from "@/components/forms/quick-log-forms";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function NutritionPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <NutritionSummaryCard {...workspace.nutrition.summary} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Recommendations</div>
          {workspace.nutrition.recommendations.map((tip) => (
            <div key={tip} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {tip}
            </div>
          ))}
          <div className="font-display text-xl font-semibold text-white">Budget-friendly meals</div>
          {workspace.nutrition.budgetMeals.map((meal) => (
            <div key={meal} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {meal}
            </div>
          ))}
        </Card>
        <QuickNutritionForm athleteId={workspace.athlete.user.id} />
      </div>
    </div>
  );
}
