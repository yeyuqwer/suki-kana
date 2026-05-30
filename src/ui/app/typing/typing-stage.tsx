import type { FC } from 'react'
import { RotateCcw, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils/shadcn'
import { Button } from '@/ui/shadcn/button'

export const TypingStage: FC<{
  currentKana: string
  currentRomaji: string
  typedValue: string
  isAnswerShown: boolean
  onNextKana: () => void
  onReset: () => void
}> = ({ currentKana, currentRomaji, typedValue, isAnswerShown, onNextKana, onReset }) => {
  return (
    <section className="flex min-h-[52svh] flex-col items-center justify-center gap-7 text-center">
      <div className="flex flex-col items-center gap-3">
        <p
          className={cn(
            'min-h-12 font-medium text-4xl text-[#687064] tracking-normal transition-colors sm:text-5xl dark:text-[#a9b2a7]',
            isAnswerShown && 'text-[#bd3f33] dark:text-[#f07862]',
          )}
        >
          {isAnswerShown ? currentRomaji : ''}
        </p>
        <h1
          className={cn(
            'font-semibold text-8xl text-[#202321] leading-none tracking-normal drop-shadow-[0_10px_26px_rgba(32,35,33,0.12)] transition-colors sm:text-9xl dark:text-[#eee7da] dark:drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]',
            isAnswerShown && 'text-[#bd3f33] dark:text-[#f07862]',
          )}
        >
          {currentKana}
        </h1>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <div className="h-14 w-full border-[#315463] border-b-2 px-3 text-center font-medium text-5xl text-[#315463] tracking-normal transition-colors dark:border-[#86a8a1] dark:text-[#ded3c1]">
          {typedValue}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="reset"
            title="reset"
            className="border-[#d6c7b3] bg-[#fbf8f1] text-[#315463] shadow-sm hover:bg-[#ece3d3] hover:text-[#bd3f33] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f] dark:hover:text-[#f07862]"
            onClick={onReset}
          >
            <RotateCcw />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="next kana"
            title="next kana"
            className="border-[#d6c7b3] bg-[#fbf8f1] text-[#315463] shadow-sm hover:bg-[#ece3d3] hover:text-[#bd3f33] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f] dark:hover:text-[#f07862]"
            onClick={onNextKana}
          >
            <Shuffle />
          </Button>
        </div>
      </div>
    </section>
  )
}
