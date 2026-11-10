# Research: Goal Reordering

## Sortable React Library

- **Decision**: Use the current modular dnd-kit React API with `@dnd-kit/react` and
  `@dnd-kit/dom`. Use its sortable hook and separate group identifiers for Current
  goals and Completed goals. Keep explicit Move up/Move down controls as the keyboard
  alternative specified by the feature.
- **Rationale**: The sortable API accepts stable item identifiers and group
  information, and the library documents multi-list state management, pointer/touch
  sensors, and drag state. The current React package supports React 18 and 19, aligning
  with this application's React 19.3.0. The board is already a client component, so
  browser interaction can remain isolated from server rendering.
- **Alternatives considered**:
  - `@hello-pangea/dnd` has list-oriented primitives and mouse, touch, keyboard, and
    screen-reader support. Its `Droppable`/`Draggable` render-prop API is more
    prescriptive than needed for the existing goal cards.
  - Older dnd-kit tutorials using `@dnd-kit/core` and `@dnd-kit/sortable` do not
    represent the current modular API. Do not combine examples from the two APIs.
- **Sources**: [dnd-kit React quickstart](https://dndkit.com/react/quickstart),
  [sortable hook](https://dndkit.com/react/hooks/use-sortable/),
  [multiple sortable lists](https://dndkit.com/react/guides/multiple-sortable-lists/),
  [sortable state management](https://dndkit.com/react/guides/sortable-state-management/),
  [sensor guide](https://dndkit.com/react/guides/sensors),
  [React package metadata](https://registry.npmjs.org/%40dnd-kit%2Freact/latest).

## Group Boundaries and Interaction

- **Decision**: Treat each status list as a separate sortable group. Commit only
  reorders that began and ended in the same group. Bind dragging to a dedicated handle,
  not to the full goal card; retain the goal checkbox, completion, and deletion
  controls independently.
- **Rationale**: This enforces the specification's no-cross-group rule and avoids
  accidental interactions with existing card controls. The dedicated keyboard buttons
  make movement accessible without a pointer and do not rely on a user discovering
  keyboard drag gestures.
- **Alternatives considered**: A shared sortable group would permit cross-list
  movement, which conflicts with the feature's requirement that completion status
  remain unchanged. Making the whole card draggable risks conflicting with selection
  and goal actions.
- **Sources**: [sortable hook](https://dndkit.com/react/hooks/use-sortable/),
  [draggable hook](https://dndkit.com/react/hooks/use-draggable/),
  [pointer sensor](https://dndkit.com/extend/sensors/pointer-sensor/).

## Styling and Persistence

- **Decision**: Use existing Tailwind CSS classes for the drag handle, focus ring,
  active/dragging state, and top/bottom insertion marker. Persist a reordered list via
  the current `saveGoals` path without changing the version-1 envelope. Update visible
  order only when persistence succeeds; if it fails, leave or restore the previous
  order and display the existing storage error.
- **Rationale**: The app already uses Tailwind CSS 4 and its goal board persists the
  complete goal array locally. Keeping the same envelope avoids a migration. Rolling
  back failed writes prevents the UI from falsely presenting an unsaved arrangement as
  retained.
- **Alternatives considered**: A separate drag styling framework or order storage
  service would add dependencies and persistence complexity without user-visible
  benefit. Optimistically retaining failed order would violate the specified error
  behavior.
- **Sources**: [sortable hook state](https://dndkit.com/react/hooks/use-sortable/),
  [sortable state management](https://dndkit.com/react/guides/sortable-state-management/).

