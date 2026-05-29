import type { Metadata } from 'next'
import { HomePage } from '@/ui/app/(home)'

export const metadata: Metadata = {
  title: 'Suki Kana',
  description: 'Suki Kana home page.',
}

export default function Page() {
  return <HomePage />
}
