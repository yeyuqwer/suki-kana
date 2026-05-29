import { z } from 'zod'

const serverEnvSchema = z.object({
  JwtSecret: z.string().trim().min(1, 'JwtSecret is required'),
})

export const validateServerEnv = () => {
  serverEnvSchema.parse({
    JwtSecret: process.env.JwtSecret,
  })
}
