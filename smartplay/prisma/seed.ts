import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { createDemoDatabase } from "@/lib/data/demo-source";

const toDate = (value: string) => new Date(value);

async function main() {
  const database = createDemoDatabase();

  await prisma.$transaction([
    prisma.aiInsight.deleteMany(),
    prisma.calendarEvent.deleteMany(),
    prisma.achievementBadge.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.coachComment.deleteMany(),
    prisma.drillAssignment.deleteMany(),
    prisma.videoComment.deleteMany(),
    prisma.videoAsset.deleteMany(),
    prisma.journalEntry.deleteMany(),
    prisma.mentalCheckIn.deleteMany(),
    prisma.wellnessCheck.deleteMany(),
    prisma.nutritionLog.deleteMany(),
    prisma.goalMilestone.deleteMany(),
    prisma.goal.deleteMany(),
    prisma.sessionMetric.deleteMany(),
    prisma.session.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.team.deleteMany(),
    prisma.parentProfile.deleteMany(),
    prisma.coachProfile.deleteMany(),
    prisma.athleteProfile.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  await prisma.user.createMany({
    data: database.users.map((user) => ({
      ...user,
      linkedAthleteIds: user.linkedAthleteIds ?? Prisma.JsonNull,
      image: user.image ?? null,
      city: user.city ?? null,
      createdAt: toDate(user.createdAt),
      updatedAt: toDate(user.updatedAt),
    })),
  });

  await prisma.athleteProfile.createMany({
    data: database.athleteProfiles.map((profile) => ({
      ...profile,
      injuryHistory: profile.injuryHistory ?? null,
      heightCm: profile.heightCm ?? null,
      weightKg: profile.weightKg ?? null,
      targetMetrics: profile.targetMetrics,
      topStats: profile.topStats,
      highlightVideoUrl: profile.highlightVideoUrl ?? null,
      createdAt: toDate(profile.createdAt),
      updatedAt: toDate(profile.updatedAt),
    })),
  });

  await prisma.coachProfile.createMany({
    data: database.coachProfiles.map((profile) => ({
      ...profile,
      createdAt: toDate(profile.createdAt),
      updatedAt: toDate(profile.updatedAt),
    })),
  });

  await prisma.parentProfile.createMany({
    data: database.parentProfiles.map((profile) => ({
      ...profile,
      createdAt: toDate(profile.createdAt),
      updatedAt: toDate(profile.updatedAt),
    })),
  });

  await prisma.team.createMany({
    data: database.teams.map((team) => ({
      ...team,
      logoUrl: team.logoUrl ?? null,
      createdAt: toDate(team.createdAt),
      updatedAt: toDate(team.updatedAt),
    })),
  });

  await prisma.teamMember.createMany({
    data: database.teamMembers.map((member) => ({
      ...member,
      createdAt: toDate(member.createdAt),
    })),
  });

  await prisma.session.createMany({
    data: database.sessions.map((session) => ({
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
      occurredAt: toDate(session.occurredAt),
      createdAt: toDate(session.createdAt),
      updatedAt: toDate(session.updatedAt),
    })),
  });

  await prisma.sessionMetric.createMany({
    data: database.sessionMetrics.map((metric) => ({
      ...metric,
      createdAt: toDate(metric.createdAt),
    })),
  });

  await prisma.goal.createMany({
    data: database.goals.map((goal) => ({
      ...goal,
      notes: goal.notes ?? null,
      deadline: toDate(goal.deadline),
      createdAt: toDate(goal.createdAt),
      updatedAt: toDate(goal.updatedAt),
    })),
  });

  await prisma.goalMilestone.createMany({
    data: database.goalMilestones.map((milestone) => ({
      ...milestone,
      createdAt: toDate(milestone.createdAt),
    })),
  });

  await prisma.nutritionLog.createMany({
    data: database.nutritionLogs.map((log) => ({
      ...log,
      notes: log.notes ?? null,
      loggedAt: toDate(log.loggedAt),
      createdAt: toDate(log.createdAt),
    })),
  });

  await prisma.wellnessCheck.createMany({
    data: database.wellnessChecks.map((entry) => ({
      ...entry,
      injuryStatus: entry.injuryStatus ?? null,
      checkedAt: toDate(entry.checkedAt),
      createdAt: toDate(entry.createdAt),
    })),
  });

  await prisma.mentalCheckIn.createMany({
    data: database.mentalCheckIns.map((entry) => ({
      ...entry,
      checkedAt: toDate(entry.checkedAt),
      createdAt: toDate(entry.createdAt),
    })),
  });

  await prisma.journalEntry.createMany({
    data: database.journalEntries.map((entry) => ({
      ...entry,
      createdAt: toDate(entry.createdAt),
    })),
  });

  await prisma.videoAsset.createMany({
    data: database.videoAssets.map((asset) => ({
      ...asset,
      mimeType: asset.mimeType ?? null,
      thumbnailUrl: asset.thumbnailUrl ?? null,
      thumbnails: asset.thumbnails ?? [],
      durationSeconds: asset.durationSeconds ?? null,
      notes: asset.notes ?? null,
      timestamps: asset.timestamps,
      analysisStatus: asset.analysisStatus ?? "pending",
      analysis: asset.analysis
        ? (asset.analysis as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      createdAt: toDate(asset.createdAt),
    })),
  });

  await prisma.videoComment.createMany({
    data: database.videoComments.map((comment) => ({
      ...comment,
      strengthTag: comment.strengthTag ?? null,
      improvementTag: comment.improvementTag ?? null,
      createdAt: toDate(comment.createdAt),
    })),
  });

  await prisma.drillAssignment.createMany({
    data: database.drillAssignments.map((assignment) => ({
      ...assignment,
      dueDate: toDate(assignment.dueDate),
      createdAt: toDate(assignment.createdAt),
    })),
  });

  await prisma.coachComment.createMany({
    data: database.coachComments.map((comment) => ({
      ...comment,
      sessionId: comment.sessionId ?? null,
      createdAt: toDate(comment.createdAt),
    })),
  });

  await prisma.announcement.createMany({
    data: database.announcements.map((announcement) => ({
      ...announcement,
      createdAt: toDate(announcement.createdAt),
    })),
  });

  await prisma.notification.createMany({
    data: database.notifications.map((notification) => ({
      ...notification,
      createdAt: toDate(notification.createdAt),
    })),
  });

  await prisma.achievementBadge.createMany({
    data: database.achievementBadges.map((badge) => ({
      ...badge,
      earnedAt: toDate(badge.earnedAt),
    })),
  });

  await prisma.calendarEvent.createMany({
    data: database.calendarEvents.map((event) => ({
      ...event,
      athleteId: event.athleteId ?? null,
      teamId: event.teamId ?? null,
      description: event.description ?? null,
      startsAt: toDate(event.startsAt),
      endsAt: toDate(event.endsAt),
      createdAt: toDate(event.createdAt),
    })),
  });

  await prisma.aiInsight.createMany({
    data: database.aiInsights.map((insight) => ({
      ...insight,
      createdAt: toDate(insight.createdAt),
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
