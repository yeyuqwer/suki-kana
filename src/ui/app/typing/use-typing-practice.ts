import { useCallback, useEffect, useMemo, useState } from 'react'
import { toRomaji } from 'wanakana'
import { kanaList } from './typing-data'

export function useTypingPractice() {
  const [kanaIndex, setKanaIndex] = useState(0)
  const [typedValue, setTypedValue] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [spacePressCount, setSpacePressCount] = useState(0)
  const [isAnswerShown, setIsAnswerShown] = useState(false)

  const currentKana = kanaList[kanaIndex]
  const currentRomaji = useMemo(() => toRomaji(currentKana), [currentKana])
  const isInputWrong = typedValue.length >= currentRomaji.length && typedValue !== currentRomaji

  const resetAnswerState = useCallback(() => {
    setTypedValue('')
    setActiveKey('')
    setSpacePressCount(0)
    setIsAnswerShown(false)
  }, [])

  const handleNextKana = useCallback(() => {
    setKanaIndex(index => (index + 1) % kanaList.length)
    resetAnswerState()
  }, [resetAnswerState])

  const handlePreviousKana = useCallback(() => {
    setKanaIndex(index => (index - 1 + kanaList.length) % kanaList.length)
    resetAnswerState()
  }, [resetAnswerState])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault()
        const nextSpacePressCount = spacePressCount + 1

        setActiveKey('space')
        setSpacePressCount(nextSpacePressCount)
        setIsAnswerShown(nextSpacePressCount >= 3)

        return
      }

      const key = event.key.toLowerCase()

      if (key === '[') {
        event.preventDefault()
        setActiveKey('[')
        handlePreviousKana()

        return
      }

      if (key === ']') {
        event.preventDefault()
        setActiveKey(']')
        handleNextKana()

        return
      }

      if (key === 'backspace') {
        setActiveKey('backspace')
        setTypedValue(value => value.slice(0, -1))
        setSpacePressCount(0)
        setIsAnswerShown(false)

        return
      }

      if (/^[a-z]$/.test(key)) {
        const nextTypedValue = isInputWrong ? key : `${typedValue}${key}`

        setActiveKey(key)
        setTypedValue(nextTypedValue)
        setSpacePressCount(0)
        setIsAnswerShown(false)

        if (nextTypedValue === currentRomaji) {
          window.setTimeout(() => {
            setKanaIndex(index => (index + 1) % kanaList.length)
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
    resetAnswerState,
    spacePressCount,
    typedValue,
  ])

  return {
    activeKey,
    currentKana,
    currentRomaji,
    handleNextKana,
    handlePreviousKana,
    isAnswerShown,
    isInputWrong,
    typedValue,
  }
}
