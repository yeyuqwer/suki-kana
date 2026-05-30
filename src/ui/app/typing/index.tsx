'use client'

import type { FC } from 'react'
import { TypingKeyboard } from './typing-keyboard'
import { TypingStage } from './typing-stage'
import { useTypingPractice } from './use-typing-practice'

export const TypingPage: FC = () => {
  const {
    activeKey,
    currentKana,
    currentRomaji,
    handleNextKana,
    handleReset,
    isAnswerShown,
    typedValue,
  } = useTypingPractice()

  return (
    <main className="min-h-[calc(100svh-4rem)] w-full bg-[#f5f1ea] text-[#202321] dark:bg-[#0f1315] dark:text-[#eee7da]">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 pt-2 pb-5">
        <TypingStage
          currentKana={currentKana}
          currentRomaji={currentRomaji}
          typedValue={typedValue}
          isAnswerShown={isAnswerShown}
          onNextKana={handleNextKana}
          onReset={handleReset}
        />
        <TypingKeyboard
          activeKey={activeKey}
          currentRomaji={currentRomaji}
          isAnswerShown={isAnswerShown}
        />
      </div>
    </main>
  )
}
