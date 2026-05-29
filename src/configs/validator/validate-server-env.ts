import { z } from 'zod'

const serverEnvSchema = z.object({})

export const validateServerEnv = () => {
  serverEnvSchema.parse({})
}
