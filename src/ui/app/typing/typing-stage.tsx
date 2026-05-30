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
    <section className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <p
          className={cn(
            'font-medium text-2xl text-muted-foreground tracking-normal transition-colors',
            isAnswerShown && 'text-emerald-600 dark:text-emerald-400',
          )}
        >
          {currentRomaji}
        </p>
        <h1
          className={cn(
            'font-semibold text-8xl leading-none tracking-normal sm:text-9xl',
            isAnswerShown && 'text-emerald-600 dark:text-emerald-400',
          )}
        >
          {currentKana}
        </h1>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <div className="h-10 w-full border-foreground border-b-2 px-3 text-center font-medium text-3xl tracking-normal">
          {typedValue}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="reset"
            title="reset"
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
            onClick={onNextKana}
          >
            <Shuffle />
          </Button>
        </div>
      </div>
    </section>
  )
}
