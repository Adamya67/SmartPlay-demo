import { TeamRosterTable } from "@/components/team-roster-table";
import { requireRole } from "@/lib/auth/session";
import { getCoachWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function CoachTeamPage() {
  const session = await requireRole(["coach", "admin"]);
  const workspace = await getCoachWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Team roster</div>
        <TeamRosterTable roster={workspace.roster} />
      </Card>
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Announcements</div>
        {workspace.announcements.map((announcement) => (
          <div key={announcement.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
            <div className="font-medium text-white">{announcement.title}</div>
            <div className="mt-2 text-sm text-slate-300">{announcement.content}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
