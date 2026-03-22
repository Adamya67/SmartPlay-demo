import { AthleteProfileHeader } from "@/components/athlete-profile-header";
import { BarComparisonChart } from "@/components/charts/bar-comparison-chart";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

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
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Top stats</div>
          {workspace.athlete.profile.topStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="text-sm text-slate-400">{stat.label}</div>
              <div className="mt-1 text-2xl font-semibold text-white">{stat.value}</div>
            </div>
          ))}
        </Card>
        <Card>
          <BarComparisonChart
            data={workspace.analytics.technical.bar}
            keys={[
              { key: "current", color: "#b5ff5d" },
              { key: "previous", color: "#0f766e" },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
