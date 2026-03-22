import { AIInsightCard } from "@/components/ai-insight-card";
import { ChartCard } from "@/components/chart-card";
import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { RingProgress } from "@/components/charts/ring-progress";
import { MetricCard } from "@/components/metric-card";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { formatRelativeDate, formatShortDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-6">
        {workspace.dashboard.widgets.slice(0, 6).map((widget) => (
          <MetricCard
            key={widget.label}
            label={widget.label}
            value={widget.value}
            change={widget.change}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <AIInsightCard title="Daily summary" body={workspace.dashboard.aiSummary} />
        <Card className="flex items-center justify-center">
          <RingProgress value={workspace.dashboard.weeklyConsistencyScore} label="Consistency score" />
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ChartCard
          title="Performance trend"
          description="Workload, readiness, and recovery over recent weeks."
        >
          <LineTrendChart
            data={workspace.dashboard.performanceTrends.map((entry, index) => ({
              name: `Week ${index + 1}`,
              trainingLoad: entry.trainingLoad,
              readiness: entry.readiness,
              recovery: entry.recovery,
            }))}
            lines={[
              { key: "trainingLoad", color: "#b5ff5d" },
              { key: "readiness", color: "#38bdf8" },
              { key: "recovery", color: "#fb7185" },
            ]}
          />
        </ChartCard>

        <Card className="space-y-4">
          <div className="text-sm uppercase tracking-[0.24em] text-lime-200">Alerts</div>
          {workspace.dashboard.alerts.map((alert) => (
            <div key={alert} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {alert}
            </div>
          ))}
          <div className="rounded-2xl border border-lime-400/20 bg-lime-400/10 p-4 text-sm text-lime-100">
            {workspace.dashboard.recommendedToday}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Recent sessions</div>
          {workspace.dashboard.recentSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-white/8 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{session.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {session.location} · {formatShortDate(session.occurredAt)}
                  </div>
                </div>
                <div className="text-sm text-lime-200">
                  {session.metric?.trainingLoad ?? 0} AU
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Upcoming schedule</div>
          {workspace.dashboard.upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-white/8 bg-white/5 p-4"
            >
              <div className="font-medium text-white">{event.title}</div>
              <div className="mt-1 text-sm text-slate-400">
                {formatRelativeDate(event.startsAt)}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
