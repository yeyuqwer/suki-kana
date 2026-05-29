---
name: lib-infrastructure-conventions
description: Use when modifying src/lib infrastructure modules, request/error/runtime wiring, or utility helpers.
---

# Lib Infrastructure Conventions

## Scope

Applies to `src/lib/**`.

## Key Directories

- `common/errors`: error model and typed errors.
- `http`: `apiRequest/httpRequest`, `withResponse`, React Query client.
- `runtime`: store/listener initialization.
- `utils`: pure utility helpers.

## Hard Modification Policy

By default, only `src/lib/utils/**` should be modified.

For `src/lib/common/**`, `src/lib/http/**`, and `src/lib/runtime/**`:

- Treat as foundational infrastructure.
- Change only for explicit new cross-layer business requirements.
- Keep edits minimal and validate broad impact.

## Usage Rules

1. API layer transport should use `@/lib/http/ky` wrappers.
2. Next route handlers should use `withResponse` from `@/lib/http/next`.
3. Shared errors should prefer `BaseError` hierarchy.
4. Runtime initialization should go through `runtime/*` initializers.

## Workflow

1. If change is utility-like, prefer `utils/`.
2. If infra core must change, document reason and verify behavior across API/hooks/ui.
3. Add or update tests for non-trivial utility logic when the project includes test coverage.

## Review Checklist

- Edit location respects modification policy.
- Transport/error/response wiring stays consistent.
- Infra-core changes (if any) are justified and scoped.
- Utility changes include tests when regression risk exists.

## References

- `src/lib/README.md`
- `src/api/README.md`
