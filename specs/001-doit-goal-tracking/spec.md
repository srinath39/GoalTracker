# Feature Specification: doit Goal Tracking

**Feature Branch**: `001-doit-goal-tracking`

**Created**: 2026-11-07

**Status**: Draft

**Input**: User description: "This application should be a goal tracking web app called 'doit'. There should be two columns: a left one where current goals are shown, along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be checked, using a checkbox, and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Use a modern light theme with fun pastel colours."

## Clarifications

### Session 2026-11-10

- Q: Should checking a goal complete it immediately, or select it for a separate action? → A: Checking selects the goal; the user then chooses a separate Complete or Delete action.
- Q: Should goals stay only in the user’s current browser, or sync across devices through an account? → A: Goals stay in the current browser; no account or cross-device syncing.

## User Scenarios & Testing *(mandatory)*

This section defines user journeys and observable acceptance outcomes. It does not
authorize creating or running tests; the project constitution prohibits all testing.

### User Story 1 - Create and track goals (Priority: P1)

As a user, I want to add goals with an end date and see them in a current-goals column
with the time remaining, so I can keep track of what I intend to accomplish.

**Why this priority**: Creating and viewing current goals is the core value of the app.

**Independent Value**: A user can create a goal and see its title, end date, and
remaining days without relying on completion or deletion actions.

**Acceptance Scenarios**:

1. **Given** the goal board is open, **When** the user chooses to add a goal,
   **Then** a modal form asks for a title and end date.
2. **Given** the user enters a non-empty title and a valid end date, **When** they
   submit the form, **Then** the new goal appears in the current-goals column and the
   modal closes.
3. **Given** the user leaves the title blank or enters an invalid date, **When** they
   submit the form, **Then** the goal is not added and the form explains what needs
   correction.

### User Story 2 - Complete or delete goals (Priority: P2)

As a user, I want to select a goal and either mark it complete or delete it, so the
board reflects my progress and no longer retains goals I remove.

**Why this priority**: These actions let users maintain an accurate, useful goal list.

**Independent Value**: A user can select an existing goal and perform the chosen
action without needing to create another goal.

**Acceptance Scenarios**:

1. **Given** a current goal is displayed, **When** the user selects its checkbox and
   chooses the completion action, **Then** the goal leaves the current-goals column and
   appears in the completed-goals column.
2. **Given** a current or completed goal is displayed, **When** the user selects its
   checkbox and confirms deletion, **Then** the goal is permanently removed from the
   board.
3. **Given** no goals are selected, **When** the user views the goal actions,
   **Then** completion and deletion actions are unavailable or clearly disabled.

### User Story 3 - Notice approaching deadlines (Priority: P2)

As a user, I want goals nearing their end date to stand out, so I can prioritize them
before time runs out.

**Why this priority**: Clear deadline urgency helps users act on goals in time.

**Independent Value**: A user can distinguish an approaching or passed deadline from
other current goals by looking at the board.

**Acceptance Scenarios**:

1. **Given** a current goal has an end date from today through three calendar days
   from today, **When** the board is displayed, **Then** the goal is highlighted and
   its remaining-days label is visible.
2. **Given** a current goal's end date is more than three calendar days away, **When**
   the board is displayed, **Then** it is not shown as approaching its deadline.
3. **Given** a current goal's end date has passed, **When** the board is displayed,
   **Then** it is identified as overdue and remains in the current-goals column until
   completed or deleted.

### Edge Cases

- A goal due today shows zero days remaining and receives the approaching-deadline
  highlight.
- A goal whose end date is in the past remains visible as overdue, with no negative
  days-left value presented as if it were time remaining.
- Submitting a blank or whitespace-only title does not create a goal.
- Submitting the add-goal form without a valid end date does not create a goal.
- An empty current or completed column clearly indicates that it has no goals.
- Deleting a selected goal requires confirmation and removes it from the board; canceling
  confirmation leaves it unchanged.
- On narrow screens, both goal groups remain reachable and usable without horizontal
  page scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST be named "doit" and present a goal-tracking board.
- **FR-002**: The board MUST present current goals in a left column and completed goals
  in a right column on wider screens.
- **FR-003**: The application MUST allow a user to open an add-goal modal with a title
  field and an end-date field.
- **FR-004**: The application MUST reject a blank or whitespace-only title and an
  invalid or missing end date, and MUST identify the fields needing correction.
- **FR-005**: On successful submission, the application MUST add the goal to the current
  goals and close the modal.
- **FR-006**: Each current goal MUST display its title, end date, and remaining calendar
  days. A goal due today MUST display zero days remaining.
- **FR-007**: A current goal with an end date from today through three calendar days
  ahead, inclusive, MUST be visually highlighted as approaching its deadline.
- **FR-008**: A past-due current goal MUST remain in the current-goals column and be
  visibly identified as overdue.
- **FR-009**: Each goal MUST have a checkbox that allows the user to select it for an
  available action.
- **FR-010**: The user MUST be able to move selected current goals to the completed
  column. Completed goals MUST no longer appear among current goals.
- **FR-011**: The user MUST be able to permanently delete selected current or completed
  goals after confirming the deletion.
- **FR-012**: The board MUST clearly distinguish the current-goals and completed-goals
  groups and provide a clear empty state when either group has no goals.
- **FR-013**: The visual design MUST use a modern, light appearance with playful pastel
  colours and readable text and controls.
- **FR-014**: On mobile, tablet, and desktop viewport sizes, all board content and
  controls MUST remain usable; narrow layouts MUST allow access to both goal groups
  without horizontal page scrolling.

### Key Entities

- **Goal**: A user-defined item with a title, end date, and completion state. A goal is
  either current or completed; a deleted goal is no longer present on the board.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 9 out of 10 first-time users can add a goal with its end date in
  under 60 seconds, without assistance.
- **SC-002**: For all current goals, the displayed days remaining matches the calendar
  difference between the current date and the goal's end date, with due-today goals
  displayed as zero and past-due goals identified as overdue.
- **SC-003**: Every current goal due within the next three calendar days, including
  today, is highlighted; no current goal with a later end date is highlighted as
  approaching its deadline.
- **SC-004**: At least 9 out of 10 users can complete or permanently delete a selected
  goal in under 15 seconds.
- **SC-005**: At viewport widths from 320 to 1920 pixels, users can reach both goal
  groups and their controls without horizontal page scrolling.
- **SC-006**: Users can distinguish current goals, completed goals, approaching
  deadlines, and overdue goals from the board's labels and visual presentation.

## Assumptions

- The app is for one user at a time; sign-in, shared goals, and cross-user collaboration
  are outside this feature's scope.
- Goals remain available in the user's current browser after closing and reopening the
  app. Accounts and cross-device synchronization are outside this feature's scope.
- End dates and days remaining use the user's local calendar date. The due date is
  included in the three-day approaching-deadline window.
- A completed goal remains in the completed-goals column until the user permanently
  deletes it. Reopening or editing goals is outside this feature's scope.
- Checkbox selection is separate from changing completion state: the user selects goals
  and then chooses the completion or deletion action.
- The delete confirmation is canceled by default unless the user explicitly confirms.
