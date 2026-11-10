# User Interface Contract: Goal Reordering

This feature changes the browser interface only; it defines no public API or external
service contract.

## Sortable Goal Groups

- Current goals and Completed goals are independently reorderable lists.
- A user can drag a goal above or below another goal in the same group.
- The proposed insertion position is visibly indicated during a drag.
- A goal dropped into its current position leaves the order unchanged.
- Dragging cannot move a goal between groups or change its status.
- A group with fewer than two goals does not expose usable reorder controls.
- Touch users can use the drag interaction without making ordinary scrolling or nearby
  card controls unintentionally start a drag.

## Keyboard and Existing Actions

- Each goal exposes keyboard-operable **Move up** and **Move down** controls with
  accessible names and visible focus.
- A move control is disabled when the goal is already at the corresponding group
  boundary.
- The drag handle is separate from the goal checkbox and action controls.
- Selecting, completing, or deleting a goal does not start or complete a reorder.
- Completing selected goals appends them to the bottom of Completed goals while
  preserving their relative order.

## Persistence and Feedback

- Successful reordering is displayed immediately and restored when the user returns
  in the same browser.
- If an order change cannot be saved, the prior order remains displayed and a visible
  storage error is shown.
- Ordering uses the existing browser-local goal collection; no account or cross-device
  synchronization is introduced.

## Visual Presentation

- Use the existing Tailwind CSS theme and utilities.
- Drag handles and move controls have visible keyboard focus.
- Dragging and the proposed insertion position are visually distinguishable without
  obscuring goal titles, due dates, selection, or status information.

