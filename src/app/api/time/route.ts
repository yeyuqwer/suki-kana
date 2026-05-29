import { withResponse } from '@/lib/http/next'

export const runtime = 'edge'

export const GET = withResponse(() => {
  return Date.now()
})
