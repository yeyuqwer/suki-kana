import { kanaBasicLibrary } from './kana-basic'
import { kanaDakutenLibrary } from './kana-dakuten'
import { kanaYouonLibrary } from './kana-youon'
import { katakanaBasicLibrary } from './katakana-basic'
import {
  type TypingLibraryId,
  type TypingPracticeItem,
  type TypingPracticeModeId,
  typingLibraryIds,
  typingPracticeModeIds,
} from './types'

export type {
  TypingLibrary,
  TypingLibraryId,
  TypingPracticeItem,
  TypingPracticeMode,
  TypingPracticeModeId,
} from './types'
export { typingLibraryIds, typingPracticeModeIds }

export const typingLibraries = [
  kanaBasicLibrary,
  kanaDakutenLibrary,
  kanaYouonLibrary,
  katakanaBasicLibrary,
] as const

export const defaultTypingLibraryId: TypingLibraryId = 'kana-basic'
export const defaultTypingPracticeModeId: TypingPracticeModeId = 'kana-to-romaji'

export const typingPracticeModes = [
  {
    description: '看假名，输入对应的罗马字',
    id: 'kana-to-romaji',
    name: '输入罗马字',
  },
  {
    description: '看罗马字，输入对应的假名',
    id: 'romaji-to-kana',
    name: '输入假名',
  },
] as const

export const getTypingLibrary = (libraryId: TypingLibraryId) => {
  const library = typingLibraries.find(item => item.id === libraryId)

  return library ?? kanaBasicLibrary
}

const typingPracticePromptGetters: Record<
  TypingPracticeModeId,
  (item: TypingPracticeItem) => {
    answer: string
    prompt: string
    speechText: string
  }
> = {
  'kana-to-romaji': item => ({
    answer: item.romaji,
    prompt: item.kana,
    speechText: item.speechText ?? item.kana,
  }),
  'romaji-to-kana': item => ({
    answer: item.kana,
    prompt: item.romaji,
    speechText: item.speechText ?? item.kana,
  }),
}

export const getTypingPracticePrompt = (item: TypingPracticeItem, modeId: TypingPracticeModeId) => {
  return typingPracticePromptGetters[modeId](item)
}

export const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]
