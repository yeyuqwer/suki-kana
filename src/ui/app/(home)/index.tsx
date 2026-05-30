import type { FC } from 'react'
import { ArrowRight, Keyboard, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/ui/shadcn/button'

export const HomePage: FC = () => {
  return (
    <main className="min-h-[calc(100svh-4rem)] overflow-hidden bg-[#f5f1ea] text-[#202321] dark:bg-[#0f1315] dark:text-[#eee7da]">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col justify-center px-4 py-10 sm:py-14">
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_0.82fr]">
          <div className="max-w-2xl space-y-7">
            <div className="inline-flex items-center rounded-full border border-[#d6c7b3] bg-[#fbf8f1] px-3 py-1 font-medium text-[#687064] text-sm shadow-sm dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#a9b2a7]">
              日语假名打字练习
            </div>

            <div className="space-y-4">
              <h1 className="font-semibold text-5xl leading-tight tracking-normal sm:text-6xl">
                Suki Kana
              </h1>
              <p className="max-w-xl text-[#687064] text-lg leading-8 dark:text-[#a9b2a7]">
                练习假名对应的罗马字输入。页面会显示假名、播放发音，并在键盘区域标出你按下的按键。
              </p>
            </div>

            <Button
              asChild
              className="h-10 rounded-md bg-[#bd3f33] px-4 font-semibold text-[#fff8ee] shadow-[0_8px_18px_rgba(189,63,51,0.14)] hover:bg-[#a8352b] dark:bg-[#f07862] dark:text-[#1c1210] dark:hover:bg-[#ff8974]"
            >
              <Link href="/typing">
                开始练习
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-md border border-[#d6c7b3] bg-[#fbf8f1] p-5 shadow-[0_12px_34px_rgba(49,84,99,0.1)] dark:border-[#2f4146] dark:bg-[#161d20] dark:shadow-[0_12px_34px_rgba(0,0,0,0.24)]">
              <div className="flex items-start justify-between border-[#d6c7b3] border-b pb-5 dark:border-[#2f4146]">
                <div>
                  <p className="font-medium text-[#687064] text-sm dark:text-[#a9b2a7]">
                    今日の文字
                  </p>
                  <p className="mt-2 font-serif text-7xl text-[#202321] leading-none dark:text-[#eee7da]">
                    す
                  </p>
                </div>
                <div className="rounded-md border border-[#d6c7b3] bg-[#f5f1ea] px-3 py-2 text-right dark:border-[#2f4146] dark:bg-[#0f1315]">
                  <p className="font-semibold text-2xl text-[#bd3f33] tracking-normal dark:text-[#f07862]">
                    su
                  </p>
                  <p className="text-[#687064] text-xs dark:text-[#a9b2a7]">romaji</p>
                </div>
              </div>

              <div className="grid gap-3 pt-5 sm:grid-cols-2">
                <div className="rounded-md border border-[#d6c7b3] bg-[#f5f1ea] p-4 dark:border-[#2f4146] dark:bg-[#0f1315]">
                  <Keyboard className="mb-3 size-5 text-[#315463] dark:text-[#86a8a1]" />
                  <h2 className="font-semibold text-base">键盘跟随</h2>
                  <p className="mt-2 text-[#687064] text-sm leading-6 dark:text-[#a9b2a7]">
                    输入时高亮当前按键，方便检查是否按对位置。
                  </p>
                </div>
                <div className="rounded-md border border-[#d6c7b3] bg-[#f5f1ea] p-4 dark:border-[#2f4146] dark:bg-[#0f1315]">
                  <Volume2 className="mb-3 size-5 text-[#315463] dark:text-[#86a8a1]" />
                  <h2 className="font-semibold text-base">发音预览</h2>
                  <p className="mt-2 text-[#687064] text-sm leading-6 dark:text-[#a9b2a7]">
                    切换题目、选语音或输入错误时，会播放当前假名。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
