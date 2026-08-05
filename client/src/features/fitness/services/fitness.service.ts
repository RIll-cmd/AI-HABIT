import { API_BASE_URL } from "@/constants";
import { Exercise, WorkoutSession, ExerciseLog, PersonalRecord, WeeklyBoss } from "../types";

export interface ExerciseLogPayload {
  exerciseId: string;
  set: number;
  weight: number;
  reps: number;
  rpe?: number | null;
  restTime?: number | null;
  notes?: string | null;
}

export interface WorkoutRewards {
  exp: number;
  gold: number;
  statsEarned: {
    strength?: number;
    endurance?: number;
    recovery?: number;
    discipline?: number;
    focus?: number;
    [key: string]: number | undefined;
  };
  volume: number;
  duration: number;
}

export interface FinishSessionResult extends WorkoutSession {
  newPRs?: PersonalRecord[];
  rewards?: WorkoutRewards;
  bossDefeated?: boolean;
  bossRewards?: any;
}

export interface OverloadSuggestion {
  exerciseId: string;
  currentWeight: number;
  recommendedWeight: number;
  suggestedReps: string;
  message: string;
  shouldIncrease?: boolean;
}

/**
 * Fetches all master exercises from backend API, ordered by category and name.
 */
export async function getExercises(): Promise<Exercise[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/exercises`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[fitness.service] Failed to fetch exercises (HTTP ${res.status}):`,
        errorText
      );
      return [];
    }

    const data = await res.json();
    return data as Exercise[];
  } catch (error) {
    console.error("[fitness.service] Error fetching exercises:", error);
    return [];
  }
}

/**
 * Starts a new workout session for a character.
 */
export async function startSession(
  characterId: string,
  planId?: string
): Promise<WorkoutSession | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId, planId }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[fitness.service] Failed to start workout session (HTTP ${res.status}):`,
        errorText
      );
      return null;
    }

    const data = await res.json();
    return data as WorkoutSession;
  } catch (error) {
    console.error("[fitness.service] Error starting session:", error);
    return null;
  }
}

/**
 * Logs a set for an active workout session (strictly append-only).
 */
export async function logExercise(
  sessionId: string,
  payload: ExerciseLogPayload
): Promise<ExerciseLog | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/${sessionId}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[fitness.service] Failed to log exercise set (HTTP ${res.status}):`,
        errorText
      );
      return null;
    }

    const data = await res.json();
    return data as ExerciseLog;
  } catch (error) {
    console.error("[fitness.service] Error logging exercise:", error);
    return null;
  }
}

/**
 * Logs a set using natural language text parsing (Phase 1 Voice simulator).
 */
export async function logTextExercise(
  sessionId: string,
  text: string
): Promise<ExerciseLog | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/${sessionId}/log-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[fitness.service] Failed to log exercise from text (HTTP ${res.status}):`,
        errorText
      );
      return null;
    }

    const data = await res.json();
    return data as ExerciseLog;
  } catch (error) {
    console.error("[fitness.service] Error logging exercise from text:", error);
    return null;
  }
}

/**
 * Marks a workout session as finished, calculates duration, detects new PRs, checks boss defeat, and awards EXP/Gold/Stats.
 */
export async function finishSession(sessionId: string): Promise<FinishSessionResult | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/${sessionId}/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[fitness.service] Failed to finish workout session (HTTP ${res.status}):`,
        errorText
      );
      return null;
    }

    const data = await res.json();
    return data as FinishSessionResult;
  } catch (error) {
    console.error("[fitness.service] Error finishing session:", error);
    return null;
  }
}

/**
 * Fetches active (uncompleted) workout session for a character.
 */
export async function fetchActiveSession(
  characterId: string
): Promise<WorkoutSession | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/active/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as WorkoutSession | null;
  } catch (error) {
    console.error("[fitness.service] Error fetching active session:", error);
    return null;
  }
}

/**
 * Fetches completed workout session history for a character.
 */
export async function getWorkoutHistory(characterId: string): Promise<WorkoutSession[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/history/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data as WorkoutSession[];
  } catch (error) {
    console.error("[fitness.service] Error fetching workout history:", error);
    return [];
  }
}

/**
 * Fetches all personal records for a character.
 */
export async function getPersonalRecords(characterId: string): Promise<PersonalRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/prs/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data as PersonalRecord[];
  } catch (error) {
    console.error("[fitness.service] Error fetching personal records:", error);
    return [];
  }
}

/**
 * Fetches progressive overload recommendations for an exercise.
 */
export async function getOverloadSuggestion(
  characterId: string,
  exerciseId: string
): Promise<OverloadSuggestion | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/overload/${characterId}/${exerciseId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as OverloadSuggestion;
  } catch (error) {
    console.error("[fitness.service] Error fetching overload suggestion:", error);
    return null;
  }
}

/**
 * Fetches active WeeklyBoss for a character.
 */
export async function getWeeklyBoss(characterId: string): Promise<WeeklyBoss | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/boss/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as WeeklyBoss;
  } catch (error) {
    console.error("[fitness.service] Error fetching weekly boss:", error);
    return null;
  }
}
