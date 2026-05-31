'use client'

import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils/shadcn'
import { useTypingLibraryQuery } from './hooks/use-typing-library-query'
import { useTypingPractice } from './hooks/use-typing-practice'
import { typingLibraries } from './typing-data'
import { TypingKeyboard } from './typing-keyboard'
import { TypingLibraryMenu } from './typing-library-menu'
import { TypingStage } from './typing-stage'

export const TypingPage: FC = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const { currentLibrary, itemIndex, libraryId, setItemIndex, setLibraryId } =
    useTypingLibraryQuery()
  const handlePracticeInput = useCallback(() => {
    const typingInput = document.querySelector<HTMLElement>('[data-typing-input]')

    setIsInputFocused(true)
    typingInput?.focus()
  }, [])
  const {
    activeKey,
    currentKana,
    currentRomaji,
    handleNextKana,
    handlePreviousKana,
    handleSelectSpeechVoice,
    handleSpeakKana,
    isAnswerShown,
    isInputWrong,
    japaneseSpeechVoices,
    selectedVoiceName,
    selectedVoiceURI,
    typedValue,
  } = useTypingPractice(currentLibrary, itemIndex, setItemIndex, handlePracticeInput)
  const isImmersiveMode = isInputFocused || typedValue.length > 0

  useEffect(() => {
    const header = document.querySelector('[data-app-header]')

    if (header) {
      header.setAttribute('data-typing-immersive', String(isImmersiveMode))
    }

    return () => {
      header?.removeAttribute('data-typing-immersive')
    }
  }, [isImmersiveMode])

  return (
    <main className="min-h-[calc(100svh-4rem)] w-full overflow-y-auto bg-[#f5f1ea] text-[#202321] dark:bg-[#0f1315] dark:text-[#eee7da]">
      <div className="mx-auto -mt-2 flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 pt-2 pb-5">
        <div
          className={cn(
            'flex justify-end pt-3 transition-all duration-300',
            isImmersiveMode &&
              'opacity-30 blur-[2px] focus-within:opacity-100 focus-within:blur-none hover:opacity-100 hover:blur-none active:opacity-100 active:blur-none',
          )}
        >
          <TypingLibraryMenu
            libraries={typingLibraries}
            onSelectLibrary={setLibraryId}
            selectedLibraryId={libraryId}
          />
        </div>
        <TypingStage
          currentKana={currentKana}
          currentRomaji={currentRomaji}
          typedValue={typedValue}
          isAnswerShown={isAnswerShown}
          isInputWrong={isInputWrong}
          japaneseSpeechVoices={japaneseSpeechVoices}
          onInputFocusChange={setIsInputFocused}
          onNextKana={handleNextKana}
          onPreviousKana={handlePreviousKana}
          onSelectSpeechVoice={handleSelectSpeechVoice}
          onSpeakKana={handleSpeakKana}
          selectedVoiceName={selectedVoiceName}
          selectedVoiceURI={selectedVoiceURI}
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
