import { QuickWellnessForm } from "@/components/forms/quick-log-forms";
import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { WellnessCheckInCard } from "@/components/wellness-check-in-card";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function WellnessPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <WellnessCheckInCard
        readiness={workspace.dashboard.readinessScore}
        summary={workspace.wellness.aiSummary}
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <LineTrendChart
            data={workspace.analytics.wellness.trend.map((entry) => ({
              name: entry.label,
              readiness: entry.readiness,
              recovery: entry.recovery,
            }))}
            lines={[
              { key: "readiness", color: "#b5ff5d" },
              { key: "recovery", color: "#38bdf8" },
            ]}
          />
        </Card>
        <div className="space-y-6">
          <QuickWellnessForm athleteId={workspace.athlete.user.id} />
          <Card className="space-y-4">
            <div className="font-display text-xl font-semibold text-white">Recovery library</div>
            {workspace.wellness.library.map((item) => (
              <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
