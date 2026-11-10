"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateGoalInput } from "@/lib/goals";

type GoalFormDialogProps = {
  onCreate: (goal: { title: string; endDate: string }) => void;
};

export function GoalFormDialog({ onCreate }: GoalFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<{ title?: string; endDate?: string }>({});

  const resetForm = () => {
    setTitle("");
    setEndDate("");
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateGoalInput({ title, endDate });

    if (!validation.success || !validation.value) {
      setErrors(validation.errors);
      return;
    }

    onCreate({
      title: validation.value.title,
      endDate: validation.value.endDate,
    });

    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">Add goal</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add goal</DialogTitle>
            <DialogDescription>Set a title and end date for a new goal.</DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal title</Label>
              <Input
                id="goal-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Finish portfolio refresh"
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? <p className="text-xs text-rose-600">{errors.title}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-end-date">End date</Label>
              <Input
                id="goal-end-date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                aria-invalid={Boolean(errors.endDate)}
              />
              {errors.endDate ? <p className="text-xs text-rose-600">{errors.endDate}</p> : null}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
