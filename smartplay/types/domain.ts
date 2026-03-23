export type AppRole = "athlete" | "coach" | "parent" | "admin";
export type SubscriptionStatus = "trialing" | "active" | "expired";
export type SubscriptionPlan = "player_monthly";

export type SessionType =
  | "team_practice"
  | "individual_training"
  | "match"
  | "gym_workout"
  | "conditioning"
  | "recovery"
  | "technical_drill"
  | "film_review"
  | "mobility";

export type GoalCategory =
  | "performance"
  | "fitness"
  | "nutrition"
  | "wellness"
  | "academic_balance"
  | "recruiting";

export type GoalStatus = "on_track" | "at_risk" | "completed";

export type VideoType =
  | "shooting"
  | "passing"
  | "game_footage"
  | "defending"
  | "sprint_form";

export type VideoAnalysisStatus =
  | "pending"
  | "completed"
  | "fallback"
  | "failed";

export type NotificationType =
  | "goal_deadline"
  | "coach_comment"
  | "drill_assignment"
  | "missed_check_in"
  | "low_readiness"
  | "streak"
  | "session_reminder";

export interface AppUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  image?: string | null;
  role: AppRole;
  onboardingCompleted: boolean;
  linkedAthleteIds?: string[];
  profileCompletion: number;
  city?: string;
  trialStartedAt?: string | null;
  trialEndsAt?: string | null;
  subscriptionStatus?: SubscriptionStatus | null;
  subscriptionPlan?: SubscriptionPlan | null;
  subscriptionPriceCents?: number | null;
  subscriptionRenewsAt?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AthleteProfileRecord {
  id: string;
  userId: string;
  slug: string;
  age: number;
  schoolClub: string;
  graduationYear: number;
  primarySport: string;
  position: string;
  dominantFoot: string;
  heightCm?: number | null;
  weightKg?: number | null;
  goals: string[];
  skillLevel: string;
  equipmentAccess: string[];
  trainingFrequency: string;
  dietaryPreferences: string[];
  injuryHistory?: string | null;
  targetMetrics: Array<{ label: string; target: string; unit?: string }>;
  bio: string;
  club: string;
  topStats: Array<{ label: string; value: string }>;
  highlightVideoUrl?: string | null;
  homeTrainingPriority: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CoachProfileRecord {
  id: string;
  userId: string;
  teamName: string;
  ageGroup: string;
  coachingRole: string;
  organization: string;
  athletesCoached: number;
  philosophy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParentProfileRecord {
  id: string;
  userId: string;
  relation: string;
  athleteNames: string[];
  goals: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  ageGroup: string;
  organization: string;
  logoUrl?: string | null;
  coachId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberRecord {
  id: string;
  teamId: string;
  userId: string;
  teamRole: "coach" | "athlete" | "parent";
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  athleteId: string;
  teamId?: string | null;
  coachId?: string | null;
  title: string;
  occurredAt: string;
  durationMinutes: number;
  sessionType: SessionType;
  intensity: number;
  rpe: number;
  distanceKm?: number | null;
  sprintCount?: number | null;
  shotsTaken?: number | null;
  passes?: number | null;
  dribbles?: number | null;
  touches?: number | null;
  notes?: string | null;
  tags: string[];
  weather?: string | null;
  location: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionMetricRecord {
  id: string;
  sessionId: string;
  trainingLoad: number;
  caloriesBurned: number;
  sprintVolume: number;
  skillCompletions: number;
  summary: string;
  aiFeedback: string;
  createdAt: string;
}

export interface GoalRecord {
  id: string;
  athleteId: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  notes?: string | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GoalMilestoneRecord {
  id: string;
  goalId: string;
  title: string;
  targetValue: number;
  completed: boolean;
  createdAt: string;
}

export interface NutritionLogRecord {
  id: string;
  athleteId: string;
  loggedAt: string;
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  hydrationMl: number;
  notes?: string | null;
  createdAt: string;
}

export interface WellnessCheckRecord {
  id: string;
  athleteId: string;
  checkedAt: string;
  sleepHours: number;
  sleepQuality: number;
  soreness: number;
  fatigue: number;
  stress: number;
  energy: number;
  mood: number;
  hydration: number;
  painFlag: boolean;
  injuryStatus?: string | null;
  readinessScore: number;
  recoverySuggestions: string[];
  createdAt: string;
}

export interface MentalCheckInRecord {
  id: string;
  athleteId: string;
  checkedAt: string;
  confidence: number;
  focus: number;
  anxiety: number;
  motivation: number;
  prompt: string;
  createdAt: string;
}

export interface JournalEntryRecord {
  id: string;
  athleteId: string;
  createdAt: string;
  title: string;
  content: string;
  tag: string;
}

export interface VideoAssetRecord {
  id: string;
  athleteId: string;
  title: string;
  videoType: VideoType;
  fileUrl: string;
  mimeType?: string | null;
  thumbnailUrl?: string | null;
  thumbnails?: string[];
  durationSeconds?: number | null;
  notes?: string | null;
  tags: string[];
  timestamps: Array<{ label: string; value: string }>;
  analysisStatus?: VideoAnalysisStatus;
  analysis?: VideoAnalysisRecord | null;
  createdAt: string;
}

export interface VideoAnalysisMomentRecord {
  timestamp: string;
  title: string;
  observation: string;
  coachingCue: string;
  tags: string[];
}

export interface VideoDrillRecommendationRecord {
  title: string;
  purpose: string;
  reps: string;
  equipment: string;
}

export interface VideoAnalysisRecord {
  provider: "openai-vision" | "smartplay-fallback";
  analyzedAt: string;
  summary: string;
  playerSnapshot: string;
  strengths: string[];
  improvementAreas: string[];
  coachingPoints: string[];
  recommendedDrills: VideoDrillRecommendationRecord[];
  mindsetCue: string;
  nextSessionFocus: string;
  confidence: "high" | "medium" | "low";
  detectedTags: string[];
  moments: VideoAnalysisMomentRecord[];
  metadata: {
    fileType: "video" | "image";
    sampledFrames: number;
    durationSeconds?: number | null;
    width?: number | null;
    height?: number | null;
    fps?: number | null;
  };
}

export interface VideoCommentRecord {
  id: string;
  videoId: string;
  authorId: string;
  content: string;
  strengthTag?: string | null;
  improvementTag?: string | null;
  createdAt: string;
}

export interface DrillAssignmentRecord {
  id: string;
  athleteId: string;
  coachId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface CoachCommentRecord {
  id: string;
  athleteId: string;
  coachId: string;
  sessionId?: string | null;
  content: string;
  createdAt: string;
}

export interface AnnouncementRecord {
  id: string;
  teamId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface AchievementBadgeRecord {
  id: string;
  athleteId: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface CalendarEventRecord {
  id: string;
  athleteId?: string | null;
  teamId?: string | null;
  creatorId: string;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt: string;
  eventType: SessionType | "reminder" | "team_event";
  completed: boolean;
  createdAt: string;
}

export interface AIInsightRecord {
  id: string;
  athleteId: string;
  category: "training" | "nutrition" | "wellness" | "mental" | "goal";
  title: string;
  content: string;
  createdAt: string;
}

export interface DemoDatabase {
  users: AppUserRecord[];
  athleteProfiles: AthleteProfileRecord[];
  coachProfiles: CoachProfileRecord[];
  parentProfiles: ParentProfileRecord[];
  teams: TeamRecord[];
  teamMembers: TeamMemberRecord[];
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
  notifications: NotificationRecord[];
  achievementBadges: AchievementBadgeRecord[];
  calendarEvents: CalendarEventRecord[];
  aiInsights: AIInsightRecord[];
}
