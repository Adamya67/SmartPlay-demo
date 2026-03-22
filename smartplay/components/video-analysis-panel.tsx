import { Card } from "@/components/ui/card";
import type { VideoAnalysisRecord } from "@/types/domain";

export function VideoAnalysisPanel({
  analysis,
}: {
  analysis: VideoAnalysisRecord | null | undefined;
}) {
  if (!analysis) {
    return (
      <Card className="text-sm text-slate-300">
        Analysis is still being prepared for this clip.
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="space-y-4">
        <div className="text-xs uppercase tracking-[0.24em] text-lime-200">
          SmartPlay AI Video Review
        </div>
        <div className="font-display text-2xl font-semibold text-white">Summary</div>
        <p className="text-sm leading-7 text-slate-300">{analysis.summary}</p>
        <p className="text-sm text-slate-400">{analysis.playerSnapshot}</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Confidence: {analysis.confidence}
          </span>
          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Source: {analysis.provider === "openai-vision" ? "Vision review" : "Structured fallback"}
          </span>
          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Frames sampled: {analysis.metadata.sampledFrames}
          </span>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Focus tags</div>
        <div className="flex flex-wrap gap-2">
          {analysis.detectedTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Strengths</div>
          {analysis.strengths.map((item) => (
            <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Improvement areas</div>
          {analysis.improvementAreas.map((item) => (
            <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Coaching points</div>
        {analysis.coachingPoints.map((item) => (
          <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
            {item}
          </div>
        ))}
      </Card>

      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Recommended drills</div>
        <div className="grid gap-4 xl:grid-cols-2">
          {analysis.recommendedDrills.map((drill) => (
            <div key={drill.title} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="font-medium text-white">{drill.title}</div>
              <div className="mt-2 text-sm text-slate-300">{drill.purpose}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                {drill.reps} · {drill.equipment}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Mindset cue</div>
          <p className="text-sm text-slate-300">{analysis.mindsetCue}</p>
        </Card>
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Next session focus</div>
          <p className="text-sm text-slate-300">{analysis.nextSessionFocus}</p>
        </Card>
      </div>
    </div>
  );
}
