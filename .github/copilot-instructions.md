# GitHub Copilot Project Instructions - LL Todo App

This project is a modern Todo application built with Next.js 15, Zustand, Tailwind CSS, and Bun.

## Tech Stack Context
- **Framework:** Next.js 15 (App Router)
- **Runtime & Testing:** Bun
- **State Management:** Zustand
- **Architecture:** 
  - Business logic is isolated in `app/lib/logic/` as pure functions.
  - State management is handled in `app/lib/store/` using Zustand.
  - `app/lib/store/` TypeScript type definitions.
  - Components are located in `app/components/`.
- **Styling:** Tailwind CSS

## Coding Standards
- **Pure Logic:** Always separate business logic from state management and UI. Logic should be placed in `app/lib/logic/` and exported as pure, testable functions.
- **Store Updates:** Use the logic functions within Zustand `set` calls to perform state transitions.
- **Imports:** Use the `@/app/` alias for all internal imports to maintain consistency.
- **Testing:** Unit tests should be written for logic and stores in the `tests/` directory using Bun's test runner (`bun test`).

## Code Review Guidelines
When reviewing Pull Requests for this project, ensure the following:

### 1. Architectural Integrity
- Check that business logic is NOT embedded directly within components or store definitions. It must reside in `app/lib/logic/`.
- Verify that store actions correctly delegate to logic functions.

### 2. State Management
- Ensure state updates are immutable.
- Verify that components use specific selectors when consuming the Zustand store to prevent unnecessary re-renders.

### 3. Styling & UI
- Confirm that all styling is done through Tailwind CSS utility classes. 
- Avoid inline styles or separate CSS modules unless strictly necessary for third-party integrations.
- Ensure the UI remains responsive and accessible.

### 4. Logic & Reliability
- Every change to `app/lib/logic/*.ts` must have a corresponding test file updater or new test in `tests/logic/`.
- Run `bun test` to ensure no regressions are introduced.

### 5. Next.js Patterns
- Use Server Components where possible; only use `'use client'` for components that require interactivity (like forms or components consuming the Zustand store via the `StoreProvider`).

### 6. Performance
- Check for excessive re-renders in the `TodoList` and `TodoItem` components.
- Ensure that logic operations (filtering, sorting) are efficient.
