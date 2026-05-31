import type { TypingLibrary } from '../typing-data'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTypingKeyboardEvents } from './use-typing-keyboard-events'
import { useTypingSpeech } from './use-typing-speech'

export function useTypingPractice(
  typingLibrary: TypingLibrary,
  itemIndex: number,
  setItemIndex: (itemIndex: number) => void,
  onPracticeInput?: () => void,
) {
  const [typedValue, setTypedValue] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [spacePressCount, setSpacePressCount] = useState(0)
  const [isAnswerShown, setIsAnswerShown] = useState(false)
  const wasInputWrongRef = useRef(false)
  const wrongAttemptCountRef = useRef(0)

  const currentItem = typingLibrary.items[itemIndex] ?? typingLibrary.items[0]
  const currentKana = currentItem.kana
  const currentRomaji = currentItem.romaji
  const currentSpeechText = currentItem.speechText ?? currentKana
  const isInputWrong = typedValue.length >= currentRomaji.length && typedValue !== currentRomaji
  const {
    handleSelectSpeechVoice,
    handleSpeakKana,
    japaneseSpeechVoices,
    selectedVoiceName,
    selectedVoiceURI,
  } = useTypingSpeech(currentSpeechText)

  const resetAnswerState = useCallback(() => {
    setTypedValue('')
    setActiveKey('')
    setSpacePressCount(0)
    setIsAnswerShown(false)
    wrongAttemptCountRef.current = 0
  }, [])

  const handleNextKana = useCallback(() => {
    setItemIndex((itemIndex + 1) % typingLibrary.items.length)
    resetAnswerState()
  }, [itemIndex, resetAnswerState, setItemIndex, typingLibrary.items.length])

  const handlePreviousKana = useCallback(() => {
    setItemIndex((itemIndex - 1 + typingLibrary.items.length) % typingLibrary.items.length)
    resetAnswerState()
  }, [itemIndex, resetAnswerState, setItemIndex, typingLibrary.items.length])

  const handleCorrectInput = useCallback(() => {
    setItemIndex((itemIndex + 1) % typingLibrary.items.length)
  }, [itemIndex, setItemIndex, typingLibrary.items.length])

  useEffect(() => {
    wasInputWrongRef.current = false
    resetAnswerState()
  }, [resetAnswerState])

  useEffect(() => {
    if (isInputWrong && !wasInputWrongRef.current && !isAnswerShown) {
      wrongAttemptCountRef.current += 1

      if (wrongAttemptCountRef.current >= 3) {
        setIsAnswerShown(true)
      }
      handleSpeakKana()
    }

    wasInputWrongRef.current = isInputWrong
  }, [handleSpeakKana, isAnswerShown, isInputWrong])

  useTypingKeyboardEvents({
    currentRomaji,
    handleNextKana,
    handlePreviousKana,
    isInputWrong,
    onCorrectInput: handleCorrectInput,
    onPracticeInput,
    resetAnswerState,
    setActiveKey,
    setIsAnswerShown,
    setSpacePressCount,
    setTypedValue,
    spacePressCount,
    typedValue,
  })

  return {
    activeKey,
    currentKana,
    currentRomaji,
    handleNextKana,
    handlePreviousKana,
    handleSpeakKana,
    handleSelectSpeechVoice,
    isAnswerShown,
    isInputWrong,
    japaneseSpeechVoices,
    selectedVoiceName,
    selectedVoiceURI,
    typedValue,
  }
}
