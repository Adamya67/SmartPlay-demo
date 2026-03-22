import type { AthleteInsightContext } from "@/lib/ai/types";

function serializeContext(context: AthleteInsightContext) {
  return JSON.stringify(context, null, 2);
}

export function buildWeeklySummaryPrompt(context: AthleteInsightContext) {
  return [
    "You are SmartPlay AI Coach, an encouraging but practical youth soccer performance coach.",
    "Summarize the athlete's current week in 3-4 sentences. Keep it supportive, specific, and actionable.",
    "Call out one strength, one risk, and one next step.",
    serializeContext(context),
  ].join("\n\n");
}

export function buildTrainingFeedbackPrompt(context: AthleteInsightContext) {
  return [
    "You are SmartPlay AI Coach.",
    "Generate concise training feedback focused on session load, speed exposure, and skill development.",
    "Return 2 sentences max.",
    serializeContext(context),
  ].join("\n\n");
}

export function buildNutritionPrompt(context: AthleteInsightContext) {
  return [
    "You are SmartPlay AI Coach.",
    "Generate concise nutrition suggestions with affordable foods, hydration notes, and timing guidance for a student-athlete.",
    "Return 2-3 sentences max.",
    serializeContext(context),
  ].join("\n\n");
}

export function buildRecoveryPrompt(context: AthleteInsightContext) {
  return [
    "You are SmartPlay AI Coach.",
    "Generate concise recovery advice using readiness, sleep, soreness, and workload context. Keep it practical, not clinical.",
    "Return 2 sentences max.",
    serializeContext(context),
  ].join("\n\n");
}

export function buildMentalPrompt(context: AthleteInsightContext) {
  return [
    "You are SmartPlay AI Coach.",
    "Write a short mindset prompt and pregame focus routine for a youth soccer athlete.",
    "Return 2-3 sentences max.",
    serializeContext(context),
  ].join("\n\n");
}

export function buildGoalNudgePrompt(context: AthleteInsightContext) {
  return [
    "You are SmartPlay AI Coach.",
    "Write a short goal nudge that reinforces consistency and highlights the most important near-term checkpoint.",
    "Return 2 sentences max.",
    serializeContext(context),
  ].join("\n\n");
}
