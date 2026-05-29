import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'production']),
})

export const validatePublicEnv = () => {
  publicEnvSchema.parse({
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  })
}
