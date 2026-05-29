import { QueryCache, QueryClient } from '@tanstack/react-query'
import { useErrorStore } from '../common/errors/error-store'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      const nextError = error instanceof Error ? error : new Error(String(error))
      useErrorStore.getState().setLastError(nextError)
    },
  }),
})
