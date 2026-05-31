import { useEffect } from 'react'

export function useTypingKeyboardEvents({
  currentRomaji,
  handleNextKana,
  handlePreviousKana,
  isInputWrong,
  onCorrectInput,
  onPracticeInput,
  resetAnswerState,
  setActiveKey,
  setIsAnswerShown,
  setSpacePressCount,
  setTypedValue,
  spacePressCount,
  typedValue,
}: {
  currentRomaji: string
  handleNextKana: () => void
  handlePreviousKana: () => void
  isInputWrong: boolean
  onCorrectInput: () => void
  onPracticeInput?: () => void
  resetAnswerState: () => void
  setActiveKey: (activeKey: string) => void
  setIsAnswerShown: (isAnswerShown: boolean) => void
  setSpacePressCount: (spacePressCount: number) => void
  setTypedValue: (typedValue: string | ((value: string) => string)) => void
  spacePressCount: number
  typedValue: string
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault()
        window.speechSynthesis.resume()
        const nextSpacePressCount = spacePressCount + 1

        setActiveKey('space')
        setSpacePressCount(nextSpacePressCount)
        setIsAnswerShown(nextSpacePressCount >= 3)

        return
      }

      const key = event.key.toLowerCase()

      if (key === '[') {
        event.preventDefault()
        window.speechSynthesis.resume()
        setActiveKey('[')
        handlePreviousKana()

        return
      }

      if (key === ']') {
        event.preventDefault()
        window.speechSynthesis.resume()
        setActiveKey(']')
        handleNextKana()

        return
      }

      if (key === 'backspace') {
        window.speechSynthesis.resume()
        setActiveKey('backspace')
        setTypedValue(value => value.slice(0, -1))
        setSpacePressCount(0)
        setIsAnswerShown(false)

        return
      }

      if (/^[a-z]$/.test(key)) {
        window.speechSynthesis.resume()
        const nextTypedValue = isInputWrong ? key : `${typedValue}${key}`

        onPracticeInput?.()
        setActiveKey(key)
        setTypedValue(nextTypedValue)
        setSpacePressCount(0)
        setIsAnswerShown(false)

        if (nextTypedValue === currentRomaji) {
          window.setTimeout(() => {
            onCorrectInput()
            resetAnswerState()
          }, 220)
        }
      }
    }

    const handleKeyUp = () => {
      window.setTimeout(() => {
        setActiveKey('')
      }, 120)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    currentRomaji,
    handleNextKana,
    handlePreviousKana,
    isInputWrong,
    onCorrectInput,
    onPracticeInput,
    resetAnswerState,
    setActiveKey,
    setIsAnswerShown,
    setSpacePressCount,
    setTypedValue,
    spacePressCount,
    typedValue,
  ])
}
