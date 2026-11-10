import { differenceInCalendarDays, format, isValid, parse, parseISO, startOfDay } from "date-fns";

export type GoalStatus = "active" | "completed";

export type Goal = {
  id: string;
  title: string;
  endDate: string;
  status: GoalStatus;
};

export type GoalInput = {
  id?: string;
  title?: string;
  endDate?: string;
  status?: GoalStatus;
};

export type GoalValidationResult = {
  success: boolean;
  value?: Goal;
  errors: {
    title?: string;
    endDate?: string;
  };
};

export function isValidLocalDate(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  return isValid(parsedDate) && format(parsedDate, "yyyy-MM-dd") === dateString;
}

export function validateGoalInput(input: GoalInput): GoalValidationResult {
  const trimmedTitle = input.title?.trim() ?? "";
  const titleError = trimmedTitle ? undefined : "Title is required.";

  const endDateValue = input.endDate ?? "";
  const endDateError = endDateValue && isValidLocalDate(endDateValue)
    ? undefined
    : "Please enter a valid local date in YYYY-MM-DD format.";

  const result: GoalValidationResult = {
    success: !titleError && !endDateError,
    errors: {
      title: titleError,
      endDate: endDateError,
    },
  };

  if (result.success) {
    result.value = {
      id: input.id ?? "",
      title: trimmedTitle,
      endDate: endDateValue,
      status: input.status ?? "active",
    };
  }

  return result;
}

export function createGoal(title: string, endDate: string, status: GoalStatus = "active"): Goal {
  const validation = validateGoalInput({ title, endDate, status });

  if (!validation.success || !validation.value) {
    throw new Error("Goal input is invalid.");
  }

  return {
    ...validation.value,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  };
}

export function validateStoredGoal(value: unknown, index = 0): Goal {
  if (typeof value !== "object" || value === null) {
    throw new Error(`Stored goal at index ${index} is not an object.`);
  }

  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const endDate = typeof record.endDate === "string" ? record.endDate : "";
  const id = typeof record.id === "string" ? record.id : "";
  const status = record.status === "completed" ? "completed" : "active";

  const validation = validateGoalInput({ title, endDate, status, id });

  if (!validation.success || !validation.value) {
    throw new Error(`Stored goal at index ${index} is missing required fields.`);
  }

  return {
    id: validation.value.id || `goal-${index}`,
    title: validation.value.title,
    endDate: validation.value.endDate,
    status: validation.value.status,
  };
}

export function getGoalDeadline(goal: Goal): {
  daysRemaining: number;
  isUrgent: boolean;
  isOverdue: boolean;
  label: string;
} {
  if (goal.status !== "active") {
    return {
      daysRemaining: 0,
      isUrgent: false,
      isOverdue: false,
      label: "Completed",
    };
  }

  const today = startOfDay(new Date());
  const dueDate = parseISO(goal.endDate);

  if (!isValid(dueDate)) {
    return {
      daysRemaining: 0,
      isUrgent: false,
      isOverdue: false,
      label: "Invalid date",
    };
  }

  const daysRemaining = differenceInCalendarDays(dueDate, today);

  if (daysRemaining < 0) {
    return {
      daysRemaining: 0,
      isUrgent: false,
      isOverdue: true,
      label: "Overdue",
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining: 0,
      isUrgent: true,
      isOverdue: false,
      label: "Due today",
    };
  }

  if (daysRemaining <= 3) {
    return {
      daysRemaining,
      isUrgent: true,
      isOverdue: false,
      label: `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`,
    };
  }

  return {
    daysRemaining,
    isUrgent: false,
    isOverdue: false,
    label: `${daysRemaining} days left`,
  };
}

export function formatGoalDate(dateString: string): string {
  const parsed = parseISO(dateString);
  return isValid(parsed) ? format(parsed, "MMM d, yyyy") : "Invalid date";
}
