---
name: hooks-conventions
description: Use when building src/hooks hooks, especially src/hooks/api React Query wrappers mapped to src/api domains.
---

# Hooks Conventions

## Scope

Applies to `src/hooks/**`.

## Structure Rules

1. `src/hooks/api` mirrors `src/api` domains and subfolders.
2. Query hooks live in `query/` and use `useQuery` (create this folder only when query hooks exist).
3. Mutation hooks live in `mutation/` and use `useMutation` (create this folder only when mutation hooks exist).
4. Hook-level helper types live in `types/` when needed.
5. Use `index.ts` barrels for existing folders only; do not create empty folder/index exports.

## Hard Boundary Rule

Client components must call APIs through hooks only.

Not allowed:

- Direct `fetch`/`ky` usage in client components.
- Calling route handlers directly from components.

## Non-API Hooks

Other hooks should be grouped by function/business categories under `src/hooks`.
Current base architecture does not provide non-API folder examples.

## Workflow

1. Confirm API function exists in `src/api/<domain>/query|mutation`.
2. Create corresponding hook in `src/hooks/api/<domain>/query|mutation`.
3. Use stable `queryKey` design for queries.
4. Add invalidation/update behavior for mutations.
5. Export through local and domain `index.ts` for existing folders only.

## Review Checklist

- Hook path mirrors API path.
- Query and mutation hooks use proper React Query primitives.
- No empty `query/` or `mutation/` folders were added.
- `index.ts` barrels are updated only for existing folders.
- Client code consumes hooks instead of direct request calls.
- Non-API hooks (if added) are categorized clearly.

## References

- `src/hooks/README.md`
- `src/api/README.md`
