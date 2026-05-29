import { create } from 'zustand'

type ErrorStoreState = {
  lastError: Error | null
  setLastError: (error: Error | null) => void
}

export const useErrorStore = create<ErrorStoreState>()(set => ({
  lastError: null,
  setLastError: lastError => {
    set({ lastError })
  },
}))
