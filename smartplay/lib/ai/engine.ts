import {
  buildGoalNudgePrompt,
  buildMentalPrompt,
  buildNutritionPrompt,
  buildRecoveryPrompt,
  buildTrainingFeedbackPrompt,
  buildWeeklySummaryPrompt,
} from "@/lib/ai/prompts";
import type { AthleteInsightContext } from "@/lib/ai/types";

async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model =
    process.env.OPENAI_TEXT_MODEL ??
    process.env.OPENAI_MODEL ??
    "gpt-4.1-mini";

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are SmartPlay AI Coach. Be concise, practical, supportive, and youth-soccer aware.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return json.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

function fallbackTrainingFeedback(context: AthleteInsightContext) {
  if (context.trainingLoadDelta > 12 && context.readinessScore < 78) {
    return "Your workload climbed faster than your readiness this week. Shift the next session toward technical quality or controlled recovery so speed work stays sharp.";
  }

  if (context.sprintDelta < -10) {
    return "Sprint exposure dipped this week, which can happen after dense match load. Add one shorter acceleration block instead of forcing another heavy session.";
  }

  return "Your workload is trending in a productive range. Keep stacking high-quality reps and use one deliberate focus cue to make the session count.";
}

function fallbackNutritionSuggestions(context: AthleteInsightContext) {
  const proteinGap = context.proteinTarget - context.proteinGrams;

  if (proteinGap > 20) {
    return context.budgetFriendly
      ? "Protein is running low for your target. Add one affordable anchor today like eggs, Greek yogurt, tuna packets, beans, or milk after training."
      : "Protein is running low for your target. Add one extra protein-focused snack after training and pair it with carbs to speed recovery.";
  }

  if (context.hydrationScore < 7) {
    return "Hydration is the easier win today. Finish two more bottles of water and add electrolytes if the next session is high-speed or outdoors.";
  }

  return "Fueling is mostly on track. Keep a simple pre-session carb option ready so your energy stays high without overcomplicating the plan.";
}

function fallbackRecoveryAdvice(context: AthleteInsightContext) {
  if (context.readinessScore < 75 || context.recoveryScore < 75) {
    return "Recovery indicators dipped after recent load. Prioritize sleep, a lighter technical day, and 10-15 minutes of mobility before the next intense block.";
  }

  if (context.sleepHours < 7.5) {
    return "Your body can handle work, but sleep is the weak link. Protect your bedtime tonight so tomorrow’s quality is not built on borrowed energy.";
  }

  return "Recovery is holding up well. Keep the cooldown and hydration habits that are helping you absorb training instead of just surviving it.";
}

function fallbackMentalPrompt(context: AthleteInsightContext) {
  if (context.anxiety > 6) {
    return "Before training, take three slow breaths and repeat: I do not need perfect reps, I need committed reps. Focus on the first action you can control, not the whole session.";
  }

  return "Your confidence is trending in the right direction. Start the next session by naming one cue that matches your focus area, then attack the first five minutes with intent.";
}

function fallbackGoalNudge(context: AthleteInsightContext) {
  if (context.weakFootProgress !== undefined && context.weakFootProgress < 100) {
    return `Your weak-foot work is moving, but it is not finished. Close the week with one short rep block and protect the consistency you already built.`;
  }

  if (context.streakDays >= 4) {
    return "Your consistency streak is becoming a real edge. Keep the next action simple so you protect momentum instead of chasing a perfect day.";
  }

  return "Pick the next checkpoint that is easiest to control today. Small wins are what make the bigger goals believable.";
}

function fallbackWeeklySummary(context: AthleteInsightContext) {
  const proteinGap = Math.max(0, context.proteinTarget - context.proteinGrams);

  if (context.readinessScore < 78) {
    return `${context.athleteName} stacked solid competitive volume this week, but recovery is carrying more stress than usual. Training quality is still there, though the next win is balancing the load with better sleep, hydration, and one lighter technical day. ${proteinGap > 0 ? `Closing the protein gap by about ${proteinGap}g would also make the recovery picture cleaner.` : ""}`.trim();
  }

  return `${context.athleteName} is building a strong week with productive load, stable readiness, and clear momentum around ${context.currentFocus.toLowerCase()}. The trend to protect now is consistency: keep fueling simple, hold onto the streak, and convert this week’s work into one more focused session instead of chasing extra volume.`;
}

async function resolveInsight(
  prompt: string,
  fallback: (context: AthleteInsightContext) => string,
  context: AthleteInsightContext,
) {
  const liveResponse = await callOpenAI(prompt);
  return liveResponse ?? fallback(context);
}

export async function summarizeAthleteWeek(context: AthleteInsightContext) {
  return resolveInsight(
    buildWeeklySummaryPrompt(context),
    fallbackWeeklySummary,
    context,
  );
}

export async function generateTrainingFeedback(context: AthleteInsightContext) {
  return resolveInsight(
    buildTrainingFeedbackPrompt(context),
    fallbackTrainingFeedback,
    context,
  );
}

export async function generateNutritionSuggestions(context: AthleteInsightContext) {
  return resolveInsight(
    buildNutritionPrompt(context),
    fallbackNutritionSuggestions,
    context,
  );
}

export async function generateRecoveryAdvice(context: AthleteInsightContext) {
  return resolveInsight(
    buildRecoveryPrompt(context),
    fallbackRecoveryAdvice,
    context,
  );
}

export async function generateMentalPrompt(context: AthleteInsightContext) {
  return resolveInsight(buildMentalPrompt(context), fallbackMentalPrompt, context);
}

export async function generateGoalNudge(context: AthleteInsightContext) {
  return resolveInsight(buildGoalNudgePrompt(context), fallbackGoalNudge, context);
}
