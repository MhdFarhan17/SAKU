import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeIcon(icon: string | null | undefined): string {
  if (!icon) return ''
  
  // Map legacy string names to emojis
  const legacyMap: Record<string, string> = {
    'coffee': '🍔',
    'car': '🚗',
    'shopping-bag': '🛍️',
    'file-text': '🧾',
    'activity': '💊',
    'film': '🎮',
    'briefcase': '💰',
    'trending-up': '📈',
    'gift': '🎁',
  }

  return legacyMap[icon] || icon
}
