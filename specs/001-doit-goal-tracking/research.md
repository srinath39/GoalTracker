# Research: doit Goal Tracking

## Tailwind CSS v4 Theme Tokens

- **Decision**: Define the pastel palette with Tailwind v4 `@theme` variables such
  as `--color-*`, then use the generated color utility classes. Use semantic roles for
  recurring UI states rather than repeating raw color values in components.
- **Rationale**: Theme variables expose consistent design tokens through the utility
  API, keeping the light palette easy to maintain.
- **Alternatives considered**: Arbitrary one-off color utilities are suitable for
  isolated exceptions, but not for the shared application palette.
- **Source**: [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme)

## shadcn/ui Components

- **Decision**: Use only the shadcn/ui components required for this interface:
  Dialog, Alert Dialog, Checkbox, Button, Input, and Label. Keep their accessible
  labels, descriptions, keyboard behavior, and focus management when customizing them.
- **Rationale**: The dialog and alert-dialog patterns suit goal creation and destructive
  confirmation; the remaining components provide consistent labeled controls and
  actions.
- **Alternatives considered**: Native form controls can reduce component dependencies,
  but the requested shadcn/ui components provide consistent accessible interaction
  primitives. Avoid adding a form library when native form validation and focused
  feedback are sufficient.
- **Sources**: [Dialog](https://ui.shadcn.com/docs/components/dialog),
  [Checkbox](https://ui.shadcn.com/docs/components/checkbox),
  [Alert Dialog](https://ui.shadcn.com/docs/components/alert-dialog),
  [Forms](https://ui.shadcn.com/docs/forms/react-hook-form)

## Browser Local Storage in the Next.js App Router

- **Decision**: Read and write storage only in client-side code after mount. Keep the
  server output and first client render independent of local storage; validate the
  versioned payload and visibly report storage access, parsing, and write failures.
- **Rationale**: `localStorage` is a browser API and cannot be read during server
  rendering. Deferring the read avoids hydration mismatches; explicit error feedback
  prevents storage failures from appearing as successful saves.
- **Alternatives considered**: Server-provided or server-persisted state is appropriate
  if goals must be shared, backed up, or available before client hydration, but those
  capabilities are outside this feature's single-browser scope.
- **Sources**: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components),
  [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
  [React useEffect](https://react.dev/reference/react/useEffect)

## date-fns and Calendar-Day Semantics

- **Decision**: Persist end dates as local calendar-date strings (`YYYY-MM-DD`). Use
  date-fns to format display dates and calculate calendar-day differences. Do not treat
  an all-day goal date as a UTC instant.
- **Rationale**: The feature's due-today and three-calendar-day rules are based on the
  user's local calendar. Comparing elapsed 24-hour periods or parsing date-only strings
  as UTC instants could shift displayed urgency across time zones.
- **Alternatives considered**: UTC timestamps are suitable for events with a specific
  moment, but not for these date-only deadlines.
- **Sources**: [date-fns documentation](https://date-fns.org/docs/Getting-Started),
  [MDN Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

## Dependency Scope

- **Decision**: Keep the existing Next.js, React, and Tailwind declarations unchanged.
  Add date-fns and only the supporting packages needed by the selected shadcn/ui
  components.
- **Rationale**: This honors the requested technology choices while following the
  constitution's minimal-dependency principle.
- **Alternatives considered**: Hand-building all interactions could avoid some UI
  packages, but would not honor the explicit shadcn/ui request. Adding a separate
  form-state library is unnecessary for the small title/date form.
