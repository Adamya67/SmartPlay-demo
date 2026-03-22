import { MetricCard } from "@/components/metric-card";
import { TeamRosterTable } from "@/components/team-roster-table";
import { requireRole } from "@/lib/auth/session";
import { getCoachWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function CoachPage() {
  const session = await requireRole(["coach", "admin"]);
  const workspace = await getCoachWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Average readiness" value={workspace.teamAnalytics.averageReadiness} change={6} />
        <MetricCard label="Average load" value={workspace.teamAnalytics.averageLoad} change={8} />
        <MetricCard label="Pending reviews" value={workspace.pendingReviews.length} change={14} />
        <MetricCard label="Readiness alerts" value={workspace.readinessAlerts.length} change={-3} />
      </div>

      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Roster overview</div>
        <TeamRosterTable roster={workspace.roster} />
      </Card>
    </div>
  );
}
