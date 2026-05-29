import 'server-only'

export const serverEnv = {
  jwtSecret: process.env.JwtSecret as string,
}
