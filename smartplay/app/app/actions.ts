"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import { createBillingPortalUrl, createPlayerCheckoutSession } from "@/lib/billing/service";
import {
  createCalendarEventEntry,
  createCoachCommentEntry,
  createGoalEntry,
  createJournalEntry,
  createMentalCheckInEntry,
  createNutritionLogEntry,
  createSessionEntry,
  createVideoAssetEntry,
  createVideoCommentEntry,
  createWellnessCheckEntry,
  startPlayerMembership,
} from "@/lib/data/service";

export async function createSessionAction(
  athleteId: string,
  input: Parameters<typeof createSessionEntry>[2],
) {
  const session = await requireSession();
  await createSessionEntry(session.user.id, athleteId, input);
  revalidatePath("/app/dashboard");
  revalidatePath("/app/sessions");
  revalidatePath("/app/analytics");
}

export async function createGoalAction(
  athleteId: string,
  input: Parameters<typeof createGoalEntry>[1],
) {
  await requireSession();
  await createGoalEntry(athleteId, input);
  revalidatePath("/app/goals");
  revalidatePath("/app/dashboard");
}

export async function createNutritionLogAction(
  athleteId: string,
  input: Parameters<typeof createNutritionLogEntry>[1],
) {
  await requireSession();
  await createNutritionLogEntry(athleteId, input);
  revalidatePath("/app/nutrition");
  revalidatePath("/app/dashboard");
}

export async function createWellnessCheckAction(
  athleteId: string,
  input: Parameters<typeof createWellnessCheckEntry>[1],
) {
  await requireSession();
  await createWellnessCheckEntry(athleteId, input);
  revalidatePath("/app/wellness");
  revalidatePath("/app/dashboard");
}

export async function createMentalCheckInAction(
  athleteId: string,
  input: Parameters<typeof createMentalCheckInEntry>[1],
) {
  await requireSession();
  await createMentalCheckInEntry(athleteId, input);
  revalidatePath("/app/mental");
  revalidatePath("/app/dashboard");
}

export async function createJournalEntryAction(
  athleteId: string,
  input: Parameters<typeof createJournalEntry>[1],
) {
  await requireSession();
  await createJournalEntry(athleteId, input);
  revalidatePath("/app/mental");
}

export async function createVideoAssetAction(
  athleteId: string,
  input: Parameters<typeof createVideoAssetEntry>[1],
) {
  await requireSession();
  const asset = await createVideoAssetEntry(athleteId, input);
  revalidatePath("/app/videos");
  revalidatePath("/app/profile");
  revalidatePath("/app/coach/reviews");
  return asset;
}

export async function createCalendarEventAction(
  input: Parameters<typeof createCalendarEventEntry>[1],
) {
  const session = await requireSession();
  await createCalendarEventEntry(session.user.id, input);
  revalidatePath("/app/calendar");
  revalidatePath("/app/dashboard");
}

export async function createCoachCommentAction(
  input: Parameters<typeof createCoachCommentEntry>[1],
) {
  const session = await requireSession();
  await createCoachCommentEntry(session.user.id, input);
  revalidatePath("/app/coach");
  revalidatePath(`/app/coach/athletes/${input.athleteId}`);
}

export async function createVideoCommentAction(
  input: Parameters<typeof createVideoCommentEntry>[1],
) {
  const session = await requireSession();
  const result = await createVideoCommentEntry(session.user.id, input);
  revalidatePath(`/app/videos/${input.videoId}`);
  revalidatePath("/app/coach/reviews");
  revalidatePath(`/app/coach/athletes/${result.athleteId}`);
  return result.comment;
}

export async function startPlayerMembershipAction() {
  const session = await requireSession();
  const checkoutUrl = await createPlayerCheckoutSession(session.user.id);
  redirect(checkoutUrl);
}

export async function openBillingPortalAction() {
  const session = await requireSession();
  const portalUrl = await createBillingPortalUrl(session.user.id);
  redirect(portalUrl);
}

export async function startLocalPlayerMembershipAction() {
  const session = await requireSession();
  await startPlayerMembership(session.user.id);
  revalidatePath("/app");
  revalidatePath("/app/settings");
  revalidatePath("/app/dashboard");
}
