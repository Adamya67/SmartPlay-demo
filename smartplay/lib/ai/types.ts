export interface AthleteInsightContext {
  athleteName: string;
  position: string;
  goals: string[];
  weeklyTrainingLoad: number;
  trainingLoadDelta: number;
  readinessScore: number;
  recoveryScore: number;
  sleepHours: number;
  hydrationScore: number;
  proteinGrams: number;
  proteinTarget: number;
  streakDays: number;
  sprintCount: number;
  sprintDelta: number;
  weakFootProgress?: number;
  confidence: number;
  focus: number;
  anxiety: number;
  budgetFriendly: boolean;
  equipmentAccess: string[];
  currentFocus: string;
}
