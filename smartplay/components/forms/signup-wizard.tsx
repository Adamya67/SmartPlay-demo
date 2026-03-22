"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const signupSchema = z.object({
  role: z.enum(["athlete", "coach", "parent"]),
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  city: z.string().optional(),
  age: z.string().optional(),
  schoolClub: z.string().optional(),
  graduationYear: z.string().optional(),
  primarySport: z.string().optional(),
  position: z.string().optional(),
  dominantFoot: z.string().optional(),
  heightCm: z.string().optional(),
  weightKg: z.string().optional(),
  goals: z.string().optional(),
  skillLevel: z.string().optional(),
  equipmentAccess: z.string().optional(),
  trainingFrequency: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  injuryHistory: z.string().optional(),
  targetMetrics: z.string().optional(),
  teamName: z.string().optional(),
  ageGroup: z.string().optional(),
  coachingRole: z.string().optional(),
  organization: z.string().optional(),
  athletesCoached: z.string().optional(),
  relation: z.string().optional(),
  athleteNames: z.string().optional(),
  parentGoals: z.string().optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

const athleteSteps = ["Account", "Player profile", "Performance", "Finish"];
const coachSteps = ["Account", "Coaching profile", "Finish"];
const parentSteps = ["Account", "Family profile", "Finish"];

function toList(value?: string) {
  return value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function SignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "athlete",
      primarySport: "Soccer",
      dominantFoot: "Right",
      trainingFrequency: "5 sessions weekly",
      skillLevel: "Developing competitive athlete",
      goals: "Train 5 times per week, Reach 120g protein daily",
      targetMetrics: "Protein:120g/day, Weak-foot reps:100/week",
      equipmentAccess: "Ball, cones, resistance bands",
      dietaryPreferences: "High-protein, budget-friendly",
      parentGoals: "Monitor progress, nutrition, schedule",
    },
  });

  const role = useWatch({
    control: form.control,
    name: "role",
  });
  const steps =
    role === "coach" ? coachSteps : role === "parent" ? parentSteps : athleteSteps;

  const progress = ((step + 1) / steps.length) * 100;

  async function handleSubmit(values: SignupValues) {
    setLoading(true);

    const onboarding =
      values.role === "athlete"
        ? {
            age: values.age,
            schoolClub: values.schoolClub,
            graduationYear: values.graduationYear,
            primarySport: values.primarySport,
            position: values.position,
            dominantFoot: values.dominantFoot,
            heightCm: values.heightCm,
            weightKg: values.weightKg,
            goals: toList(values.goals),
            skillLevel: values.skillLevel,
            equipmentAccess: toList(values.equipmentAccess),
            trainingFrequency: values.trainingFrequency,
            dietaryPreferences: toList(values.dietaryPreferences),
            injuryHistory: values.injuryHistory,
            targetMetrics: toList(values.targetMetrics)?.map((entry) => {
              const [label, target] = entry.split(":");
              return { label, target };
            }),
            homeTrainingPriority: true,
          }
        : values.role === "coach"
          ? {
              teamName: values.teamName,
              ageGroup: values.ageGroup,
              coachingRole: values.coachingRole,
              organization: values.organization,
              athletesCoached: values.athletesCoached,
            }
          : {
              relation: values.relation,
              athleteNames: toList(values.athleteNames),
              goals: toList(values.parentGoals),
            };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        city: values.city,
        onboarding,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(payload?.error ?? "Unable to create your account.");
      setLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      toast.error("Account created, but auto-login failed. Please log in manually.");
      router.push("/login");
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <Card className="bg-white/80 dark:bg-white/5">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Step {step + 1}</span>
          <span>{steps[step]}</span>
        </div>
        <Progress className="mt-3" value={progress} />
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
        {step === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Role</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {["athlete", "coach", "parent"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => form.setValue("role", item as SignupValues["role"])}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      role === item
                        ? "border-lime-400/60 bg-lime-400/10 text-slate-950 dark:text-lime-100"
                        : "border-black/10 bg-white/50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...form.register("city")} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...form.register("email")} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
            </div>
          </div>
        ) : null}

        {role === "athlete" && step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" {...form.register("age")} />
            </div>
            <div>
              <Label htmlFor="graduationYear">Graduation year</Label>
              <Input id="graduationYear" {...form.register("graduationYear")} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="schoolClub">School / club</Label>
              <Input id="schoolClub" {...form.register("schoolClub")} />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" {...form.register("position")} />
            </div>
            <div>
              <Label htmlFor="dominantFoot">Dominant foot</Label>
              <Input id="dominantFoot" {...form.register("dominantFoot")} />
            </div>
            <div>
              <Label htmlFor="heightCm">Height (cm)</Label>
              <Input id="heightCm" {...form.register("heightCm")} />
            </div>
            <div>
              <Label htmlFor="weightKg">Weight (kg)</Label>
              <Input id="weightKg" {...form.register("weightKg")} />
            </div>
          </div>
        ) : null}

        {role === "athlete" && step === 2 ? (
          <div className="grid gap-4">
            <div>
              <Label htmlFor="goals">Goals</Label>
              <Textarea id="goals" {...form.register("goals")} />
            </div>
            <div>
              <Label htmlFor="skillLevel">Skill level</Label>
              <Input id="skillLevel" {...form.register("skillLevel")} />
            </div>
            <div>
              <Label htmlFor="equipmentAccess">Equipment access</Label>
              <Textarea id="equipmentAccess" {...form.register("equipmentAccess")} />
            </div>
            <div>
              <Label htmlFor="trainingFrequency">Training frequency</Label>
              <Input id="trainingFrequency" {...form.register("trainingFrequency")} />
            </div>
            <div>
              <Label htmlFor="dietaryPreferences">Dietary preferences</Label>
              <Textarea id="dietaryPreferences" {...form.register("dietaryPreferences")} />
            </div>
            <div>
              <Label htmlFor="injuryHistory">Injury history</Label>
              <Textarea id="injuryHistory" {...form.register("injuryHistory")} />
            </div>
            <div>
              <Label htmlFor="targetMetrics">Target metrics</Label>
              <Textarea id="targetMetrics" {...form.register("targetMetrics")} />
            </div>
          </div>
        ) : null}

        {role === "athlete" && step === 3 ? (
          <div className="grid gap-4">
            <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Athlete onboarding complete
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              SmartPlay will create a premium athlete dashboard with training, wellness, nutrition, mental performance, and recruiting context.
            </p>
          </div>
        ) : null}

        {role === "coach" && step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="teamName">Team name</Label>
              <Input id="teamName" {...form.register("teamName")} />
            </div>
            <div>
              <Label htmlFor="ageGroup">Age group</Label>
              <Input id="ageGroup" {...form.register("ageGroup")} />
            </div>
            <div>
              <Label htmlFor="coachingRole">Coaching role</Label>
              <Input id="coachingRole" {...form.register("coachingRole")} />
            </div>
            <div>
              <Label htmlFor="organization">Club / school</Label>
              <Input id="organization" {...form.register("organization")} />
            </div>
            <div>
              <Label htmlFor="athletesCoached">Athletes coached</Label>
              <Input id="athletesCoached" {...form.register("athletesCoached")} />
            </div>
          </div>
        ) : null}

        {role === "coach" && step === 2 ? (
          <div className="grid gap-4">
            <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Coach workspace ready
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              You’ll land in the coach command center with roster analytics, readiness alerts, drill assignments, and video review tools.
            </p>
          </div>
        ) : null}

        {role === "parent" && step === 1 ? (
          <div className="grid gap-4">
            <div>
              <Label htmlFor="relation">Relation</Label>
              <Input id="relation" {...form.register("relation")} />
            </div>
            <div>
              <Label htmlFor="athleteNames">Athlete name(s)</Label>
              <Textarea id="athleteNames" {...form.register("athleteNames")} />
            </div>
            <div>
              <Label htmlFor="parentGoals">Parent goals</Label>
              <Textarea id="parentGoals" {...form.register("parentGoals")} />
            </div>
          </div>
        ) : null}

        {role === "parent" && step === 2 ? (
          <div className="grid gap-4">
            <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Parent view ready
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              SmartPlay keeps parent visibility supportive and high-level: consistency, hydration, wellness, goals, and schedule.
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0 || loading}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
            >
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Create account
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
