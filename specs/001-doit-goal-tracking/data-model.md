# Data Model: doit Goal Tracking

## Goal

Represents one user-created item on the board.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique and stable for the lifetime of the goal. Generated when a goal is created. |
| `title` | string | Required after trimming leading and trailing whitespace. |
| `endDate` | string | Required local calendar date in `YYYY-MM-DD` form. Past dates are allowed and display as overdue. |
| `status` | `"active" \| "completed"` | New goals are active. Completing a selected goal changes its status to completed. |

### Relationships and Lifecycle

- Each goal belongs to the single local user context; accounts and sharing are out of
  scope.
- An active goal can be completed or permanently deleted.
- A completed goal can be permanently deleted. Reopening or editing goals is out of
  scope.
- Checkbox selection is transient interface state, not a goal field and not persisted.
- Goal order is insertion order within each status group. Moving goals between groups
  preserves their relative order.

## Local Storage Record

- Storage key: `doit:goals`.
- Payload: a JSON object with `schemaVersion: 1` and a `goals` array containing Goal
  records.
- Missing storage represents an empty board. Changes are persisted in the current
  browser only.
- Stored JSON and each goal record are validated when read. Invalid data or unavailable
  storage MUST produce a visible, actionable message rather than being silently treated
  as a successful empty board.
- Storage access begins on the client after hydration. The initial server-rendered
  output MUST not depend on browser storage.

## Deadline Rules

- Interpret `endDate` as a local calendar date, not as a UTC timestamp.
- Compute calendar-day difference from the user's local current date.
- Zero means due today; one through three days ahead inclusive means approaching;
  negative difference means overdue.
- Completed goals do not receive active deadline urgency treatment.
