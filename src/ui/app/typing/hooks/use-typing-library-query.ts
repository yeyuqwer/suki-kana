import { parseAsStringLiteral, useQueryState } from 'nuqs'
import {
  defaultTypingLibraryId,
  getTypingLibrary,
  type TypingLibraryId,
  typingLibraryIds,
} from '../typing-data'

const libraryParser = parseAsStringLiteral(typingLibraryIds)
  .withDefault(defaultTypingLibraryId)
  .withOptions({
    clearOnDefault: true,
    history: 'replace',
    shallow: true,
  })

export function useTypingLibraryQuery() {
  const [libraryId, setLibraryId] = useQueryState('library', libraryParser)
  const currentLibrary = getTypingLibrary(libraryId)

  return {
    currentLibrary,
    libraryId,
    setLibraryId: (nextLibraryId: TypingLibraryId) => {
      void setLibraryId(nextLibraryId)
    },
  }
}
