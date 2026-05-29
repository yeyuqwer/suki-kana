# Configs Guide

This directory contains the runtime environment config entry points.

Goals:
- Keep client-safe values separate from server-only secrets.
- Keep zod out of application runtime imports.
- Validate env values before the app is bundled.

## Directory Layout

```text
src/configs/
  validator/
    validate-public-env.ts   # zod validation for public env
    validate-server-env.ts   # zod validation for server env
  client-env.ts   # NEXT_PUBLIC_* and other client-safe env values
  server-env.ts   # server-only env values and secrets
```

## Validation

Zod env validation lives in `src/configs/validator/validate-public-env.ts` and `src/configs/validator/validate-server-env.ts`.

`next.config.ts` should only call `validatePublicEnv()` and `validateServerEnv()`. Do not define schemas inline there.

Do not import `zod` from `src/configs/client-env.ts` or `src/configs/server-env.ts`. Those env modules should only expose already-validated values from `process.env` with narrow TypeScript types.

## Import Rules

Client-safe values:

```ts
import { clientEnv } from '@/configs/client-env'
```

Server-only values:

```ts
import { serverEnv } from '@/configs/server-env'
```

`server-env.ts` must include `import 'server-only'` and must never be imported by client components.

## How To Add Env Values

1. Add the value to the matching zod schema in `src/configs/validator/validate-public-env.ts` or `src/configs/validator/validate-server-env.ts`.
2. Add the typed value to `clientEnv` or `serverEnv`.
3. Consume values through `@/configs/client-env` or `@/configs/server-env`.

Shared public example:

```ts
// src/configs/validator/validate-public-env.ts
const publicEnvSchema = z.object({
  NEXT_PUBLIC_FEATURE_FLAG: z.enum(['on', 'off']),
})
```

```ts
// src/configs/client-env.ts
export const clientEnv = {
  featureFlag: process.env.NEXT_PUBLIC_FEATURE_FLAG as 'on' | 'off',
}
```

Server-only example:

```ts
// src/configs/validator/validate-server-env.ts
const serverEnvSchema = z.object({
  API_SECRET: z.string().trim().min(1, 'API_SECRET is required'),
})
```

```ts
// src/configs/server-env.ts
import 'server-only'

export const serverEnv = {
  apiSecret: process.env.API_SECRET as string,
}
```

## Checklist For PRs

- Zod validation stays in `src/configs/validator/validate-*.ts`.
- `next.config.ts` only calls env validation functions.
- `client-env.ts` and `server-env.ts` do not import `zod`.
- Client-safe values are exported from `clientEnv`.
- Secrets are exported from `serverEnv`.
- Client components never import `serverEnv`.
