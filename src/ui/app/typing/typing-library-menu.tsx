import type { FC } from 'react'
import type { TypingLibrary, TypingLibraryId } from './typing-data'
import { BookOpen, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/shadcn'

export const TypingLibraryMenu: FC<{
  isOpen: boolean
  libraries: readonly TypingLibrary[]
  onSelectLibrary: (libraryId: TypingLibraryId) => void
  onOpenChange: (isOpen: boolean) => void
  selectedLibraryId: TypingLibraryId
}> = ({ isOpen, libraries, onOpenChange, onSelectLibrary, selectedLibraryId }) => {
  const selectedLibrary = libraries.find(library => library.id === selectedLibraryId)

  return (
    <div
      className="relative w-full max-w-sm"
      onBlur={event => {
        const nextFocusedElement = event.relatedTarget

        if (
          !(nextFocusedElement instanceof Node) ||
          !event.currentTarget.contains(nextFocusedElement)
        ) {
          onOpenChange(false)
        }
      }}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-md border border-[#d6c7b3] bg-[#fbf8f1] px-3 py-2 text-left text-[#315463] shadow-sm outline-none transition-colors hover:bg-[#ece3d3] dark:border-[#2f4146] dark:bg-[#161d20] dark:text-[#ded3c1] dark:hover:bg-[#202b2f]"
        onClick={() => onOpenChange(!isOpen)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <BookOpen className="size-4 shrink-0 text-[#bd3f33] dark:text-[#f07862]" />
          <span className="min-w-0">
            <span className="block truncate font-semibold text-sm">
              {selectedLibrary?.name ?? '选择词库'}
            </span>
            <span className="block truncate text-[#687064] text-xs dark:text-[#a9b2a7]">
              {selectedLibrary?.items.length ?? 0} 个练习项
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-full rounded-md border border-[#d6c7b3] bg-[#fbf8f1] p-1 shadow-[0_12px_34px_rgba(49,84,99,0.1)] dark:border-[#2f4146] dark:bg-[#161d20] dark:shadow-[0_12px_34px_rgba(0,0,0,0.24)]">
          {libraries.map(library => (
            <button
              key={library.id}
              type="button"
              className={cn(
                'flex w-full items-start gap-3 rounded px-3 py-2 text-left transition-colors hover:bg-[#ece3d3] dark:hover:bg-[#202b2f]',
                selectedLibraryId === library.id &&
                  'bg-[#ece3d3] text-[#bd3f33] dark:bg-[#202b2f] dark:text-[#f07862]',
              )}
              onClick={() => {
                onSelectLibrary(library.id)
                onOpenChange(false)
              }}
            >
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                {selectedLibraryId === library.id && <Check className="size-4" />}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-sm">{library.name}</span>
                <span className="mt-1 block text-[#687064] text-xs leading-5 dark:text-[#a9b2a7]">
                  {library.description}
                </span>
              </span>
              <span className="ml-auto shrink-0 rounded-full border border-[#d6c7b3] px-2 py-0.5 text-[#687064] text-xs dark:border-[#2f4146] dark:text-[#a9b2a7]">
                {library.items.length}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
