import type { GetServerTimeResult } from '../types'
import { apiRequest } from '@/lib/http/ky'

export async function getServerTime(): Promise<GetServerTimeResult> {
  return await apiRequest<GetServerTimeResult>({
    url: 'time',
  })
}
