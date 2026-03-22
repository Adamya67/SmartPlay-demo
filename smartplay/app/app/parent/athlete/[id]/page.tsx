import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { getParentWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function ParentAthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["parent", "admin"]);
  const { id } = await params;
  const workspace = await getParentWorkspace(session.user.id);
  const athlete = workspace.athletes.find((entry) => entry.id === id);

  if (!athlete) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="space-y-4">
        <div className="font-display text-2xl font-semibold text-white">{athlete.name}</div>
        {athlete.alerts.map((alert) => (
          <div key={alert} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
            {alert}
          </div>
        ))}
      </Card>
      <Card className="space-y-4">
        <div className="font-display text-2xl font-semibold text-white">Coach notes</div>
        {athlete.coachComments.map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
            {comment.content}
          </div>
        ))}
      </Card>
    </div>
  );
}
