# Tasks: Goal Reordering

**Input**: Design documents from `specs/002-goal-reordering/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md

**Testing**: No tests or test tasks are included. Project governance and user direction
prohibit creating, modifying, or running tests of any kind.

**Organization**: Tasks are grouped by user story. The feature has one independently
deliverable user story.

## Phase 1: Setup

**Purpose**: Add the sortable interaction dependencies selected by the implementation
plan.

- [X] T001 Add `@dnd-kit/react` and `@dnd-kit/dom` to `goal-tracker/package.json` and update `goal-tracker/package-lock.json` without changing the existing Next.js, React, or Tailwind versions.

---

## Phase 2: Foundational

No separate foundational code changes are required. The feature reuses the existing
Goal type, browser storage envelope, Tailwind theme, board state, and accessible Button
component. Complete Phase 1 before starting User Story 1.

---

## Phase 3: User Story 1 - Reorder goals (Priority: P1) - MVP

**Goal**: Users can reorder goals within either status group with drag-and-drop or
keyboard Move up/Move down controls, and saved order is retained in the current browser.

**Independent Outcome (No Tests)**: Reorder goals above or below other goals in either
group, use Move up/Move down with a keyboard, and retain the displayed order after
reopening the app; completion status and other card actions remain unchanged.

- [X] T002 [US1] Implement same-status reordering and order-aware action updates in `goal-tracker/components/goal-board.tsx`: preserve each group's relative order, append selected current goals to the bottom of Completed goals in their existing relative order, and persist the full ordered goal list only when a save succeeds, retaining the previous visible order and showing an error on failure.
- [X] T003 [US1] Add an explicit sortable drag handle and accessible Move up/Move down controls to `goal-tracker/components/goal-card.tsx`; ensure the handle does not overlap or intercept the selection checkbox or other goal actions, and disable movement controls at their group's boundaries.
- [X] T004 [US1] Make each list independently sortable in `goal-tracker/components/goal-column.tsx` and `goal-tracker/components/goal-card.tsx` using the current `@dnd-kit/react` API; configure distinct Current and Completed groups, touch-capable pointer interaction, and a visible above/below insertion cue, preventing cross-group drops.
- [X] T005 [US1] Connect sortable drop and Move up/Move down callbacks to the persistence-aware handlers in `goal-tracker/components/goal-board.tsx`, ensuring successful reorder state updates immediately and failed storage writes restore or retain the prior order with visible feedback.

**Checkpoint**: Both groups can be reordered without status changes; keyboard controls
and existing checkbox, completion, and deletion actions work independently; order is
saved and restored in the same browser.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Refine responsive and accessible reorder controls using the existing
Tailwind styling system.

- [X] T006 Refine keyboard-visible focus, drag-state and insertion-position contrast, touch affordances, and narrow-screen layout in `goal-tracker/components/goal-card.tsx`, `goal-tracker/components/goal-column.tsx`, and `goal-tracker/app/globals.css`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No prerequisites; T001 must complete before sortable components are added.
- **Foundational (Phase 2)**: No additional code tasks; existing Goal, storage, Tailwind, and Button infrastructure is reused.
- **User Story 1 (Phase 3)**: Depends on T001. Complete T002 before wiring user controls in T003-T005.
- **Polish (Phase 4)**: Depends on User Story 1 being complete.

### User Story Dependencies

- **User Story 1 (P1)**: The only story; deliver as the MVP.

### Parallel Opportunities

- No implementation tasks are marked parallel: the board, card, and column share the sortable item and callback interface, so completing them sequentially avoids conflicting edits.
- T006 touches styles in addition to the components and should follow the completed interaction work to preserve the established UI behavior.

## Implementation Strategy

1. Add the chosen sortable dependencies without changing framework versions.
2. Implement reliable, group-scoped ordering and persistence behavior.
3. Add sortable handles and keyboard controls, then connect the two distinct lists to the board callbacks.
4. Refine responsive and accessible styling.
5. Do not create, modify, or run tests, per project governance and user direction.
