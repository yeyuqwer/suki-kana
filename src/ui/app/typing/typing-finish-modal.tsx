import type { FC } from 'react'
import type { TypingPracticeItem } from './typing-data'
import { BookOpen, Clock3, RotateCcw, Target } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'

export const TypingFinishModal: FC<{
  accuracy: number
  elapsedSeconds: number
  isOpen: boolean
  onChooseLibrary: () => void
  onRestartAll: () => void
  onRestartWrong: () => void
  wrongItems: TypingPracticeItem[]
}> = ({
  accuracy,
  elapsedSeconds,
  isOpen,
  onChooseLibrary,
  onRestartAll,
  onRestartWrong,
  wrongItems,
}) => {
  if (!isOpen) {
    return null
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  const remainingSeconds = elapsedSeconds % 60
  const elapsedText =
    elapsedMinutes > 0 ? `${elapsedMinutes} 分 ${remainingSeconds} 秒` : `${remainingSeconds} 秒`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202321]/45 px-4 backdrop-blur-md dark:bg-black/55">
      <section className="w-full max-w-xl overflow-hidden rounded-md border border-[#d6c7b3] bg-[#fbf8f1] text-[#202321] shadow-[0_18px_46px_rgba(49,84,99,0.18)] dark:border-[#2f4146] dark:bg-[#151c1f] dark:text-[#eee7da]">
        <div className="border-[#d6c7b3] border-b bg-[#f5f1ea] px-5 py-4 dark:border-[#2f4146] dark:bg-[#0f1315]">
          <p className="font-medium text-[#bd3f33] text-sm dark:text-[#f07862]">练习完成</p>
          <h2 className="mt-1 font-semibold text-2xl tracking-normal">这一轮结束了</h2>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-[#d6c7b3] bg-[#f5f1ea] p-4 dark:border-[#2f4146] dark:bg-[#0f1315]">
              <Clock3 className="mb-3 size-5 text-[#315463] dark:text-[#86a8a1]" />
              <p className="text-[#687064] text-sm dark:text-[#a9b2a7]">学习时间</p>
              <p className="mt-1 font-semibold text-2xl">{elapsedText}</p>
            </div>
            <div className="rounded-md border border-[#d6c7b3] bg-[#f5f1ea] p-4 dark:border-[#2f4146] dark:bg-[#0f1315]">
              <Target className="mb-3 size-5 text-[#315463] dark:text-[#86a8a1]" />
              <p className="text-[#687064] text-sm dark:text-[#a9b2a7]">正确率</p>
              <p className="mt-1 font-semibold text-2xl">{accuracy}%</p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-[#d6c7b3] bg-[#f5f1ea] p-4 dark:border-[#2f4146] dark:bg-[#0f1315]">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-sm">错误的单词</p>
              <span className="rounded-full border border-[#d6c7b3] px-2 py-0.5 text-[#687064] text-xs dark:border-[#2f4146] dark:text-[#a9b2a7]">
                {wrongItems.length}
              </span>
            </div>
            {wrongItems.length > 0 ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {wrongItems.map(item => (
                  <div
                    key={`${item.kana}-${item.romaji}`}
                    className="flex items-center justify-between rounded-md border border-[#d6c7b3] bg-[#fbf8f1] px-3 py-2 dark:border-[#2f4146] dark:bg-[#161d20]"
                  >
                    <span className="font-semibold text-lg">{item.kana}</span>
                    <span className="text-[#bd3f33] text-sm dark:text-[#f07862]">
                      {item.romaji}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[#687064] text-sm dark:text-[#a9b2a7]">这一轮没有错题。</p>
            )}
          </div>

          <div className="mt-5 grid gap-2">
            <Button
              type="button"
              className="h-10 justify-start bg-[#bd3f33] text-[#fff8ee] shadow-[0_8px_18px_rgba(189,63,51,0.14)] hover:bg-[#a8352b] dark:bg-[#f07862] dark:text-[#1c1210] dark:hover:bg-[#ff8974]"
              onClick={onRestartAll}
            >
              <RotateCcw className="size-4" />
              重新开始练习所有单词
            </Button>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 justify-start border-[#d6c7b3] bg-[#fbf8f1] text-[#315463] hover:bg-[#ece3d3] disabled:opacity-45 dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f]"
                disabled={wrongItems.length === 0}
                onClick={onRestartWrong}
              >
                <Target className="size-4" />
                练习错误单词
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 justify-start border-[#d6c7b3] bg-[#fbf8f1] text-[#315463] hover:bg-[#ece3d3] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f]"
                onClick={onChooseLibrary}
              >
                <BookOpen className="size-4" />
                其他词库
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
