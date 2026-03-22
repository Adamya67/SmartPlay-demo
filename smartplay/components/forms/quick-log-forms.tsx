"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createCalendarEventAction,
  createGoalAction,
  createJournalEntryAction,
  createMentalCheckInAction,
  createNutritionLogAction,
  createVideoAssetAction,
  createWellnessCheckAction,
} from "@/app/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function QuickGoalForm({ athleteId }: { athleteId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <form
        className="grid gap-4"
        action={(formData) =>
          startTransition(async () => {
            await createGoalAction(athleteId, {
              title: String(formData.get("title")),
              category: "performance",
              targetValue: Number(formData.get("targetValue")),
              currentValue: Number(formData.get("currentValue") ?? 0),
              unit: String(formData.get("unit")),
              deadline: new Date(String(formData.get("deadline"))).toISOString(),
              notes: String(formData.get("notes") ?? ""),
            });
            toast.success("Goal created.");
          })
        }
      >
        <div>
          <Label htmlFor="title">Goal title</Label>
          <Input id="title" name="title" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="targetValue">Target</Label>
            <Input id="targetValue" name="targetValue" type="number" />
          </div>
          <div>
            <Label htmlFor="currentValue">Current</Label>
            <Input id="currentValue" name="currentValue" type="number" defaultValue={0} />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" name="unit" defaultValue="sessions" />
          </div>
        </div>
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" name="deadline" type="date" />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" />
        </div>
        <Button disabled={pending}>Add goal</Button>
      </form>
    </Card>
  );
}

export function QuickNutritionForm({ athleteId }: { athleteId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <form
        className="grid gap-4"
        action={(formData) =>
          startTransition(async () => {
            await createNutritionLogAction(athleteId, {
              loggedAt: new Date().toISOString(),
              mealName: String(formData.get("mealName")),
              calories: Number(formData.get("calories")),
              protein: Number(formData.get("protein")),
              carbs: Number(formData.get("carbs")),
              fats: Number(formData.get("fats")),
              hydrationMl: Number(formData.get("hydrationMl")),
              notes: String(formData.get("notes") ?? ""),
            });
            toast.success("Nutrition log saved.");
          })
        }
      >
        <div>
          <Label htmlFor="mealName">Meal name</Label>
          <Input id="mealName" name="mealName" />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Input name="calories" type="number" placeholder="Calories" />
          <Input name="protein" type="number" placeholder="Protein" />
          <Input name="carbs" type="number" placeholder="Carbs" />
          <Input name="fats" type="number" placeholder="Fats" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="hydrationMl" type="number" placeholder="Hydration ml" />
          <Input name="notes" placeholder="Notes" />
        </div>
        <Button disabled={pending}>Save meal</Button>
      </form>
    </Card>
  );
}

export function QuickWellnessForm({ athleteId }: { athleteId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <form
        className="grid gap-4"
        action={(formData) =>
          startTransition(async () => {
            await createWellnessCheckAction(athleteId, {
              checkedAt: new Date().toISOString(),
              sleepHours: Number(formData.get("sleepHours")),
              sleepQuality: Number(formData.get("sleepQuality")),
              soreness: Number(formData.get("soreness")),
              fatigue: Number(formData.get("fatigue")),
              stress: Number(formData.get("stress")),
              energy: Number(formData.get("energy")),
              mood: Number(formData.get("mood")),
              hydration: Number(formData.get("hydration")),
              painFlag: false,
              injuryStatus: String(formData.get("injuryStatus") ?? ""),
            });
            toast.success("Wellness check-in saved.");
          })
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Input name="sleepHours" type="number" step="0.1" placeholder="Sleep hours" />
          <Input name="sleepQuality" type="number" placeholder="Sleep quality" />
          <Input name="hydration" type="number" placeholder="Hydration score" />
          <Input name="soreness" type="number" placeholder="Soreness" />
          <Input name="fatigue" type="number" placeholder="Fatigue" />
          <Input name="stress" type="number" placeholder="Stress" />
          <Input name="energy" type="number" placeholder="Energy" />
          <Input name="mood" type="number" placeholder="Mood" />
          <Input name="injuryStatus" placeholder="Injury status" />
        </div>
        <Button disabled={pending}>Check in</Button>
      </form>
    </Card>
  );
}

export function QuickMentalForm({ athleteId }: { athleteId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <form
        className="grid gap-4"
        action={(formData) =>
          startTransition(async () => {
            await createMentalCheckInAction(athleteId, {
              checkedAt: new Date().toISOString(),
              confidence: Number(formData.get("confidence")),
              focus: Number(formData.get("focus")),
              anxiety: Number(formData.get("anxiety")),
              motivation: Number(formData.get("motivation")),
              prompt: String(formData.get("prompt")),
            });
            const content = String(formData.get("journal"));
            if (content) {
              await createJournalEntryAction(athleteId, {
                title: "Daily reflection",
                content,
                tag: "daily",
              });
            }
            toast.success("Mental check-in saved.");
          })
        }
      >
        <div className="grid gap-4 sm:grid-cols-4">
          <Input name="confidence" type="number" placeholder="Confidence" />
          <Input name="focus" type="number" placeholder="Focus" />
          <Input name="anxiety" type="number" placeholder="Anxiety" />
          <Input name="motivation" type="number" placeholder="Motivation" />
        </div>
        <Input
          name="prompt"
          defaultValue="What one cue helps you stay composed under pressure?"
        />
        <Textarea name="journal" placeholder="Daily reflection" />
        <Button disabled={pending}>Save reflection</Button>
      </form>
    </Card>
  );
}

export function QuickCalendarForm({
  athleteId,
  teamId,
}: {
  athleteId?: string;
  teamId?: string | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <form
        className="grid gap-4"
        action={(formData) =>
          startTransition(async () => {
            await createCalendarEventAction({
              athleteId: athleteId ?? null,
              teamId: teamId ?? null,
              title: String(formData.get("title")),
              description: String(formData.get("description") ?? ""),
              startsAt: new Date(String(formData.get("startsAt"))).toISOString(),
              endsAt: new Date(String(formData.get("endsAt"))).toISOString(),
              eventType: "reminder",
              completed: false,
            });
            toast.success("Event scheduled.");
          })
        }
      >
        <Input name="title" placeholder="Event title" />
        <Textarea name="description" placeholder="Description" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="startsAt" type="datetime-local" />
          <Input name="endsAt" type="datetime-local" />
        </div>
        <Button disabled={pending}>Add event</Button>
      </form>
    </Card>
  );
}

export function QuickVideoForm({ athleteId }: { athleteId: string }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <form
        className="grid gap-4"
        action={async (formData) => {
          setUploading(true);

          try {
            const file = formData.get("file");
            const videoType = String(formData.get("videoType") ?? "game_footage");
            let fileUrl = "/uploads/videos/demo-placeholder.svg";
            let mimeType = "image/svg+xml";
            const reviewSections = [
              String(formData.get("matchContext") ?? "").trim(),
              String(formData.get("playerQuestion") ?? "").trim(),
              String(formData.get("notes") ?? "").trim(),
            ].filter(Boolean);

            if (file instanceof File && file.size > 0) {
              const uploadData = new FormData();
              uploadData.append("bucket", "videos");
              uploadData.append("file", file);
              const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
              });
              const payload = (await response.json()) as {
                error?: string;
                fileUrl?: string;
              };

              if (!response.ok || !payload.fileUrl) {
                throw new Error(payload.error ?? "Upload failed.");
              }

              fileUrl = payload.fileUrl;
              mimeType = file.type || mimeType;
            }

            const asset = await createVideoAssetAction(athleteId, {
              title: String(formData.get("title")),
              videoType: videoType as
                | "shooting"
                | "passing"
                | "game_footage"
                | "defending"
                | "sprint_form",
              fileUrl,
              mimeType,
              thumbnailUrl: null,
              thumbnails: [],
              durationSeconds: null,
              notes: reviewSections.join("\n\n"),
              tags:
                String(formData.get("tags") ?? "")
                  .split(",")
                  .map((entry) => entry.trim())
                  .filter(Boolean) ?? [],
              timestamps: [],
              analysisStatus: "pending",
              analysis: null,
            });

            toast.success("Clip uploaded and analyzed.");
            if (asset?.id) {
              router.push(`/app/videos/${asset.id}`);
              router.refresh();
            }
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to upload clip.");
          } finally {
            setUploading(false);
          }
        }}
      >
        <div>
          <Label htmlFor="title">Clip title</Label>
          <Input id="title" name="title" placeholder="Full-match pressing sequence" />
        </div>
        <div>
          <Label htmlFor="videoType">Clip type</Label>
          <select
            id="videoType"
            name="videoType"
            className="flex h-11 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white outline-none"
            defaultValue="game_footage"
          >
            <option value="game_footage">Game footage</option>
            <option value="shooting">Shooting</option>
            <option value="passing">Passing</option>
            <option value="defending">Defending</option>
            <option value="sprint_form">Sprint form</option>
          </select>
        </div>
        <div>
          <Label htmlFor="matchContext">Match or session context</Label>
          <Input
            id="matchContext"
            name="matchContext"
            placeholder="U17 league match, second half, playing left wing in a 4-3-3"
          />
        </div>
        <div>
          <Label htmlFor="playerQuestion">What do you want the review to focus on?</Label>
          <Input
            id="playerQuestion"
            name="playerQuestion"
            placeholder="Did my pressing angle and recovery runs create real value?"
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" name="tags" placeholder="pressing, transition, striker" />
        </div>
        <div>
          <Label htmlFor="notes">What do you want feedback on?</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Tell SmartPlay what this clip is, match context, and what you want evaluated."
          />
        </div>
        <div>
          <Label htmlFor="file">Upload game footage or a still frame</Label>
          <Input id="file" name="file" type="file" accept="video/*,image/*" />
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
          Best results come from a focused clip plus a clear review question. SmartPlay samples
          frames, analyzes soccer-specific movement and decisions, and returns timestamped coaching
          notes. If no live AI key is configured, it falls back to a structured low-confidence
          review instead of pretending it saw more than it did.
        </div>
        <Button disabled={uploading}>{uploading ? "Uploading..." : "Add clip"}</Button>
      </form>
    </Card>
  );
}
