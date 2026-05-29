'use client'

import type { FC } from 'react'
import { useServerConfigs } from '@/hooks/api/configs'
import { Button } from '@/ui/shadcn/button'

export const ServerConfig: FC = () => {
  const { data, isFetching, isError, error, refetch } = useServerConfigs()

  const errorMessage =
    isError && error != null
      ? error instanceof Error
        ? error.message
        : 'Failed to load server config'
      : null

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="font-medium">Server Config</div>

      <Button type="button" variant="outline" onClick={() => void refetch()} disabled={isFetching}>
        {isFetching ? 'Loading...' : 'Get Server Config'}
      </Button>

      {data != null ? <div className="font-mono text-sm">JwtSecret: {data.jwtSecret}</div> : null}
      {errorMessage != null ? (
        <div className="text-red-600 text-sm">Error: {errorMessage}</div>
      ) : null}
    </div>
  )
}
