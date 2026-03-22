/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { isVideoFile } from "@/lib/video/utils";

export function VideoReviewPlayer({
  fileUrl,
  mimeType,
  thumbnailUrl,
  title,
  moments,
}: {
  fileUrl: string;
  mimeType?: string | null;
  thumbnailUrl?: string | null;
  title: string;
  moments: Array<{ timestamp: string; title: string }>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = isVideoFile(fileUrl, mimeType);

  function seekTo(timestamp: string) {
    if (!isVideo) {
      return;
    }

    const [minutes, seconds] = timestamp.split(":").map(Number);
    if (!videoRef.current) {
      return;
    }
    videoRef.current.currentTime = minutes * 60 + seconds;
    videoRef.current.play().catch(() => undefined);
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video overflow-hidden rounded-[24px] border border-white/10 bg-slate-950">
        {isVideo ? (
          <video
            ref={videoRef}
            src={fileUrl}
            poster={thumbnailUrl ?? undefined}
            controls
            className="size-full object-cover"
          />
        ) : (
          <img
            src={thumbnailUrl ?? fileUrl}
            alt={title}
            className="size-full object-cover"
          />
        )}
      </div>
      {moments.length ? (
        <div className="flex flex-wrap gap-2">
          {moments.map((moment) => (
            <Button
              key={`${moment.timestamp}-${moment.title}`}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => seekTo(moment.timestamp)}
              disabled={!isVideo}
            >
              {moment.timestamp} · {moment.title}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
