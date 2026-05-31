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
    name: '看假名，输入罗马字',
  },
  {
    description: '看罗马字，输入对应的假名',
    id: 'romaji-to-kana',
    name: '看罗马字，输入假名',
  },
  {
    description: '看罗马字，照着输入罗马字',
    id: 'romaji-to-romaji',
    name: '看罗马字，输入罗马字',
  },
  {
    description: '看假名，照着输入假名',
    id: 'kana-to-kana',
    name: '看假名，输入假名',
  },
] as const

export const getTypingLibrary = (libraryId: TypingLibraryId) => {
  const library = typingLibraries.find(item => item.id === libraryId)

  return library ?? kanaBasicLibrary
}

const getTypingInputHint = (item: TypingPracticeItem) => {
  return item.inputHints?.join(' / ') ?? item.typingRomaji ?? item.romaji
}

const typingPracticePromptGetters: Record<
  TypingPracticeModeId,
  (item: TypingPracticeItem) => {
    answer: string
    inputHint: string
    prompt: string
    requiresManualSubmit: boolean
    speechText: string
  }
> = {
  'kana-to-romaji': item => ({
    answer: item.romaji,
    inputHint: item.inputHints?.join(' / ') ?? item.romaji,
    prompt: item.kana,
    requiresManualSubmit: false,
    speechText: item.speechText ?? item.kana,
  }),
  'romaji-to-kana': item => ({
    answer: item.kana,
    inputHint: getTypingInputHint(item),
    prompt: item.romaji,
    requiresManualSubmit: true,
    speechText: item.speechText ?? item.kana,
  }),
  'romaji-to-romaji': item => ({
    answer: item.romaji,
    inputHint: item.inputHints?.join(' / ') ?? item.romaji,
    prompt: item.romaji,
    requiresManualSubmit: false,
    speechText: item.speechText ?? item.kana,
  }),
  'kana-to-kana': item => ({
    answer: item.kana,
    inputHint: getTypingInputHint(item),
    prompt: item.kana,
    requiresManualSubmit: true,
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
