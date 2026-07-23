import { format, parseISO, isToday, isYesterday, formatDistanceToNow } from 'date-fns'
import { id, enUS } from 'date-fns/locale'

export function formatDate(dateString: string, lang: string = 'id'): string {
  const date = parseISO(dateString)
  if (isToday(date)) return lang === 'en' ? 'Today' : 'Hari ini'
  if (isYesterday(date)) return lang === 'en' ? 'Yesterday' : 'Kemarin'
  return format(date, 'd MMM yyyy', { locale: lang === 'en' ? enUS : id })
}

export function formatTime(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'HH:mm')
}

export function formatRelative(dateString: string, lang: string = 'id'): string {
  const date = parseISO(dateString)
  return formatDistanceToNow(date, { addSuffix: true, locale: lang === 'en' ? enUS : id })
}
