<!--
Sync Impact Report
Version change: unratified template → 1.0.0 (initial adoption)
Modified principles: template placeholders → I. Clean Code; II. Simple UX;
  III. Responsive Design; IV. Minimal Dependencies; V. No Testing
Added sections: Technology Constraints; Development Workflow
Removed sections: none
Follow-up TODOs: Confirm the original ratification date.
-->

# Goal Tracker Constitution

## Core Principles

### I. Clean Code
Production code MUST use clear names, focused components and functions, and consistent
formatting. Implementations MUST avoid duplication and unnecessary indirection so that
the codebase remains easy to understand and change.

### II. Simple UX
User-facing flows MUST make their purpose and available actions clear. The interface MUST
avoid unnecessary steps, controls, and visual complexity; interaction feedback MUST be
clear and timely.

### III. Responsive Design
Every user-facing page MUST remain usable across supported viewport sizes, including
mobile, tablet, and desktop. Layouts MUST adapt without horizontal overflow or obscured
content, and interactive controls MUST remain accessible and usable.

### IV. Minimal Dependencies
The project MUST prefer existing platform and framework capabilities over additional
packages. A new dependency MUST be necessary to meet a requirement and MUST be kept to
the smallest suitable dependency set.

### V. No Testing
Contributors MUST NOT create, modify, or run tests of any kind, including unit,
integration, and end-to-end tests. This project rule takes precedence over any other
project guidance that recommends or requires testing.

## Technology Constraints

The project MUST use Next.js, React, and Tailwind CSS at the versions declared in the
root `goal-tracker/package.json`. Those declarations are the source of truth; upgrades
or version changes MUST be reflected there. At adoption, the declarations are Next.js
`16.4.5`, React and React DOM `19.3.0`, and Tailwind CSS `^4`.

## Development Workflow

Changes MUST stay within the stated requirement and preserve existing behavior outside
that scope. Reviews MUST assess whether a change follows the core principles and
technology constraints. Contributors MUST NOT add testing steps to the workflow, in
accordance with the No Testing principle.

## Governance

This constitution governs project decisions and supersedes conflicting project-level
guidance. To amend it, contributors MUST document the proposed change, explain its
impact on existing principles and work, and obtain maintainer approval before merging.
Each approved amendment MUST update the last-amended date and increment the version
according to semantic versioning: MAJOR for incompatible governance changes, MINOR for
new or materially expanded principles or sections, and PATCH for clarifications and
non-semantic edits.

Every change review MUST check the work against this constitution. Any deviation MUST
be identified and resolved or explicitly approved by maintainers before the change is
accepted. Compliance review MUST NOT add or run tests.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-11-07
