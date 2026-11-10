"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatGoalDate, getGoalDeadline, type Goal } from "@/lib/goals";
import { cn } from "@/lib/utils";

type GoalCardProps = {
  goal: Goal;
  selected: boolean;
  onToggleSelect: (goalId: string) => void;
};

export function GoalCard({ goal, selected, onToggleSelect }: GoalCardProps) {
  const deadline = getGoalDeadline(goal);

  const urgencyClasses =
    goal.status === "completed"
      ? "border-emerald-200 bg-emerald-50/70"
      : deadline.isOverdue
        ? "border-rose-200 bg-rose-50"
        : deadline.isUrgent
          ? "border-amber-200 bg-amber-50"
          : "border-goal-border bg-goal-panel";

  const statusTextClasses =
    goal.status === "completed"
      ? "text-emerald-700"
      : deadline.isOverdue
        ? "text-rose-700"
        : deadline.isUrgent
          ? "text-amber-800"
          : "text-goal-muted";

  return (
    <div className={cn("rounded-2xl border p-4 shadow-sm transition-colors", urgencyClasses)}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(goal.id)}
          aria-label={`Select ${goal.title}`}
          className="mt-1"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="break-words text-base font-semibold text-goal-text">{goal.title}</p>
            {goal.status === "active" && !deadline.isOverdue && deadline.isUrgent ? (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-800">
                {deadline.label}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-goal-muted">Due {formatGoalDate(goal.endDate)}</p>

          {goal.status === "active" ? (
            <p className={cn("mt-2 text-xs font-medium", statusTextClasses)}>
              {deadline.isOverdue ? "Overdue" : deadline.label}
            </p>
          ) : (
            <p className="mt-2 text-xs font-medium text-emerald-700">Completed</p>
          )}
        </div>
      </div>
    </div>
  );
}
