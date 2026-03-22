import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

import { getS3Object, parseStorageObjectKeyFromUrl } from "@/lib/storage";
import { formatTimestampLabel, isVideoFile } from "@/lib/video/utils";

type LocalMediaKind = "video" | "image";

type CleanupFn = () => Promise<void>;

export interface LocalMediaProbe {
  fileType: LocalMediaKind;
  durationSeconds: number | null;
  width: number | null;
  height: number | null;
  fps: number | null;
}

export interface ExtractedFrame {
  timestampSeconds: number;
  timestamp: string;
  filePath: string;
  fileName: string;
}

export interface PreparedMediaInput {
  absolutePath: string;
  cleanup: CleanupFn;
}

async function cleanupNoop() {}

function runBinary(binary: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    execFile(binary, args, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }

      resolve(stdout);
    });
  });
}

function parseFps(value?: string) {
  if (!value) {
    return null;
  }

  const [numerator, denominator] = value.split("/").map(Number);

  if (!numerator || !denominator) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  return Number((numerator / denominator).toFixed(2));
}

function extensionFromMimeType(mimeType?: string | null) {
  switch (mimeType?.split(";")[0]?.trim()) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    case "video/quicktime":
      return ".mov";
    case "video/webm":
      return ".webm";
    case "video/mp4":
      return ".mp4";
    case "image/jpeg":
    default:
      return ".jpg";
  }
}

function extensionFromUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    return path.extname(url.pathname) || "";
  } catch {
    return path.extname(fileUrl) || "";
  }
}

export function detectMimeTypeFromPath(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    case ".webm":
      return "video/webm";
    case ".jpg":
    case ".jpeg":
    default:
      return "image/jpeg";
  }
}

export async function prepareMediaInput(
  fileUrl: string,
  mimeType?: string | null,
): Promise<PreparedMediaInput | null> {
  const storageObjectKey = parseStorageObjectKeyFromUrl(fileUrl);

  if (storageObjectKey) {
    const tempDir = path.join(
      os.tmpdir(),
      "smartplay-source-media",
      randomUUID().slice(0, 12),
    );
    const extension = extensionFromUrl(fileUrl) || extensionFromMimeType(mimeType);
    const absolutePath = path.join(tempDir, `source${extension || ".bin"}`);
    const object = await getS3Object({ objectKey: storageObjectKey });

    if (!object.Body) {
      throw new Error("Stored media body was empty.");
    }

    await mkdir(tempDir, { recursive: true });
    await writeFile(
      absolutePath,
      Buffer.from(await object.Body.transformToByteArray()),
    );

    return {
      absolutePath,
      cleanup: async () => {
        await rm(tempDir, { recursive: true, force: true });
      },
    };
  }

  if (fileUrl.startsWith("/")) {
    return {
      absolutePath: path.join(process.cwd(), "public", fileUrl.replace(/^\//, "")),
      cleanup: cleanupNoop,
    };
  }

  if (!/^https?:\/\//i.test(fileUrl)) {
    return null;
  }

  const response = await fetch(fileUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to download media for analysis (${response.status}).`);
  }

  const tempDir = path.join(
    os.tmpdir(),
    "smartplay-source-media",
    randomUUID().slice(0, 12),
  );
  const contentType = response.headers.get("content-type");
  const extension =
    extensionFromUrl(fileUrl) ||
    extensionFromMimeType(mimeType || contentType);
  const absolutePath = path.join(tempDir, `source${extension || ".bin"}`);

  await mkdir(tempDir, { recursive: true });
  await writeFile(absolutePath, Buffer.from(await response.arrayBuffer()));

  return {
    absolutePath,
    cleanup: async () => {
      await rm(tempDir, { recursive: true, force: true });
    },
  };
}

export async function probeLocalMedia(
  inputPath: string,
  fileUrl: string,
  mimeType?: string | null,
): Promise<LocalMediaProbe> {
  const stdout = await runBinary(ffprobeStatic.path, [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,r_frame_rate",
    "-show_entries",
    "format=duration",
    "-of",
    "json",
    inputPath,
  ]);

  const parsed = JSON.parse(stdout) as {
    format?: { duration?: string };
    streams?: Array<{ width?: number; height?: number; r_frame_rate?: string }>;
  };

  const stream = parsed.streams?.[0];
  const durationSeconds = parsed.format?.duration
    ? Math.max(0, Math.round(Number(parsed.format.duration)))
    : null;

  return {
    fileType: isVideoFile(fileUrl, mimeType) ? "video" : "image",
    durationSeconds,
    width: stream?.width ?? null,
    height: stream?.height ?? null,
    fps: parseFps(stream?.r_frame_rate),
  };
}

function selectSampleSeconds(durationSeconds: number, count: number) {
  if (durationSeconds <= 1) {
    return [0];
  }

  const first = durationSeconds < 20 ? 0.18 : 0.12;
  const last = durationSeconds < 20 ? 0.82 : 0.9;
  const selected: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const percent =
      count === 1 ? 0.5 : first + ((last - first) * index) / (count - 1);
    selected.push(Math.max(0, Math.floor(durationSeconds * percent)));
  }

  return [...new Set(selected)];
}

export async function extractSampleFrames({
  assetId,
  inputPath,
  fileUrl,
  mimeType,
  durationSeconds,
}: {
  assetId: string;
  inputPath: string;
  fileUrl: string;
  mimeType?: string | null;
  durationSeconds: number | null;
}) {
  const fileType: LocalMediaKind = isVideoFile(fileUrl, mimeType) ? "video" : "image";

  if (fileType === "image" || !durationSeconds) {
    return {
      frames: [
        {
          timestampSeconds: 0,
          timestamp: "00:00",
          filePath: inputPath,
          fileName: `frame-1${path.extname(inputPath) || ".jpg"}`,
        },
      ] satisfies ExtractedFrame[],
      cleanup: cleanupNoop,
    };
  }

  const sampleCount =
    durationSeconds < 30 ? 3 : durationSeconds < 100 ? 4 : durationSeconds < 240 ? 5 : 6;
  const outputDir = path.join(
    os.tmpdir(),
    "smartplay-generated-frames",
    `${assetId}-${randomUUID().slice(0, 8)}`,
  );

  await mkdir(outputDir, { recursive: true });

  const timestamps = selectSampleSeconds(durationSeconds, sampleCount);
  const frames: ExtractedFrame[] = [];

  for (let index = 0; index < timestamps.length; index += 1) {
    const timestampSeconds = timestamps[index] ?? 0;
    const fileName = `frame-${index + 1}.jpg`;
    const outputPath = path.join(outputDir, fileName);

    await runBinary(ffmpegPath as string, [
      "-y",
      "-ss",
      String(timestampSeconds),
      "-i",
      inputPath,
      "-frames:v",
      "1",
      "-vf",
      "scale='min(960,iw)':-2",
      "-q:v",
      "3",
      outputPath,
    ]);

    frames.push({
      timestampSeconds,
      timestamp: formatTimestampLabel(timestampSeconds),
      filePath: outputPath,
      fileName,
    });
  }

  return {
    frames,
    cleanup: async () => {
      await rm(outputDir, { recursive: true, force: true });
    },
  };
}

export async function frameFileToDataUrl(filePath: string) {
  const buffer = await readFile(filePath);
  return `data:${detectMimeTypeFromPath(filePath)};base64,${buffer.toString("base64")}`;
}
