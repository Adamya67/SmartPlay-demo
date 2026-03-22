import { QuickCalendarForm } from "@/components/forms/quick-log-forms";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { formatRelativeDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/card";

export default async function CalendarPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Upcoming calendar</div>
        {workspace.calendar.events.map((event) => (
          <div key={event.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
            <div className="font-medium text-white">{event.title}</div>
            <div className="mt-1 text-sm text-slate-400">{formatRelativeDate(event.startsAt)}</div>
          </div>
        ))}
      </Card>
      <QuickCalendarForm
        athleteId={workspace.athlete.user.id}
        teamId={workspace.athlete.team?.id ?? null}
      />
    </div>
  );
}
