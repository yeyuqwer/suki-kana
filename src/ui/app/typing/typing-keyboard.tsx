import type { FC } from 'react'
import { cn } from '@/lib/utils/shadcn'
import { keyboardRows } from './typing-data'

export const TypingKeyboard: FC<{
  activeKey: string
  currentRomaji: string
  isAnswerShown: boolean
}> = ({ activeKey, currentRomaji, isAnswerShown }) => {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-3">
      {keyboardRows.map(row => (
        <div key={row.join('')} className="flex justify-center gap-2 sm:gap-4">
          {row.map(key => {
            const isAnswerKey = isAnswerShown && currentRomaji.includes(key)

            return (
              <kbd
                key={key}
                className={cn(
                  'flex h-14 min-w-9 items-center justify-center rounded-md border border-[#d7c9b4] bg-[#fbf8f1] px-2 font-semibold text-[#315463] text-base uppercase shadow-[0_5px_0_rgba(49,84,99,0.12)] transition-all sm:h-20 sm:min-w-20 sm:px-5 sm:text-lg dark:border-[#304247] dark:bg-[#161d20] dark:text-[#ded3c1] dark:shadow-[0_5px_0_rgba(0,0,0,0.38)]',
                  (activeKey === key || isAnswerKey) &&
                    'translate-y-0.5 border-[#bd3f33] bg-[#bd3f33] text-[#fff8ef] shadow-[0_3px_0_rgba(128,41,33,0.42)] dark:border-[#f07862] dark:bg-[#d65f4d] dark:text-[#160f0d] dark:shadow-[0_3px_0_rgba(0,0,0,0.45)]',
                )}
              >
                {key}
              </kbd>
            )
          })}
        </div>
      ))}

      <div className="flex justify-center">
        <kbd
          className={cn(
            'flex h-14 w-full max-w-2xl items-center justify-center rounded-md border border-[#d7c9b4] bg-[#fbf8f1] px-3 font-semibold text-[#315463] text-base shadow-[0_5px_0_rgba(49,84,99,0.12)] transition-all sm:h-20 sm:text-lg dark:border-[#304247] dark:bg-[#161d20] dark:text-[#ded3c1] dark:shadow-[0_5px_0_rgba(0,0,0,0.38)]',
            activeKey === 'space' &&
              'translate-y-0.5 border-[#bd3f33] bg-[#bd3f33] text-[#fff8ef] shadow-[0_3px_0_rgba(128,41,33,0.42)] dark:border-[#f07862] dark:bg-[#d65f4d] dark:text-[#160f0d] dark:shadow-[0_3px_0_rgba(0,0,0,0.45)]',
          )}
        >
          space
        </kbd>
      </div>
    </section>
  )
}
