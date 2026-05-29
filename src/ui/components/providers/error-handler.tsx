'use client'

import type { FC, MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { BaseError } from '@/lib/common/errors/base'
import { useErrorStore } from '@/lib/common/errors/error-store'
import { initializeErrorStore } from '@/lib/runtime/init-error-store'

function clearTimeouts(timeoutIds: Set<number>) {
  for (const timeoutId of timeoutIds) {
    window.clearTimeout(timeoutId)
  }

  timeoutIds.clear()
}

function scheduleMessageRelease(
  message: string,
  recentMessages: MutableRefObject<Partial<Record<string, boolean>>>,
  timeoutIds: MutableRefObject<Set<number>>,
) {
  const timeoutId = window.setTimeout(() => {
    timeoutIds.current.delete(timeoutId)
    delete recentMessages.current[message]
  }, 1000)

  timeoutIds.current.add(timeoutId)
}

function reportError(
  error: Error,
  recentMessages: MutableRefObject<Partial<Record<string, boolean>>>,
  timeoutIds: MutableRefObject<Set<number>>,
) {
  if (error instanceof BaseError) {
    if (!error.handled) {
      error.handled = true

      if (recentMessages.current[error.message] !== true) {
        recentMessages.current[error.message] = true

        toast.error(error.message)
        scheduleMessageRelease(error.message, recentMessages, timeoutIds)
      }
    }

    if (error.needFix) {
      console.error(error)
    } else {
      // biome-ignore lint/suspicious/noConsole: <ignore>
      console.log(error)
    }

    return
  }

  console.error(error)
}

function initializeErrorHandler(
  recentMessages: MutableRefObject<Partial<Record<string, boolean>>>,
  timeoutIds: MutableRefObject<Set<number>>,
) {
  const cleanupErrorStore = initializeErrorStore()
  const unsubscribe = useErrorStore.subscribe(state => {
    if (state.lastError == null) {
      return
    }

    const nextError = state.lastError

    useErrorStore.getState().setLastError(null)
    reportError(nextError, recentMessages, timeoutIds)
  })

  return () => {
    unsubscribe()
    cleanupErrorStore()
    clearTimeouts(timeoutIds.current)
    recentMessages.current = {}
  }
}

export const ErrorHandler: FC = () => {
  const recentMessages = useRef<Partial<Record<string, boolean>>>({})
  const timeoutIds = useRef<Set<number>>(new Set())

  useEffect(() => {
    return initializeErrorHandler(recentMessages, timeoutIds)
  }, [])

  return null
}
