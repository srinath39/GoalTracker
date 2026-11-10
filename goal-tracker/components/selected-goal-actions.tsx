import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { type Goal } from "@/lib/goals";

type SelectedGoalActionsProps = {
  selectedGoals: Goal[];
  onCompleteSelected: () => void;
  onDeleteSelected: () => void;
};

export function SelectedGoalActions({
  selectedGoals,
  onCompleteSelected,
  onDeleteSelected,
}: SelectedGoalActionsProps) {
  const hasSelection = selectedGoals.length > 0;
  const hasActiveSelection = selectedGoals.some((goal) => goal.status === "active");

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-goal-border bg-goal-panel p-3 shadow-sm">
      <span className="text-sm font-medium text-goal-text">Selected: {selectedGoals.length}</span>

      <Button type="button" size="sm" disabled={!hasActiveSelection} onClick={onCompleteSelected}>
        Complete selected
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive" size="sm" disabled={!hasSelection}>
            Delete selected
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected goals?</AlertDialogTitle>
            <AlertDialogDescription>
              This action removes {selectedGoals.length} selected goal{selectedGoals.length === 1 ? "" : "s"} permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteSelected}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
