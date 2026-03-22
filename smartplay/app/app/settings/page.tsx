import { requireSession } from "@/lib/auth/session";
import { getAthleteWorkspace, getParentWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type PreferenceItem = {
  label?: string;
  title?: string;
};

export default async function SettingsPage() {
  const session = await requireSession();
  const settings =
    session.user.role === "athlete"
      ? (await getAthleteWorkspace(session.user.id)).settings.notificationPreferences
      : session.user.role === "parent"
        ? (await getParentWorkspace(session.user.id)).notifications
        : [
            { label: "Coach alerts", enabled: true },
            { label: "Roster updates", enabled: true },
            { label: "System summaries", enabled: true },
          ];

  return (
    <div className="grid gap-6">
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Notification preferences</div>
        {Array.isArray(settings)
          ? settings.map((item: PreferenceItem, index: number) => (
              <div key={index} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="text-sm text-slate-200">{item.label ?? item.title}</div>
                <Switch defaultChecked />
              </div>
            ))
          : null}
      </Card>
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Theme + privacy</div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
          Theme toggle is available in the top nav. Profile sharing stays athlete-controlled and role-aware.
        </div>
      </Card>
    </div>
  );
}
