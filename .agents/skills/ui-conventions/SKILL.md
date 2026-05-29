---
name: ui-conventions
description: Use when implementing or refactoring src/ui page modules, shared components, providers, shadcn wrappers, or SVG components.
---

# UI Conventions

## Scope

Applies to `src/ui/**`.

## Structure Rules

1. `src/ui/app` mirrors `src/app` route structure.
2. Page implementation entry file is `index.tsx` in each route folder.
3. Internal child files use lowercase kebab-case.
4. Shared route layout components live in `src/ui/app/layout`.
5. Route-group-local layout components may live in route-local `layout/` folders.

## Component Authoring Rules

Default component declaration style:

```tsx
export const Loader: FC = () => {}
```

Hard constraints:

- Except `src/ui/svgs/**`, components should not consume `props`/`className` by default.
- For non-`svgs` components, keep empty parameter signatures unless explicitly required.
- Treat `src/ui/shadcn/**` as vendor-like primitives; avoid edits unless necessary.

## Workflow

1. Implement real pages under `src/ui/app/<route>/index.tsx`.
2. Keep mapping with `src/app/<route>/page.tsx`.
3. Put shared/global pieces under `components/providers` or `components/shared`.
4. Place modal-specific code under `components/modal`.

## Review Checklist

- Route UI entry files use `index.tsx`.
- Internal file names follow kebab-case.
- Non-`svgs` components avoid `props`/`className` by default.
- `shadcn` components are not modified without a clear reason.

## References

- `src/ui/README.md`
- `src/app/README.md`
