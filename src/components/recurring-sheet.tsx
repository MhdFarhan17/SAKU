'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCategories } from '@/features/categories/hooks'
import { useAccounts } from '@/features/accounts/hooks'
import { useRecurringBills, useCreateRecurringBill, useUpdateRecurringBill, useDeleteRecurringBill } from '@/features/recurring/hooks'
import { useRecurringSheet } from '@/store/use-recurring-sheet'
import { useTranslation } from 'react-i18next'

export function GlobalRecurringSheet() {
  const { t } = useTranslation()
  const { isOpen, closeSheet, billId } = useRecurringSheet()
  const { data: bills } = useRecurringBills()
  const { mutateAsync: createBill } = useCreateRecurringBill()
  const { mutateAsync: updateBill } = useUpdateRecurringBill()
  const { mutateAsync: deleteBill } = useDeleteRecurringBill()
  
  const { data: categories } = useCategories()
  const { data: accounts } = useAccounts()

  const isEditing = !!billId
  const bill = bills?.find(b => b.id === billId)

  const [name, setName] = useState('')
  const [amountStr, setAmountStr] = useState('')
  const [kind, setKind] = useState<'income' | 'expense' | 'transfer'>('expense')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [nextDueDate, setNextDueDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (isEditing && bill) {
        setTimeout(() => {
          setName(bill.name)
          setAmountStr(bill.amount_minor.toLocaleString('id-ID'))
          setKind(bill.kind as any)
          setFrequency(bill.frequency as any)
          setNextDueDate(bill.next_due_date)
          setCategoryId(bill.category_id || '')
          setAccountId(bill.account_id)
        }, 0)
      } else {
        setTimeout(() => {
          setName('')
          setAmountStr('')
          setKind('expense')
          setFrequency('monthly')
          setNextDueDate(new Date().toISOString().split('T')[0])
          setCategoryId(categories?.[0]?.id || '')
          setAccountId(accounts?.[0]?.id || '')
        }, 0)
      }
    }
  }, [isOpen, isEditing, bill, categories, accounts])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, '')
    setAmountStr(num ? parseInt(num, 10).toLocaleString('id-ID') : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amountStr || !accountId || !nextDueDate) return

    setIsSubmitting(true)
    try {
      const amountMinor = parseInt(amountStr.replace(/\D/g, ''), 10)
      
      if (isEditing) {
        await updateBill({
          id: billId!,
          updates: {
            name,
            amount_minor: amountMinor,
            kind,
            frequency,
            next_due_date: nextDueDate,
            category_id: categoryId || null,
            account_id: accountId,
          }
        })
      } else {
        await createBill({
          name,
          amount_minor: amountMinor,
          kind,
          frequency,
          next_due_date: nextDueDate,
          category_id: categoryId || null,
          account_id: accountId,
        })
      }
      closeSheet()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!billId || !confirm(t('recurring.delete_confirm', 'Hapus catatan rutin ini?'))) return
    setIsSubmitting(true)
    try {
      await deleteBill(billId)
      closeSheet()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent side="bottom" className="max-h-[96vh] h-full sm:h-auto sm:max-w-md mx-auto rounded-t-[24px] sm:rounded-[24px] z-[100] flex flex-col sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto">
        <SheetHeader className="mb-2 shrink-0 pt-2 sm:pt-0">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-border/80 mb-4 sm:hidden" />
          <SheetTitle className="text-2xl font-black">{isEditing ? t('recurring.edit_title', 'Edit Catatan Rutin') : t('recurring.add_title', 'Tambah Rutin Baru')}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full flex-1 overflow-hidden pt-4">
          <div className="space-y-6 flex-1 overflow-y-auto pb-6 px-1 scrollbar-hide">
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('recurring.name_label', 'Nama / Deskripsi')}</label>
              <Input 
                type="text" 
                placeholder={t('recurring.name_placeholder', 'Contoh: Tagihan Internet, Gaji Bulanan')} 
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-14 px-4 font-medium rounded-[16px] border-border bg-surface shadow-sm focus-visible:ring-brand"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('recurring.amount_label', 'Nominal (Rp)')}</label>
              <Input 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                value={amountStr}
                onChange={handleAmountChange}
                className="text-3xl h-16 px-4 font-mono font-black rounded-[20px] border-border bg-surface shadow-sm focus-visible:ring-brand tracking-tight"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('recurring.kind_label', 'Jenis')}</label>
                <div className="relative">
                  <select 
                    value={kind}
                    onChange={e => setKind(e.target.value as any)}
                    className="flex h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <option value="expense">{t('transactions.filter_expense', 'Pengeluaran')}</option>
                    <option value="income">{t('transactions.filter_income', 'Pemasukan')}</option>
                    <option value="transfer">{t('transactions.filter_transfer', 'Transfer')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('recurring.freq_label', 'Frekuensi')}</label>
                <div className="relative">
                  <select 
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as any)}
                    className="flex h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <option value="daily">{t('recurring.freq.daily', 'Harian')}</option>
                    <option value="weekly">{t('recurring.freq.weekly', 'Mingguan')}</option>
                    <option value="monthly">{t('recurring.freq.monthly', 'Bulanan')}</option>
                    <option value="yearly">{t('recurring.freq.yearly', 'Tahunan')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('recurring.start_date_label', 'Tanggal Mulai Berlaku')}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-brand">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                <Input 
                  type="date" 
                  value={nextDueDate}
                  onChange={e => setNextDueDate(e.target.value)}
                  className="h-14 pl-12 pr-4 font-bold rounded-[16px] border-border bg-surface shadow-sm focus-visible:ring-brand cursor-pointer text-text-main block w-full appearance-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('recurring.source_account_label', 'Sumber Akun')}</label>
              <div className="relative">
                <select 
                  value={accountId}
                  onChange={e => setAccountId(e.target.value)}
                  className="flex h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  required
                >
                  <option value="" disabled>{t('recurring.select_account', 'Pilih akun')}</option>
                  {accounts?.filter(a => !a.archived).map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {kind !== 'transfer' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('transactions.category_label', 'Kategori')}</label>
                <div className="relative">
                  <select 
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="flex h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <option value="">{t('recurring.no_category', '(Tanpa Kategori)')}</option>
                    {categories?.filter(c => c.kind === kind && !c.archived).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-auto shrink-0 pt-4 pb-safe">
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1 rounded-[16px] h-14 font-bold border-border text-text-muted hover:text-text-main" disabled={isSubmitting} onClick={closeSheet}>
                {t('recurring.cancel', 'Batal')}
              </Button>
              <Button type="submit" size="lg" className="flex-1 h-14 rounded-[16px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-black shadow-sm" disabled={isSubmitting}>
                {isSubmitting ? t('recurring.saving', 'Menyimpan...') : t('recurring.save_btn', 'Simpan')}
              </Button>
            </div>
            {isEditing && (
              <Button type="button" variant="ghost" size="lg" className="w-full rounded-[16px] h-14 font-bold text-expense hover:bg-expense/10 hover:text-expense" disabled={isSubmitting} onClick={handleDelete}>
                {t('recurring.delete', 'Hapus')}
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
