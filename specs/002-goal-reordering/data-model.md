# Data Model: Goal Reordering

## Goal

The existing Goal entity remains unchanged.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Stable identifier used to track the item while its position changes. |
| `title` | string | Existing required, trimmed display title. |
| `endDate` | string | Existing local calendar date in `YYYY-MM-DD` form. |
| `status` | `"active" \| "completed"` | Reordering does not change status. |

## Goal Group Ordering

- The Current goals and Completed goals groups are ordered independently.
- Within a group, relative position in the stored goal collection determines display
  order. No persistent rank field is added.
- Reordering updates the position of one goal within its current group. It does not
  add, remove, duplicate, or change the status of goals.
- New goals are inserted at the top of Current goals.
- Completing one or more current goals removes them from their current positions and
  appends them to the bottom of Completed goals in their existing relative order.
- Deletion removes selected goals and leaves the relative order of remaining goals
  unchanged.

## Persistence

- Storage key remains `doit:goals`.
- Payload remains `{ schemaVersion: 1, goals: Goal[] }`.
- Stored list sequence carries the ordering for both groups; each group's visible
  sequence is its goals' relative sequence in that array.
- A reorder is saved through the existing storage helper. On write failure, the
  previous visible order remains in effect and the existing user-visible storage error
  is shown.
- Selection and drag state are transient and are not persisted.

