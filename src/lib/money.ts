/**
 * Saku stores all money as integer minor units (0 decimal places for IDR).
 */

export function formatMoney(amountMinor: number, currency = 'IDR', locale = 'id-ID'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountMinor)
}

export function parseMoneyInput(input: string): number {
  // Remove all non-numeric characters
  const numericString = input.replace(/\D/g, '')
  if (!numericString) return 0
  return parseInt(numericString, 10)
}
