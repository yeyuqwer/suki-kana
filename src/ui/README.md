# UI Guide

This directory contains page UI implementations and reusable UI modules.

Goals:
- Keep `src/app` as a thin route-entry layer.
- Keep real page implementation in `src/ui/app`.
- Keep reusable UI grouped by clear intent.

## Directory Layout

```text
src/ui/
  app/                      # UI implementation mapped to src/app routes
    layout/                 # Route-shared layout components
  components/
    providers/              # Providers and global handlers
    shared/                 # Generic shared components
    modal/                  # Modal components
  shadcn/                   # Installed shadcn components
  svgs/                     # SVG components
```

## Mapping Rule

Keep directory names aligned between route entries and page implementations.

```text
src/app/examples/server-time/page.tsx
src/ui/app/examples/server-time/index.tsx
```

## Checklist For PRs

- New route UI has `src/ui/app/**/index.tsx`.
- `src/app` and `src/ui/app` paths stay mirrored.
- Child component filenames follow kebab-case.
- Shared or global concerns are placed in `components/providers` or `components/shared`.
- `shadcn` files are changed only when there is a clear reason.
