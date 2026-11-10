# Feature Specification: Goal Reordering

**Feature Branch**: `002-goal-reordering`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "drag and drop - let's make it so that users can reorder goals by dragging and dropping them above or below other goals in the list."

## Clarifications

### Session 2026-11-10

- Q: How should users reorder goals using only a keyboard? → A: Provide Move up and Move down controls for each goal, operable by keyboard.
- Q: When a goal is completed, where should it appear in the Completed goals list? → A: Add newly completed goals to the bottom, preserving the existing order and the order of goals completed together.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reorder goals (Priority: P1)

As a user, I want to drag a goal above or below another goal so that I can organize the goals in each group in the order that is most useful to me.

**Why this priority**: Reordering is the complete value of this feature and lets users organize their existing goals without changing their meaning or status.

**Independent Outcome (No Tests)**: A user can reposition a goal in either group, see the new order immediately, and retain that order after reopening the app.

**Acceptance Scenarios**:

1. **Given** a group with multiple goals, **When** the user drags a goal and drops it above another goal, **Then** the moved goal appears immediately before the target.
2. **Given** a group with multiple goals, **When** the user drags a goal and drops it below another goal, **Then** the moved goal appears immediately after the target.
3. **Given** a reordered group, **When** the user leaves and reopens the app in the same browser, **Then** the group retains its saved order.
4. **Given** goals in the Current goals or Completed goals group, **When** the user reorders a goal within that group, **Then** its completion status remains unchanged.
5. **Given** one or more selected current goals, **When** the user completes them, **Then** they appear at the bottom of Completed goals in their existing relative order.

### Edge Cases

- Dropping a goal in its existing position leaves the group's order unchanged.
- Dropping a goal between two items places it on the indicated side of the target without duplicating or losing either item.
- Reordering is unavailable when a group has fewer than two goals.
- A drag operation cannot move a goal between Current goals and Completed goals or change its status.
- Checkbox selection and other goal actions remain usable without unintentionally starting a drag.
- If an order change cannot be saved, the user receives a visible error; the interface does not indicate that the change was saved.
- Reordering remains possible on touch devices and has a keyboard-operable alternative.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to reorder goals in the Current goals group by dragging a goal and dropping it above or below another goal in that group.
- **FR-002**: Users MUST be able to reorder goals in the Completed goals group by dragging a goal and dropping it above or below another goal in that group.
- **FR-003**: The interface MUST clearly indicate the proposed insertion position while a goal is being dragged.
- **FR-004**: After a valid drop, the displayed group order MUST update immediately and contain every goal exactly once.
- **FR-005**: Reordering MUST NOT move goals between groups or change their completion status.
- **FR-006**: Saved ordering MUST be restored when the user returns to the app in the same browser.
- **FR-007**: Each goal MUST provide keyboard-operable Move up and Move down controls with accessible names and visible focus. A control MUST be unavailable when the goal cannot move farther in that direction within its group.
- **FR-008**: Goal selection, completion, deletion, and other existing actions MUST remain independently operable and MUST NOT be triggered by starting or ending a reorder interaction.
- **FR-009**: If a reorder cannot be saved, the interface MUST communicate the failure visibly.

### Key Entities

- **Goal**: An existing goal with a title, end date, and completion status. Its position within its current group represents its user-defined order.
- **Goal Group**: The Current goals or Completed goals collection. Ordering is maintained separately for each group.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can move a goal above or below another goal in one drag-and-drop action, with the new position visible immediately.
- **SC-002**: In a demonstration with at least five goals in each group, users can reorder a goal in either group in under 10 seconds.
- **SC-003**: After a successful save and app reload, 100% of reordered goals appear in the same relative order as before the reload.
- **SC-004**: Reordering a goal leaves its completion status unchanged in every supported reorder scenario.
- **SC-005**: All reorder actions can be completed using a keyboard without requiring a pointer.

## Assumptions

- Users reorder goals only within their existing group; moving a goal between Current goals and Completed goals remains the separate completion action.
- Newly created goals keep the existing behavior of appearing at the top of Current goals.
- When one or more goals are completed, they are appended to the bottom of Completed goals in their existing relative order; users can subsequently reorder that group.
- The feature continues to use the current browser-local goal collection and its existing visible storage-error behavior.
- A keyboard-operable alternative and touch-device interaction are included so reordering is usable without a mouse.
