"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createVideoCommentAction } from "@/app/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function VideoCommentForm({ videoId }: { videoId: string }) {
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [strengthTag, setStrengthTag] = useState("");
  const [improvementTag, setImprovementTag] = useState("");

  return (
    <form
      className="space-y-4 rounded-2xl border border-white/8 bg-white/5 p-4"
      action={(formData) =>
        startTransition(async () => {
          try {
            await createVideoCommentAction({
              videoId,
              content: String(formData.get("content") ?? ""),
              strengthTag: String(formData.get("strengthTag") ?? "") || null,
              improvementTag: String(formData.get("improvementTag") ?? "") || null,
            });
            setContent("");
            setStrengthTag("");
            setImprovementTag("");
            toast.success("Coach review added.");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Unable to save coach review.",
            );
          }
        })
      }
    >
      <div className="text-sm text-slate-300">
        Add one clear strength and one next-action cue so the athlete can turn this clip
        into a better next session.
      </div>
      <Textarea
        name="content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Strong timing stepping into the press. Next clip, scan the weak-side runner before the regain so your next pass is cleaner."
        required
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          name="strengthTag"
          value={strengthTag}
          onChange={(event) => setStrengthTag(event.target.value)}
          placeholder="Strength tag"
        />
        <Input
          name="improvementTag"
          value={improvementTag}
          onChange={(event) => setImprovementTag(event.target.value)}
          placeholder="Improvement tag"
        />
      </div>
      <Button disabled={pending}>{pending ? "Saving..." : "Add coach review"}</Button>
    </form>
  );
}
