import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toRomaji } from 'wanakana'
import { kanaList } from './typing-data'

export function useTypingPractice() {
  const [kanaIndex, setKanaIndex] = useState(0)
  const [typedValue, setTypedValue] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [spacePressCount, setSpacePressCount] = useState(0)
  const [isAnswerShown, setIsAnswerShown] = useState(false)
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('')
  const wasInputWrongRef = useRef(false)

  const currentKana = kanaList[kanaIndex]
  const currentRomaji = useMemo(() => toRomaji(currentKana), [currentKana])
  const isInputWrong = typedValue.length >= currentRomaji.length && typedValue !== currentRomaji
  const japaneseSpeechVoices = useMemo(
    () => speechVoices.filter(voice => voice.lang.toLowerCase().startsWith('ja')),
    [speechVoices],
  )
  const selectedSpeechVoice = useMemo(
    () => speechVoices.find(voice => voice.voiceURI === selectedVoiceURI),
    [selectedVoiceURI, speechVoices],
  )

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

  const handleSelectSpeechVoice = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI)
  }

  const speakKana = useCallback(
    (kana: string) => {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(kana)

      utterance.lang = selectedSpeechVoice?.lang ?? 'ja-JP'
      utterance.rate = 0.9
      utterance.pitch = 1

      if (selectedSpeechVoice) {
        utterance.voice = selectedSpeechVoice
      }

      window.speechSynthesis.speak(utterance)
    },
    [selectedSpeechVoice],
  )

  const handleSpeakKana = useCallback(() => {
    speakKana(currentKana)
  }, [currentKana, speakKana])

  useEffect(() => {
    handleSpeakKana()

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [handleSpeakKana])

  useEffect(() => {
    if (isInputWrong && !wasInputWrongRef.current) {
      handleSpeakKana()
    }

    wasInputWrongRef.current = isInputWrong
  }, [handleSpeakKana, isInputWrong])

  useEffect(() => {
    const syncSpeechVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const japaneseVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('ja'))
      const preferredVoice =
        japaneseVoices.find(voice => /kyoko|otoya|nanami|haruka|ichiro|google/i.test(voice.name)) ??
        japaneseVoices[0]

      setSpeechVoices(voices)

      if (preferredVoice && !selectedVoiceURI) {
        setSelectedVoiceURI(preferredVoice.voiceURI)
      }
    }

    syncSpeechVoices()
    window.speechSynthesis.addEventListener('voiceschanged', syncSpeechVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', syncSpeechVoices)
    }
  }, [selectedVoiceURI])

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
    handleSpeakKana,
    handleSelectSpeechVoice,
    isAnswerShown,
    isInputWrong,
    japaneseSpeechVoices,
    selectedVoiceURI,
    typedValue,
  }
}
