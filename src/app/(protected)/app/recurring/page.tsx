'use client'

import { useRecurringBills, useUpdateRecurringBill } from '@/features/recurring/hooks'
import { useCreateTransaction } from '@/features/transactions/hooks'
import { useRecurringSheet } from '@/store/use-recurring-sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Clock, CheckCircle2, Activity } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { formatDate } from '@/lib/date'
import { AmountChip } from '@/components/amount-chip'
import { useTranslation } from 'react-i18next'

export default function RecurringPage() {
  const { t } = useTranslation()
  const { data: bills, isLoading } = useRecurringBills()
  const { mutateAsync: updateBill } = useUpdateRecurringBill()
  const { mutateAsync: createTransaction } = useCreateTransaction()
  const openSheet = useRecurringSheet(s => s.openSheet)

  const handlePay = async (e: React.MouseEvent, bill: any) => {
    e.stopPropagation()
    
    // Create actual transaction
    await createTransaction({
      account_id: bill.account_id,
      amount_minor: bill.amount_minor,
      kind: bill.kind,
      category_id: bill.category_id,
      date: bill.next_due_date, // use the due date as the transaction date
      note: t('recurring.routine_note', '(Rutin) {{name}}', { name: bill.name }),
      tags: ['rutin'],
    })

    // Advance the next due date
    const date = new Date(bill.next_due_date)
    if (bill.frequency === 'daily') date.setDate(date.getDate() + 1)
    if (bill.frequency === 'weekly') date.setDate(date.getDate() + 7)
    if (bill.frequency === 'monthly') date.setMonth(date.getMonth() + 1)
    if (bill.frequency === 'yearly') date.setFullYear(date.getFullYear() + 1)

    const nextDueDate = date.toISOString().split('T')[0]
    await updateBill({ id: bill.id, updates: { next_due_date: nextDueDate } })
  }

  if (isLoading) return <div className="p-6 font-medium animate-pulse">{t('recurring.loading', 'Memuat catatan rutin...')}</div>

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">{t('recurring.title', 'Catatan Rutin')}</h1>
          <p className="text-text-muted font-medium mt-1">{t('recurring.desc', 'Kelola tagihan, langganan, atau gaji rutin Anda.')}</p>
        </div>
        <Button onClick={() => openSheet()} className="hidden md:flex font-bold rounded-xl h-11 px-6 bg-[#9fe870] text-[#0e0f0c] hover:bg-[#85c95a]">
          <Plus className="w-5 h-5 mr-2" />
          {t('recurring.add_new', 'Tambah Rutin')}
        </Button>
      </div>

      <div className="space-y-4">
        {(!bills || bills.length === 0) && (
          <div className="text-center p-12 bg-surface rounded-[24px] shadow-sm border-none mt-8">
            <div className="w-16 h-16 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-main font-bold mb-1">{t('recurring.empty_title', 'Belum ada catatan rutin')}</p>
            <p className="text-sm text-text-muted mb-6">{t('recurring.empty_desc', 'Tambahkan tagihan atau pemasukan berulang Anda di sini.')}</p>
            <Button onClick={() => openSheet()} className="md:hidden font-bold rounded-xl h-11 px-6 bg-[#9fe870] text-[#0e0f0c] hover:bg-[#85c95a] mx-auto flex">
              <Plus className="w-5 h-5 mr-2" />
              {t('recurring.add_new', 'Tambah Rutin')}
            </Button>
          </div>
        )}

        {bills?.map(bill => {
          const isOverdue = bill.next_due_date < todayStr
          const isDueToday = bill.next_due_date === todayStr
          const catName = bill.categories?.name || t('recurring.others', 'Lainnya')
          const catColor = bill.categories?.color || '#cbd5e1'
          
          return (
            <Card 
              key={bill.id} 
              onClick={() => openSheet(bill.id)}
              className={`border-2 rounded-[24px] shadow-sm bg-surface overflow-hidden transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                isOverdue ? 'border-red-500' : isDueToday ? 'border-brand' : 'border-transparent hover:border-brand/50'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                      style={{ backgroundColor: catColor }}
                    >
                      {catName[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-lg leading-tight flex items-center gap-2">
                        {bill.name}
                        <span className="bg-canvas px-2 py-0.5 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-wider">
                          {t(`recurring.freq.${bill.frequency}`, bill.frequency)}
                        </span>
                      </h3>
                      <p className="text-sm font-medium text-text-muted mt-1 flex items-center gap-1.5">
                        <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-500' : isDueToday ? 'text-brand' : ''}`} />
                        <span className={isOverdue ? 'text-red-500 font-bold' : isDueToday ? 'text-brand font-bold' : ''}>
                          {isOverdue ? t('recurring.overdue', 'Terlewat: ') : isDueToday ? t('recurring.today', 'Hari Ini: ') : t('recurring.next', 'Berikutnya: ')}
                          {formatDate(bill.next_due_date)}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 mt-2 sm:mt-0">
                    <AmountChip amountMinor={bill.amount_minor} kind={bill.kind} />
                    
                    <Button 
                      onClick={(e) => handlePay(e, bill)}
                      variant={isOverdue || isDueToday ? 'default' : 'outline'}
                      size="sm"
                      className={`rounded-full font-bold text-xs h-8 px-4 ${
                        isOverdue || isDueToday ? 'bg-brand text-[#0e0f0c] hover:bg-brand/90' : 'bg-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      {t('recurring.mark_done', 'Tandai Selesai')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
