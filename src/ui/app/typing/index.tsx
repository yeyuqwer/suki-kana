'use client'

import type { FC } from 'react'
import { typingLibraries } from './typing-data'
import { TypingKeyboard } from './typing-keyboard'
import { TypingLibraryMenu } from './typing-library-menu'
import { TypingStage } from './typing-stage'
import { useTypingLibraryQuery } from './use-typing-library-query'
import { useTypingPractice } from './use-typing-practice'

export const TypingPage: FC = () => {
  const { currentLibrary, libraryId, setLibraryId } = useTypingLibraryQuery()
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
  } = useTypingPractice(currentLibrary)

  return (
    <main className="min-h-[calc(100svh-4rem)] w-full bg-[#f5f1ea] text-[#202321] dark:bg-[#0f1315] dark:text-[#eee7da]">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 pt-2 pb-5">
        <div className="flex justify-end pt-3">
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
