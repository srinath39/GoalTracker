# Goal Reordering: Run and Use

This is an app run-and-use guide, not a test or validation procedure. The project
constitution and user direction prohibit creating or running tests.

## Start the application

From `goal-tracker/`, start the app:

```powershell
npm run dev
```

Open `http://localhost:3000`. Goals and their order are stored in the current browser.

## Reorder goals

1. Use the drag handle on a goal card to move it above or below another goal in the
   same group.
2. Use **Move up** or **Move down** when operating with a keyboard.
3. Use the existing selection, completion, and deletion controls independently of the
   reorder handle.
4. Reorder goals separately in Current goals and Completed goals. Completing selected
   goals adds them to the bottom of Completed goals in their current relative order.

See [the UI contract](contracts/ui.md) for user-facing behavior and
[the data model](data-model.md) for ordering and persistence semantics.
