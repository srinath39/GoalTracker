"use client";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useEffect, useMemo, useState } from "react";

import { GoalColumn } from "@/components/goal-column";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { SelectedGoalActions } from "@/components/selected-goal-actions";
import { createGoal, type Goal, type GoalStatus } from "@/lib/goals";
import { loadGoals, saveGoals } from "@/lib/goal-storage";

export function GoalBoard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setGoals(loadGoals());
        setStorageError(null);
      } catch (error) {
        setGoals([]);
        setStorageError(
          error instanceof Error ? error.message : "Unable to load saved goals.",
        );
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

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

  const persistGoals = (nextGoals: Goal[]) => {
    try {
      saveGoals(nextGoals);
      setStorageError(null);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Unable to save goals.");
    }
  };

  const saveReorderedGoals = (nextGoals: Goal[]) => {
    try {
      saveGoals(nextGoals);
      setGoals(nextGoals);
      setStorageError(null);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Unable to save goal order.");
    }
  };

  const reorderGroup = (status: GoalStatus, fromIndex: number, toIndex: number) => {
    if (!isLoaded || fromIndex === toIndex) {
      return;
    }

    const groupGoals = goals.filter((goal) => goal.status === status);

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= groupGoals.length ||
      toIndex >= groupGoals.length
    ) {
      return;
    }

    const reorderedGroup = [...groupGoals];
    const [movedGoal] = reorderedGroup.splice(fromIndex, 1);
    reorderedGroup.splice(toIndex, 0, movedGoal);

    const currentGoalsList =
      status === "active"
        ? reorderedGroup
        : goals.filter((goal) => goal.status === "active");
    const completedGoalsList =
      status === "completed"
        ? reorderedGroup
        : goals.filter((goal) => goal.status === "completed");

    saveReorderedGoals([...currentGoalsList, ...completedGoalsList]);
  };

  const handleToggleSelect = (goalId: string) => {
    setSelectedGoalIds((current) =>
      current.includes(goalId) ? current.filter((id) => id !== goalId) : [...current, goalId],
    );
  };

  const handleCreateGoal = ({ title, endDate }: { title: string; endDate: string }) => {
    if (!isLoaded) {
      return;
    }

    const nextGoal = createGoal(title, endDate, "active");
    const nextGoals = [nextGoal, ...goals];
    setGoals(nextGoals);
    persistGoals(nextGoals);
  };

  const handleCompleteSelected = () => {
    if (!isLoaded || selectedGoalIds.length === 0) {
      return;
    }

    const remainingCurrentGoals = goals.filter(
      (goal) => goal.status === "active" && !selectedGoalIds.includes(goal.id),
    );
    const completedGoalsToAppend = goals.filter(
      (goal) => goal.status === "active" && selectedGoalIds.includes(goal.id),
    );
    const existingCompletedGoals = goals.filter((goal) => goal.status === "completed");
    const nextGoals: Goal[] = [
      ...remainingCurrentGoals,
      ...existingCompletedGoals,
      ...completedGoalsToAppend.map((goal) => ({ ...goal, status: "completed" as const })),
    ];

    setGoals(nextGoals);
    persistGoals(nextGoals);
    setSelectedGoalIds([]);
  };

  const handleDeleteSelected = () => {
    if (!isLoaded || selectedGoalIds.length === 0) {
      return;
    }

    const nextGoals = goals.filter((goal) => !selectedGoalIds.includes(goal.id));
    setGoals(nextGoals);
    persistGoals(nextGoals);
    setSelectedGoalIds([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { source, target } = event.operation;

    if (
      event.canceled ||
      !isSortable(source) ||
      !isSortable(target) ||
      source.initialGroup !== source.group ||
      source.group !== target.group
    ) {
      return;
    }

    if (source.group === "active" || source.group === "completed") {
      reorderGroup(source.group, source.initialIndex, source.index);
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-goal-muted">Goal tracker</p>
            <h1 className="mt-2 text-3xl font-bold text-goal-text sm:text-4xl">doit</h1>
          </div>

          {isLoaded ? <GoalFormDialog onCreate={handleCreateGoal} /> : null}
        </header>

        {storageError ? (
          <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {storageError}
          </div>
        ) : null}

        {isLoaded ? (
          <>
            <SelectedGoalActions
              selectedGoals={selectedGoals}
              onCompleteSelected={handleCompleteSelected}
              onDeleteSelected={handleDeleteSelected}
            />

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <GoalColumn
                title="Current goals"
                groupId="active"
                goals={currentGoals}
                emptyMessage="No active goals yet. Add one to get started."
                selectedGoalIds={selectedGoalIds}
                onToggleSelect={handleToggleSelect}
                onMove={reorderGroup}
              />

              <GoalColumn
                title="Completed goals"
                groupId="completed"
                goals={completedGoals}
                emptyMessage="No completed goals yet. Finish a current goal to see it here."
                selectedGoalIds={selectedGoalIds}
                onToggleSelect={handleToggleSelect}
                onMove={reorderGroup}
              />
            </div>
          </>
        ) : (
          <p role="status" className="rounded-2xl border border-goal-border bg-goal-panel px-4 py-3 text-sm text-goal-muted">
            Loading your goals…
          </p>
        )}
      </div>
    </DragDropProvider>
  );
}
