import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useTypingStore = create<{
  hasHydrated: boolean
  selectedVoiceLang: string
  selectedVoiceName: string
  selectedVoiceURI: string
  setHasHydrated: (hasHydrated: boolean) => void
  setSelectedVoice: (voice: { lang: string; name: string; voiceURI: string }) => void
}>()(
  persist(
    set => ({
      hasHydrated: false,
      selectedVoiceLang: '',
      selectedVoiceName: '',
      selectedVoiceURI: '',
      setHasHydrated: hasHydrated => {
        set({ hasHydrated })
      },
      setSelectedVoice: voice => {
        set({
          selectedVoiceLang: voice.lang,
          selectedVoiceName: voice.name,
          selectedVoiceURI: voice.voiceURI,
        })
      },
    }),
    {
      name: 'suki-kana-typing',
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
      partialize: state => ({
        selectedVoiceLang: state.selectedVoiceLang,
        selectedVoiceName: state.selectedVoiceName,
        selectedVoiceURI: state.selectedVoiceURI,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
