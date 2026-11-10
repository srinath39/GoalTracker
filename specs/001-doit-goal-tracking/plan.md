# Implementation Plan: doit Goal Tracking

**Branch**: `001-doit-goal-tracking` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-doit-goal-tracking/spec.md`

## Summary

Replace the default starter page with the doit goal board: create, select, complete,
and delete goals; highlight imminent and overdue deadlines; and retain goals in the
current browser. Use Tailwind CSS v4 `@theme` tokens for the pastel palette, shadcn/ui
for accessible interface primitives, and date-fns for date formatting and local
calendar-day calculations. Persist a versioned goal record in browser local storage,
loading it only on the client after hydration.

## Technical Context

**Language/Version**: TypeScript 5; React 19.3.0; Next.js 16.4.5 (from `goal-tracker/package.json`)

**Primary Dependencies**: Existing Next.js, React, Tailwind CSS `^4`; add date-fns.
Use shadcn/ui-generated components with only the primitives and supporting packages
needed for this UI.

**Storage**: Browser `localStorage`, scoped to the current browser and origin. Persist
a versioned JSON envelope as defined in [data-model.md](data-model.md).

**Testing**: Prohibited by the project constitution. Do not create or run unit,
integration, or end-to-end tests, or add testing tasks. The quickstart is an app-use
guide, not a validation procedure.

**Target Platform**: Current desktop, tablet, and mobile web browsers; the feature uses
browser local storage and the Next.js App Router.

**Project Type**: Single Next.js web application in `goal-tracker/`.

**Performance Goals**: Meet the user-facing completion-time and responsive-width
outcomes in the feature specification; no separate backend or network latency target.

**Constraints**: No account, server persistence, cross-device sync, or goal editing.
Treat due dates as local calendar dates. Do not read local storage during server
rendering. Surface storage errors visibly. Use the package-declared framework versions.

**Scale/Scope**: One user per browser origin and a single goal board; the specification
sets no fixed goal-count limit.

## Constitution Check

| Principle | Gate | Plan |
|---|---|---|
| Clean Code | Pass | Keep date rules, storage access, and focused UI components separated; avoid duplicated state logic. |
| Simple UX | Pass | Use the specified board, add-goal modal, selected-goal actions, and explicit delete confirmation only. |
| Responsive Design | Pass | Keep two columns on wider screens and stack both groups on narrow screens without horizontal overflow. |
| Minimal Dependencies | Pass with explicit requirement | Use requested date-fns and shadcn/ui; include only dependencies needed by selected components, and preserve the existing framework versions. |
| No Testing | Pass | Create and run no tests; do not include test tasks. |

No constitution gate violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/001-doit-goal-tracking/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui.md
└── tasks.md              # Created later by /speckit-tasks; no test tasks
```

### Source Code

```text
goal-tracker/
├── app/
│   ├── globals.css              # Tailwind import and pastel @theme tokens
│   ├── layout.tsx               # doit metadata and application shell
│   └── page.tsx                 # Board entry point
├── components/
│   ├── goal-board.tsx           # Client state, hydration, and goal actions
│   ├── goal-column.tsx          # Current/completed group presentation
│   ├── goal-card.tsx            # Goal details, urgency, and selection
│   ├── goal-form-dialog.tsx     # Add-goal dialog and field feedback
│   ├── selected-goal-actions.tsx
│   └── ui/                      # Only required shadcn/ui components
├── lib/
│   ├── goals.ts                 # Goal types, validation, date presentation rules
│   ├── goal-storage.ts          # Versioned localStorage read/write
│   └── utils.ts                 # shadcn class-name helper
├── components.json              # shadcn/ui configuration
├── package.json
└── package-lock.json
```

**Structure Decision**: Keep the existing single Next.js App Router project under
`goal-tracker/`. Put UI in focused components and keep browser persistence and goal/date
rules in small library modules. No backend or test directories are introduced.

## Design Decisions

- Keep the page shell server-renderable, with interactive goal state in a client
  component. Render a stable initial shell, load local storage after hydration, and do
  not write the initial empty state over saved goals before loading completes.
- Use a single versioned storage record. Validate its shape on read and report
  serialization, parsing, or storage-access failures visibly.
- Store end dates as date-only `YYYY-MM-DD` strings. Use date-fns calendar-day
  operations against the user's local date, never elapsed 24-hour durations, to derive
  days remaining and urgency.
- Keep checkbox selection transient. Completion changes only eligible active goals;
  deletion requires explicit confirmation and applies to selected goals from either
  group.
- Define the pastel palette with Tailwind v4 `@theme` color tokens and use only
  shadcn/ui components required by the board and dialogs.
- No tests, test fixtures, or automated test commands are part of this plan, per
  constitution.
