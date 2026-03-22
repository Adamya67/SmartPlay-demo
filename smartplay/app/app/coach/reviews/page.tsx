import { VideoReviewCard } from "@/components/video-review-card";
import { requireRole } from "@/lib/auth/session";
import { getCoachWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function CoachReviewsPage() {
  const session = await requireRole(["coach", "admin"]);
  const workspace = await getCoachWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <div className="font-display text-xl font-semibold text-white">Video review queue</div>
        <p className="text-sm text-slate-300">
          Review player footage, add coach notes, and turn clips into specific next-session
          work.
        </p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {workspace.pendingReviews.map((video) => (
          <VideoReviewCard
            key={video.id}
            video={video}
            href={`/app/videos/${video.id}`}
          />
        ))}
      </div>
    </div>
  );
}
