export function formatTime(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '--'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(value)
}
