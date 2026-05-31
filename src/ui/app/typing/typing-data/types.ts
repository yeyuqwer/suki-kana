export const typingLibraryIds = [
  'kana-basic',
  'kana-dakuten',
  'kana-youon',
  'katakana-basic',
] as const

export type TypingLibraryId = (typeof typingLibraryIds)[number]

export type TypingPracticeItem = {
  inputHints?: readonly string[]
  kana: string
  romaji: string
  speechText?: string
  typingRomaji?: string
}

export type TypingLibrary = {
  description: string
  id: TypingLibraryId
  items: readonly [TypingPracticeItem, ...TypingPracticeItem[]]
  name: string
}

export const typingPracticeModeIds = [
  'kana-to-romaji',
  'romaji-to-kana',
  'romaji-to-romaji',
  'kana-to-kana',
] as const

export type TypingPracticeModeId = (typeof typingPracticeModeIds)[number]

export type TypingPracticeMode = {
  description: string
  id: TypingPracticeModeId
  name: string
}
