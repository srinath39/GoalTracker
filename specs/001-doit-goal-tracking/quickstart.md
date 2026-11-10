# doit Quickstart

This is a local run-and-use guide, not a test or validation procedure. The project
constitution prohibits creating or running unit, integration, and end-to-end tests.

## Prerequisites

- Node.js and npm installed.
- Dependencies installed in `goal-tracker/`.

## Start the application

From the `goal-tracker/` directory, run:

```powershell
npm run dev
```

Open `http://localhost:3000` in a browser. The app stores goals in that browser's local
storage; they are not synchronized to other browsers or devices.

## Use the board

1. Choose **Add goal**, enter a title and end date, and submit the form.
2. View current goals, including their remaining days. Goals due within three calendar
   days are highlighted; past-due goals are labeled overdue.
3. Select one or more goals with their checkboxes, then choose **Complete selected** or
   **Delete selected**. Confirm deletion in the dialog.
4. Find completed goals in the Completed goals group.

See [the UI contract](contracts/ui.md) for user-facing behavior and
[the data model](data-model.md) for goal and persistence semantics.
