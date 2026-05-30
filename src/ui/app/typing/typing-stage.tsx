import type { FC } from 'react'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/shadcn'
import { Button } from '@/ui/shadcn/button'

export const TypingStage: FC<{
  currentKana: string
  currentRomaji: string
  typedValue: string
  isAnswerShown: boolean
  isInputWrong: boolean
  japaneseSpeechVoices: SpeechSynthesisVoice[]
  onNextKana: () => void
  onPreviousKana: () => void
  onSelectSpeechVoice: (voiceURI: string) => void
  onSpeakKana: () => void
  selectedVoiceName: string
  selectedVoiceURI: string
}> = ({
  currentKana,
  currentRomaji,
  typedValue,
  isAnswerShown,
  isInputWrong,
  japaneseSpeechVoices,
  onNextKana,
  onPreviousKana,
  onSelectSpeechVoice,
  onSpeakKana,
  selectedVoiceName,
  selectedVoiceURI,
}) => {
  const [isVoiceListOpen, setIsVoiceListOpen] = useState(false)
  const displayedVoiceName =
    japaneseSpeechVoices.find(voice => voice.voiceURI === selectedVoiceURI)?.name ??
    (selectedVoiceName || '未找到日语语音')
  const getVoiceGenderLabel = (voiceName: string) => {
    const normalizedVoiceName = voiceName.toLowerCase()

    if (/eddy|grandpa|reed|rocko|otoya|ichiro/.test(normalizedVoiceName)) {
      return '男声'
    }

    if (/flo|grandma|kyoko|sandy|shelley|nanami|haruka/.test(normalizedVoiceName)) {
      return '女声'
    }

    return '未知'
  }

  return (
    <section className="flex min-h-[52svh] flex-col items-center justify-center gap-7 text-center">
      <div className="flex flex-col items-center gap-3">
        <p
          className={cn(
            'min-h-12 font-medium text-4xl text-[#687064] tracking-normal transition-colors sm:text-5xl dark:text-[#a9b2a7]',
            isAnswerShown && 'text-[#bd3f33] dark:text-[#f07862]',
          )}
        >
          {isAnswerShown ? currentRomaji : ''}
        </p>
        <h1
          className={cn(
            'typing-kana-font text-8xl text-[#202321] leading-none tracking-normal drop-shadow-[0_10px_26px_rgba(32,35,33,0.12)] transition-colors sm:text-9xl dark:text-[#eee7da] dark:drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]',
            isAnswerShown && 'text-[#bd3f33] dark:text-[#f07862]',
          )}
        >
          {currentKana}
        </h1>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <div
          className={cn(
            'h-14 w-full border-[#315463] border-b-2 px-3 text-center font-medium text-5xl text-[#315463] tracking-normal transition-colors dark:border-[#86a8a1] dark:text-[#ded3c1]',
            isInputWrong &&
              'typing-input-shake border-[#bd3f33] text-[#bd3f33] dark:border-[#f07862] dark:text-[#f07862]',
          )}
        >
          {typedValue}
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="previous kana"
            title="[ 上一个"
            className="border-[#d6c7b3] bg-[#fbf8f1] text-[#315463] shadow-sm hover:bg-[#ece3d3] hover:text-[#bd3f33] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f] dark:hover:text-[#f07862]"
            onClick={onPreviousKana}
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2 text-[#687064] text-sm dark:text-[#a9b2a7]">
            <span className="flex items-center gap-1">
              <ChevronLeft className="size-4" />
              <kbd className="rounded border border-[#d6c7b3] bg-[#fbf8f1] px-1.5 py-0.5 font-semibold text-[#315463] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1]">
                [
              </kbd>
              上一个
            </span>
            <span className="flex items-center gap-1">
              下一个
              <kbd className="rounded border border-[#d6c7b3] bg-[#fbf8f1] px-1.5 py-0.5 font-semibold text-[#315463] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1]">
                ]
              </kbd>
              <ChevronRight className="size-4" />
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="next kana"
            title="] 下一个"
            className="border-[#d6c7b3] bg-[#fbf8f1] text-[#315463] shadow-sm hover:bg-[#ece3d3] hover:text-[#bd3f33] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f] dark:hover:text-[#f07862]"
            onClick={onNextKana}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex w-full items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="play kana audio"
            title="播放发音"
            className="shrink-0 border-[#d6c7b3] bg-[#fbf8f1] text-[#315463] shadow-sm hover:bg-[#ece3d3] hover:text-[#bd3f33] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f] dark:hover:text-[#f07862]"
            onClick={onSpeakKana}
          >
            <Volume2 />
          </Button>
          <div
            className="relative min-w-0 flex-1"
            onBlur={event => {
              const nextFocusedElement = event.relatedTarget

              if (
                !(nextFocusedElement instanceof Node) ||
                !event.currentTarget.contains(nextFocusedElement)
              ) {
                setIsVoiceListOpen(false)
              }
            }}
          >
            <button
              type="button"
              className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-[#d6c7b3] bg-[#fbf8f1] px-3 text-left text-[#315463] text-sm shadow-sm outline-none transition-colors hover:bg-[#ece3d3] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f]"
              onClick={() => setIsVoiceListOpen(isOpen => !isOpen)}
            >
              <span className="truncate">{displayedVoiceName}</span>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 transition-transform',
                  isVoiceListOpen && 'rotate-180',
                )}
              />
            </button>

            {isVoiceListOpen && (
              <div className="absolute right-0 bottom-full z-20 mb-2 min-w-full rounded-md border border-[#d6c7b3] bg-[#fbf8f1] p-1 shadow-lg dark:border-[#2f4146] dark:bg-[#161d20]">
                {japaneseSpeechVoices.length === 0 && (
                  <div className="px-3 py-2 text-[#687064] text-sm dark:text-[#a9b2a7]">
                    未找到日语语音
                  </div>
                )}
                {japaneseSpeechVoices.map(voice => (
                  <button
                    key={voice.voiceURI}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-[#315463] text-sm transition-colors hover:bg-[#ece3d3] dark:text-[#ded3c1] dark:hover:bg-[#202b2f]',
                      selectedVoiceURI === voice.voiceURI &&
                        'bg-[#ece3d3] text-[#bd3f33] dark:bg-[#202b2f] dark:text-[#f07862]',
                    )}
                    onClick={() => {
                      onSelectSpeechVoice(voice.voiceURI)
                    }}
                  >
                    <span className="whitespace-nowrap">{voice.name}</span>
                    <span className="ml-4 flex shrink-0 items-center gap-2">
                      {selectedVoiceURI === voice.voiceURI && <Check className="size-4 shrink-0" />}
                      <span className="rounded-full border border-[#d6c7b3] px-2 py-0.5 text-[#687064] text-xs dark:border-[#2f4146] dark:text-[#a9b2a7]">
                        {getVoiceGenderLabel(voice.name)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <p
          className={cn(
            'min-h-7 text-center font-semibold text-transparent text-xl transition-colors',
            isInputWrong && 'text-[#bd3f33] dark:text-[#f07862]',
          )}
        >
          直接重新输入答案即可
        </p>
      </div>
    </section>
  )
}
