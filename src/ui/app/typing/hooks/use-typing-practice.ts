import type { TypingLibrary, TypingPracticeItem, TypingPracticeModeId } from '../typing-data'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getTypingPracticePrompt } from '../typing-data'
import { useTypingKeyboardEvents } from './use-typing-keyboard-events'
import { useTypingSpeech } from './use-typing-speech'

export function useTypingPractice(
  typingLibrary: TypingLibrary,
  modeId: TypingPracticeModeId,
  itemIndex: number,
  setItemIndex: (itemIndex: number) => void,
  onPracticeInput?: () => void,
) {
  const [typedValue, setTypedValue] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [spacePressCount, setSpacePressCount] = useState(0)
  const [isAnswerShown, setIsAnswerShown] = useState(false)
  const [isInputComposing, setIsInputComposing] = useState(false)
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
  const currentPrompt = getTypingPracticePrompt(currentItem, modeId)
  const currentKana = currentPrompt.prompt
  const currentRomaji = currentPrompt.answer
  const isInputWrong =
    !isInputComposing &&
    typedValue.length >= currentPrompt.answer.length &&
    typedValue !== currentPrompt.answer
  const {
    handleSelectSpeechVoice,
    handleSpeakKana,
    japaneseSpeechVoices,
    selectedVoiceName,
    selectedVoiceURI,
  } = useTypingSpeech(currentPrompt.speechText)

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

  const handleTypedValueChange = useCallback(
    (nextValue: string, shouldCheckAnswer = true) => {
      const normalizedValue =
        isInputWrong && nextValue.length > typedValue.length
          ? nextValue.slice(typedValue.length)
          : nextValue

      setTypedValue(normalizedValue)
      setSpacePressCount(0)
      setIsAnswerShown(false)

      if (shouldCheckAnswer && normalizedValue === currentPrompt.answer) {
        window.setTimeout(() => {
          handleCorrectInput()
          resetAnswerState()
        }, 220)
      }
    },
    [currentPrompt.answer, handleCorrectInput, isInputWrong, resetAnswerState, typedValue.length],
  )

  const handleInputCompositionChange = useCallback((isComposing: boolean) => {
    setIsInputComposing(isComposing)
  }, [])

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
    handleNextKana,
    handlePreviousKana,
    isDisabled: finishSummary !== null,
    onPracticeInput,
    setActiveKey,
    setIsAnswerShown,
    setSpacePressCount,
    spacePressCount,
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
    handleInputCompositionChange,
    handleTypedValueChange,
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
