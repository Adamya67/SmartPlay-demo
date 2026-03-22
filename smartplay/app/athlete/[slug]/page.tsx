import { notFound } from "next/navigation";

import { AthleteProfileHeader } from "@/components/athlete-profile-header";
import { getPublicAthleteProfile } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function PublicAthleteProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPublicAthleteProfile(slug);

  if (!profile) {
    notFound();
  }

  return (
    <main className="section-shell py-16">
      <AthleteProfileHeader
        name={profile.athlete.user.name}
        image={profile.athlete.user.image}
        position={profile.athlete.profile.position}
        graduationYear={profile.athlete.profile.graduationYear}
        club={profile.athlete.profile.club}
        bio={profile.athlete.profile.bio}
      />
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Top stats</div>
          {profile.topStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="text-sm text-slate-400">{stat.label}</div>
              <div className="mt-1 text-2xl font-semibold text-white">{stat.value}</div>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Goals</div>
          {profile.goals.map((goal) => (
            <div key={goal.id} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {goal.title}
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Coach endorsements</div>
          {profile.coachEndorsements.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {comment.content}
            </div>
          ))}
        </Card>
      </div>
    </main>
  );
}
