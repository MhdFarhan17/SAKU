'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTransactionSheet } from '@/store/use-transaction-sheet'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function AddTransactionFab() {
  const { t } = useTranslation()
  const { openSheet } = useTransactionSheet()
  const pathname = usePathname()

  // Hanya tampilkan FAB di halaman Dasbor Utama
  if (pathname !== '/app') {
    return null
  }

  return (
    <Button
      onClick={() => openSheet('expense')}
      className="fixed bottom-[88px] right-6 md:bottom-10 md:right-10 h-14 px-5 rounded-full shadow-lg hover:shadow-xl transition-all z-[90] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-bold flex items-center gap-2"
      aria-label={t('dashboard.fab_add_transaction', 'Tambah Transaksi')}
    >
      <Plus className="h-6 w-6" />
      {t('dashboard.fab_transaction', 'Transaksi')}
    </Button>
  )
}
