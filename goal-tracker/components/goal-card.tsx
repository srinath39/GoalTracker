"use client";

import { useDragOperation } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatGoalDate, getGoalDeadline, type Goal, type GoalStatus } from "@/lib/goals";
import { cn } from "@/lib/utils";

type GoalCardProps = {
  goal: Goal;
  index: number;
  groupId: GoalStatus;
  canReorder: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  selected: boolean;
  onToggleSelect: (goalId: string) => void;
  onMove: (status: GoalStatus, fromIndex: number, toIndex: number) => void;
};

export function GoalCard({
  goal,
  index,
  groupId,
  canReorder,
  canMoveUp,
  canMoveDown,
  selected,
  onToggleSelect,
  onMove,
}: GoalCardProps) {
  const deadline = getGoalDeadline(goal);
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id: goal.id,
    index,
    group: groupId,
    disabled: !canReorder,
  });
  const { source } = useDragOperation();
  const sourceSortable = source != null && isSortable(source) ? source : null;
  const showInsertAfter =
    sourceSortable !== null &&
    sourceSortable.group === groupId &&
    sourceSortable.initialIndex < index;

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
    <div
      ref={ref}
      role="listitem"
      className={cn(
        "relative rounded-2xl border p-4 shadow-sm transition-colors",
        urgencyClasses,
        isDragging && "z-10 opacity-60 shadow-lg",
        isDropTarget && sourceSortable?.id !== goal.id && "ring-2 ring-goal-accent",
      )}
    >
      {isDropTarget && sourceSortable?.id !== goal.id ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-3 right-3 h-1 rounded-full bg-goal-accent",
            showInsertAfter ? "-bottom-2" : "-top-2",
          )}
        />
      ) : null}
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

        {canReorder ? (
          <div className="-mr-2 -mt-2 flex shrink-0 flex-col items-center gap-0.5">
            <Button
              ref={handleRef}
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Drag to reorder ${goal.title}`}
              title="Drag to reorder"
              className="h-8 w-8 cursor-grab touch-none text-goal-muted active:cursor-grabbing"
            >
              <GripVertical aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move ${goal.title} up`}
              title="Move up"
              disabled={!canMoveUp}
              onClick={() => onMove(groupId, index, index - 1)}
              className="h-7 w-8 text-goal-muted"
            >
              <ChevronUp aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move ${goal.title} down`}
              title="Move down"
              disabled={!canMoveDown}
              onClick={() => onMove(groupId, index, index + 1)}
              className="h-7 w-8 text-goal-muted"
            >
              <ChevronDown aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
