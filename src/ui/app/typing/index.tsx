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
    <main className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-6xl flex-col px-4 pb-8">
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
    </main>
  )
}
