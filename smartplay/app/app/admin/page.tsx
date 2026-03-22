import { MetricCard } from "@/components/metric-card";
import { requireRole } from "@/lib/auth/session";
import { getAdminWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function AdminPage() {
  await requireRole(["admin"]);
  const workspace = await getAdminWorkspace();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Users" value={workspace.totals.users} change={12} />
        <MetricCard label="Athletes" value={workspace.totals.athletes} change={18} />
        <MetricCard label="Coaches" value={workspace.totals.coaches} change={7} />
        <MetricCard label="Parents" value={workspace.totals.parents} change={9} />
      </div>
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Risk flags</div>
        {workspace.riskFlags.map((flag) => (
          <div key={flag.name} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
            {flag.name}: {flag.reason}
          </div>
        ))}
      </Card>
    </div>
  );
}
