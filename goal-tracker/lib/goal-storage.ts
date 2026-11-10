import { validateStoredGoal, type Goal } from "@/lib/goals";

export const STORAGE_KEY = "doit:goals";

export type StoredGoalsEnvelope = {
  schemaVersion: 1;
  goals: Goal[];
};

export class GoalStorageError extends Error {
  constructor(
    message: string,
    public code: "storage-unavailable" | "invalid-json" | "invalid-records" | "write-failure",
  ) {
    super(message);
    this.name = "GoalStorageError";
  }
}

function isStorageAvailable() {
  try {
    const storageKey = "__goal_tracker_test__";
    window.localStorage.setItem(storageKey, storageKey);
    window.localStorage.removeItem(storageKey);
    return true;
  } catch {
    return false;
  }
}

export function isGoalsEnvelope(value: unknown): value is StoredGoalsEnvelope {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return record.schemaVersion === 1 && Array.isArray(record.goals);
}

export function loadGoals(): Goal[] {
  if (typeof window === "undefined" || !isStorageAvailable()) {
    throw new GoalStorageError("Goal storage is unavailable in this browser.", "storage-unavailable");
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as unknown;

    if (!isGoalsEnvelope(parsed)) {
      throw new GoalStorageError(
        "Saved goals are invalid. The stored data does not match the expected format.",
        "invalid-records",
      );
    }

    return parsed.goals.map((goal, index) => validateStoredGoal(goal, index));
  } catch (error) {
    if (error instanceof GoalStorageError) {
      throw error;
    }

    if (error instanceof SyntaxError) {
      throw new GoalStorageError("Saved goals could not be parsed. The data is not valid JSON.", "invalid-json");
    }

    throw new GoalStorageError("Saved goals could not be loaded. Please try again.", "storage-unavailable");
  }
}

export function saveGoals(goals: Goal[]): void {
  if (typeof window === "undefined" || !isStorageAvailable()) {
    throw new GoalStorageError("Goal storage is unavailable in this browser.", "storage-unavailable");
  }

  try {
    const payload: StoredGoalsEnvelope = {
      schemaVersion: 1,
      goals: goals.map((goal, index) => validateStoredGoal(goal, index)),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    throw new GoalStorageError("Goals could not be saved. Please try again.", "write-failure");
  }
}
