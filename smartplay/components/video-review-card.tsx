/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatVideoDuration } from "@/lib/video/utils";
import type { VideoAssetRecord, VideoCommentRecord } from "@/types/domain";

export function VideoReviewCard({
  video,
  comments = [],
  href,
}: {
  video: VideoAssetRecord;
  comments?: VideoCommentRecord[];
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="overflow-hidden transition hover:border-lime-400/30 hover:bg-white/8">
        <div className="relative aspect-video overflow-hidden rounded-[20px] border border-white/8 bg-slate-900">
          <img
            src={video.thumbnailUrl ?? video.fileUrl}
            alt={video.title}
            className="size-full object-cover"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{video.videoType.replaceAll("_", " ")}</Badge>
          <Badge variant="secondary">{video.analysisStatus ?? "pending"}</Badge>
          <Badge variant="secondary">{formatVideoDuration(video.durationSeconds)}</Badge>
        </div>
        <div className="mt-4 font-display text-xl font-semibold text-white">{video.title}</div>
        <p className="mt-2 line-clamp-3 text-sm text-slate-300">
          {video.analysis?.summary ?? video.notes ?? "Analysis is being prepared."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {video.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">
          {comments.length} coach notes
        </div>
      </Card>
    </Link>
  );
}
