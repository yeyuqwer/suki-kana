import type { Metadata } from 'next'
import { clientEnv } from '@/configs/client-env'
import { HomePage } from '@/ui/app/(home)'

export const metadata: Metadata = {
  title: clientEnv.appName,
  description: `${clientEnv.appName} home page.`,
}

export default function Page() {
  return <HomePage />
}
