'use client'

import { useTransactionSheet } from '@/store/use-transaction-sheet'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useTransactions } from '@/features/transactions/hooks'
import { useAccounts } from '@/features/accounts/hooks'
import { useCategories } from '@/features/categories/hooks'
import { useDebts } from '@/features/debts/hooks'
import { getTranslatedCategoryName } from '@/features/categories/utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function GlobalTransactionSheet() {
  const { t } = useTranslation()
  const { isOpen, closeSheet, defaultType, transactionId } = useTransactionSheet()
  const { mutateAsync: createTransaction } = useCreateTransaction()
  const { mutateAsync: updateTransaction } = useUpdateTransaction()
  const { mutateAsync: deleteTransaction } = useDeleteTransaction()
  
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()
  const { data: transactions } = useTransactions()
  const { data: debts } = useDebts()

  const isEditing = !!transactionId

  const [amountStr, setAmountStr] = useState('')
  const [kind, setKind] = useState<'income' | 'expense' | 'transfer'>(defaultType)
  const [accountId, setAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [debtId, setDebtId] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when opened or populate if editing
  React.useEffect(() => {
    if (isOpen) {
      if (transactionId && transactions) {
        const tx = transactions.find(t => t.id === transactionId)
        if (tx) {
          setTimeout(() => {
            setAmountStr(tx.amount_minor.toLocaleString('id-ID'))
            setKind(tx.kind as any)
            setAccountId(tx.account_id)
            setCategoryId(tx.category_id || '')
            setDebtId((tx as any).debt_id || '')
            setNote(tx.note || '')
          }, 0)
          return
        }
      }

      const timer = setTimeout(() => {
        setAmountStr('')
        setKind(defaultType)
        setAccountId(accounts?.[0]?.id || '')
        setCategoryId('')
        setDebtId('')
        setNote('')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, defaultType, accounts, transactionId, transactions])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, '')
    setAmountStr(num ? parseInt(num, 10).toLocaleString('id-ID') : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amountStr || !accountId) return

    setIsSubmitting(true)
    try {
      const amountMinor = parseInt(amountStr.replace(/\D/g, ''), 10)
      
      if (isEditing && transactionId) {
        await updateTransaction({
          id: transactionId,
          kind,
          amount_minor: amountMinor,
          account_id: accountId,
          category_id: categoryId || null,
          debt_id: debtId || null,
          note: note || null,
        } as any)
        toast.info(t('transactions.updated', 'Transaksi Diperbarui'), { description: t('transactions.updated_desc', 'Perubahan pada transaksi telah disimpan.') })
      } else {
        await createTransaction({
          kind,
          amount_minor: amountMinor,
          account_id: accountId,
          category_id: categoryId || null,
          debt_id: debtId || null,
          date: new Date().toISOString().split('T')[0],
          note: note || null,
          tags: [],
        } as any)
        const kindText = kind === 'expense' ? t('transactions.filter_expense', 'Pengeluaran') : kind === 'income' ? t('transactions.filter_income', 'Pemasukan') : t('transactions.filter_transfer', 'Transfer')
        toast.success(t('transactions.add_success', '{{kind}} Ditambahkan', { kind: kindText }), { description: t('transactions.add_success_desc', 'Berhasil mencatat {{kind}} baru.', { kind: kindText }) })
      }
      
      closeSheet()
    } catch (error) {
      console.error(error)
      toast.error(t('transactions.save_error', 'Gagal Menyimpan'), { description: t('transactions.save_error_desc', 'Terjadi kesalahan saat menyimpan transaksi.') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!transactionId) return
    
    setIsSubmitting(true)
    try {
      await deleteTransaction(transactionId)
      toast.success(t('transactions.deleted', 'Transaksi Dihapus'), { description: t('transactions.deleted_desc', 'Catatan transaksi telah dihapus permanen.') })
      closeSheet()
    } catch (error) {
      console.error(error)
      toast.error("Gagal Menghapus", { description: "Terjadi kesalahan saat menghapus transaksi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCategories = categories?.filter(c => c.kind === kind) || []

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent side="bottom" className="max-h-[96vh] h-full sm:h-auto sm:max-w-md mx-auto rounded-t-[24px] sm:rounded-[24px] z-[100] flex flex-col sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto">
        <SheetHeader className="mb-2 shrink-0 pt-2 sm:pt-0">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-border/80 mb-4 sm:hidden" />
          <SheetTitle className="text-2xl font-black">{isEditing ? t('transactions.edit', 'Edit Transaksi') : t('transactions.add_tx', 'Tambah Transaksi')}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full flex-1 overflow-hidden pt-4">
          <div className="flex bg-surface-subtle p-1 rounded-[16px] border border-border mx-1 shrink-0">
            {(['expense', 'income', 'transfer'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setKind(type)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-[12px] capitalize transition-all duration-200 cursor-pointer active:scale-95 ${
                  kind === type 
                    ? (type === 'expense' ? 'bg-expense text-white shadow-md' : type === 'income' ? 'bg-income text-white shadow-md' : 'bg-blue-500 text-white shadow-md') 
                    : 'text-text-secondary hover:text-text-main hover:bg-black/5 hover:shadow-sm'
                }`}
              >
                {type === 'expense' ? t('transactions.filter_expense', 'Pengeluaran') : type === 'income' ? t('transactions.filter_income', 'Pemasukan') : t('transactions.filter_transfer', 'Transfer')}
              </button>
            ))}
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pb-6 px-1 scrollbar-hide">
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('transactions.amount_label', 'Jumlah (Rp)')}</label>
              <Input 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                value={amountStr}
                onChange={handleAmountChange}
                className="text-4xl h-20 px-4 font-mono font-black rounded-[20px] border-border bg-surface shadow-sm focus-visible:ring-brand text-center tracking-tight"
                autoFocus
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('transactions.account_label', 'Akun')}</label>
                <div className="relative">
                  <select 
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    className="flex h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    required
                  >
                    <option value="" disabled>{t('transactions.select_account', 'Pilih Akun')}</option>
                    {accounts?.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {kind !== 'transfer' ? (
                 <div className="space-y-3">
                   <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('transactions.category_label', 'Kategori')}</label>
                   <div className="relative">
                     <select 
                       value={categoryId}
                       onChange={e => setCategoryId(e.target.value)}
                       className="flex h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                       required
                     >
                       <option value="" disabled>{t('transactions.select_category', 'Pilih Kategori')}</option>
                       {filteredCategories.map(c => (
                         <option key={c.id} value={c.id}>{getTranslatedCategoryName(c.name, t)}</option>
                       ))}
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                     </div>
                   </div>
                 </div>
              ) : (
                 <div className="space-y-3 opacity-50">
                   <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('transactions.category_label', 'Kategori')}</label>
                   <div className="flex h-14 w-full items-center px-4 rounded-[16px] border border-border bg-surface-subtle font-medium text-text-muted">
                     {t('transactions.not_applicable', '(Tidak Berlaku)')}
                   </div>
                 </div>
              )}
            </div>

            {kind !== 'transfer' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('transactions.related_debt', 'Terkait Hutang (Opsional)')}</label>
                <div className="relative">
                  <select 
                    value={debtId}
                    onChange={e => setDebtId(e.target.value)}
                    className="flex h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <option value="">{t('transactions.none', '-- Tidak ada --')}</option>
                    {debts?.filter((d: any) => d.status === 'active' && (kind === 'expense' ? d.kind === 'payable' : d.kind === 'receivable')).map((d: any) => (
                      <option key={d.id} value={d.id}>{d.contact_name} ({t('transactions.remaining_amount', 'Sisa: {{amount}}', { amount: d.remaining_amount_minor.toLocaleString('id-ID') })})</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('transactions.note_label', 'Catatan (Opsional)')}</label>
              <Input 
                type="text" 
                placeholder={t('transactions.note_placeholder', 'Untuk apa transaksi ini?')} 
                value={note}
                onChange={e => setNote(e.target.value)}
                className="h-14 px-4 font-medium rounded-[16px] border-border bg-surface shadow-sm focus-visible:ring-brand"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-auto shrink-0 pt-4 pb-safe">
            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    className="rounded-[16px] border-expense text-expense hover:bg-expense hover:text-white font-bold h-14 px-6 bg-transparent" 
                    disabled={isSubmitting}
                  >
                    {t('transactions.delete', 'Hapus')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="z-[110] rounded-[24px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-expense">{t('transactions.delete_confirm_title', 'Hapus transaksi ini?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('transactions.delete_confirm_desc', 'Anda akan menghapus transaksi ini secara permanen. Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-[12px]">{t('transactions.cancel', 'Batal')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-expense text-white hover:bg-red-600 rounded-[12px]">{t('transactions.delete_btn', 'Hapus Transaksi')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit" size="lg" className="flex-1 h-14 rounded-[16px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-black shadow-sm" disabled={isSubmitting}>
              {isSubmitting ? t('transactions.saving', 'Menyimpan...') : (isEditing ? t('transactions.save_changes', 'Simpan Perubahan') : t('transactions.save_transaction', 'Simpan Transaksi'))}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
