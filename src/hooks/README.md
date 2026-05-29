# Hooks Guide

This directory stores application hooks.

Goals:
- Keep all API-calling hooks in `src/hooks/api`.
- Mirror `src/api` structure for fast lookup and maintenance.
- Use React Query as the only API-calling mechanism in client components.

## Directory Layout

```text
src/hooks/
  api/
    <domain>/
      mutation/            # useMutation hooks
      query/               # useQuery hooks
      types/               # Hook-level types
      index.ts             # Domain barrel export
```

## Mapping Rule

Keep similar structure between hooks and API modules.

```text
src/api/time/query/get-server-time.ts
src/hooks/api/time/query/use-server-time.ts
```

## Client Usage Rule

In client page components, direct server requests are not allowed.

Required flow:
1. Component calls hook from `src/hooks`.
2. Hook calls API function from `src/api`.
3. API function executes request with wrapped ky functions.

## Checklist For PRs

- New API function has a corresponding hook when client usage is needed.
- Hook path mirrors API path and domain.
- Query hooks use `useQuery`; mutation hooks use `useMutation`.
- Related `index.ts` barrel exports are updated.
- Client components call hooks instead of direct network requests.
