---
name: app-router-conventions
description: Use when creating or modifying src/app route entries, page/layout wrappers, route handlers, and app-to-ui route mapping.
---

# App Router Conventions

## Scope

Applies to `src/app/**`.

## Hard Rules

1. Keep `src/app` as a thin route-entry layer.
2. Avoid page UI implementation details in route files.
3. For non-static pages, do not write page-specific styles in `src/app`.
4. Route entries export only `default function Page()` or `default function Layout()`.
5. Route entries return named components imported from mirrored `src/ui/app` paths.

Example:

```tsx
import { ServerTimePage } from '@/ui/app/examples/server-time'

export default function Page() {
  return <ServerTimePage />
}
```

## Folder Mapping Rule

Keep route path and UI path aligned:

```text
src/app/examples/server-time/page.tsx
src/ui/app/examples/server-time/index.tsx
```

## Workflow

1. Add route entry in `src/app/<route>/page.tsx` or `layout.tsx`.
2. Add/update mirrored UI in `src/ui/app/<route>/index.tsx`.
3. Keep route entry minimal: import + return.
4. Keep shared layout pieces in `src/ui/app/layout` or route-local `layout/`.

## Review Checklist

- Route file uses `Page`/`Layout` export naming.
- Route file returns route-named UI component from `@/ui/app/...`.
- Non-static styles are not introduced in `src/app/**`.
- `src/app` <-> `src/ui/app` mapping remains one-to-one.

## References

- `src/app/README.md`
- `src/ui/README.md`
