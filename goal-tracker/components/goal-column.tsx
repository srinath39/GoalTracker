import { GoalCard } from "@/components/goal-card";
import { type Goal, type GoalStatus } from "@/lib/goals";

type GoalColumnProps = {
  title: string;
  groupId: GoalStatus;
  goals: Goal[];
  emptyMessage: string;
  selectedGoalIds: string[];
  onToggleSelect: (goalId: string) => void;
  onMove: (status: GoalStatus, fromIndex: number, toIndex: number) => void;
};

export function GoalColumn({
  title,
  groupId,
  goals,
  emptyMessage,
  selectedGoalIds,
  onToggleSelect,
  onMove,
}: GoalColumnProps) {
  return (
    <section className="rounded-3xl border border-goal-border bg-goal-panel/80 p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-goal-text">{title}</h2>
        <span className="rounded-full bg-goal-soft px-2.5 py-1 text-xs font-semibold text-goal-text">
          {goals.length}
        </span>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-goal-border bg-goal-soft/60 p-4 text-sm text-goal-muted">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label={title}>
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={index}
              groupId={groupId}
              canReorder={goals.length > 1}
              canMoveUp={index > 0}
              canMoveDown={index < goals.length - 1}
              selected={selectedGoalIds.includes(goal.id)}
              onToggleSelect={onToggleSelect}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </section>
  );
}
