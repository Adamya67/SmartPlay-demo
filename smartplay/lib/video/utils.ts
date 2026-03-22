export function isVideoFile(fileUrl: string, mimeType?: string | null) {
  if (mimeType?.startsWith("video/")) {
    return true;
  }

  return /\.(mp4|mov|m4v|webm|avi)$/i.test(fileUrl);
}

export function formatTimestampLabel(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatVideoDuration(durationSeconds?: number | null) {
  if (!durationSeconds || durationSeconds <= 0) {
    return "Duration unavailable";
  }

  return formatTimestampLabel(durationSeconds);
}
