import { z } from "zod";

import {
  detectMimeTypeFromPath,
  extractSampleFrames,
  frameFileToDataUrl,
  prepareMediaInput,
  probeLocalMedia,
} from "@/lib/video/media";
import {
  getMaxVideoAnalysisDurationSeconds,
  saveStorageObjectFromPath,
} from "@/lib/storage";
import type {
  VideoAnalysisRecord,
  VideoAnalysisStatus,
  VideoAssetRecord,
  VideoType,
} from "@/types/domain";

interface VideoAnalysisAthleteContext {
  athleteName: string;
  position: string;
  dominantFoot: string;
  club: string;
  goals: string[];
  equipmentAccess: string[];
  homeTrainingPriority: boolean;
}

const videoAnalysisSchema = z.object({
  summary: z.string().min(20),
  playerSnapshot: z.string().min(12),
  strengths: z.array(z.string()).min(2).max(4),
  improvementAreas: z.array(z.string()).min(2).max(4),
  coachingPoints: z.array(z.string()).min(2).max(5),
  recommendedDrills: z
    .array(
      z.object({
        title: z.string(),
        purpose: z.string(),
        reps: z.string(),
        equipment: z.string(),
      }),
    )
    .min(2)
    .max(4),
  mindsetCue: z.string().min(8),
  nextSessionFocus: z.string().min(8),
  confidence: z.enum(["high", "medium", "low"]),
  detectedTags: z.array(z.string()).min(2).max(8),
  moments: z
    .array(
      z.object({
        timestamp: z.string().regex(/^\d{2}:\d{2}$/),
        title: z.string(),
        observation: z.string(),
        coachingCue: z.string(),
        tags: z.array(z.string()).min(1).max(5),
      }),
    )
    .min(2)
    .max(6),
});

function parseJsonObject(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const generic = trimmed.match(/\{[\s\S]*\}/);
  return generic?.[0] ?? trimmed;
}

function inferClipFocus(videoType: VideoType) {
  switch (videoType) {
    case "shooting":
      return {
        summaryLabel: "finishing mechanics",
        strengths: [
          "commits to striking through the ball",
          "creates usable body shape on cleaner reps",
        ],
        improvementAreas: [
          "plant-foot discipline",
          "calmer setup touch before contact",
        ],
        drills: [
          {
            title: "Three-angle finishing circuit",
            purpose: "Improve repeatable body line into contact.",
            reps: "4 sets x 6 reps",
            equipment: "Ball, cones, one target goal",
          },
          {
            title: "Weak-foot wall set",
            purpose: "Clean up first touch before the strike.",
            reps: "3 sets x 10 reps",
            equipment: "Ball and wall",
          },
        ],
      };
    case "passing":
      return {
        summaryLabel: "passing rhythm and body orientation",
        strengths: [
          "shows willingness to play forward",
          "opens the hips better on cleaner actions",
        ],
        improvementAreas: [
          "scan earlier before reception",
          "cleaner contact foot on driven passes",
        ],
        drills: [
          {
            title: "Open-body passing pattern",
            purpose: "Improve receiving angle and next action speed.",
            reps: "4 sets x 8 reps",
            equipment: "Ball, wall, cones",
          },
          {
            title: "Scan-call-pass circuit",
            purpose: "Build earlier information before the first touch.",
            reps: "3 sets x 90 seconds",
            equipment: "Partner or wall",
          },
        ],
      };
    case "defending":
      return {
        summaryLabel: "defending body shape and line management",
        strengths: [
          "protects space with better patience",
          "shows useful recovery habits in transition",
        ],
        improvementAreas: [
          "earlier communication",
          "sharper first adjustment step",
        ],
        drills: [
          {
            title: "Drop-step defending grid",
            purpose: "Sharpen recovery angles and duel setup.",
            reps: "4 sets x 4 reps each side",
            equipment: "Cones",
          },
          {
            title: "Defend and outlet pattern",
            purpose: "Connect duel win to composed next pass.",
            reps: "3 sets x 6 reps",
            equipment: "Ball and partner",
          },
        ],
      };
    case "sprint_form":
      return {
        summaryLabel: "acceleration mechanics",
        strengths: [
          "good intent through the first steps",
          "decent projection angle when the rep is organized",
        ],
        improvementAreas: [
          "shin angle consistency",
          "arm action under fatigue",
        ],
        drills: [
          {
            title: "Wall projection series",
            purpose: "Refine projection angles and force direction.",
            reps: "3 sets x 5 reps",
            equipment: "Wall",
          },
          {
            title: "10m acceleration clusters",
            purpose: "Transfer mechanics into real sprint actions.",
            reps: "5 sets x 2 reps",
            equipment: "Cones",
          },
        ],
      };
    case "game_footage":
    default:
      return {
        summaryLabel: "match decision-making and movement",
        strengths: [
          "finds useful moments to impact the phase",
          "shows intent in transition and recovery actions",
        ],
        improvementAreas: [
          "earlier scanning before the key action",
          "cleaner next action after winning the moment",
        ],
        drills: [
          {
            title: "Scan and play transition pattern",
            purpose: "Improve first action speed after the regain.",
            reps: "4 sets x 90 seconds",
            equipment: "Ball, cones, partner",
          },
          {
            title: "Decision box game",
            purpose: "Force faster visual processing in game-like space.",
            reps: "4 rounds x 2 minutes",
            equipment: "Cones, ball",
          },
        ],
      };
  }
}

function buildFallbackVideoAnalysis({
  athlete,
  video,
  timestamps,
  probe,
}: {
  athlete: VideoAnalysisAthleteContext;
  video: Pick<VideoAssetRecord, "title" | "notes" | "tags" | "videoType">;
  timestamps: string[];
  probe: {
    fileType: "video" | "image";
    durationSeconds: number | null;
    width: number | null;
    height: number | null;
    fps: number | null;
    sampledFrames: number;
  };
}): VideoAnalysisRecord {
  const focus = inferClipFocus(video.videoType);
  const accessLine = athlete.homeTrainingPriority
    ? "Recommended work stays equipment-light so the feedback can turn into action quickly."
    : "The feedback is designed to translate into the next team or individual session immediately.";

  const moments = timestamps.slice(0, Math.max(2, timestamps.length)).map((timestamp, index) => ({
    timestamp,
    title:
      index === 0
        ? "Positive reference rep"
        : index === 1
          ? "Main improvement moment"
          : `Review moment ${index + 1}`,
    observation:
      index === 0
        ? `This moment should be used as the reference clip for ${focus.summaryLabel}.`
        : `This moment is the best checkpoint for tightening ${focus.improvementAreas[Math.min(index - 1, focus.improvementAreas.length - 1)]}.`,
    coachingCue:
      index === 0
        ? "Keep this body shape and timing as the baseline."
        : `Name one cue before the rep so the correction is deliberate, not accidental.`,
    tags:
      index === 0
        ? ["reference", ...video.tags.slice(0, 2)]
        : [video.tags[index - 1] ?? "review", "coaching"],
  }));

  return {
    provider: "smartplay-fallback",
    analyzedAt: new Date().toISOString(),
    summary: `${athlete.athleteName}'s clip points to ${focus.summaryLabel}. ${focus.strengths[0]} while the next gain is ${focus.improvementAreas[0]}. ${accessLine}`,
    playerSnapshot: `${athlete.position} at ${athlete.club}, working on ${athlete.goals[0]?.toLowerCase() ?? "consistent development"} with ${athlete.dominantFoot.toLowerCase()}-footed preference.`,
    strengths: focus.strengths,
    improvementAreas: focus.improvementAreas,
    coachingPoints: [
      `Anchor the review around ${focus.summaryLabel}, not just whether the rep or play "worked."`,
      "Use one clear cue for the next session so the correction is measurable.",
      accessLine,
    ],
    recommendedDrills: focus.drills,
    mindsetCue: "Review with curiosity, not self-judgment. The clip is a tool for the next rep.",
    nextSessionFocus: `Turn this review into one short session focused on ${focus.improvementAreas[0]}.`,
    confidence: probe.sampledFrames >= 3 ? "medium" : "low",
    detectedTags: [...new Set([...video.tags, ...focus.summaryLabel.split(" ").slice(0, 2)])].slice(
      0,
      6,
    ),
    moments,
    metadata: {
      fileType: probe.fileType,
      sampledFrames: probe.sampledFrames,
      durationSeconds: probe.durationSeconds,
      width: probe.width,
      height: probe.height,
      fps: probe.fps,
    },
  };
}

async function callOpenAIVideoAnalysis({
  athlete,
  video,
  probe,
  frames,
}: {
  athlete: VideoAnalysisAthleteContext;
  video: Pick<VideoAssetRecord, "title" | "notes" | "tags" | "videoType">;
  probe: {
    fileType: "video" | "image";
    durationSeconds: number | null;
    width: number | null;
    height: number | null;
    fps: number | null;
    sampledFrames: number;
  };
  frames: Array<{ timestamp: string; dataUrl: string }>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model =
    process.env.OPENAI_VISION_MODEL ??
    process.env.OPENAI_MODEL ??
    "gpt-4.1-mini";

  if (!apiKey || !frames.length) {
    return null;
  }

  const prompt = [
    "You are SmartPlay AI Coach, a high-level but practical soccer performance analyst for youth athletes.",
    "Analyze the uploaded clip based on the sampled frames and the athlete context.",
    "Only make claims supported by the visible frames and the user's notes. Do not invent hidden events.",
    "Return only valid JSON matching this shape:",
    JSON.stringify({
      summary: "string",
      playerSnapshot: "string",
      strengths: ["string", "string"],
      improvementAreas: ["string", "string"],
      coachingPoints: ["string", "string", "string"],
      recommendedDrills: [
        {
          title: "string",
          purpose: "string",
          reps: "string",
          equipment: "string",
        },
      ],
      mindsetCue: "string",
      nextSessionFocus: "string",
      confidence: "high | medium | low",
      detectedTags: ["string", "string"],
      moments: [
        {
          timestamp: "mm:ss",
          title: "string",
          observation: "string",
          coachingCue: "string",
          tags: ["string"],
        },
      ],
    }),
    `Athlete: ${athlete.athleteName}, ${athlete.position}, ${athlete.dominantFoot}-footed, ${athlete.club}`,
    `Athlete goals: ${athlete.goals.join("; ")}`,
    `Equipment access: ${athlete.equipmentAccess.join(", ")}`,
    `Clip title: ${video.title}`,
    `Clip type: ${video.videoType}`,
    `Clip notes: ${video.notes ?? "No extra notes provided."}`,
    `Existing tags: ${video.tags.join(", ") || "none"}`,
    `Media metadata: ${JSON.stringify(probe)}`,
    `Frame timestamps: ${frames.map((frame) => frame.timestamp).join(", ")}`,
  ].join("\n\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You analyze soccer footage honestly and constructively. You never overclaim beyond the visible evidence.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            ...frames.map((frame) => ({
              type: "image_url",
              image_url: {
                url: frame.dataUrl,
                detail: "high",
              },
            })),
          ],
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    return null;
  }

  const parsed = videoAnalysisSchema.safeParse(
    JSON.parse(parseJsonObject(content)),
  );

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

function buildDurationLimitFallback({
  athlete,
  video,
  probe,
  maxDurationSeconds,
}: {
  athlete: VideoAnalysisAthleteContext;
  video: Pick<VideoAssetRecord, "title" | "notes" | "tags" | "videoType">;
  probe: {
    fileType: "video" | "image";
    durationSeconds: number | null;
    width: number | null;
    height: number | null;
    fps: number | null;
  };
  maxDurationSeconds: number;
}) {
  const fallback = buildFallbackVideoAnalysis({
    athlete,
    video,
    timestamps: ["00:00", "00:30", "01:00"],
    probe: {
      ...probe,
      sampledFrames: 0,
    },
  });

  return {
    ...fallback,
    summary: `This clip is too long for SmartPlay's hosted real-time review window. Trim the most important ${maxDurationSeconds}-second sequence so the feedback stays specific and trustworthy.`,
    coachingPoints: [
      `Upload a shorter sequence centered on the decision, action, or phase you want reviewed.`,
      "Use the notes field to describe the match context and what you want evaluated.",
      "Keep full-match uploads for storage and coach review, then create shorter clips for AI analysis.",
    ],
    nextSessionFocus:
      "Trim a 30-120 second sequence around the key moment, then re-upload for more accurate feedback.",
    confidence: "low" as const,
    metadata: {
      ...probe,
      sampledFrames: 0,
      durationSeconds: probe.durationSeconds,
    },
  };
}

export async function analyzeSoccerVideoAsset({
  assetId,
  video,
  athlete,
}: {
  assetId: string;
  video: Pick<
    VideoAssetRecord,
    "title" | "videoType" | "fileUrl" | "mimeType" | "thumbnailUrl" | "notes" | "tags"
  >;
  athlete: VideoAnalysisAthleteContext;
}) {
  const preparedInput = await prepareMediaInput(video.fileUrl, video.mimeType);

  if (!preparedInput) {
    const fallback = buildFallbackVideoAnalysis({
      athlete,
      video,
      timestamps: ["00:00", "00:12"],
      probe: {
        fileType: "image",
        sampledFrames: 0,
        durationSeconds: null,
        width: null,
        height: null,
        fps: null,
      },
    });

    return {
      analysisStatus: "fallback" as VideoAnalysisStatus,
      analysis: fallback,
      timestamps: fallback.moments.map((moment) => ({
        label: moment.title,
        value: moment.timestamp,
      })),
      thumbnailUrl: video.fileUrl,
      thumbnails: [video.fileUrl],
      durationSeconds: null,
      mimeType: video.mimeType ?? null,
      tags: [...new Set([...video.tags, ...fallback.detectedTags])],
    };
  }

  let cleanupFrames = async () => {};

  try {
    const absolutePath = preparedInput.absolutePath;
    const probe = await probeLocalMedia(absolutePath, video.fileUrl, video.mimeType);
    const maxDurationSeconds = getMaxVideoAnalysisDurationSeconds();

    if (
      probe.fileType === "video" &&
      probe.durationSeconds &&
      probe.durationSeconds > maxDurationSeconds
    ) {
      const fallback = buildDurationLimitFallback({
        athlete,
        video,
        probe,
        maxDurationSeconds,
      });

      return {
        analysisStatus: "fallback" as VideoAnalysisStatus,
        analysis: fallback,
        timestamps: fallback.moments.map((moment) => ({
          label: moment.title,
          value: moment.timestamp,
        })),
        thumbnailUrl: video.thumbnailUrl ?? video.fileUrl,
        thumbnails: video.thumbnailUrl ? [video.thumbnailUrl] : [video.fileUrl],
        durationSeconds: probe.durationSeconds,
        mimeType: video.mimeType ?? "video/mp4",
        tags: [...new Set([...video.tags, ...fallback.detectedTags])].slice(0, 10),
      };
    }

    const extracted = await extractSampleFrames({
      assetId,
      inputPath: absolutePath,
      fileUrl: video.fileUrl,
      mimeType: video.mimeType,
      durationSeconds: probe.durationSeconds,
    });
    cleanupFrames = extracted.cleanup;

    const framePayload = await Promise.all(
      extracted.frames.map(async (frame) => ({
        timestamp: frame.timestamp,
        dataUrl: await frameFileToDataUrl(frame.filePath),
      })),
    );

    const baseProbe = {
      ...probe,
      sampledFrames: extracted.frames.length,
    };

    const uploadedFrames =
      probe.fileType === "video"
        ? await Promise.all(
            extracted.frames.map(async (frame, index) => {
              const uploaded = await saveStorageObjectFromPath({
                filePath: frame.filePath,
                bucket: "generated",
                fileName: `${assetId}-${index + 1}-${frame.fileName}`,
                contentType: detectMimeTypeFromPath(frame.filePath),
              });

              return {
                timestamp: frame.timestamp,
                fileUrl: uploaded.fileUrl,
              };
            }),
          )
        : [
            {
              timestamp: extracted.frames[0]?.timestamp ?? "00:00",
              fileUrl: video.thumbnailUrl ?? video.fileUrl,
            },
          ];

    const live = await callOpenAIVideoAnalysis({
      athlete,
      video,
      probe: baseProbe,
      frames: framePayload,
    });

    const analysis: VideoAnalysisRecord = live
      ? {
          provider: "openai-vision",
          analyzedAt: new Date().toISOString(),
          ...live,
          metadata: baseProbe,
        }
      : buildFallbackVideoAnalysis({
          athlete,
          video,
          timestamps: extracted.frames.map((frame) => frame.timestamp),
          probe: baseProbe,
        });

    return {
      analysisStatus: live
        ? ("completed" as VideoAnalysisStatus)
        : ("fallback" as VideoAnalysisStatus),
      analysis,
      timestamps: analysis.moments.map((moment) => ({
        label: moment.title,
        value: moment.timestamp,
      })),
      thumbnailUrl: uploadedFrames[0]?.fileUrl ?? video.thumbnailUrl ?? video.fileUrl,
      thumbnails: uploadedFrames.map((frame) => frame.fileUrl),
      durationSeconds: probe.durationSeconds,
      mimeType: video.mimeType ?? (probe.fileType === "video" ? "video/mp4" : "image/jpeg"),
      tags: [...new Set([...video.tags, ...analysis.detectedTags])].slice(0, 10),
    };
  } catch {
    const fallback = buildFallbackVideoAnalysis({
      athlete,
      video,
      timestamps: ["00:00", "00:18", "00:34"].map((timestamp, index) =>
        video.videoType === "game_footage" && index === 2 ? "00:46" : timestamp,
      ),
      probe: {
        fileType: video.mimeType?.startsWith("video/") ? "video" : "image",
        sampledFrames: 0,
        durationSeconds: null,
        width: null,
        height: null,
        fps: null,
      },
    });

    return {
      analysisStatus: "fallback" as VideoAnalysisStatus,
      analysis: fallback,
      timestamps: fallback.moments.map((moment) => ({
        label: moment.title,
        value: moment.timestamp,
      })),
      thumbnailUrl: video.thumbnailUrl ?? video.fileUrl,
      thumbnails: video.thumbnailUrl ? [video.thumbnailUrl] : [video.fileUrl],
      durationSeconds: null,
      mimeType: video.mimeType ?? null,
      tags: [...new Set([...video.tags, ...fallback.detectedTags])],
    };
  } finally {
    await cleanupFrames();
    await preparedInput.cleanup();
  }
}
