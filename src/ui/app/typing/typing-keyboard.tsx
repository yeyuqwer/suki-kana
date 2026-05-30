import type { FC } from 'react'
import { cn } from '@/lib/utils/shadcn'
import { keyboardRows } from './typing-data'

export const TypingKeyboard: FC<{ activeKey: string }> = ({ activeKey }) => {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-2">
      {keyboardRows.map(row => (
        <div key={row.join('')} className="flex justify-center gap-1 sm:gap-2">
          {row.map(key => (
            <kbd
              key={key}
              className={cn(
                'flex h-10 min-w-7 items-center justify-center rounded-md border bg-card px-2 font-semibold text-sm uppercase shadow-xs transition-colors sm:h-14 sm:min-w-12 sm:px-3',
                activeKey === key &&
                  'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/25',
              )}
            >
              {key}
            </kbd>
          ))}
        </div>
      ))}

      <div className="flex justify-center">
        <kbd
          className={cn(
            'flex h-12 w-full max-w-sm items-center justify-center rounded-md border bg-card px-3 font-semibold text-sm shadow-xs transition-colors sm:h-14',
            activeKey === 'space' &&
              'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/25',
          )}
        >
          space
        </kbd>
      </div>
    </section>
  )
}
