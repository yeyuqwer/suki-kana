import type { TypingLibrary } from '../typing-data'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTypingStore } from '../stores/typing-store'

export function useTypingPractice(typingLibrary: TypingLibrary, onPracticeInput?: () => void) {
  const [kanaState, setKanaState] = useState({
    index: 0,
    libraryId: typingLibrary.id,
  })
  const [typedValue, setTypedValue] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [spacePressCount, setSpacePressCount] = useState(0)
  const [isAnswerShown, setIsAnswerShown] = useState(false)
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([])
  const hasHydrated = useTypingStore(state => state.hasHydrated)
  const selectedVoiceLang = useTypingStore(state => state.selectedVoiceLang)
  const selectedVoiceName = useTypingStore(state => state.selectedVoiceName)
  const selectedVoiceURI = useTypingStore(state => state.selectedVoiceURI)
  const setSelectedVoice = useTypingStore(state => state.setSelectedVoice)
  const speechTimerRef = useRef<number | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const wasInputWrongRef = useRef(false)

  const kanaIndex = kanaState.libraryId === typingLibrary.id ? kanaState.index : 0
  const currentItem = typingLibrary.items[kanaIndex] ?? typingLibrary.items[0]
  const currentKana = currentItem.kana
  const currentRomaji = currentItem.romaji
  const currentSpeechText = currentItem.speechText ?? currentKana
  const isInputWrong = typedValue.length >= currentRomaji.length && typedValue !== currentRomaji
  const japaneseSpeechVoices = useMemo(
    () => speechVoices.filter(voice => voice.lang.toLowerCase().startsWith('ja')),
    [speechVoices],
  )
  const selectedSpeechVoice = useMemo(
    () =>
      speechVoices.find(voice => voice.voiceURI === selectedVoiceURI) ??
      speechVoices.find(
        voice =>
          selectedVoiceName !== '' &&
          selectedVoiceLang !== '' &&
          voice.name === selectedVoiceName &&
          voice.lang === selectedVoiceLang,
      ),
    [selectedVoiceLang, selectedVoiceName, selectedVoiceURI, speechVoices],
  )
  const activeSpeechVoice = selectedSpeechVoice ?? japaneseSpeechVoices[0]

  const resetAnswerState = useCallback(() => {
    setTypedValue('')
    setActiveKey('')
    setSpacePressCount(0)
    setIsAnswerShown(false)
  }, [])

  const handleNextKana = useCallback(() => {
    setKanaState(state => {
      const currentIndex = state.libraryId === typingLibrary.id ? state.index : 0

      return {
        index: (currentIndex + 1) % typingLibrary.items.length,
        libraryId: typingLibrary.id,
      }
    })
    resetAnswerState()
  }, [resetAnswerState, typingLibrary.id, typingLibrary.items.length])

  const handlePreviousKana = useCallback(() => {
    setKanaState(state => {
      const currentIndex = state.libraryId === typingLibrary.id ? state.index : 0

      return {
        index: (currentIndex - 1 + typingLibrary.items.length) % typingLibrary.items.length,
        libraryId: typingLibrary.id,
      }
    })
    resetAnswerState()
  }, [resetAnswerState, typingLibrary.id, typingLibrary.items.length])

  const speakKana = useCallback(
    (kana: string, speechVoice = activeSpeechVoice) => {
      if (!hasHydrated || speechVoices.length === 0) {
        return
      }

      if (speechTimerRef.current) {
        window.clearTimeout(speechTimerRef.current)
      }

      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()

      speechTimerRef.current = window.setTimeout(() => {
        speechTimerRef.current = null
        const utterance = new SpeechSynthesisUtterance(kana)

        utterance.lang = speechVoice?.lang ?? 'ja-JP'
        utterance.rate = 0.9
        utterance.pitch = 1

        if (speechVoice) {
          utterance.voice = speechVoice
        }

        utterance.onend = () => {
          utteranceRef.current = null
        }
        utterance.onerror = () => {
          utteranceRef.current = null
        }

        utteranceRef.current = utterance
        window.speechSynthesis.resume()
        window.speechSynthesis.speak(utterance)
      }, 40)
    },
    [activeSpeechVoice, hasHydrated, speechVoices.length],
  )

  const stopSpeaking = useCallback(() => {
    if (speechTimerRef.current) {
      window.clearTimeout(speechTimerRef.current)
      speechTimerRef.current = null
    }

    utteranceRef.current = null
    window.speechSynthesis.cancel()
  }, [])

  const handleSelectSpeechVoice = (voiceURI: string) => {
    const speechVoice = speechVoices.find(voice => voice.voiceURI === voiceURI)

    if (speechVoice) {
      setSelectedVoice({
        lang: speechVoice.lang,
        name: speechVoice.name,
        voiceURI: speechVoice.voiceURI,
      })
      speakKana(currentSpeechText, speechVoice)
    }
  }

  const handleSpeakKana = useCallback(() => {
    speakKana(currentSpeechText)
  }, [currentSpeechText, speakKana])

  useEffect(() => {
    setKanaState({
      index: 0,
      libraryId: typingLibrary.id,
    })
    wasInputWrongRef.current = false
    resetAnswerState()
  }, [resetAnswerState, typingLibrary.id])

  useEffect(() => {
    handleSpeakKana()

    return () => {
      stopSpeaking()
    }
  }, [handleSpeakKana, stopSpeaking])

  useEffect(() => {
    if (isInputWrong && !wasInputWrongRef.current) {
      handleSpeakKana()
    }

    wasInputWrongRef.current = isInputWrong
  }, [handleSpeakKana, isInputWrong])

  useEffect(() => {
    let voiceSyncTimer: number | null = null
    let voiceSyncCount = 0

    const syncSpeechVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const japaneseVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('ja'))
      const preferredVoice =
        japaneseVoices.find(voice => /kyoko|otoya|nanami|haruka|ichiro|google/i.test(voice.name)) ??
        japaneseVoices[0]
      const selectedVoiceByURI = voices.find(voice => voice.voiceURI === selectedVoiceURI)
      const selectedVoiceByName = voices.find(
        voice =>
          selectedVoiceName !== '' &&
          selectedVoiceLang !== '' &&
          voice.name === selectedVoiceName &&
          voice.lang === selectedVoiceLang,
      )

      setSpeechVoices(voices)

      if (!hasHydrated) {
        return
      }

      if (selectedVoiceByName && selectedVoiceByName.voiceURI !== selectedVoiceURI) {
        setSelectedVoice({
          lang: selectedVoiceByName.lang,
          name: selectedVoiceByName.name,
          voiceURI: selectedVoiceByName.voiceURI,
        })

        return
      }

      if (
        preferredVoice &&
        !selectedVoiceByURI &&
        selectedVoiceURI === '' &&
        selectedVoiceName === ''
      ) {
        setSelectedVoice({
          lang: preferredVoice.lang,
          name: preferredVoice.name,
          voiceURI: preferredVoice.voiceURI,
        })
      }
    }
    const scheduleVoiceSync = () => {
      if (voiceSyncCount >= 20 || window.speechSynthesis.getVoices().length > 0) {
        return
      }

      voiceSyncCount += 1
      voiceSyncTimer = window.setTimeout(() => {
        syncSpeechVoices()
        scheduleVoiceSync()
      }, 250)
    }

    syncSpeechVoices()
    scheduleVoiceSync()
    window.speechSynthesis.addEventListener('voiceschanged', syncSpeechVoices)

    return () => {
      if (voiceSyncTimer) {
        window.clearTimeout(voiceSyncTimer)
      }

      window.speechSynthesis.removeEventListener('voiceschanged', syncSpeechVoices)
    }
  }, [hasHydrated, selectedVoiceLang, selectedVoiceName, selectedVoiceURI, setSelectedVoice])

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
            setKanaState(state => {
              const currentIndex = state.libraryId === typingLibrary.id ? state.index : 0

              return {
                index: (currentIndex + 1) % typingLibrary.items.length,
                libraryId: typingLibrary.id,
              }
            })
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
    onPracticeInput,
    resetAnswerState,
    spacePressCount,
    typedValue,
    typingLibrary.id,
    typingLibrary.items.length,
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
    selectedVoiceName,
    selectedVoiceURI,
    typedValue,
  }
}
