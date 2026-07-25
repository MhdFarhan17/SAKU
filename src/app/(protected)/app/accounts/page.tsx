'use client'

import { useState } from 'react'
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/features/accounts/hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AmountChip } from '@/components/amount-chip'
import { AccountChip } from '@/components/account-chip'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export default function AccountsPage() {
  const { t } = useTranslation()
  const { data: accounts, isLoading, error } = useAccounts()
  const { mutateAsync: createAccount } = useCreateAccount()
  const { mutateAsync: updateAccount } = useUpdateAccount()
  const { mutateAsync: deleteAccount } = useDeleteAccount()
  
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState<'cash' | 'bank' | 'card' | 'ewallet'>('cash')
  const [balance, setBalance] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) return <div className="p-6">{t('accounts.loading', 'Memuat akun...')}</div>
  if (error) return <div className="p-6 text-expense">{t('accounts.error_load', 'Gagal memuat akun.')}</div>

  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance_minor, 0) || 0

  const openAdd = () => {
    setEditId(null)
    setName('')
    setType('cash')
    setBalance('')
    setIsOpen(true)
  }

  const openEdit = (acc: any) => {
    setEditId(acc.id)
    setName(acc.name)
    setType(acc.type)
    setBalance(acc.starting_balance_minor.toLocaleString('id-ID'))
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setIsSubmitting(true)
    try {
      const startingBalanceMinor = parseInt(balance.replace(/\D/g, ''), 10) || 0
      
      if (editId) {
        await updateAccount({
          id: editId,
          account: {
            name,
            type,
            starting_balance_minor: startingBalanceMinor,
          }
        })
        toast.info(t('accounts.toast_saved_title', 'Akun Diperbarui'), { description: t('accounts.toast_saved_desc', "Detail akun '{{name}}' telah disimpan.", { name }) })
      } else {
        await createAccount({
          name,
          type,
          currency: 'IDR',
          starting_balance_minor: startingBalanceMinor,
        })
        toast.success(t('accounts.toast_added_title', "Akun Ditambahkan"), { description: t('accounts.toast_added_desc', "Akun '{{name}}' berhasil ditambahkan.", { name }) })
      }
      
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(t('accounts.toast_save_error', "Gagal Menyimpan"), { description: t('accounts.toast_save_error_desc', "Terjadi kesalahan saat menyimpan akun.") })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!editId) return
    setIsSubmitting(true)
    try {
      await deleteAccount(editId)
      toast.success(t('accounts.toast_deleted_title', "Akun Dihapus"), { description: t('accounts.toast_deleted_desc', "Akun beserta transaksinya berhasil dihapus.") })
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(t('accounts.toast_delete_error', "Gagal Menghapus"), { description: t('accounts.toast_delete_error_desc', "Terjadi kesalahan saat menghapus akun.") })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, '')
    setBalance(num ? parseInt(num, 10).toLocaleString('id-ID') : '')
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 md:space-y-10 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main">{t('accounts.title', 'Akun')}</h1>
          <p className="text-text-muted mt-1">{t('accounts.desc', 'Kelola dompet, rekening, dan kartu Anda.')}</p>
        </div>
        <Button 
          className="rounded-[16px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-bold hidden md:flex"
          onClick={openAdd}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('accounts.add_account', 'Tambah Akun')}
        </Button>
      </div>

      <Card className="rounded-[24px] border-none shadow-sm bg-surface">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">{t('accounts.total_wealth', 'Total Kekayaan')}</CardTitle>
          <CardDescription>{t('accounts.total_wealth_desc', 'Total saldo dari semua akun Anda')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AmountChip amountMinor={totalBalance} className="text-4xl font-black text-text-main" showSign={false} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {accounts?.map((account) => (
          <Card key={account.id} onClick={() => openEdit(account)} className="rounded-[24px] hover:border-brand transition-all duration-200 cursor-pointer active:scale-[0.98] hover:shadow-md border-border bg-surface shadow-sm">
            <CardContent className="p-4 md:p-5 flex flex-col gap-4 md:gap-6">
              <div className="flex justify-between items-start">
                <AccountChip name={account.name} type={account.type} color={account.color} />
                <span className="text-xs font-bold text-text-muted capitalize bg-canvas px-2 py-1 rounded-full">{account.currency}</span>
              </div>
              <div>
                <AmountChip amountMinor={account.balance_minor} className="text-2xl font-black" showSign={false} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile FAB */}
      <Button 
        onClick={openAdd}
        className="fixed bottom-24 right-6 h-14 px-5 rounded-full shadow-lg md:hidden bg-brand text-[#0e0f0c] hover:bg-brand/90 z-[90] font-bold flex items-center gap-2"
      >
        <Plus className="w-6 h-6" />
        {t('accounts.title', 'Akun')}
      </Button>

      {/* Add/Edit Account Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="max-h-[95vh] sm:h-auto sm:max-w-md mx-auto rounded-t-[24px] sm:rounded-[24px] z-[100] flex flex-col sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto">
          <SheetHeader className="mb-2 shrink-0 flex flex-row items-center justify-between">
            <SheetTitle className="text-2xl font-black">{editId ? t('accounts.edit_account', 'Edit Akun') : t('accounts.add_account', 'Tambah Akun')}</SheetTitle>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full flex-1">
            <div className="space-y-6 flex-1 overflow-y-auto px-2 scrollbar-hide pb-6 pt-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('accounts.account_name_label', 'Nama Akun / Dompet')}</label>
                <Input 
                  type="text" 
                  placeholder={t('accounts.account_name_placeholder', 'Contoh: BCA, GoPay, Dompet Tunai')} 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-12 md:h-14 px-4 font-medium rounded-[16px] border-border bg-surface shadow-sm focus-visible:ring-brand"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('accounts.account_type_label', 'Tipe')}</label>
                <div className="relative">
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="flex h-12 md:h-14 w-full appearance-none rounded-[16px] border border-border bg-surface px-4 py-2 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    required
                  >
                    <option value="cash">{t('accounts.type_cash', 'Tunai (Cash)')}</option>
                    <option value="bank">{t('accounts.type_bank', 'Rekening Bank')}</option>
                    <option value="ewallet">{t('accounts.type_ewallet', 'E-Wallet (GoPay, OVO, dll)')}</option>
                    <option value="card">{t('accounts.type_card', 'Kartu Kredit/Debit')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('accounts.starting_balance_label', 'Saldo Awal (Rp)')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted">Rp</span>
                  <Input 
                    type="text" 
                    inputMode="numeric"
                    placeholder={t('accounts.starting_balance_placeholder', '0')} 
                    value={balance}
                    onChange={handleBalanceChange}
                    className="h-12 md:h-14 pl-12 pr-4 font-bold rounded-[16px] border-border bg-surface shadow-sm focus-visible:ring-brand text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 pb-safe space-y-3 shrink-0">
              <Button type="submit" className="w-full h-12 md:h-14 rounded-full font-black text-lg bg-brand text-[#0e0f0c] hover:bg-brand/90" disabled={isSubmitting}>
                {isSubmitting ? '...' : t('accounts.save', 'Simpan Akun')}
              </Button>
              
              {editId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="ghost" className="w-full h-12 rounded-full font-bold text-expense hover:bg-expense/10 hover:text-expense" disabled={isSubmitting}>
                      <Trash2 className="w-5 h-5 mr-2" />
                      {t('accounts.delete', 'Hapus Akun')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[24px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black">{t('accounts.delete_confirm_title', 'Hapus akun ini?')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('accounts.delete_confirm_desc', 'Semua transaksi yang terkait dengan akun ini akan ikut terhapus dan saldo Anda akan terpengaruh. Tindakan ini tidak dapat dibatalkan.')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row items-center gap-3 mt-4 sm:mt-0">
                      <AlertDialogCancel className="mt-0 flex-1 rounded-[12px] font-bold">{t('accounts.cancel', 'Batal')}</AlertDialogCancel>
                      <Button onClick={handleDelete} className="flex-1 h-10 rounded-[12px] font-bold bg-expense text-white hover:bg-red-600 px-4 py-2 text-sm transition-colors cursor-pointer">
                        {t('accounts.delete', 'Hapus')}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
