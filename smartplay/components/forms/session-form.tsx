"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { createSessionAction } from "@/app/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const sessionSchema = z.object({
  title: z.string().min(2),
  occurredAt: z.string().min(1),
  durationMinutes: z.coerce.number().min(10),
  sessionType: z.enum([
    "team_practice",
    "individual_training",
    "match",
    "gym_workout",
    "conditioning",
    "recovery",
    "technical_drill",
    "film_review",
    "mobility",
  ]),
  intensity: z.coerce.number().min(1).max(10),
  rpe: z.coerce.number().min(1).max(10),
  distanceKm: z.coerce.number().optional(),
  sprintCount: z.coerce.number().optional(),
  shotsTaken: z.coerce.number().optional(),
  passes: z.coerce.number().optional(),
  dribbles: z.coerce.number().optional(),
  touches: z.coerce.number().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
  weather: z.string().optional(),
  location: z.string().min(2),
});

type SessionValues = z.infer<typeof sessionSchema>;
type SessionFormInput = z.input<typeof sessionSchema>;

export function SessionForm({ athleteId }: { athleteId: string }) {
  const [pending, startTransition] = useTransition();
  const form = useForm<SessionFormInput, unknown, SessionValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      sessionType: "individual_training",
      intensity: 7,
      rpe: 7,
      location: "Training Ground",
      occurredAt: new Date().toISOString().slice(0, 16),
    },
  });

  function onSubmit(values: SessionValues) {
    startTransition(async () => {
      await createSessionAction(athleteId, {
        title: values.title,
        occurredAt: new Date(values.occurredAt).toISOString(),
        durationMinutes: values.durationMinutes,
        sessionType: values.sessionType,
        intensity: values.intensity,
        rpe: values.rpe,
        distanceKm: values.distanceKm ?? null,
        sprintCount: values.sprintCount ?? null,
        shotsTaken: values.shotsTaken ?? null,
        passes: values.passes ?? null,
        dribbles: values.dribbles ?? null,
        touches: values.touches ?? null,
        notes: values.notes ?? null,
        tags: values.tags?.split(",").map((entry) => entry.trim()).filter(Boolean) ?? [],
        weather: values.weather ?? null,
        location: values.location,
        mediaUrls: [],
        teamId: null,
      });
      toast.success("Session logged.");
      form.reset();
    });
  }

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
        </div>
        <div>
          <Label htmlFor="occurredAt">Date / time</Label>
          <Input id="occurredAt" type="datetime-local" {...form.register("occurredAt")} />
        </div>
        <div>
          <Label htmlFor="sessionType">Session type</Label>
          <Input id="sessionType" {...form.register("sessionType")} />
        </div>
        <div>
          <Label htmlFor="durationMinutes">Duration</Label>
          <Input id="durationMinutes" type="number" {...form.register("durationMinutes")} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...form.register("location")} />
        </div>
        <div>
          <Label htmlFor="intensity">Intensity</Label>
          <Input id="intensity" type="number" {...form.register("intensity")} />
        </div>
        <div>
          <Label htmlFor="rpe">RPE</Label>
          <Input id="rpe" type="number" {...form.register("rpe")} />
        </div>
        <div>
          <Label htmlFor="distanceKm">Distance (km)</Label>
          <Input id="distanceKm" type="number" step="0.1" {...form.register("distanceKm")} />
        </div>
        <div>
          <Label htmlFor="sprintCount">Sprint count</Label>
          <Input id="sprintCount" type="number" {...form.register("sprintCount")} />
        </div>
        <div>
          <Label htmlFor="shotsTaken">Shots</Label>
          <Input id="shotsTaken" type="number" {...form.register("shotsTaken")} />
        </div>
        <div>
          <Label htmlFor="touches">Touches</Label>
          <Input id="touches" type="number" {...form.register("touches")} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="weak-foot, finishing, home" {...form.register("tags")} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...form.register("notes")} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button disabled={pending} type="submit">
            Log session
          </Button>
        </div>
      </form>
    </Card>
  );
}
