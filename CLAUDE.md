# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **Bun**, not npm/yarn.

- `bun install` — install dependencies
- `bun --bun run next dev` (aka `bun run dev`) — start dev server
- `bun run build` — production build (`next build`)
- `bun run start` — start production server
- `bun run lint` — run `next lint`
- `bun test` — run the full test suite (Bun's built-in test runner, not Jest/Vitest)
- `bun test tests/logic/filterLogic.test.ts` — run a single test file
- `bun test -t "test name"` — run tests matching a name pattern

Tests use `bun:test` imports (`describe`, `test`, `expect`) — see any file under `tests/` for the pattern.

CI (`.github/workflows/test.yml`) runs `bun install --frozen-lockfile`, `bun run lint`, then `bun test` on every PR into `main` — keep both lint and tests passing before opening a PR. This repo also has `claude.yml` (responds to `@claude` mentions in issues/PR comments) and `claude-code-review.yml` (automatic Claude code review on PR open/update) wired up as GitHub Actions.

## Architecture

This is a Next.js 15 (App Router) + React 19 + Zustand todo app, in-memory only (no backend/persistence — state resets on reload). The codebase enforces a strict separation between pure logic, state, and presentation:

- **`app/lib/logic/`** — pure, framework-free functions that operate on plain arrays and never mutate the input, always returning a new array (`todoLogic.ts`: `addTodo`/`deleteTodo`/`toggleTodo`/`editTodo`/`generateId`; `filterLogic.ts`: `filterTodos`/`getActiveCount`/`getCompletedCount`/`clearCompleted`). This is the layer to unit test, and `tests/logic/` exercises it directly without touching Zustand or React.
- **`app/lib/store/todoStore.ts`** — a Zustand store created via a factory function `createTodoStore()` (not a module-level singleton). Store actions are thin wrappers that call straight into `app/lib/logic/*` inside `set()` — they must not contain business logic themselves.
- **`app/lib/store/StoreProvider.tsx`** — because the store is a factory, it's instantiated once per component tree via React Context (`TodoStoreProvider`, created with `useState(() => createTodoStore())`) rather than a singleton — deliberate, to avoid cross-request state leakage under Next.js SSR. Components read state via the `useTodoStore(selector)` hook, which throws if used outside the provider. `RootLayout` (`app/layout.tsx`) wraps the whole app in `TodoStoreProvider`.
- **`app/components/`** — `"use client"` UI components, each pulling only the store slices/actions it needs via `useTodoStore` selectors rather than subscribing to the whole store: `AddTodoForm`, `TodoList` (renders `TodoItem`s, filters via `filterLogic.filterTodos`), `TodoItem` (inline edit/toggle/delete), `FilterBar` (filter buttons + active/completed counts + clear-completed). Only mark a component `"use client"` if it actually reads/writes the store or uses hooks/event handlers; `page.tsx` and `layout.tsx` stay server components.
- **`app/lib/types/todo.ts`** — single source of truth for the `Todo` and `FilterType` types. When adding a new todo field or store action, update this file and the `TodoStore` interface in `todoStore.ts` together.

Data flow for any new feature: pure function in `app/lib/logic` → thin action in `todoStore.ts` → `useTodoStore` selector usage in a component. Add corresponding tests in `tests/logic/` (and `tests/store/` if store wiring is non-trivial), mirroring the existing test files. This is a small, dependency-light app — avoid introducing new dependencies, premature abstractions, or unrelated refactors bundled into a feature change.

Imports use the `@/` alias (maps to repo root per `tsconfig.json`), not relative `../../` paths — e.g. `@/app/lib/logic/todoLogic`.

Styling is Tailwind CSS utility classes only (no CSS modules/styled-components), using the custom palette in `tailwind.config.ts` (`background`, `foreground`, `border`, `muted`) — reuse these tokens rather than hardcoding colors.

## Pull Requests & Code Review

Opening a PR: keep it scoped to one feature/fix, make sure `bun run lint` and `bun test` both pass locally first (CI re-runs the same two on every PR into `main`), and add/update tests in `tests/logic/` or `tests/store/` alongside any change to `app/lib/`. The `claude-code-review.yml` workflow auto-runs a review on every PR open/update, and `claude.yml` responds to `@claude` mentions in PR/issue comments — expect automated review comments in addition to human ones.

When reviewing a PR or diff in this repo, check in this order:

1. **Logic lives in the right place.** Reject business logic embedded in a component or inlined into a `set()` call inside `todoStore.ts` — it belongs in `app/lib/logic/*.ts` as a pure, exported function.
2. **Immutability.** Every logic function must return a new array/object; flag any `.push`, `.splice`, direct property assignment, or in-place sort on the input `todos`.
3. **Test coverage.** A change to `app/lib/logic/*.ts` without a corresponding update in `tests/logic/*.test.ts` (or `app/lib/store/todoStore.ts` without `tests/store/todoStore.test.ts`) should be called out as missing. Confirm `bun test` passes.
4. **Client/server boundary.** Flag `"use client"` added to a component that doesn't need it, and flag any server component (`page.tsx`, `layout.tsx`) that starts reading the Zustand store directly instead of delegating to a client child.
5. **Store consumption.** Flag components subscribing to the whole store instead of a narrow selector, and any prop-drilling of store data where `useTodoStore` should be called directly in the consuming component instead.
6. **Styling.** Flag non-Tailwind styling additions (CSS files, inline styles, new UI libraries) unless justified. Check basic accessibility on interactive elements (labeling, focus states — see the existing `focus:ring-black` pattern).
7. **Type safety.** New todo fields or actions should update `app/lib/types/todo.ts` and the `TodoStore` interface in `todoStore.ts` together, not one without the other.
8. **Scope.** This is a small, dependency-light app — push back on unrequested new dependencies, premature abstractions (e.g. a generic CRUD framework for a handful of store actions), or unrelated refactors bundled into a feature PR.

Summarize review findings as a short list grouped by severity (must-fix vs. nit), referencing exact file paths and line numbers.
