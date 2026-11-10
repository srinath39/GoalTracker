"use client";

import { useMemo, useState } from "react";

import { GoalColumn } from "@/components/goal-column";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { SelectedGoalActions } from "@/components/selected-goal-actions";
import { createGoal, type Goal } from "@/lib/goals";
import { loadGoals, saveGoals } from "@/lib/goal-storage";

function readStoredGoalsState() {
  if (typeof window === "undefined") {
    return { goals: [] as Goal[], storageError: null as string | null };
  }

  try {
    return { goals: loadGoals(), storageError: null as string | null };
  } catch (error) {
    return {
      goals: [] as Goal[],
      storageError:
        error instanceof Error ? error.message : "Unable to load saved goals.",
    };
  }
}

export function GoalBoard() {
  const [{ goals: initialGoals, storageError: initialStorageError }] = useState(readStoredGoalsState);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [storageError, setStorageError] = useState<string | null>(initialStorageError);

  const persistGoals = (nextGoals: Goal[]) => {
    try {
      saveGoals(nextGoals);
      setStorageError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save goals.";
      setStorageError(message);
    }
  };

  const selectedGoals = useMemo(
    () => goals.filter((goal) => selectedGoalIds.includes(goal.id)),
    [goals, selectedGoalIds],
  );

  const currentGoals = useMemo(
    () => goals.filter((goal) => goal.status === "active"),
    [goals],
  );

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "completed"),
    [goals],
  );

  const handleToggleSelect = (goalId: string) => {
    setSelectedGoalIds((current) =>
      current.includes(goalId) ? current.filter((id) => id !== goalId) : [...current, goalId],
    );
  };

  const handleCreateGoal = ({ title, endDate }: { title: string; endDate: string }) => {
    const nextGoal = createGoal(title, endDate, "active");
    const nextGoals = [nextGoal, ...goals];
    setGoals(nextGoals);
    persistGoals(nextGoals);
  };

  const handleCompleteSelected = () => {
    if (selectedGoalIds.length === 0) {
      return;
    }

    const nextGoals: Goal[] = goals.map((goal): Goal =>
      selectedGoalIds.includes(goal.id) && goal.status === "active"
        ? { ...goal, status: "completed" }
        : goal,
    );

    setGoals(nextGoals);
    persistGoals(nextGoals);
    setSelectedGoalIds([]);
  };

  const handleDeleteSelected = () => {
    if (selectedGoalIds.length === 0) {
      return;
    }

    const nextGoals = goals.filter((goal) => !selectedGoalIds.includes(goal.id));
    setGoals(nextGoals);
    persistGoals(nextGoals);
    setSelectedGoalIds([]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-goal-muted">Goal tracker</p>
          <h1 className="mt-2 text-3xl font-bold text-goal-text sm:text-4xl">doit</h1>
        </div>

        <GoalFormDialog onCreate={handleCreateGoal} />
      </header>

      {storageError ? (
        <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {storageError}
        </div>
      ) : null}

      <SelectedGoalActions
        selectedGoals={selectedGoals}
        onCompleteSelected={handleCompleteSelected}
        onDeleteSelected={handleDeleteSelected}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GoalColumn
          title="Current goals"
          goals={currentGoals}
          emptyMessage="No active goals yet. Add one to get started."
          selectedGoalIds={selectedGoalIds}
          onToggleSelect={handleToggleSelect}
        />

        <GoalColumn
          title="Completed goals"
          goals={completedGoals}
          emptyMessage="No completed goals yet. Finish a current goal to see it here."
          selectedGoalIds={selectedGoalIds}
          onToggleSelect={handleToggleSelect}
        />
      </div>
    </div>
  );
}
