'use client'

import type { FC } from 'react'
import Link from 'next/link'
import { SwitchTheme } from './switch-theme'

export const Header: FC = () => {
  return (
    <div className="sticky mb-4 flex h-16 w-screen border-b border-dashed">
      <div className="container m-auto flex justify-between">
        <Link href="/" className="text-2xl hover:underline">
          Suki Kana
        </Link>

        <div className="flex items-center gap-4">
          <SwitchTheme />
        </div>
      </div>
    </div>
  )
}
