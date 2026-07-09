import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

export function formatDate(
  date?: string | Date | null,
  pattern = 'MMM d, yyyy',
) {
  if (!date) return 'Not specified'

  const d = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(d)) return 'Not specified'

  return format(d, pattern)
}

export function formatTime(date?: string | Date | null) {
  if (!date) return '--'

  const d = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(d)) return '--'

  return format(d, 'h:mm a')
}

export function formatRelative(date?: string | Date | null) {
  if (!date) return ''

  const d = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(d)) return ''

  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}