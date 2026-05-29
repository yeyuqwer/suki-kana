import { useQuery } from '@tanstack/react-query'
import { getServerConfig } from '@/api/configs'

export function useServerConfigs() {
  return useQuery({
    queryKey: ['server-configs'],
    enabled: false,
    queryFn: async () => {
      return await getServerConfig()
    },
  })
}
