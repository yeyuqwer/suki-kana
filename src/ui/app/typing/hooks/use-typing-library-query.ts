import { parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs'
import { useCallback, useEffect } from 'react'
import {
  defaultTypingLibraryId,
  defaultTypingPracticeModeId,
  getTypingLibrary,
  type TypingLibraryId,
  type TypingPracticeModeId,
  typingLibraryIds,
  typingPracticeModeIds,
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
const modeParser = parseAsStringLiteral(typingPracticeModeIds)
  .withDefault(defaultTypingPracticeModeId)
  .withOptions({
    clearOnDefault: true,
    history: 'replace',
    shallow: true,
  })

export function useTypingLibraryQuery() {
  const [libraryId, setQueryLibraryId] = useQueryState('library', libraryParser)
  const [itemIndex, setQueryItemIndex] = useQueryState('item', itemParser)
  const [modeId, setQueryModeId] = useQueryState('mode', modeParser)
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
  const setModeId = useCallback(
    (nextModeId: TypingPracticeModeId) => {
      void setQueryModeId(nextModeId)
      void setQueryItemIndex(0)
    },
    [setQueryItemIndex, setQueryModeId],
  )

  return {
    currentLibrary,
    itemIndex: currentItemIndex,
    libraryId,
    modeId,
    setItemIndex,
    setLibraryId,
    setModeId,
  }
}
