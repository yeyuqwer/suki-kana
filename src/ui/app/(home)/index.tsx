import type { FC } from 'react'
import Link from 'next/link'
import { clientEnv } from '@/configs/client-env'
import { ServerConfig } from './server-config'

export const HomePage: FC = () => {
  return (
    <div className="container space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-3xl tracking-tight">Home</h1>
        <div>Environment: {clientEnv.environment}</div>
        <div>App Name: {clientEnv.appName}</div>
      </div>

      <ServerConfig />

      <div className="flex flex-col gap-2">
        <Link className="text-primary hover:underline" href="/examples/server-time">
          Example: Server Time
        </Link>
      </div>
    </div>
  )
}
