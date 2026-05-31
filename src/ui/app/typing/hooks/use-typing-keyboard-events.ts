import { useEffect } from 'react'

export function useTypingKeyboardEvents({
  handleNextKana,
  handlePreviousKana,
  isDisabled,
  onPracticeInput,
  setActiveKey,
  setIsAnswerShown,
  setSpacePressCount,
  spacePressCount,
}: {
  handleNextKana: () => void
  handlePreviousKana: () => void
  isDisabled: boolean
  onPracticeInput?: () => void
  setActiveKey: (activeKey: string) => void
  setIsAnswerShown: (isAnswerShown: boolean) => void
  setSpacePressCount: (spacePressCount: number) => void
  spacePressCount: number
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isDisabled) {
        return
      }

      if (event.isComposing || event.key === 'Process' || event.keyCode === 229) {
        return
      }

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
        setSpacePressCount(0)
        setIsAnswerShown(false)

        return
      }

      if (/^[a-z]$/.test(key)) {
        window.speechSynthesis.resume()

        onPracticeInput?.()
        setActiveKey(key)
        setSpacePressCount(0)
        setIsAnswerShown(false)
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
    handleNextKana,
    handlePreviousKana,
    isDisabled,
    onPracticeInput,
    setActiveKey,
    setIsAnswerShown,
    setSpacePressCount,
    spacePressCount,
  ])
}
