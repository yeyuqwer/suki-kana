import { parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs'
import { useCallback, useEffect } from 'react'
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
const itemParser = parseAsInteger.withDefault(0).withOptions({
  clearOnDefault: true,
  history: 'replace',
  shallow: true,
})

export function useTypingLibraryQuery() {
  const [libraryId, setQueryLibraryId] = useQueryState('library', libraryParser)
  const [itemIndex, setQueryItemIndex] = useQueryState('item', itemParser)
  const currentLibrary = getTypingLibrary(libraryId)
  const currentItemIndex = itemIndex >= 0 && itemIndex < currentLibrary.items.length ? itemIndex : 0

  useEffect(() => {
    if (currentItemIndex !== itemIndex) {
      void setQueryItemIndex(currentItemIndex)
    }
  }, [currentItemIndex, itemIndex, setQueryItemIndex])

  const setLibraryId = useCallback(
    (nextLibraryId: TypingLibraryId) => {
      void setQueryLibraryId(nextLibraryId)
      void setQueryItemIndex(0)
    },
    [setQueryItemIndex, setQueryLibraryId],
  )
  const setItemIndex = useCallback(
    (nextItemIndex: number) => {
      void setQueryItemIndex(nextItemIndex)
    },
    [setQueryItemIndex],
  )

  return {
    currentLibrary,
    itemIndex: currentItemIndex,
    libraryId,
    setItemIndex,
    setLibraryId,
  }
}
