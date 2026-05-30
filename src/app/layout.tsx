import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/index.css'
import { fontsClassName } from '@/styles/fonts'
import { Header } from '@/ui/app/layout/header'
import { Providers } from '@/ui/components/providers'

export const metadata: Metadata = {
  title: 'Suki Kana',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontsClassName}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-[#f5f1ea] text-[#202321] dark:bg-[#0f1315] dark:text-[#eee7da]">
            <Header />
            <div className="w-full flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
