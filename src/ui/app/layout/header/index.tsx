'use client'

import type { FC } from 'react'
import Link from 'next/link'
import { SwitchTheme } from './switch-theme'

export const Header: FC = () => {
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full border-[#ded2c0] border-b bg-[#f5f1ea]/90 backdrop-blur dark:border-[#29363a] dark:bg-[#0f1315]/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-semibold text-2xl text-[#202321] tracking-normal transition-colors hover:text-[#bd3f33] dark:text-[#eee7da] dark:hover:text-[#f07862]"
        >
          Suki Kana
        </Link>

        <div className="flex items-center gap-4">
          <SwitchTheme />
        </div>
      </div>
    </div>
  )
}
