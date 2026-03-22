/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";

import { VideoCommentForm } from "@/components/video-comment-form";
import { VideoAnalysisPanel } from "@/components/video-analysis-panel";
import { VideoReviewPlayer } from "@/components/video-review-player";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { getVideoDetailForViewer } from "@/lib/data/service";
import { formatVideoDuration } from "@/lib/video/utils";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const detail = await getVideoDetailForViewer(session.user.id, session.user.role, id);

  if (!detail) {
    notFound();
  }

  const moments = detail.video.analysis?.moments ?? [];
  const frameStrip = detail.video.thumbnails?.slice(0, 6) ?? [];
  const canComment = session.user.role === "coach" || session.user.role === "admin";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-[0.24em] text-lime-200">
          {detail.athlete.user.name} · {detail.athlete.profile.position} · {detail.athlete.profile.club}
        </div>
        <h1 className="font-display text-3xl font-semibold text-white">{detail.video.title}</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          {detail.video.notes ?? "Soccer-specific clip review"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge>{detail.video.videoType.replaceAll("_", " ")}</Badge>
        <Badge variant="secondary">{detail.video.analysisStatus ?? "pending"}</Badge>
        <Badge variant="secondary">{formatVideoDuration(detail.video.durationSeconds)}</Badge>
        <Badge variant="secondary">{detail.video.analysis?.confidence ?? "low"} confidence</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <VideoReviewPlayer
            fileUrl={detail.video.fileUrl}
            mimeType={detail.video.mimeType}
            thumbnailUrl={detail.video.thumbnailUrl}
            title={detail.video.title}
            moments={moments.map((moment) => ({
              timestamp: moment.timestamp,
              title: moment.title,
            }))}
          />
        </Card>
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Timestamped review</div>
          {moments.length ? (
            moments.map((moment) => (
              <div
                key={`${moment.timestamp}-${moment.title}`}
                className="rounded-2xl border border-white/8 bg-white/5 p-4"
              >
                <div className="text-sm font-medium text-lime-200">
                  {moment.timestamp} · {moment.title}
                </div>
                <p className="mt-2 text-sm text-slate-300">{moment.observation}</p>
                <p className="mt-2 text-sm text-slate-400">{moment.coachingCue}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              SmartPlay will surface timestamped review moments once the clip analysis is complete.
            </div>
          )}
        </Card>
      </div>

      {frameStrip.length ? (
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Sampled review frames</div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {frameStrip.map((frameUrl, index) => (
              <div
                key={frameUrl}
                className="overflow-hidden rounded-[22px] border border-white/8 bg-white/5"
              >
                <div className="aspect-video">
                  <img
                    src={frameUrl}
                    alt={`${detail.video.title} frame ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>
                <div className="px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Review frame {index + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <VideoAnalysisPanel analysis={detail.video.analysis} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">
            Coach review thread
          </div>
          {detail.video.comments.length ? (
            detail.video.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl border border-white/8 bg-white/5 p-4"
              >
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {comment.createdAt.slice(0, 10)}
                </div>
                <div className="mt-2 text-sm text-slate-200">{comment.content}</div>
                {comment.strengthTag || comment.improvementTag ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                    {comment.strengthTag ? (
                      <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1">
                        Strength: {comment.strengthTag}
                      </span>
                    ) : null}
                    {comment.improvementTag ? (
                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1">
                        Improve: {comment.improvementTag}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              No coach comments yet.
            </div>
          )}
          {canComment ? <VideoCommentForm videoId={detail.video.id} /> : null}
        </Card>
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Related clips</div>
          {detail.relatedVideos.map((video) => (
            <Link
              key={video.id}
              href={`/app/videos/${video.id}`}
              className="rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:border-lime-400/30 hover:bg-white/8"
            >
              <div className="font-medium text-white">{video.title}</div>
              <div className="mt-2 text-sm text-slate-400">
                {video.analysis?.summary ?? video.notes ?? "Review clip"}
              </div>
            </Link>
          ))}
        </Card>
      </div>
    </div>
  );
}
