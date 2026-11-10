# Implementation Plan: Goal Reordering

**Branch**: `002-goal-reordering` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-goal-reordering/spec.md`

## Summary

Enable users to reorder goals within the Current goals and Completed goals lists using
drag-and-drop. Use the current modular dnd-kit React API for sortable interactions,
with distinct groups so goals cannot be dragged across statuses. Style drag handles,
drop-position indicators, and keyboard focus with the existing Tailwind CSS tokens and
utilities. Provide the specified Move up/Move down keyboard controls, persist ordering
through the existing local goal record, and retain the prior order if persistence fails.

## Technical Context

**Language/Version**: TypeScript 5; React 19.3.0; Next.js 16.4.5.

**Primary Dependencies**: Add `@dnd-kit/react` and `@dnd-kit/dom` for sortable drag
interactions. Tailwind CSS 4 is already present and will style controls, drag states,
and insertion cues. Do not mix the current dnd-kit API with older
`@dnd-kit/core`/`@dnd-kit/sortable` examples.

**Storage**: Existing browser `localStorage` key `doit:goals` and version-1 envelope
`{ schemaVersion: 1, goals }`. The goal array order represents each status group's
relative display order; no new goal field or storage schema migration is required.

**Testing**: Prohibited. The project constitution and user's instruction forbid
creating, modifying, or running tests of any kind. No testing procedures or test tasks
are included.

**Target Platform**: The existing Next.js App Router application in current desktop,
tablet, and mobile browsers. Reordering works with pointer/touch and keyboard-operated
Move up/Move down controls.

**Project Type**: Single Next.js web application in `goal-tracker/`.

**Performance Goals**: A successful reorder updates the visible position immediately;
users can perform a reorder in either group in under 10 seconds with at least five
goals in the group.

**Constraints**: Keep drag-and-drop interactions within client-side components. Each
goal remains in its existing status group during a reorder. Use a dedicated drag handle
so the checkbox and other goal actions do not initiate a drag. Use separate sortable
group identities. Save the new order through the existing storage layer; if saving
fails, restore the previous displayed order and surface the existing visible storage
error. Newly created goals stay at the top of Current goals; selected goals completed
together are appended to Completed goals in their current relative order. No tests.

**Scale/Scope**: Two user-managed lists in one browser-local board. No fixed list-size
limit is specified. No server API or shared ordering is introduced.

## Constitution Check

| Principle | Gate | Plan |
|---|---|---|
| I. Clean Code | Pass | Keep list ordering in the existing board state flow and use focused sortable/card behavior rather than duplicating order state. |
| II. Simple UX | Pass | Provide an explicit drag handle, visible insertion cue, and clear Move up/Move down controls. |
| III. Responsive Design | Pass | Support touch interaction and avoid obscuring list content or controls at narrow widths. |
| IV. Minimal Dependencies | Pass with justified addition | The requested sortable behavior needs a React-compatible sortable library; use only `@dnd-kit/react` and its DOM sensor package `@dnd-kit/dom`. Tailwind is already installed. |
| V. No Testing | Pass | Do not create, modify, or run tests, in accordance with both the constitution and user direction. |

No constitution gate violations identified.

**Post-design gate**: Pass. The design adds no persistence schema change or test
artifacts, uses the existing client board and storage, and limits the additional
dependencies to those required for the requested sortable interaction.

## Project Structure

### Documentation (this feature)

```text
specs/002-goal-reordering/
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
│   ├── globals.css                 # Existing Tailwind theme and focus styles
│   └── page.tsx                    # Existing board entry point
├── components/
│   ├── goal-board.tsx              # Order state, per-group reorder, persistence
│   ├── goal-column.tsx             # Sortable group boundary and list presentation
│   ├── goal-card.tsx               # Sortable item, handle, and move controls
│   └── ui/
│       └── button.tsx              # Existing accessible button primitive
├── lib/
│   ├── goal-storage.ts             # Existing versioned localStorage envelope
│   └── goals.ts                    # Existing Goal model and status types
├── package.json                    # Add the required dnd-kit dependencies
└── package-lock.json               # Lockfile update
```

**Structure Decision**: Extend the existing single Next.js application. Keep sortable
state in `GoalBoard`, render each status group as its own sortable collection, and
preserve the existing Goal model and versioned localStorage format.

