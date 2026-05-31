import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTypingStore } from '../stores/typing-store'

export function useTypingSpeech(currentSpeechText: string) {
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([])
  const hasHydrated = useTypingStore(state => state.hasHydrated)
  const selectedVoiceLang = useTypingStore(state => state.selectedVoiceLang)
  const selectedVoiceName = useTypingStore(state => state.selectedVoiceName)
  const selectedVoiceURI = useTypingStore(state => state.selectedVoiceURI)
  const setSelectedVoice = useTypingStore(state => state.setSelectedVoice)
  const speechTimerRef = useRef<number | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

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

  const handleSelectSpeechVoice = useCallback(
    (voiceURI: string) => {
      const speechVoice = speechVoices.find(voice => voice.voiceURI === voiceURI)

      if (speechVoice) {
        setSelectedVoice({
          lang: speechVoice.lang,
          name: speechVoice.name,
          voiceURI: speechVoice.voiceURI,
        })
        speakKana(currentSpeechText, speechVoice)
      }
    },
    [currentSpeechText, setSelectedVoice, speakKana, speechVoices],
  )

  const handleSpeakKana = useCallback(() => {
    speakKana(currentSpeechText)
  }, [currentSpeechText, speakKana])

  useEffect(() => {
    handleSpeakKana()

    return () => {
      stopSpeaking()
    }
  }, [handleSpeakKana, stopSpeaking])

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

  return {
    handleSelectSpeechVoice,
    handleSpeakKana,
    japaneseSpeechVoices,
    selectedVoiceName,
    selectedVoiceURI,
  }
}
