import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { getCoachAthleteWorkspace } from "@/lib/data/service";
import { AthleteProfileHeader } from "@/components/athlete-profile-header";
import { Card } from "@/components/ui/card";

export default async function CoachAthleteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["coach", "admin"]);
  const { id } = await params;

  const workspace = await getCoachAthleteWorkspace(session.user.id, id).catch(
    () => null,
  );

  if (!workspace) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AthleteProfileHeader
        name={workspace.athlete.user.name}
        image={workspace.athlete.user.image}
        position={workspace.athlete.profile.position}
        graduationYear={workspace.athlete.profile.graduationYear}
        club={workspace.athlete.profile.club}
        bio={workspace.athlete.profile.bio}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-3">
          <div className="font-display text-xl font-semibold text-white">Readiness</div>
          <div className="text-4xl font-semibold text-white">
            {workspace.dashboard.readinessScore}
          </div>
        </Card>
        <Card className="space-y-3">
          <div className="font-display text-xl font-semibold text-white">Goal progress</div>
          <div className="text-4xl font-semibold text-white">
            {workspace.dashboard.goalProgress}%
          </div>
        </Card>
        <Card className="space-y-3">
          <div className="font-display text-xl font-semibold text-white">Consistency</div>
          <div className="text-4xl font-semibold text-white">
            {workspace.dashboard.weeklyConsistencyScore}
          </div>
        </Card>
      </div>
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Coach notes</div>
        {workspace.dashboard.coachComments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200"
          >
            {comment.content}
          </div>
        ))}
      </Card>
    </div>
  );
}
