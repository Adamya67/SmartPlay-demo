import { randomUUID } from "node:crypto";

import type {
  AIInsightRecord,
  AnnouncementRecord,
  AppRole,
  AppUserRecord,
  CalendarEventRecord,
  CoachCommentRecord,
  DemoDatabase,
  DrillAssignmentRecord,
  GoalMilestoneRecord,
  GoalRecord,
  JournalEntryRecord,
  MentalCheckInRecord,
  NutritionLogRecord,
  SessionMetricRecord,
  SessionRecord,
  TeamRecord,
  VideoAssetRecord,
  VideoCommentRecord,
  WellnessCheckRecord,
} from "@/types/domain";
import {
  differenceInCalendarDays,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
  startOfWeek,
  subDays,
  subWeeks,
} from "date-fns";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  generateGoalNudge,
  generateMentalPrompt,
  generateNutritionSuggestions,
  generateRecoveryAdvice,
  generateTrainingFeedback,
  summarizeAthleteWeek,
} from "@/lib/ai/engine";
import type { AthleteInsightContext } from "@/lib/ai/types";
import { analyzeSoccerVideoAsset } from "@/lib/ai/video-analysis";
import { createDemoDatabase } from "@/lib/data/demo-source";
import {
  isDemoMode,
  readDemoDatabase,
  writeDemoDatabase,
} from "@/lib/data/demo-store";
import { prisma } from "@/lib/db/prisma";

const BUDGET_MEALS = [
  "Egg wrap with fruit",
  "Greek yogurt, oats, and peanut butter",
  "Rice, beans, and chicken thighs",
  "Tuna packet, crackers, and banana",
];

const RECOVERY_LIBRARY = [
  "8-minute lower-leg cooldown",
  "Foam rolling for quads and calves",
  "Sleep hygiene reset checklist",
  "Equipment-light hip mobility flow",
];

const DRILL_TEMPLATES = [
  {
    title: "Shooting workout",
    description: "Finishing from three angles with a composure cue on each rep.",
  },
  {
    title: "Speed session",
    description: "Acceleration mechanics plus 10-20m repeat sprint exposures.",
  },
  {
    title: "Ball mastery",
    description: "Tight-space touches and first-touch exits with limited equipment.",
  },
  {
    title: "Leg day",
    description: "Lower-body strength session with posterior-chain emphasis.",
  },
  {
    title: "Recovery day",
    description: "Mobility, tissue work, hydration, and walking volume.",
  },
];

const REPORT_SECTIONS = [
  "Training load + readiness snapshot",
  "Technical growth markers",
  "Nutrition and hydration adherence",
  "Mindset + reflection highlights",
];

type AthleteContext = {
  user: AppUserRecord;
  profile: DemoDatabase["athleteProfiles"][number];
  team?: TeamRecord;
  sessions: SessionRecord[];
  sessionMetrics: SessionMetricRecord[];
  goals: GoalRecord[];
  goalMilestones: GoalMilestoneRecord[];
  nutritionLogs: NutritionLogRecord[];
  wellnessChecks: WellnessCheckRecord[];
  mentalCheckIns: MentalCheckInRecord[];
  journalEntries: JournalEntryRecord[];
  videoAssets: VideoAssetRecord[];
  videoComments: VideoCommentRecord[];
  drillAssignments: DrillAssignmentRecord[];
  coachComments: CoachCommentRecord[];
  announcements: AnnouncementRecord[];
  calendarEvents: CalendarEventRecord[];
  aiInsights: AIInsightRecord[];
  notifications: DemoDatabase["notifications"];
  badges: DemoDatabase["achievementBadges"];
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return sum(values) / values.length;
}

function sortDescendingByDate<T extends { createdAt?: string; occurredAt?: string }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    const aValue = a.occurredAt ?? a.createdAt ?? "";
    const bValue = b.occurredAt ?? b.createdAt ?? "";
    return parseISO(bValue).getTime() - parseISO(aValue).getTime();
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeId(prefix: string) {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

function asStringArray(value: Prisma.JsonValue | null | undefined) {
  return Array.isArray(value) ? value.map(String) : undefined;
}

function asTimestampArray(value: Prisma.JsonValue | null | undefined) {
  return Array.isArray(value)
    ? (value as unknown as Array<{ label: string; value: string }>)
    : [];
}

function asVideoAnalysis(value: Prisma.JsonValue | null | undefined) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as unknown as VideoAssetRecord["analysis"])
    : null;
}

function asPrismaJson(value: unknown) {
  return value as Prisma.InputJsonValue;
}

function iso(value: Date) {
  return value.toISOString();
}

async function loadDatabaseFromPrisma(): Promise<DemoDatabase> {
  const [
    users,
    athleteProfiles,
    coachProfiles,
    parentProfiles,
    teams,
    teamMembers,
    sessions,
    sessionMetrics,
    goals,
    goalMilestones,
    nutritionLogs,
    wellnessChecks,
    mentalCheckIns,
    journalEntries,
    videoAssets,
    videoComments,
    drillAssignments,
    coachComments,
    announcements,
    notifications,
    achievementBadges,
    calendarEvents,
    aiInsights,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.athleteProfile.findMany(),
    prisma.coachProfile.findMany(),
    prisma.parentProfile.findMany(),
    prisma.team.findMany(),
    prisma.teamMember.findMany(),
    prisma.session.findMany(),
    prisma.sessionMetric.findMany(),
    prisma.goal.findMany(),
    prisma.goalMilestone.findMany(),
    prisma.nutritionLog.findMany(),
    prisma.wellnessCheck.findMany(),
    prisma.mentalCheckIn.findMany(),
    prisma.journalEntry.findMany(),
    prisma.videoAsset.findMany(),
    prisma.videoComment.findMany(),
    prisma.drillAssignment.findMany(),
    prisma.coachComment.findMany(),
    prisma.announcement.findMany(),
    prisma.notification.findMany(),
    prisma.achievementBadge.findMany(),
    prisma.calendarEvent.findMany(),
    prisma.aiInsight.findMany(),
  ]);

  return {
    users: users.map((user) => ({
      ...user,
      image: user.image ?? null,
      linkedAthleteIds: asStringArray(user.linkedAthleteIds),
      city: user.city ?? undefined,
      createdAt: iso(user.createdAt),
      updatedAt: iso(user.updatedAt),
    })),
    athleteProfiles: athleteProfiles.map((profile) => ({
      ...profile,
      heightCm: profile.heightCm ?? null,
      weightKg: profile.weightKg ?? null,
      injuryHistory: profile.injuryHistory ?? null,
      targetMetrics: Array.isArray(profile.targetMetrics)
        ? (profile.targetMetrics as Array<{ label: string; target: string; unit?: string }>)
        : [],
      topStats: Array.isArray(profile.topStats)
        ? (profile.topStats as Array<{ label: string; value: string }>)
        : [],
      highlightVideoUrl: profile.highlightVideoUrl ?? null,
      createdAt: iso(profile.createdAt),
      updatedAt: iso(profile.updatedAt),
    })),
    coachProfiles: coachProfiles.map((profile) => ({
      ...profile,
      createdAt: iso(profile.createdAt),
      updatedAt: iso(profile.updatedAt),
    })),
    parentProfiles: parentProfiles.map((profile) => ({
      ...profile,
      createdAt: iso(profile.createdAt),
      updatedAt: iso(profile.updatedAt),
    })),
    teams: teams.map((team) => ({
      ...team,
      logoUrl: team.logoUrl ?? null,
      createdAt: iso(team.createdAt),
      updatedAt: iso(team.updatedAt),
    })),
    teamMembers: teamMembers.map((member) => ({
      ...member,
      createdAt: iso(member.createdAt),
    })),
    sessions: sessions.map((session) => ({
      ...session,
      teamId: session.teamId ?? null,
      coachId: session.coachId ?? null,
      distanceKm: session.distanceKm ?? null,
      sprintCount: session.sprintCount ?? null,
      shotsTaken: session.shotsTaken ?? null,
      passes: session.passes ?? null,
      dribbles: session.dribbles ?? null,
      touches: session.touches ?? null,
      notes: session.notes ?? null,
      weather: session.weather ?? null,
      createdAt: iso(session.createdAt),
      updatedAt: iso(session.updatedAt),
      occurredAt: iso(session.occurredAt),
    })),
    sessionMetrics: sessionMetrics.map((metric) => ({
      ...metric,
      createdAt: iso(metric.createdAt),
    })),
    goals: goals.map((goal) => ({
      ...goal,
      notes: goal.notes ?? null,
      deadline: iso(goal.deadline),
      createdAt: iso(goal.createdAt),
      updatedAt: iso(goal.updatedAt),
    })),
    goalMilestones: goalMilestones.map((milestone) => ({
      ...milestone,
      createdAt: iso(milestone.createdAt),
    })),
    nutritionLogs: nutritionLogs.map((log) => ({
      ...log,
      notes: log.notes ?? null,
      loggedAt: iso(log.loggedAt),
      createdAt: iso(log.createdAt),
    })),
    wellnessChecks: wellnessChecks.map((entry) => ({
      ...entry,
      injuryStatus: entry.injuryStatus ?? null,
      checkedAt: iso(entry.checkedAt),
      createdAt: iso(entry.createdAt),
    })),
    mentalCheckIns: mentalCheckIns.map((entry) => ({
      ...entry,
      checkedAt: iso(entry.checkedAt),
      createdAt: iso(entry.createdAt),
    })),
    journalEntries: journalEntries.map((entry) => ({
      ...entry,
      createdAt: iso(entry.createdAt),
    })),
    videoAssets: videoAssets.map((asset) => ({
      ...asset,
      mimeType: asset.mimeType ?? null,
      thumbnailUrl: asset.thumbnailUrl ?? null,
      thumbnails: asset.thumbnails ?? [],
      durationSeconds: asset.durationSeconds ?? null,
      notes: asset.notes ?? null,
      tags: asset.tags,
      timestamps: asTimestampArray(asset.timestamps),
      analysisStatus: asset.analysisStatus ?? "pending",
      analysis: asVideoAnalysis(asset.analysis),
      createdAt: iso(asset.createdAt),
    })),
    videoComments: videoComments.map((comment) => ({
      ...comment,
      strengthTag: comment.strengthTag ?? null,
      improvementTag: comment.improvementTag ?? null,
      createdAt: iso(comment.createdAt),
    })),
    drillAssignments: drillAssignments.map((assignment) => ({
      ...assignment,
      dueDate: iso(assignment.dueDate),
      createdAt: iso(assignment.createdAt),
    })),
    coachComments: coachComments.map((comment) => ({
      ...comment,
      sessionId: comment.sessionId ?? null,
      createdAt: iso(comment.createdAt),
    })),
    announcements: announcements.map((announcement) => ({
      ...announcement,
      createdAt: iso(announcement.createdAt),
    })),
    notifications: notifications.map((notification) => ({
      ...notification,
      createdAt: iso(notification.createdAt),
    })),
    achievementBadges: achievementBadges.map((badge) => ({
      ...badge,
      earnedAt: iso(badge.earnedAt),
    })),
    calendarEvents: calendarEvents.map((event) => ({
      ...event,
      athleteId: event.athleteId ?? null,
      teamId: event.teamId ?? null,
      description: event.description ?? null,
      startsAt: iso(event.startsAt),
      endsAt: iso(event.endsAt),
      eventType: event.eventType as CalendarEventRecord["eventType"],
      createdAt: iso(event.createdAt),
    })),
    aiInsights: aiInsights.map((insight) => ({
      ...insight,
      createdAt: iso(insight.createdAt),
    })),
  };
}

async function readDatabase(): Promise<DemoDatabase> {
  if (isDemoMode()) {
    return readDemoDatabase();
  }

  return loadDatabaseFromPrisma();
}

function getAthleteContext(database: DemoDatabase, athleteId: string): AthleteContext {
  const user = database.users.find((entry) => entry.id === athleteId);
  const profile = database.athleteProfiles.find((entry) => entry.userId === athleteId);

  if (!user || !profile) {
    throw new Error(`Athlete ${athleteId} not found.`);
  }

  const teamMember = database.teamMembers.find((member) => member.userId === athleteId);
  const team = teamMember
    ? database.teams.find((entry) => entry.id === teamMember.teamId)
    : undefined;

  return {
    user,
    profile,
    team,
    sessions: sortDescendingByDate(
      database.sessions.filter((entry) => entry.athleteId === athleteId),
    ),
    sessionMetrics: database.sessionMetrics.filter((entry) =>
      database.sessions.some(
        (session) =>
          session.id === entry.sessionId && session.athleteId === athleteId,
      ),
    ),
    goals: database.goals.filter((entry) => entry.athleteId === athleteId),
    goalMilestones: database.goalMilestones.filter((entry) =>
      database.goals.some((goal) => goal.id === entry.goalId && goal.athleteId === athleteId),
    ),
    nutritionLogs: sortDescendingByDate(
      database.nutritionLogs
        .filter((entry) => entry.athleteId === athleteId)
        .map((entry) => ({ ...entry, createdAt: entry.loggedAt })),
    ) as NutritionLogRecord[],
    wellnessChecks: sortDescendingByDate(
      database.wellnessChecks
        .filter((entry) => entry.athleteId === athleteId)
        .map((entry) => ({ ...entry, createdAt: entry.checkedAt })),
    ) as WellnessCheckRecord[],
    mentalCheckIns: sortDescendingByDate(
      database.mentalCheckIns
        .filter((entry) => entry.athleteId === athleteId)
        .map((entry) => ({ ...entry, createdAt: entry.checkedAt })),
    ) as MentalCheckInRecord[],
    journalEntries: sortDescendingByDate(
      database.journalEntries.filter((entry) => entry.athleteId === athleteId),
    ) as JournalEntryRecord[],
    videoAssets: sortDescendingByDate(
      database.videoAssets.filter((entry) => entry.athleteId === athleteId),
    ) as VideoAssetRecord[],
    videoComments: database.videoComments.filter((entry) =>
      database.videoAssets.some(
        (video) => video.id === entry.videoId && video.athleteId === athleteId,
      ),
    ),
    drillAssignments: database.drillAssignments.filter(
      (entry) => entry.athleteId === athleteId,
    ),
    coachComments: sortDescendingByDate(
      database.coachComments.filter((entry) => entry.athleteId === athleteId),
    ) as CoachCommentRecord[],
    announcements: team
      ? sortDescendingByDate(
          database.announcements.filter((entry) => entry.teamId === team.id),
        ) as AnnouncementRecord[]
      : [],
    calendarEvents: database.calendarEvents.filter(
      (entry) => entry.athleteId === athleteId || (team && entry.teamId === team.id),
    ),
    aiInsights: sortDescendingByDate(
      database.aiInsights.filter((entry) => entry.athleteId === athleteId),
    ) as AIInsightRecord[],
    notifications: sortDescendingByDate(
      database.notifications.filter((entry) => entry.userId === athleteId),
    ) as DemoDatabase["notifications"],
    badges: database.achievementBadges.filter((entry) => entry.athleteId === athleteId),
  };
}

function getWeeklyWindows(now = new Date()) {
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const previousWeekStart = subWeeks(currentWeekStart, 1);
  const previousWeekEnd = subDays(currentWeekStart, 1);

  return {
    currentWeekStart,
    currentWeekEnd,
    previousWeekStart,
    previousWeekEnd,
  };
}

function filterByInterval<T extends { occurredAt?: string; loggedAt?: string; checkedAt?: string }>(
  items: T[],
  start: Date,
  end: Date,
) {
  return items.filter((item) => {
    const value = item.occurredAt ?? item.loggedAt ?? item.checkedAt;
    if (!value) {
      return false;
    }
    const parsed = parseISO(value);
    return !isBefore(parsed, start) && !isAfter(parsed, end);
  });
}

function getStreakDays(entries: string[]) {
  if (!entries.length) {
    return 0;
  }

  const uniqueDays = [...new Set(entries.map((entry) => format(parseISO(entry), "yyyy-MM-dd")))]
    .sort()
    .reverse();

  const latest = parseISO(`${uniqueDays[0]}T00:00:00.000Z`);
  let streak = 0;

  for (const day of uniqueDays) {
    const parsed = parseISO(`${day}T00:00:00.000Z`);
    if (differenceInCalendarDays(latest, parsed) === streak) {
      streak += 1;
      continue;
    }
    break;
  }

  return streak;
}

function getMetricForSession(
  metrics: SessionMetricRecord[],
  sessionId: string,
) {
  return metrics.find((entry) => entry.sessionId === sessionId);
}

function buildTrendSeries(labelPrefix: string, current: number, baseline = 0.86) {
  return Array.from({ length: 6 }, (_, index) => {
    const modifier = 0.78 + index * 0.05;
    return {
      label: `${labelPrefix} ${index + 1}`,
      value: Math.round(current * Math.max(baseline, modifier)),
    };
  });
}

function buildReadinessSeries(current: number) {
  return Array.from({ length: 6 }, (_, index) => ({
    label: `W${index + 1}`,
    readiness: clamp(current - 7 + index * 2),
    recovery: clamp(current - 4 + index * 2),
  }));
}

function getHydrationProgress(logs: NutritionLogRecord[]) {
  const today = startOfDay(new Date());
  return sum(
    logs
      .filter((entry) => isSameDay(parseISO(entry.loggedAt), today))
      .map((entry) => entry.hydrationMl),
  );
}

function getNutritionTotals(logs: NutritionLogRecord[], days = 3) {
  const cutoff = subDays(new Date(), days - 1);
  const recent = logs.filter((entry) => !isBefore(parseISO(entry.loggedAt), cutoff));

  return {
    calories: Math.round(average(recent.map((entry) => entry.calories))),
    protein: Math.round(average(recent.map((entry) => entry.protein))),
    carbs: Math.round(average(recent.map((entry) => entry.carbs))),
    fats: Math.round(average(recent.map((entry) => entry.fats))),
    hydrationMl: Math.round(average(recent.map((entry) => entry.hydrationMl))),
  };
}

function buildAthleteInsightContext(context: AthleteContext) {
  const latestWellness = context.wellnessChecks[0];
  const latestMental = context.mentalCheckIns[0];
  const { currentWeekStart, currentWeekEnd, previousWeekStart, previousWeekEnd } =
    getWeeklyWindows();

  const currentSessions = filterByInterval(
    context.sessions,
    currentWeekStart,
    currentWeekEnd,
  );
  const previousSessions = filterByInterval(
    context.sessions,
    previousWeekStart,
    previousWeekEnd,
  );

  const currentLoad = sum(
    currentSessions.map(
      (session) => getMetricForSession(context.sessionMetrics, session.id)?.trainingLoad ?? 0,
    ),
  );
  const previousLoad = sum(
    previousSessions.map(
      (session) => getMetricForSession(context.sessionMetrics, session.id)?.trainingLoad ?? 0,
    ),
  );
  const currentSprints = sum(currentSessions.map((entry) => entry.sprintCount ?? 0));
  const previousSprints = sum(previousSessions.map((entry) => entry.sprintCount ?? 0));
  const nutritionTotals = getNutritionTotals(context.nutritionLogs);
  const streakDays = getStreakDays([
    ...context.sessions.map((entry) => entry.occurredAt),
    ...context.nutritionLogs.map((entry) => entry.loggedAt),
    ...context.wellnessChecks.map((entry) => entry.checkedAt),
  ]);

  const weakFootGoal = context.goals.find((goal) =>
    goal.title.toLowerCase().includes("weak-foot"),
  );

  return {
    athleteName: context.user.name,
    position: context.profile.position,
    goals: context.profile.goals,
    weeklyTrainingLoad: currentLoad,
    trainingLoadDelta:
      previousLoad > 0 ? Math.round(((currentLoad - previousLoad) / previousLoad) * 100) : 12,
    readinessScore: latestWellness?.readinessScore ?? 78,
    recoveryScore:
      latestWellness?.readinessScore !== undefined
        ? clamp(latestWellness.readinessScore + 2)
        : 80,
    sleepHours: latestWellness?.sleepHours ?? 7.6,
    hydrationScore: latestWellness?.hydration ?? 7,
    proteinGrams: nutritionTotals.protein,
    proteinTarget: 120,
    streakDays,
    sprintCount: currentSprints,
    sprintDelta:
      previousSprints > 0
        ? Math.round(((currentSprints - previousSprints) / previousSprints) * 100)
        : -18,
    weakFootProgress: weakFootGoal?.currentValue,
    confidence: latestMental?.confidence ?? 8,
    focus: latestMental?.focus ?? 8,
    anxiety: latestMental?.anxiety ?? 4,
    budgetFriendly:
      context.profile.dietaryPreferences.some((entry) =>
        entry.toLowerCase().includes("budget"),
      ) || context.profile.homeTrainingPriority,
    equipmentAccess: context.profile.equipmentAccess,
    currentFocus: context.profile.goals[0] ?? "Consistency",
  } satisfies AthleteInsightContext;
}

async function buildAthleteWorkspaceFromContext(context: AthleteContext) {
  const now = new Date();
  const { currentWeekStart, currentWeekEnd, previousWeekStart, previousWeekEnd } =
    getWeeklyWindows(now);
  const currentSessions = filterByInterval(
    context.sessions,
    currentWeekStart,
    currentWeekEnd,
  );
  const previousSessions = filterByInterval(
    context.sessions,
    previousWeekStart,
    previousWeekEnd,
  );

  const currentLoad = sum(
    currentSessions.map(
      (session) => getMetricForSession(context.sessionMetrics, session.id)?.trainingLoad ?? 0,
    ),
  );
  const previousLoad = sum(
    previousSessions.map(
      (session) => getMetricForSession(context.sessionMetrics, session.id)?.trainingLoad ?? 0,
    ),
  );
  const loadDelta =
    previousLoad > 0 ? Math.round(((currentLoad - previousLoad) / previousLoad) * 100) : 14;
  const readiness = context.wellnessChecks[0]?.readinessScore ?? 80;
  const recoveryScore = clamp(readiness + 3);
  const weeklyMinutes = sum(currentSessions.map((session) => session.durationMinutes));
  const shotsLogged = sum(currentSessions.map((entry) => entry.shotsTaken ?? 0));
  const sprintCount = sum(currentSessions.map((entry) => entry.sprintCount ?? 0));
  const drillCount = currentSessions.filter(
    (entry) =>
      entry.sessionType === "technical_drill" || entry.sessionType === "mobility",
  ).length;
  const wellnessMood = context.wellnessChecks[0]?.mood ?? 8;
  const nutritionTotals = getNutritionTotals(context.nutritionLogs);
  const hydrationToday = getHydrationProgress(context.nutritionLogs);
  const sleepHours = context.wellnessChecks[0]?.sleepHours ?? 7.8;
  const goalsProgress = Math.round(
    average(
      context.goals.map((goal) =>
        clamp((goal.currentValue / Math.max(goal.targetValue, 1)) * 100),
      ),
    ),
  );
  const streakDays = getStreakDays([
    ...context.sessions.map((entry) => entry.occurredAt),
    ...context.nutritionLogs.map((entry) => entry.loggedAt),
    ...context.wellnessChecks.map((entry) => entry.checkedAt),
  ]);
  const achievements = context.badges.slice(0, 3);
  const upcomingEvents = context.calendarEvents
    .filter((entry) => isAfter(parseISO(entry.startsAt), now))
    .sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime())
    .slice(0, 4);
  const sessionFeed = currentSessions.map((session) => ({
    ...session,
    metric: getMetricForSession(context.sessionMetrics, session.id),
  }));
  const insightContext = buildAthleteInsightContext(context);
  const [weeklySummary, trainingFeedback, nutritionAdvice, recoveryAdvice, mentalPrompt, goalNudge] =
    await Promise.all([
      summarizeAthleteWeek(insightContext),
      generateTrainingFeedback(insightContext),
      generateNutritionSuggestions(insightContext),
      generateRecoveryAdvice(insightContext),
      generateMentalPrompt(insightContext),
      generateGoalNudge(insightContext),
    ]);

  const alerts = [
    loadDelta > 10
      ? `Training load is up ${loadDelta}% from the prior week.`
      : "Training load is balanced versus last week.",
    insightContext.sprintDelta < 0
      ? `Sprint volume is down ${Math.abs(insightContext.sprintDelta)}% this week.`
      : "Sprint exposure is trending up this week.",
    hydrationToday < 1800
      ? "Hydration is behind target heading into the afternoon."
      : "Hydration is pacing well today.",
  ];

  const analytics = {
    overviewTrend: buildTrendSeries("W", currentLoad || 460, 0.82).map((entry, index) => ({
      name: `Week ${index + 1}`,
      trainingLoad: entry.value,
      readiness: clamp(readiness - 6 + index * 2),
      recovery: clamp(recoveryScore - 7 + index * 2),
    })),
    physical: {
      line: buildTrendSeries("S", sprintCount || 28, 0.8).map((entry, index) => ({
        name: `Week ${index + 1}`,
        sprintVolume: entry.value,
        speedSessions: Math.max(1, 2 + index),
        consistency: clamp(72 + index * 4),
      })),
      comparison: {
        current: currentLoad,
        previous: previousLoad || Math.round(currentLoad * 0.87),
      },
    },
    technical: {
      radar: [
        { metric: "Finishing", current: 78, target: 88 },
        { metric: "First Touch", current: 83, target: 90 },
        { metric: "Passing", current: 76, target: 86 },
        { metric: "Weak Foot", current: 72, target: 85 },
        { metric: "Decision Speed", current: 80, target: 88 },
      ],
      bar: [
        { name: "Shots", current: shotsLogged || 44, previous: Math.max(20, shotsLogged - 12) },
        { name: "Touches", current: 401, previous: 356 },
        { name: "Passing reps", current: 172, previous: 148 },
      ],
    },
    match: {
      stats: [
        { name: "Goals", value: 1 },
        { name: "Assists", value: 1 },
        { name: "Pass completion", value: 84 },
        { name: "Minutes", value: 86 },
      ],
      comparison: [
        { label: "Practice load", value: Math.round(currentLoad * 0.62) },
        { label: "Match load", value: Math.round(currentLoad * 0.38) },
      ],
    },
    nutrition: {
      bars: [
        { name: "Calories", value: nutritionTotals.calories, target: 2300 },
        { name: "Protein", value: nutritionTotals.protein, target: 120 },
        { name: "Hydration", value: nutritionTotals.hydrationMl, target: 2800 },
      ],
      tips: [nutritionAdvice, "Pregame: pair carbs with a lighter protein source 2-3 hours before kickoff."],
    },
    wellness: {
      trend: buildReadinessSeries(readiness).map((entry, index) => ({
        ...entry,
        label: `Week ${index + 1}`,
        sleep: Number((sleepHours - 0.6 + index * 0.2).toFixed(1)),
      })),
      flags:
        readiness < 75
          ? ["Overtraining risk is elevated."]
          : ["Recovery balance is in a manageable range."],
    },
    mental: {
      trend: [
        { name: "Confidence", current: insightContext.confidence },
        { name: "Focus", current: insightContext.focus },
        { name: "Anxiety", current: 10 - insightContext.anxiety },
      ],
      prompt: mentalPrompt,
    },
    reports: {
      weekly: REPORT_SECTIONS,
      monthly: REPORT_SECTIONS.map((entry) => `${entry} - month view`),
      coachSummary:
        "Training consistency stayed strong while recovery rebounded after match day. Nutrition is the main unlock for next-week readiness.",
    },
  };

  return {
    athlete: {
      user: context.user,
      profile: context.profile,
      team: context.team,
      shareUrl: `/athlete/${context.profile.slug}`,
    },
    dashboard: {
      weeklyTrainingLoad: currentLoad,
      readinessScore: readiness,
      recoveryScore,
      goalProgress: goalsProgress,
      recentSessions: sessionFeed,
      streakDays,
      performanceTrends: analytics.overviewTrend,
      upcomingEvents,
      hydrationSleep: {
        hydrationMl: hydrationToday,
        sleepHours,
      },
      aiSummary: weeklySummary,
      alerts,
      quickActions: [
        { label: "Log a session", href: "/app/sessions/new" },
        { label: "Check in wellness", href: "/app/wellness" },
        { label: "Upload a clip", href: "/app/videos" },
      ],
      widgets: [
        {
          label: "Training minutes this week",
          value: weeklyMinutes,
          change: loadDelta,
        },
        {
          label: "Shots logged",
          value: shotsLogged,
          change: 11,
        },
        {
          label: "Sprint count",
          value: sprintCount,
          change: insightContext.sprintDelta,
        },
        {
          label: "Skill drills completed",
          value: drillCount,
          change: 9,
        },
        {
          label: "Mood / wellness",
          value: wellnessMood,
          change: 4,
        },
        {
          label: "Calories / protein progress",
          value: `${nutritionTotals.calories} / ${nutritionTotals.protein}g`,
          change: -5,
        },
      ],
      achievements,
      coachComments: context.coachComments.slice(0, 3),
      latestVideo: context.videoAssets[0],
      recommendedToday:
        readiness < 78
          ? "Recommended today: mobility, technical touches, and extra hydration."
          : "Recommended today: quality technical work plus one short acceleration block.",
      weeklyConsistencyScore: clamp(68 + streakDays * 6),
    },
    analytics,
    sessions: {
      items: context.sessions.map((session) => ({
        ...session,
        metric: getMetricForSession(context.sessionMetrics, session.id),
      })),
      templates: DRILL_TEMPLATES,
      trainingFeedback,
    },
    goals: {
      items: context.goals.map((goal) => ({
        ...goal,
        progress: clamp((goal.currentValue / Math.max(goal.targetValue, 1)) * 100),
        milestones: context.goalMilestones.filter((entry) => entry.goalId === goal.id),
      })),
      goalNudge,
      badges: context.badges,
    },
    nutrition: {
      logs: context.nutritionLogs,
      targets: {
        calories: 2300,
        protein: 120,
        carbs: 280,
        fats: 70,
        hydrationMl: 2800,
      },
      summary: nutritionTotals,
      recommendations: [nutritionAdvice, "Postgame: add fast carbs plus 25-35g protein within 60 minutes."],
      groceryList: [
        "Eggs",
        "Greek yogurt",
        "Rice",
        "Beans",
        "Chicken thighs",
        "Bananas",
      ],
      budgetMeals: BUDGET_MEALS,
    },
    wellness: {
      latest: context.wellnessChecks[0],
      history: context.wellnessChecks,
      aiSummary: recoveryAdvice,
      flags:
        readiness < 78
          ? ["Recovery risk elevated after recent load."]
          : ["Readiness is steady for the next training block."],
      library: RECOVERY_LIBRARY,
    },
    mental: {
      latest: context.mentalCheckIns[0],
      history: context.mentalCheckIns,
      journals: context.journalEntries,
      quote:
        "Discipline is the bridge between where you train and who you become under pressure.",
      aiPrompt: mentalPrompt,
      pregameChecklist: [
        "Hydrate before warm-up",
        "Name one tactical cue",
        "Three slow breaths",
        "Attack the first action",
      ],
      breathingSeconds: 90,
      mindsetScore: clamp(
        average([
          insightContext.confidence * 10,
          insightContext.focus * 10,
          100 - insightContext.anxiety * 8,
        ]),
      ),
    },
    videos: {
      items: context.videoAssets.map((video) => ({
        ...video,
        comments: context.videoComments.filter((entry) => entry.videoId === video.id),
      })),
      reviewFeed: context.videoComments,
    },
    calendar: {
      events: context.calendarEvents.sort(
        (a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
      ),
      filters: [
        "team_practice",
        "match",
        "technical_drill",
        "recovery",
        "reminder",
      ],
    },
    communication: {
      announcements: context.announcements,
      assignments: context.drillAssignments,
      feedbackFeed: context.coachComments,
    },
    notifications: {
      items: context.notifications,
      unreadCount: context.notifications.filter((entry) => !entry.read).length,
    },
    settings: {
      notificationPreferences: [
        { label: "Goal deadlines", enabled: true },
        { label: "Coach comments", enabled: true },
        { label: "Wellness reminders", enabled: true },
      ],
      rolePermissions:
        "Athlete controls personal profile sharing. Parent and coach views are permission-aware.",
      units: "Metric + US mixed",
      theme: "System",
    },
    reports: {
      weekly: REPORT_SECTIONS.map((title) => ({
        title,
        detail: `${title} for ${context.user.name}`,
      })),
      monthly: REPORT_SECTIONS.map((title) => ({
        title,
        detail: `${title} over the last month for ${context.user.name}`,
      })),
      coachSummary:
        analytics.reports.coachSummary,
    },
  };
}

function getPrimaryAthleteIdForUser(database: DemoDatabase, userId: string) {
  const user = database.users.find((entry) => entry.id === userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role === "athlete") {
    return user.id;
  }

  if (user.role === "parent") {
    return user.linkedAthleteIds?.[0] ?? null;
  }

  return null;
}

function getCoachTeamIds(database: DemoDatabase, coachId: string) {
  return database.teamMembers
    .filter((entry) => entry.userId === coachId && entry.teamRole === "coach")
    .map((entry) => entry.teamId);
}

function canCoachAccessAthlete(
  database: DemoDatabase,
  coachId: string,
  athleteId: string,
) {
  const teamIds = getCoachTeamIds(database, coachId);

  return database.teamMembers.some(
    (entry) =>
      entry.userId === athleteId &&
      entry.teamRole === "athlete" &&
      teamIds.includes(entry.teamId),
  );
}

function canUserAccessAthlete(
  database: DemoDatabase,
  userId: string,
  role: AppRole,
  athleteId: string,
) {
  if (role === "admin") {
    return true;
  }

  if (role === "athlete") {
    return athleteId === userId;
  }

  if (role === "parent") {
    const parent = database.users.find((entry) => entry.id === userId);
    return parent?.linkedAthleteIds?.includes(athleteId) ?? false;
  }

  if (role === "coach") {
    return canCoachAccessAthlete(database, userId, athleteId);
  }

  return false;
}

export async function findUserByEmail(email: string) {
  const database = await readDatabase();
  return database.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export async function findUserById(userId: string) {
  const database = await readDatabase();
  return database.users.find((user) => user.id === userId) ?? null;
}

export async function getAthleteWorkspace(userId: string) {
  const database = await readDatabase();
  const athleteId = getPrimaryAthleteIdForUser(database, userId);

  if (!athleteId) {
    throw new Error("Athlete workspace not available for this account.");
  }

  const context = getAthleteContext(database, athleteId);
  return buildAthleteWorkspaceFromContext(context);
}

export async function getCoachWorkspace(userId: string) {
  const database = await readDatabase();
  const teamIds = getCoachTeamIds(database, userId);
  const teams = database.teams.filter((entry) => teamIds.includes(entry.id));
  const rosterAthleteIds = database.teamMembers
    .filter((entry) => teamIds.includes(entry.teamId) && entry.teamRole === "athlete")
    .map((entry) => entry.userId);

  const roster = await Promise.all(
    rosterAthleteIds.map(async (athleteId) => {
      const workspace = await buildAthleteWorkspaceFromContext(
        getAthleteContext(database, athleteId),
      );

      return {
        athleteId,
        name: workspace.athlete.user.name,
        position: workspace.athlete.profile.position,
        readiness: workspace.dashboard.readinessScore,
        weeklyLoad: workspace.dashboard.weeklyTrainingLoad,
        trend: workspace.dashboard.weeklyConsistencyScore,
        focusArea: workspace.athlete.profile.goals[0],
      };
    }),
  );

  const pendingReviews = database.videoAssets.filter((video) =>
    rosterAthleteIds.includes(video.athleteId),
  );

  return {
    teams,
    roster,
    announcements: database.announcements.filter((announcement) =>
      teamIds.includes(announcement.teamId),
    ),
    upcomingSessions: database.calendarEvents
      .filter(
        (event) =>
          (event.teamId && teamIds.includes(event.teamId)) &&
          isAfter(parseISO(event.startsAt), new Date()),
      )
      .sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime())
      .slice(0, 5),
    readinessAlerts: roster.filter((entry) => entry.readiness < 78),
    topImprovers: [...roster].sort((a, b) => b.trend - a.trend).slice(0, 3),
    lowEngagement: roster.filter((entry) => entry.trend < 76),
    pendingReviews,
    teamAnalytics: {
      averageReadiness: Math.round(average(roster.map((entry) => entry.readiness))),
      averageLoad: Math.round(average(roster.map((entry) => entry.weeklyLoad))),
      leaderboard: roster
        .map((entry, index) => ({
          rank: index + 1,
          name: entry.name,
          score: entry.trend,
        }))
        .sort((a, b) => b.score - a.score),
    },
  };
}

export async function getCoachAthleteWorkspace(userId: string, athleteId: string) {
  const database = await readDatabase();
  const hasAccess = canCoachAccessAthlete(database, userId, athleteId);

  if (!hasAccess) {
    throw new Error("Coach does not have access to this athlete.");
  }

  return buildAthleteWorkspaceFromContext(getAthleteContext(database, athleteId));
}

export async function getParentWorkspace(userId: string) {
  const database = await readDatabase();
  const parent = database.users.find((entry) => entry.id === userId && entry.role === "parent");

  if (!parent) {
    throw new Error("Parent account not found.");
  }

  const linkedAthleteIds = parent.linkedAthleteIds ?? [];
  const athletes = await Promise.all(
    linkedAthleteIds.map((athleteId) =>
      buildAthleteWorkspaceFromContext(getAthleteContext(database, athleteId)),
    ),
  );

  return {
    athletes: athletes.map((workspace) => ({
      id: workspace.athlete.user.id,
      name: workspace.athlete.user.name,
      consistency: workspace.dashboard.weeklyConsistencyScore,
      readiness: workspace.dashboard.readinessScore,
      goalProgress: workspace.dashboard.goalProgress,
      nutrition: workspace.nutrition.summary,
      upcomingEvents: workspace.dashboard.upcomingEvents,
      coachComments: workspace.dashboard.coachComments,
      alerts: workspace.dashboard.alerts,
      hydrationSleep: workspace.dashboard.hydrationSleep,
    })),
    notifications: database.notifications.filter((entry) => entry.userId === userId),
  };
}

export async function getAdminWorkspace() {
  const database = await readDatabase();
  const athleteIds = database.users
    .filter((entry) => entry.role === "athlete")
    .map((entry) => entry.id);
  const athletes = await Promise.all(
    athleteIds.map((athleteId) =>
      buildAthleteWorkspaceFromContext(getAthleteContext(database, athleteId)),
    ),
  );

  return {
    totals: {
      users: database.users.length,
      athletes: athleteIds.length,
      coaches: database.users.filter((entry) => entry.role === "coach").length,
      parents: database.users.filter((entry) => entry.role === "parent").length,
    },
    adoption: {
      weeklyActiveAthletes: athletes.filter(
        (entry) => entry.dashboard.recentSessions.length > 0,
      ).length,
      averageReadiness: Math.round(
        average(athletes.map((entry) => entry.dashboard.readinessScore)),
      ),
      averageGoalProgress: Math.round(
        average(athletes.map((entry) => entry.dashboard.goalProgress)),
      ),
    },
    riskFlags: athletes
      .filter((entry) => entry.dashboard.readinessScore < 78)
      .map((entry) => ({
        name: entry.athlete.user.name,
        reason: entry.dashboard.alerts[0],
      })),
    recentAnnouncements: database.announcements.slice(0, 5),
  };
}

export async function getPublicAthleteProfile(slug: string) {
  const database = await readDatabase();
  const profile = database.athleteProfiles.find((entry) => entry.slug === slug);

  if (!profile) {
    return null;
  }

  const workspace = await buildAthleteWorkspaceFromContext(
    getAthleteContext(database, profile.userId),
  );

  return {
    athlete: workspace.athlete,
    topStats: workspace.athlete.profile.topStats,
    goals: workspace.goals.items,
    highlights: workspace.videos.items.slice(0, 3),
    recentProgress: workspace.dashboard.performanceTrends,
    coachEndorsements: workspace.dashboard.coachComments,
  };
}

export async function getVideoDetailForViewer(
  userId: string,
  role: AppRole,
  videoId: string,
) {
  const database = await readDatabase();
  const video = database.videoAssets.find((entry) => entry.id === videoId);

  if (!video) {
    return null;
  }

  if (!canUserAccessAthlete(database, userId, role, video.athleteId)) {
    return null;
  }

  const context = getAthleteContext(database, video.athleteId);

  return {
    athlete: {
      user: context.user,
      profile: context.profile,
      team: context.team,
    },
    video: {
      ...video,
      comments: sortDescendingByDate(
        context.videoComments.filter((entry) => entry.videoId === video.id),
      ),
    },
    relatedVideos: sortDescendingByDate(
      context.videoAssets.filter((entry) => entry.id !== video.id),
    ).slice(0, 3),
  };
}

export async function getAthleteVideoDetail(userId: string, videoId: string) {
  return getVideoDetailForViewer(userId, "athlete", videoId);
}

export async function getNotificationsForUser(userId: string) {
  const database = await readDatabase();
  return database.notifications
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
}

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: AppRole;
  city?: string;
  onboarding: Record<string, unknown>;
};

export async function registerUser(input: RegisterInput) {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new Error("An account with that email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const userId = makeId("user");
  const createdAt = new Date().toISOString();
  const newUser: AppUserRecord = {
    id: userId,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: input.role,
    onboardingCompleted: true,
    linkedAthleteIds: input.role === "parent" ? [] : undefined,
    profileCompletion: 72,
    city: input.city,
    createdAt,
    updatedAt: createdAt,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.users.push(newUser);

    if (input.role === "athlete") {
      database.athleteProfiles.push({
        id: makeId("athlete-profile"),
        userId,
        slug: slugify(input.name),
        age: Number(input.onboarding.age ?? 16),
        schoolClub: String(input.onboarding.schoolClub ?? "Local club"),
        graduationYear: Number(input.onboarding.graduationYear ?? new Date().getFullYear() + 2),
        primarySport: String(input.onboarding.primarySport ?? "Soccer"),
        position: String(input.onboarding.position ?? "Midfielder"),
        dominantFoot: String(input.onboarding.dominantFoot ?? "Right"),
        heightCm: input.onboarding.heightCm ? Number(input.onboarding.heightCm) : null,
        weightKg: input.onboarding.weightKg ? Number(input.onboarding.weightKg) : null,
        goals: Array.isArray(input.onboarding.goals)
          ? (input.onboarding.goals as string[])
          : [String(input.onboarding.goals ?? "Improve consistently")],
        skillLevel: String(input.onboarding.skillLevel ?? "Developing"),
        equipmentAccess: Array.isArray(input.onboarding.equipmentAccess)
          ? (input.onboarding.equipmentAccess as string[])
          : [String(input.onboarding.equipmentAccess ?? "Ball only")],
        trainingFrequency: String(input.onboarding.trainingFrequency ?? "4 sessions weekly"),
        dietaryPreferences: Array.isArray(input.onboarding.dietaryPreferences)
          ? (input.onboarding.dietaryPreferences as string[])
          : [String(input.onboarding.dietaryPreferences ?? "Balanced")],
        injuryHistory: input.onboarding.injuryHistory
          ? String(input.onboarding.injuryHistory)
          : null,
        targetMetrics: Array.isArray(input.onboarding.targetMetrics)
          ? (input.onboarding.targetMetrics as Array<{
              label: string;
              target: string;
              unit?: string;
            }>)
          : [],
        bio: "New SmartPlay athlete profile.",
        club: String(input.onboarding.schoolClub ?? "Independent"),
        topStats: [],
        highlightVideoUrl: null,
        homeTrainingPriority: Boolean(input.onboarding.homeTrainingPriority ?? true),
        createdAt,
        updatedAt: createdAt,
      });
    }

    if (input.role === "coach") {
      database.coachProfiles.push({
        id: makeId("coach-profile"),
        userId,
        teamName: String(input.onboarding.teamName ?? "SmartPlay Team"),
        ageGroup: String(input.onboarding.ageGroup ?? "U17"),
        coachingRole: String(input.onboarding.coachingRole ?? "Coach"),
        organization: String(input.onboarding.organization ?? "Community Club"),
        athletesCoached: Number(input.onboarding.athletesCoached ?? 12),
        philosophy:
          "Train smarter, keep access practical, and help every athlete feel seen.",
        createdAt,
        updatedAt: createdAt,
      });
    }

    if (input.role === "parent") {
      database.parentProfiles.push({
        id: makeId("parent-profile"),
        userId,
        relation: String(input.onboarding.relation ?? "Parent"),
        athleteNames: Array.isArray(input.onboarding.athleteNames)
          ? (input.onboarding.athleteNames as string[])
          : [String(input.onboarding.athleteNames ?? "Athlete")],
        goals: Array.isArray(input.onboarding.goals)
          ? (input.onboarding.goals as string[])
          : [String(input.onboarding.goals ?? "Monitor progress")],
        createdAt,
        updatedAt: createdAt,
      });
    }

    await writeDemoDatabase(database);
  } else {
    await prisma.user.create({
      data: {
        ...newUser,
        linkedAthleteIds: newUser.linkedAthleteIds ?? Prisma.JsonNull,
      },
    });
  }

  return newUser;
}

type SessionInput = Omit<
  SessionRecord,
  "id" | "createdAt" | "updatedAt" | "athleteId" | "coachId"
>;

export async function createSessionEntry(
  actorId: string,
  athleteId: string,
  input: SessionInput,
) {
  const createdAt = new Date().toISOString();
  const sessionId = makeId("session");
  const trainingLoad = input.durationMinutes * input.rpe;

  const session: SessionRecord = {
    id: sessionId,
    athleteId,
    coachId: actorId !== athleteId ? actorId : null,
    createdAt,
    updatedAt: createdAt,
    ...input,
  };

  const metric: SessionMetricRecord = {
    id: makeId("metric"),
    sessionId,
    trainingLoad,
    caloriesBurned: Math.round(input.durationMinutes * Math.max(5, input.intensity + 2)),
    sprintVolume: input.sprintCount ?? 0,
    skillCompletions: Math.max(1, Math.round((input.touches ?? 24) / 12)),
    summary: `${input.title} logged successfully with ${input.durationMinutes} minutes of work.`,
    aiFeedback: "Session saved. SmartPlay AI Coach will use this in your next daily summary.",
    createdAt,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.sessions.push(session);
    database.sessionMetrics.push(metric);
    database.notifications.unshift({
      id: makeId("notification"),
      userId: athleteId,
      type: "session_reminder",
      title: "Session logged",
      body: `${input.title} updated your weekly training load.`,
      read: false,
      createdAt,
    });
    await writeDemoDatabase(database);
  } else {
    await prisma.session.create({
      data: {
        ...session,
        teamId: session.teamId ?? null,
        coachId: session.coachId ?? null,
        distanceKm: session.distanceKm ?? null,
        sprintCount: session.sprintCount ?? null,
        shotsTaken: session.shotsTaken ?? null,
        passes: session.passes ?? null,
        dribbles: session.dribbles ?? null,
        touches: session.touches ?? null,
        notes: session.notes ?? null,
        weather: session.weather ?? null,
        occurredAt: new Date(session.occurredAt),
        createdAt: new Date(createdAt),
        updatedAt: new Date(createdAt),
      },
    });
    await prisma.sessionMetric.create({
      data: {
        ...metric,
        createdAt: new Date(createdAt),
      },
    });
  }

  return { session, metric };
}

export async function createGoalEntry(
  athleteId: string,
  input: Pick<
    GoalRecord,
    "title" | "category" | "targetValue" | "currentValue" | "unit" | "deadline" | "notes"
  >,
) {
  const createdAt = new Date().toISOString();
  const goal: GoalRecord = {
    id: makeId("goal"),
    athleteId,
    status: "on_track",
    createdAt,
    updatedAt: createdAt,
    ...input,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.goals.push(goal);
    await writeDemoDatabase(database);
  } else {
    await prisma.goal.create({
      data: {
        ...goal,
        notes: goal.notes ?? null,
        deadline: new Date(goal.deadline),
        createdAt: new Date(createdAt),
        updatedAt: new Date(createdAt),
      },
    });
  }

  return goal;
}

export async function createNutritionLogEntry(
  athleteId: string,
  input: Omit<NutritionLogRecord, "id" | "athleteId" | "createdAt">,
) {
  const createdAt = new Date().toISOString();
  const log: NutritionLogRecord = {
    id: makeId("nutrition"),
    athleteId,
    createdAt,
    ...input,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.nutritionLogs.push(log);
    await writeDemoDatabase(database);
  } else {
    await prisma.nutritionLog.create({
      data: {
        ...log,
        notes: log.notes ?? null,
        loggedAt: new Date(log.loggedAt),
        createdAt: new Date(createdAt),
      },
    });
  }

  return log;
}

export async function createWellnessCheckEntry(
  athleteId: string,
  input: Omit<
    WellnessCheckRecord,
    "id" | "athleteId" | "createdAt" | "readinessScore" | "recoverySuggestions"
  >,
) {
  const createdAt = new Date().toISOString();
  const readinessScore = clamp(
    100 -
      input.soreness * 4 -
      input.fatigue * 4 -
      input.stress * 3 +
      input.energy * 3 +
      input.sleepQuality * 2,
  );
  const entry: WellnessCheckRecord = {
    id: makeId("wellness"),
    athleteId,
    createdAt,
    readinessScore,
    recoverySuggestions:
      readinessScore < 75
        ? ["Reduce intensity tomorrow", "Prioritize hydration and mobility tonight"]
        : ["You can handle a quality session", "Keep recovery habits consistent"],
    ...input,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.wellnessChecks.push(entry);
    await writeDemoDatabase(database);
  } else {
    await prisma.wellnessCheck.create({
      data: {
        ...entry,
        injuryStatus: entry.injuryStatus ?? null,
        checkedAt: new Date(entry.checkedAt),
        createdAt: new Date(createdAt),
      },
    });
  }

  return entry;
}

export async function createMentalCheckInEntry(
  athleteId: string,
  input: Omit<MentalCheckInRecord, "id" | "athleteId" | "createdAt">,
) {
  const createdAt = new Date().toISOString();
  const entry: MentalCheckInRecord = {
    id: makeId("mental"),
    athleteId,
    createdAt,
    ...input,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.mentalCheckIns.push(entry);
    await writeDemoDatabase(database);
  } else {
    await prisma.mentalCheckIn.create({
      data: {
        ...entry,
        checkedAt: new Date(entry.checkedAt),
        createdAt: new Date(createdAt),
      },
    });
  }

  return entry;
}

export async function createJournalEntry(
  athleteId: string,
  input: Omit<JournalEntryRecord, "id" | "athleteId" | "createdAt">,
) {
  const createdAt = new Date().toISOString();
  const entry: JournalEntryRecord = {
    id: makeId("journal"),
    athleteId,
    createdAt,
    ...input,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.journalEntries.push(entry);
    await writeDemoDatabase(database);
  } else {
    await prisma.journalEntry.create({
      data: {
        ...entry,
        createdAt: new Date(createdAt),
      },
    });
  }

  return entry;
}

export async function createVideoAssetEntry(
  athleteId: string,
  input: Omit<VideoAssetRecord, "id" | "athleteId" | "createdAt">,
) {
  const createdAt = new Date().toISOString();
  const assetId = makeId("video");
  const database = await readDatabase();
  const athleteContext = getAthleteContext(database, athleteId);
  const analyzed = await analyzeSoccerVideoAsset({
    assetId,
    video: {
      title: input.title,
      videoType: input.videoType,
      fileUrl: input.fileUrl,
      mimeType: input.mimeType ?? null,
      thumbnailUrl: input.thumbnailUrl ?? null,
      notes: input.notes ?? null,
      tags: input.tags,
    },
    athlete: {
      athleteName: athleteContext.user.name,
      position: athleteContext.profile.position,
      dominantFoot: athleteContext.profile.dominantFoot,
      club: athleteContext.profile.club,
      goals: athleteContext.profile.goals,
      equipmentAccess: athleteContext.profile.equipmentAccess,
      homeTrainingPriority: athleteContext.profile.homeTrainingPriority,
    },
  });

  const asset: VideoAssetRecord = {
    id: assetId,
    athleteId,
    createdAt,
    ...input,
    mimeType: analyzed.mimeType,
    thumbnailUrl: analyzed.thumbnailUrl,
    thumbnails: analyzed.thumbnails,
    durationSeconds: analyzed.durationSeconds,
    tags: analyzed.tags,
    timestamps: analyzed.timestamps,
    analysisStatus: analyzed.analysisStatus,
    analysis: analyzed.analysis,
  };

  if (isDemoMode()) {
    database.videoAssets.push(asset);
    await writeDemoDatabase(database);
  } else {
    await prisma.videoAsset.create({
      data: {
        ...asset,
        mimeType: asset.mimeType ?? null,
        thumbnailUrl: asset.thumbnailUrl ?? null,
        thumbnails: asset.thumbnails ?? [],
        durationSeconds: asset.durationSeconds ?? null,
        notes: asset.notes ?? null,
        timestamps: asset.timestamps,
        analysisStatus: asset.analysisStatus ?? "pending",
        analysis: asset.analysis ? asPrismaJson(asset.analysis) : Prisma.JsonNull,
        createdAt: new Date(createdAt),
      },
    });
  }

  return asset;
}

export async function createVideoCommentEntry(
  authorId: string,
  input: Omit<VideoCommentRecord, "id" | "authorId" | "createdAt">,
) {
  const database = await readDatabase();
  const author = database.users.find((entry) => entry.id === authorId);

  if (!author) {
    throw new Error("Comment author was not found.");
  }

  if (!["coach", "admin"].includes(author.role)) {
    throw new Error("Only coaches and admins can leave video review comments.");
  }

  const video = database.videoAssets.find((entry) => entry.id === input.videoId);

  if (!video) {
    throw new Error("Video clip not found.");
  }

  if (author.role !== "admin" && !canCoachAccessAthlete(database, authorId, video.athleteId)) {
    throw new Error("Coach does not have access to this athlete.");
  }

  const createdAt = new Date().toISOString();
  const comment: VideoCommentRecord = {
    id: makeId("video-comment"),
    authorId,
    createdAt,
    ...input,
  };

  if (isDemoMode()) {
    database.videoComments.push(comment);
    await writeDemoDatabase(database);
  } else {
    await prisma.videoComment.create({
      data: {
        ...comment,
        strengthTag: comment.strengthTag ?? null,
        improvementTag: comment.improvementTag ?? null,
        createdAt: new Date(createdAt),
      },
    });
  }

  return {
    comment,
    athleteId: video.athleteId,
  };
}

export async function createCalendarEventEntry(
  creatorId: string,
  input: Omit<CalendarEventRecord, "id" | "creatorId" | "createdAt">,
) {
  const createdAt = new Date().toISOString();
  const event: CalendarEventRecord = {
    id: makeId("event"),
    creatorId,
    createdAt,
    ...input,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.calendarEvents.push(event);
    await writeDemoDatabase(database);
  } else {
    await prisma.calendarEvent.create({
      data: {
        ...event,
        athleteId: event.athleteId ?? null,
        teamId: event.teamId ?? null,
        description: event.description ?? null,
        eventType: event.eventType,
        startsAt: new Date(event.startsAt),
        endsAt: new Date(event.endsAt),
        createdAt: new Date(createdAt),
      },
    });
  }

  return event;
}

export async function createCoachCommentEntry(
  coachId: string,
  input: Omit<CoachCommentRecord, "id" | "coachId" | "createdAt">,
) {
  const createdAt = new Date().toISOString();
  const comment: CoachCommentRecord = {
    id: makeId("coach-comment"),
    coachId,
    createdAt,
    ...input,
  };

  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.coachComments.push(comment);
    await writeDemoDatabase(database);
  } else {
    await prisma.coachComment.create({
      data: {
        ...comment,
        sessionId: comment.sessionId ?? null,
        createdAt: new Date(createdAt),
      },
    });
  }

  return comment;
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  if (isDemoMode()) {
    const database = await readDemoDatabase();
    database.notifications = database.notifications.map((notification) =>
      notification.id === notificationId && notification.userId === userId
        ? { ...notification, read: true }
        : notification,
    );
    await writeDemoDatabase(database);
    return;
  }

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      read: true,
    },
  });
}

export async function resetDemoData() {
  if (!isDemoMode()) {
    return;
  }

  await writeDemoDatabase(createDemoDatabase());
}

export async function seedDemoDataFile() {
  if (isDemoMode()) {
    await writeDemoDatabase(createDemoDatabase());
  }
}
