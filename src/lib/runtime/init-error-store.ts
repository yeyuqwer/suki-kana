import { useErrorStore } from '../common/errors/error-store'

let refCount = 0
let stopListening: (() => void) | null = null

function setupListeners(): () => void {
  const setLastError = (error: Error | null) => {
    useErrorStore.getState().setLastError(error)
  }

  const errorListener = (event: ErrorEvent) => {
    if (event.error instanceof Error) {
      event.preventDefault()
      setLastError(event.error)
    }
  }
  window.addEventListener('error', errorListener)

  const rejectionListener = (event: PromiseRejectionEvent) => {
    if (event.reason instanceof Error) {
      event.preventDefault()
      setLastError(event.reason)
    }
  }
  window.addEventListener('unhandledrejection', rejectionListener)

  return () => {
    window.removeEventListener('error', errorListener)
    window.removeEventListener('unhandledrejection', rejectionListener)
  }
}

export function initializeErrorStore(): () => void {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  refCount += 1
  if (refCount === 1) {
    stopListening = setupListeners()
  }

  return () => {
    refCount = Math.max(refCount - 1, 0)

    if (refCount === 0 && stopListening != null) {
      stopListening()
      stopListening = null
    }
  }
}
