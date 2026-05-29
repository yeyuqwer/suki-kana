import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'production']),
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1, 'NEXT_PUBLIC_APP_NAME is required'),
})

export const validatePublicEnv = () => {
  publicEnvSchema.parse({
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  })
}
