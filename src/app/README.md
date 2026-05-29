# App Router Guide

This directory is the App Router entry layer only.

Goals:
- Keep `src/app` focused on routing and framework entry files.
- Keep page UI implementation inside `src/ui/app`.
- Keep route files simple, predictable, and easy to search.

## Directory Layout

```text
src/app/
  (home)/                 # Route group entries
  examples/               # Route entries for examples
  api/                    # Route handlers
  layout.tsx              # Root layout entry
  error.tsx               # Error boundary entry
  not-found.tsx           # Not-found entry
```

## Responsibilities

### `src/app/*`
- Define route entry points (`page.tsx`, `layout.tsx`, route handlers).
- Keep route files minimal and declarative.
- Prefer wiring imports and composition only.

### `src/ui/app/*`
- Implement page UI and interactions.
- Own most styles, layout details, and view logic.
- Mirror route structure from `src/app` for fast lookup.

## Checklist For PRs

- New route has both `src/app/**` entry and `src/ui/app/**` UI file.
- Route entry exports `default function Page()` or `default function Layout()`.
- Route entry returns a route-named UI component.
- Non-static page styles are not added in `src/app/**`.
- Imports use mirrored path under `@/ui/app/...` when applicable.
