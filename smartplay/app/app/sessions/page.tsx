import Link from "next/link";

import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { formatShortDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function SessionsPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-3xl font-semibold text-white">Session log</div>
          <p className="mt-2 text-slate-400">Track volume, context, and AI-assisted follow-up.</p>
        </div>
        <Button asChild>
          <Link href="/app/sessions/new">Log new session</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          {workspace.sessions.items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {item.sessionType.replaceAll("_", " ")} · {formatShortDate(item.occurredAt)}
                  </div>
                </div>
                <div className="text-sm text-lime-200">{item.metric?.trainingLoad ?? 0} AU</div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{item.metric?.aiFeedback}</p>
            </div>
          ))}
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="font-display text-xl font-semibold text-white">Templates</div>
            {workspace.sessions.templates.map((template) => (
              <div key={template.title} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="font-medium text-white">{template.title}</div>
                <div className="mt-1 text-sm text-slate-400">{template.description}</div>
              </div>
            ))}
          </Card>
          <Card className="space-y-3">
            <div className="font-display text-xl font-semibold text-white">AI feedback</div>
            <p className="text-sm text-slate-300">{workspace.sessions.trainingFeedback}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
