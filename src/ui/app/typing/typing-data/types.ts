export const typingLibraryIds = [
  'kana-basic',
  'kana-dakuten',
  'kana-youon',
  'katakana-basic',
] as const

export type TypingLibraryId = (typeof typingLibraryIds)[number]

export type TypingPracticeItem = {
  kana: string
  romaji: string
  speechText?: string
}

export type TypingLibrary = {
  description: string
  id: TypingLibraryId
  items: readonly [TypingPracticeItem, ...TypingPracticeItem[]]
  name: string
}
