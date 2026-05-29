# API Guide

This directory stores API request functions by domain.

Goals:
- Keep network request logic centralized in `src/api`.
- Separate read/write behavior with `query` and `mutation`.
- Keep request and response contracts explicit in `types`.
- Re-export each domain through `index.ts` for predictable imports.

## Directory Layout

```text
src/api/
  <domain>/
    mutation/              # Write/update requests and side-effect actions
    query/                 # Read/fetch requests
    types/                 # API params and response types
    index.ts               # Domain barrel export
```

## Request Rules

All request functions in `src/api` must use wrapped functions from `@/lib/http/ky`.

1. If the target endpoint is under Next.js route handlers (`src/app/api/**`), use `apiRequest`.
2. If the target endpoint is not from `src/app/api/**`, use `httpRequest`.
3. Do not use direct `fetch`, raw `ky`, or other ad-hoc request approaches inside `src/api`.

## Client Boundary

Client page components must not request server APIs directly.

Allowed flow:
1. Component uses hook from `src/hooks`.
2. Hook calls function from `src/api`.
3. API function performs request through `apiRequest` or `httpRequest`.

## Checklist For PRs

- API functions are placed in `query` or `mutation` correctly.
- Shared contracts are defined in `types`.
- Domain and subfolders expose `index.ts` as needed.
- `src/app/api/**` endpoints use `apiRequest`.
- Non-`src/app/api/**` endpoints use `httpRequest`.
- Client components consume API through hooks, not direct requests.
