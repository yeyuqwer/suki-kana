import { serverEnv } from '@/configs/server-env'
import { withResponse } from '@/lib/http/next'

export const GET = withResponse(() => {
  return {
    jwtSecret: serverEnv.jwtSecret,
  }
})
