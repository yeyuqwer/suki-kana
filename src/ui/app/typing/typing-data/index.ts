import { kanaBasicLibrary } from './kana-basic'
import { kanaDakutenLibrary } from './kana-dakuten'
import { kanaYouonLibrary } from './kana-youon'
import { katakanaBasicLibrary } from './katakana-basic'
import { type TypingLibraryId, typingLibraryIds } from './types'

export type { TypingLibrary, TypingLibraryId, TypingPracticeItem } from './types'
export { typingLibraryIds }

export const typingLibraries = [
  kanaBasicLibrary,
  kanaDakutenLibrary,
  kanaYouonLibrary,
  katakanaBasicLibrary,
] as const

export const defaultTypingLibraryId: TypingLibraryId = 'kana-basic'

export const getTypingLibrary = (libraryId: TypingLibraryId) => {
  const library = typingLibraries.find(item => item.id === libraryId)

  return library ?? kanaBasicLibrary
}

export const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]
