import { MentalPromptCard } from "@/components/mental-prompt-card";
import { QuickMentalForm } from "@/components/forms/quick-log-forms";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function MentalPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <MentalPromptCard prompt={workspace.mental.aiPrompt} />
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Pregame checklist</div>
          {workspace.mental.pregameChecklist.map((item) => (
            <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </Card>
        <Card className="space-y-3">
          <div className="font-display text-xl font-semibold text-white">Journal</div>
          {workspace.mental.journals.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="font-medium text-white">{entry.title}</div>
              <p className="mt-2 text-sm text-slate-300">{entry.content}</p>
            </div>
          ))}
        </Card>
      </div>
      <QuickMentalForm athleteId={workspace.athlete.user.id} />
    </div>
  );
}
