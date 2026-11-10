# User Interface Contract: doit Goal Tracking

This feature exposes a browser interface only; it defines no public API or external
service contract.

## Goal Board

- The page is branded **doit** and presents clearly labeled **Current goals** and
  **Completed goals** groups.
- At wider viewport sizes, current goals appear on the left and completed goals on the
  right. At narrow widths, the groups stack in that order without horizontal page
  scrolling.
- Each goal displays its title. Current goals also display the end date and remaining
  calendar days or an **Overdue** label.
- A current goal due today through three local calendar days from today, inclusive, is
  highlighted. Past-due goals have a distinct overdue label.
- Empty groups have a clear empty-state message.

## Goal Creation

- An **Add goal** action opens a modal with a required title field and required end-date
  field.
- Submitting a valid goal adds it to Current goals and closes the modal.
- Blank titles and missing or invalid dates prevent submission and produce field-level
  feedback.
- Closing or canceling the modal without submission does not add a goal.

## Goal Actions

- Each goal has an accessible checkbox. Checking it selects the goal; it does not
  complete or delete it.
- **Complete selected** moves selected current goals into Completed goals.
- **Delete selected** is available for selected current or completed goals and opens a
  confirmation dialog. Only explicit confirmation permanently deletes them.
- Selection is cleared after an action. Actions are unavailable when no eligible goals
  are selected.

## Visual and Accessibility Contract

- Use the light pastel palette defined through Tailwind v4 `@theme` tokens.
- Use accessible shadcn/ui dialog, alert-dialog, checkbox, input, label, and button
  components where applicable.
- Controls have visible keyboard focus, accessible names, and readable contrast.
- Storage read or write failures are communicated visibly; they are not represented as
  successful saves.
