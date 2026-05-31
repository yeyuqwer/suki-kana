import type { TypingLibrary, TypingPracticeItem } from '../typing-data'
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
  const [practiceItems, setPracticeItems] = useState(typingLibrary.items)
  const [finishSummary, setFinishSummary] = useState<{
    accuracy: number
    elapsedSeconds: number
    wrongItems: TypingPracticeItem[]
  } | null>(null)
  const roundStartTimeRef = useRef(Date.now())
  const wasInputWrongRef = useRef(false)
  const wrongAttemptCountRef = useRef(0)
  const wrongItemsRef = useRef(new Map<string, TypingPracticeItem>())

  const currentItem = practiceItems[itemIndex] ?? practiceItems[0]
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
    setItemIndex((itemIndex + 1) % practiceItems.length)
    resetAnswerState()
  }, [itemIndex, practiceItems.length, resetAnswerState, setItemIndex])

  const handlePreviousKana = useCallback(() => {
    setItemIndex((itemIndex - 1 + practiceItems.length) % practiceItems.length)
    resetAnswerState()
  }, [itemIndex, practiceItems.length, resetAnswerState, setItemIndex])

  const handleCorrectInput = useCallback(() => {
    if (itemIndex >= practiceItems.length - 1) {
      const wrongItems = [...wrongItemsRef.current.values()]
      const correctItemCount = practiceItems.length - wrongItems.length

      setFinishSummary({
        accuracy: Math.round((correctItemCount / practiceItems.length) * 100),
        elapsedSeconds: Math.max(1, Math.round((Date.now() - roundStartTimeRef.current) / 1000)),
        wrongItems,
      })

      return
    }

    setItemIndex((itemIndex + 1) % practiceItems.length)
  }, [itemIndex, practiceItems.length, setItemIndex])

  const handleRestartAll = useCallback(() => {
    setPracticeItems(typingLibrary.items)
    setFinishSummary(null)
    setItemIndex(0)
    wrongItemsRef.current = new Map()
    roundStartTimeRef.current = Date.now()
    resetAnswerState()
  }, [resetAnswerState, setItemIndex, typingLibrary.items])

  const handleRestartWrong = useCallback(() => {
    const wrongItems = finishSummary?.wrongItems ?? []
    const [firstWrongItem, ...remainingWrongItems] = wrongItems

    if (!firstWrongItem) {
      return
    }

    setPracticeItems([firstWrongItem, ...remainingWrongItems])
    setFinishSummary(null)
    setItemIndex(0)
    wrongItemsRef.current = new Map()
    roundStartTimeRef.current = Date.now()
    resetAnswerState()
  }, [finishSummary?.wrongItems, resetAnswerState, setItemIndex])

  const handleChooseLibrary = useCallback(() => {
    setFinishSummary(null)
  }, [])

  useEffect(() => {
    setPracticeItems(typingLibrary.items)
    setFinishSummary(null)
    setItemIndex(0)
    wrongItemsRef.current = new Map()
    roundStartTimeRef.current = Date.now()
    wasInputWrongRef.current = false
    resetAnswerState()
  }, [resetAnswerState, setItemIndex, typingLibrary.items])

  useEffect(() => {
    if (isInputWrong && !wasInputWrongRef.current && !isAnswerShown) {
      wrongAttemptCountRef.current += 1
      wrongItemsRef.current.set(`${currentItem.kana}-${currentItem.romaji}`, currentItem)

      if (wrongAttemptCountRef.current >= 3) {
        setIsAnswerShown(true)
      }
      handleSpeakKana()
    }

    wasInputWrongRef.current = isInputWrong
  }, [currentItem, handleSpeakKana, isAnswerShown, isInputWrong])

  useTypingKeyboardEvents({
    currentRomaji,
    handleNextKana,
    handlePreviousKana,
    isDisabled: finishSummary !== null,
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
    handleChooseLibrary,
    isAnswerShown,
    isInputWrong,
    japaneseSpeechVoices,
    finishSummary,
    restartAll: handleRestartAll,
    restartWrong: handleRestartWrong,
    selectedVoiceName,
    selectedVoiceURI,
    typedValue,
  }
}
