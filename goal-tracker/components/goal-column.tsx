import { GoalCard } from "@/components/goal-card";
import { type Goal } from "@/lib/goals";

type GoalColumnProps = {
  title: string;
  goals: Goal[];
  emptyMessage: string;
  selectedGoalIds: string[];
  onToggleSelect: (goalId: string) => void;
};

export function GoalColumn({
  title,
  goals,
  emptyMessage,
  selectedGoalIds,
  onToggleSelect,
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
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              selected={selectedGoalIds.includes(goal.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}
