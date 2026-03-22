import { requireRole } from "@/lib/auth/session";
import { getCoachWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function CoachPlansPage() {
  const session = await requireRole(["coach", "admin"]);
  const workspace = await getCoachWorkspace(session.user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {workspace.pendingReviews.map((video) => (
        <Card key={video.id} className="space-y-3">
          <div className="font-display text-xl font-semibold text-white">{video.title}</div>
          <p className="text-sm text-slate-300">{video.notes ?? "Coach-created template ready for review."}</p>
        </Card>
      ))}
    </div>
  );
}
