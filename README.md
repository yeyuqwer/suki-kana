# Suki Kana

A Next.js application.

## Runtime Requirements

- Node.js `>= 20`
- pnpm `>= 9`

## Common Commands

```bash
pnpm dev
pnpm start
```

## Architecture Overview

```text
src/
  app/        # Next.js route entries (thin layer)
  ui/         # UI implementation (pages + shared components)
  configs/    # Client/server environment config
  lib/        # Infrastructure layer (errors/http/runtime/utils)
  styles/     # Global style entry, shadcn base css, fonts
```

## Core Layering Rules

1. Client page components must not call network requests directly.
2. `src/app` should stay minimal and route-focused; page implementation lives in `src/ui/app`.

## Documentation Index

- `src/app/README.md`: App Router entry-layer conventions
- `src/ui/README.md`: UI structure and component organization
- `src/configs/README.md`: Env validation and client/server config boundaries
- `src/lib/README.md`: Infrastructure modules and change policy
- `src/styles/README.md`: Style entry and CSS extension rules
