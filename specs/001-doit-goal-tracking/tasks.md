# Tasks: doit Goal Tracking

**Input**: Design documents from `specs/001-doit-goal-tracking/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md

**Testing**: No test tasks are included. The project constitution prohibits creating or
running unit, integration, and end-to-end tests.

**Organization**: Tasks are grouped by user story. Each story's independent outcome
describes the user-visible result without requiring test creation or execution.

## Phase 1: Setup

**Purpose**: Add the requested small dependencies and initialize the chosen UI component
system without changing the existing Next.js, React, or Tailwind versions.

- [x] T001 Add date-fns to `goal-tracker/package.json` and update `goal-tracker/package-lock.json` without changing existing framework versions.
- [x] T002 Initialize shadcn/ui configuration in `goal-tracker/components.json` and add its shared class-name utility in `goal-tracker/lib/utils.ts`, retaining Tailwind CSS v4 compatibility.
- [x] T003 Add only the required shadcn/ui primitives in `goal-tracker/components/ui/dialog.tsx`, `goal-tracker/components/ui/alert-dialog.tsx`, `goal-tracker/components/ui/checkbox.tsx`, `goal-tracker/components/ui/button.tsx`, `goal-tracker/components/ui/input.tsx`, and `goal-tracker/components/ui/label.tsx`; update package manifests only with their required dependencies.

---

## Phase 2: Foundational

**Purpose**: Establish shared visual tokens, goal rules, and safe persistence before
implementing user-facing story flows.

- [x] T004 [P] Define the light pastel palette and semantic colors with Tailwind v4 `@theme` tokens in `goal-tracker/app/globals.css`, removing the starter dark-mode color behavior.
- [x] T005 [P] Define the Goal type and creation validation in `goal-tracker/lib/goals.ts`; enforce `title` as required after trimming leading and trailing whitespace, `endDate` as a required local `YYYY-MM-DD` date, and `status` as `"active" | "completed"` with new goals active.
- [x] T006 Implement versioned localStorage loading and saving in `goal-tracker/lib/goal-storage.ts` using storage key `doit:goals` and payload `{ schemaVersion: 1, goals }`; validate stored records and return actionable errors for unavailable storage, invalid JSON, invalid records, and write failures.

**Checkpoint**: Shared model, visual tokens, and persistence are ready for story work.

---

## Phase 3: User Story 1 - Create and track goals (Priority: P1) - MVP

**Goal**: A user can create a goal with a title and end date and see it among current
goals, with browser-local persistence.

**Independent Outcome (No Tests)**: A user can add a valid goal, see it in Current
goals with its title and end date, and still see it after reopening the app in the same
browser.

- [x] T007 [P] [US1] Create the add-goal modal with required title and end-date fields, trimmed-title and date validation feedback, and cancel behavior in `goal-tracker/components/goal-form-dialog.tsx`.
- [x] T008 [P] [US1] Create the current and completed goal group presentation and base goal display in `goal-tracker/components/goal-column.tsx` and `goal-tracker/components/goal-card.tsx`, including clear empty states and current-goal title and end date.
- [x] T009 [US1] Connect post-hydration goal loading, goal creation, and localStorage persistence in `goal-tracker/components/goal-board.tsx`; mount the board from `goal-tracker/app/page.tsx` and set doit page metadata in `goal-tracker/app/layout.tsx`. Do not overwrite stored goals before loading completes, and surface storage errors visibly.

**Checkpoint**: Goal creation and current/completed board layout are available without
requiring completion or deletion actions.

---

## Phase 4: User Story 2 - Complete or delete goals (Priority: P2)

**Goal**: A user can select goals and explicitly complete selected current goals or
permanently delete selected goals after confirmation.

**Independent Outcome (No Tests)**: Given a goal on the board, the user can select it,
move a selected current goal to Completed goals, or confirm deletion of selected goals
from either group.

- [x] T010 [P] [US2] Add an accessible checkbox and transient selected state interface to `goal-tracker/components/goal-card.tsx`; checking a goal MUST select it without completing or deleting it.
- [x] T011 [P] [US2] Create selected-goal actions in `goal-tracker/components/selected-goal-actions.tsx` using the existing `goal-tracker/components/ui/alert-dialog.tsx`; disable unavailable actions when there is no eligible selection and require explicit delete confirmation.
- [x] T012 [US2] Implement completion and confirmed permanent deletion handlers in `goal-tracker/components/goal-board.tsx`; persist changes, clear selection after actions, and allow deletion from both current and completed groups.

**Checkpoint**: Selection is distinct from completing a goal; cancellation leaves
selected goals unchanged.

---

## Phase 5: User Story 3 - Notice approaching deadlines (Priority: P2)

**Goal**: A user can quickly distinguish approaching deadlines and overdue current goals.

**Independent Outcome (No Tests)**: Current goals show correct local calendar days
remaining; goals due today through three days ahead are highlighted, and past-due goals
are labeled overdue without a negative days-left value.

- [x] T013 [P] [US3] Add date-fns local-calendar parsing, display formatting, and deadline classification helpers in `goal-tracker/lib/goals.ts`; interpret stored `YYYY-MM-DD` end dates as local calendar dates, classify zero as due today, one through three days ahead as approaching, and past dates as overdue.
- [x] T014 [US3] Update `goal-tracker/components/goal-card.tsx` to show formatted end dates and remaining calendar days, highlight active goals due today through three days ahead inclusive, and distinctly label overdue goals; do not apply active deadline urgency to completed goals.

**Checkpoint**: Deadline messaging agrees with local calendar-day semantics and remains
visually distinct from ordinary goals.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ensure the finished board follows responsive, accessibility, and usability
constraints across the feature.

- [x] T015 Refine responsive layout and keyboard-visible focus, labels, and readable pastel color contrast in `goal-tracker/app/globals.css`, `goal-tracker/components/goal-column.tsx`, `goal-tracker/components/goal-form-dialog.tsx`, and `goal-tracker/components/selected-goal-actions.tsx`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No user-story dependencies. T001 precedes shadcn setup and
  component generation; T002 precedes T003.
- **Foundational (Phase 2)**: Begins after setup. T004 and T005 are independent;
  T006 depends on the Goal type and validation from T005. This phase blocks the stories.
- **User Stories (Phases 3-5)**: Depend on the foundational phase. US1 establishes
  goal creation and the board. US2 and US3 both build on the goal board; US3's card
  integration follows US2 because both update the goal card.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after the foundation. T007 and T008 can be developed in parallel;
  T009 integrates them and the persistence layer.
- **US2 (P2)**: Starts after US1's board exists. T010 and T011 can proceed in parallel;
  T012 integrates selected actions with goal state and persistence.
- **US3 (P2)**: T013 can begin after setup and the foundation. T014 applies its date
  behavior to the goal card after US1 and US2.

### Parallel Opportunities

- **Foundation**: T004 and T005 touch different files and may run in parallel; T006
  follows T005.
- **US1**: T007 and T008 touch separate UI files and may run in parallel; T009 follows
  both.
- **US2**: T010 and T011 touch separate component files and may run in parallel after
  US1; T012 follows both.
- **US3 and polish**: T013 may proceed independently of other story code once the
  foundation and date-fns dependency exist; T014 follows T013, US1, and US2; T015
  follows all desired story work.

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and Foundational phases.
2. Complete US1 to deliver goal creation, board presentation, and same-browser
   persistence.
3. Stop at the US1 checkpoint; the project policy does not permit adding or running
   tests.

### Incremental Delivery

1. Deliver US1 as the first usable increment.
2. Add US2 for completion and confirmed deletion.
3. Add US3 for deadline urgency.
4. Complete responsive and accessibility refinements.

## Notes

- Every implementation task uses the required checkbox, sequential ID, optional
  parallel marker, story label where applicable, and explicit file path.
- No test-writing, test-running, test-fixture, or automated validation tasks are
  included, in accordance with the project constitution and implementation plan.
