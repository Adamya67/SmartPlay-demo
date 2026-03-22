import { QuickVideoForm } from "@/components/forms/quick-log-forms";
import { VideoReviewCard } from "@/components/video-review-card";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";
import { Card } from "@/components/ui/card";

export default async function VideosPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        {workspace.videos.items.map((video) => (
          <VideoReviewCard
            key={video.id}
            video={video}
            comments={video.comments}
            href={`/app/videos/${video.id}`}
          />
        ))}
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Coach review feed</div>
          {workspace.videos.reviewFeed.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {comment.content}
            </div>
          ))}
        </Card>
      </div>
      <QuickVideoForm athleteId={workspace.athlete.user.id} />
    </div>
  );
}
