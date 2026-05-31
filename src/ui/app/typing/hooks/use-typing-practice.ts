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
  const [hasSubmittedWrongAnswer, setHasSubmittedWrongAnswer] = useState(false)
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
  const currentAnswer = currentPrompt.answer
  const currentInputHint = currentPrompt.inputHint
  const requiresManualSubmit = currentPrompt.requiresManualSubmit
  const isInputWrong =
    !isInputComposing &&
    (requiresManualSubmit
      ? hasSubmittedWrongAnswer
      : typedValue.length >= currentAnswer.length && typedValue !== currentAnswer)
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
    setHasSubmittedWrongAnswer(false)
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
      if (nextValue.endsWith('[') || nextValue.endsWith(']')) {
        return
      }

      const normalizedValue =
        isInputWrong && nextValue.length > typedValue.length ? (nextValue.at(-1) ?? '') : nextValue

      setTypedValue(normalizedValue)
      setSpacePressCount(0)
      setIsAnswerShown(false)
      setHasSubmittedWrongAnswer(false)

      if (!requiresManualSubmit && shouldCheckAnswer && normalizedValue === currentAnswer) {
        window.setTimeout(() => {
          handleCorrectInput()
          resetAnswerState()
        }, 220)
      }
    },
    [
      currentAnswer,
      handleCorrectInput,
      isInputWrong,
      requiresManualSubmit,
      resetAnswerState,
      typedValue.length,
    ],
  )

  const handleInputCompositionChange = useCallback((isComposing: boolean) => {
    setIsInputComposing(isComposing)
  }, [])

  const handleSubmitInput = useCallback(() => {
    if (isInputComposing) {
      return
    }

    if (typedValue === currentAnswer) {
      handleCorrectInput()
      resetAnswerState()

      return
    }

    setHasSubmittedWrongAnswer(true)
    wrongItemsRef.current.set(`${currentItem.kana}-${currentItem.romaji}`, currentItem)
    handleSpeakKana()
  }, [
    currentAnswer,
    currentItem,
    handleCorrectInput,
    handleSpeakKana,
    isInputComposing,
    resetAnswerState,
    typedValue,
  ])

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
    setHasSubmittedWrongAnswer(false)
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
    handleSubmitInput,
    isDisabled: finishSummary !== null,
    isInputComposing,
    onPracticeInput,
    requiresManualSubmit,
    setActiveKey,
    setIsAnswerShown,
    setSpacePressCount,
    spacePressCount,
  })

  return {
    activeKey,
    currentAnswer,
    currentInputHint,
    currentPrompt: currentPrompt.prompt,
    handleNextKana,
    handlePreviousKana,
    handleSpeakKana,
    handleSelectSpeechVoice,
    handleChooseLibrary,
    handleInputCompositionChange,
    handleSubmitInput,
    handleTypedValueChange,
    isAnswerShown,
    isInputWrong,
    japaneseSpeechVoices,
    finishSummary,
    requiresManualSubmit,
    restartAll: handleRestartAll,
    restartWrong: handleRestartWrong,
    selectedVoiceName,
    selectedVoiceURI,
    typedValue,
  }
}
