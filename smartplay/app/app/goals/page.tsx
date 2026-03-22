import { GoalCard } from "@/components/goal-card";
import { QuickGoalForm } from "@/components/forms/quick-log-forms";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function GoalsPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="grid gap-4">
        {workspace.goals.items.map((goal) => (
          <GoalCard key={goal.id} {...goal} />
        ))}
        <Card className="space-y-3">
          <div className="font-display text-xl font-semibold text-white">Goal nudge</div>
          <p className="text-sm text-slate-300">{workspace.goals.goalNudge}</p>
        </Card>
      </div>
      <div className="space-y-6">
        <QuickGoalForm athleteId={workspace.athlete.user.id} />
        <Card className="space-y-3">
          <div className="font-display text-xl font-semibold text-white">Badges</div>
          {workspace.goals.badges.map((badge) => (
            <div key={badge.id} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {badge.title} · {badge.description}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
