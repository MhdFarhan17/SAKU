'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AmountChip } from '@/components/amount-chip'
import { Clock, ArrowRight, Activity, LogOut } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/(auth)/actions'
import { DashboardCharts } from '@/components/dashboard-charts'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useTranslation } from 'react-i18next'
import { normalizeIcon } from '@/lib/utils'

interface DashboardClientProps {
  displayName: string
  totalBalance: number
  recentTx: any[]
}

export function DashboardClient({ displayName, totalBalance, recentTx }: DashboardClientProps) {
  const { t } = useTranslation()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 pb-24">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">{t('dashboard.title', 'Dasbor')}</h1>
          <p className="text-text-muted font-medium mt-1">{t('dashboard.welcome', 'Halo, Selamat datang kembali {{name}} 👋', { name: displayName })}</p>
        </div>
        <div className="md:hidden">
          <AlertDialog>
            <div className="rounded-full bg-gradient-to-r from-red-500/80 to-rose-600/80 p-[1.5px] shadow-sm transition-all duration-300">
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="h-8 px-4 rounded-full bg-surface hover:bg-transparent text-expense hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5" />
                  {t('dashboard.logout_btn', 'Keluar')}
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent className="rounded-[24px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black">{t('dashboard.logout_confirm_title', 'Keluar dari Saku?')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('dashboard.logout_confirm_desc', 'Apakah Anda yakin ingin keluar dari sesi Anda saat ini? Anda harus masuk kembali untuk melihat catatan keuangan Anda.')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row items-center gap-3 mt-4 sm:mt-0">
                <AlertDialogCancel className="mt-0 flex-1 rounded-[12px] font-bold">{t('dashboard.cancel', 'Batal')}</AlertDialogCancel>
                <form action={logout} className="flex-1">
                  <button type="submit" className="w-full h-10 rounded-[12px] font-bold bg-expense text-white hover:bg-red-600 px-4 py-2 text-sm transition-colors cursor-pointer">
                    {t('dashboard.yes_logout', 'Ya, Keluar')}
                  </button>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <DashboardCharts totalBalance={totalBalance} />

      <Card className="border-none rounded-[24px] shadow-sm bg-surface overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <Clock className="w-5 h-5 text-brand" /> {t('dashboard.recent_transactions', 'Transaksi Terakhir')}
            </CardTitle>
            <CardDescription className="font-medium text-text-muted">{t('dashboard.recent_tx_desc', '5 aktivitas terbaru Anda')}</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex font-bold hover:bg-surface-subtle rounded-xl">
            <Link href="/app/transactions">
              {t('dashboard.view_all', 'Lihat Semua')} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {(!recentTx || recentTx.length === 0) ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-text-muted" />
              </div>
              <p className="text-text-main font-bold mb-1">{t('dashboard.no_transactions', 'Belum ada transaksi')}</p>
              <p className="text-sm text-text-muted">{t('dashboard.no_transactions_desc', 'Mulai catat keuangan Anda untuk melihat aktivitas di sini.')}</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {recentTx.map((tx: any) => {
                const isIncome = tx.kind === 'income'
                const isExpense = tx.kind === 'expense'
                const isTransfer = tx.kind === 'transfer'
                
                const iconBg = isIncome ? 'bg-income/10 text-income' : isExpense ? 'bg-expense/10 text-expense' : 'bg-blue-500/10 text-blue-500'
                
                const catName = tx.categories?.name || (isTransfer ? t('dashboard.transfer', 'Transfer') : t('dashboard.other', 'Lainnya'))

                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-surface-subtle transition-all duration-200 cursor-pointer active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-bold ${iconBg}`}>
                        <span className="text-xl">
                          {normalizeIcon(tx.categories?.icon) || (isTransfer ? '🔄' : catName[0].toUpperCase())}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-text-main leading-tight">{catName}</span>
                        <span className="text-sm font-medium text-text-muted mt-1 leading-tight">
                          {tx.accounts?.name || t('dashboard.account', 'Akun')}
                        </span>
                        {tx.note && (
                          <span className="text-sm font-medium text-text-muted truncate mt-1 leading-tight">
                            <span className="opacity-60 font-normal mr-1">{t('dashboard.note_prefix', 'Ket:')}</span>
                            {tx.note}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <AmountChip amountMinor={tx.amount_minor} kind={tx.kind} className="text-base" />
                      <span className="text-xs font-bold text-text-muted mt-1">
                        {new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}
                      </span>
                      <span className="text-[10px] font-medium text-text-muted mt-0.5">
                        {tx.date.split('-').reverse().join('/')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className="p-4 border-t border-border/50 sm:hidden">
            <Button asChild variant="outline" className="w-full font-bold rounded-xl h-12">
              <Link href="/app/transactions">
                {t('dashboard.view_all_tx', 'Lihat Semua Transaksi')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
