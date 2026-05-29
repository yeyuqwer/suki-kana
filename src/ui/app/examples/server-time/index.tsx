'use client'

import type { FC } from 'react'
import Link from 'next/link'
import { useServerTime } from '@/hooks/api/time'
import { formatTime } from '@/lib/utils/formatter'
import { Button } from '@/ui/shadcn/button'

export const ServerTimePage: FC = () => {
  const { data, error, isFetching, isLoading, refetch } = useServerTime()

  return (
    <div className="container space-y-4">
      <div className="space-y-2">
        <Link className="text-primary text-sm hover:underline" href="/">
          Back Home
        </Link>
        <h1 className="font-semibold text-3xl tracking-tight">Server Time</h1>
        <div className="text-muted-foreground text-sm">
          Read server time through the standard hooks/api/route-handler chain.
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-dashed p-4">
        <div className="font-medium">Current server time</div>
        <div className="font-mono text-sm">{isLoading ? 'Loading...' : formatTime(data)}</div>
        {error instanceof Error ? (
          <div className="text-red-600 text-sm">Error: {error.message}</div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  )
}
