'use client'

import { useTransactions } from '@/features/transactions/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { AmountChip } from '@/components/amount-chip'
import { formatDate, formatTime } from '@/lib/date'
import { Button } from '@/components/ui/button'
import { Plus, Activity, Search, Download } from 'lucide-react'
import { useTransactionSheet } from '@/store/use-transaction-sheet'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { generateMonthlyReport, PDFTransactionData } from '@/lib/pdf'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from 'react-i18next'
import { getTranslatedCategoryName } from '@/features/categories/utils'

type FilterType = 'all' | 'income' | 'expense' | 'transfer'

export default function TransactionsPage() {
  const { t, i18n } = useTranslation()
  const { data: transactions, isLoading, error } = useTransactions()
  const openSheet = useTransactionSheet(s => s.openSheet)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [exportMonth, setExportMonth] = useState('')

  if (isLoading) return <div className="p-6 font-medium">{t('transactions.loading', 'Memuat transaksi...')}</div>
  if (error) return <div className="p-6 text-expense font-medium">{t('transactions.error_load', 'Gagal memuat transaksi.')}</div>

  // Filter transactions
  const filteredTransactions = transactions?.filter(t => {
    // 1. Type filter
    if (typeFilter !== 'all' && t.kind !== typeFilter) return false
    
    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const catName = t.categories?.name?.toLowerCase() || ''
      const note = t.note?.toLowerCase() || ''
      const amountStr = t.amount_minor.toString()
      
      if (!catName.includes(q) && !note.includes(q) && !amountStr.includes(q)) {
        return false
      }
    }
    
    return true
  }) || []

  // Group by date
  const grouped = filteredTransactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = []
    acc[t.date].push(t)
    return acc
  }, {} as Record<string, typeof filteredTransactions>)

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const handleExportPDF = async () => {
    let finalTransactions = filteredTransactions

    // If month is selected, filter further
    if (exportMonth) {
      finalTransactions = filteredTransactions.filter(t => t.date.startsWith(exportMonth))
    }

    if (!finalTransactions || finalTransactions.length === 0) {
      alert(t('transactions.export_empty_alert', "Tidak ada transaksi pada periode ini untuk diekspor."))
      return
    }

    let period = t('transactions.export_report_title', "Laporan Transaksi")
    if (exportMonth) {
      const [year, month] = exportMonth.split('-')
      const monthDate = new Date(parseInt(year), parseInt(month) - 1)
      const monthStr = monthDate.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { month: 'long' })
      period = `${t('transactions.export_month_prefix', 'Bulan')} ${monthStr} ${year}`
    } else {
      period = t('transactions.export_all_time', "Semua Waktu")
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userName = user?.user_metadata?.display_name || 'Pengguna Saku'

    const now = new Date()
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()]
    const tanggal = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
    const printTime = `Hari ${hari}, ${jam} WIB ${tanggal}`
    
    let totalIncome = 0
    let totalExpense = 0
    
    const pdfData: PDFTransactionData[] = finalTransactions.map(tx => {
      if (tx.kind === 'income') totalIncome += tx.amount_minor
      if (tx.kind === 'expense') totalExpense += tx.amount_minor
      
      return {
        date: tx.date,
        note: tx.note,
        kind: tx.kind as 'income'|'expense'|'transfer',
        amount_minor: tx.amount_minor,
        categoryName: tx.categories?.name ? getTranslatedCategoryName(tx.categories.name, t) : '',
        accountName: tx.accounts?.name || ''
      }
    })

    generateMonthlyReport(period, pdfData, totalIncome, totalExpense, userName, printTime)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">{t('transactions.title', 'Transaksi')}</h1>
          <p className="text-text-muted font-medium mt-1">{t('transactions.desc', 'Semua catatan pemasukan dan pengeluaran Anda.')}</p>
        </div>
        <Button onClick={() => openSheet('expense')} className="hidden md:flex font-bold rounded-xl h-11 px-6 bg-[#9fe870] text-[#0e0f0c] hover:bg-[#85c95a]">
          <Plus className="w-5 h-5 mr-2" />
          {t('transactions.add_tx', 'Tambah Transaksi')}
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input 
            placeholder={t('transactions.search_placeholder', 'Cari transaksi (nama kategori, catatan, nominal)...')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-[16px] border-none bg-surface shadow-sm font-medium text-base focus-visible:ring-brand focus-visible:ring-2"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
            <button 
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                typeFilter === 'all' ? 'bg-surface-subtle text-text-main shadow-sm' : 'text-text-muted hover:bg-surface-subtle'
              }`}
            >
              {t('transactions.filter_all', 'Semua')}
            </button>
            <button 
              onClick={() => setTypeFilter('income')}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                typeFilter === 'income' ? 'bg-income/20 text-income' : 'text-text-muted hover:bg-surface-subtle'
              }`}
            >
              {t('transactions.filter_income', 'Pemasukan')}
            </button>
            <button 
              onClick={() => setTypeFilter('expense')}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                typeFilter === 'expense' ? 'bg-expense/20 text-expense' : 'text-text-muted hover:bg-surface-subtle'
              }`}
            >
              {t('transactions.filter_expense', 'Pengeluaran')}
            </button>
            <button 
              onClick={() => setTypeFilter('transfer')}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                typeFilter === 'transfer' ? 'bg-blue-500/20 text-blue-500' : 'text-text-muted hover:bg-surface-subtle'
              }`}
            >
              {t('transactions.filter_transfer', 'Transfer')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto mt-2 sm:mt-0">
            <div className="relative flex items-center w-full">
              {!exportMonth && (
                <span className="absolute left-4 text-text-muted text-sm font-bold pointer-events-none truncate pr-2">
                  {t('transactions.select_month', 'Pilih Bulan')}
                </span>
              )}
              <input 
                type="month" 
                value={exportMonth}
                onChange={e => setExportMonth(e.target.value)}
                className={`h-10 w-full sm:w-[170px] px-3 rounded-[12px] sm:rounded-full border border-border bg-surface text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80 cursor-pointer [&::-webkit-calendar-picker-indicator]:bg-brand [&::-webkit-calendar-picker-indicator]:p-1.5 [&::-webkit-calendar-picker-indicator]:rounded-[8px] sm:[&::-webkit-calendar-picker-indicator]:rounded-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-[#85c95a] [&::-webkit-calendar-picker-indicator]:transition-colors ${!exportMonth ? 'text-transparent' : 'text-text-main'}`}
                title={t('transactions.select_month', 'Pilih bulan untuk diekspor')}
              />
            </div>
            <Button 
              onClick={handleExportPDF} 
              variant="outline" 
              className="w-full sm:w-auto shrink-0 rounded-[12px] sm:rounded-full font-bold border-border text-text-main shadow-sm bg-surface hover:bg-surface-subtle px-4 h-10"
            >
              <Download className="w-4 h-4 sm:mr-2 shrink-0" />
              <span className="truncate sm:overflow-visible sm:whitespace-nowrap">{t('transactions.export_pdf', 'Ekspor PDF')}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {sortedDates.length === 0 && (
          <div className="text-center p-12 bg-surface rounded-[24px] shadow-sm border-none mt-8">
            <div className="w-16 h-16 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-main font-bold mb-1">{t('transactions.empty_title', 'Tidak ada transaksi ditemukan')}</p>
            <p className="text-sm text-text-muted">{t('transactions.empty_desc', 'Coba ubah filter atau kata kunci pencarian Anda.')}</p>
          </div>
        )}

        {sortedDates.map(date => (
          <div key={date} className="space-y-4">
            <h3 className="text-sm font-bold text-text-muted sticky top-0 bg-canvas/95 py-2 backdrop-blur z-10 rounded-lg px-2">
              {formatDate(date, i18n.language)}
            </h3>
            <Card className="border-none rounded-[24px] shadow-sm bg-surface overflow-hidden">
              <CardContent className="p-0 divide-y divide-border/50">
                {grouped[date].map(tx => {
                  const isIncome = tx.kind === 'income'
                  const isExpense = tx.kind === 'expense'
                  const isTransfer = tx.kind === 'transfer'
                  
                  const iconBg = isIncome ? 'bg-income/10 text-income' : isExpense ? 'bg-expense/10 text-expense' : 'bg-blue-500/10 text-blue-500'
                  const rawCatName = tx.categories?.name || ''
                  const catName = rawCatName ? getTranslatedCategoryName(rawCatName, t) : (isTransfer ? t('transactions.transfer', 'Transfer') : t('transactions.other', 'Lainnya'))
                  const accName = tx.accounts?.name || t('transactions.account', 'Akun')
                  
                  return (
                    <div 
                      key={tx.id} 
                      onClick={() => openSheet(tx.kind as any, tx.id)}
                      className="p-4 flex items-center justify-between hover:bg-surface-subtle transition-all duration-200 cursor-pointer active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-bold text-xl shrink-0 ${iconBg}`}>
                          {tx.categories?.icon || (isTransfer ? '🔄' : catName[0].toUpperCase())}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-bold text-text-main leading-tight">{catName}</span>
                          <span className="text-sm font-medium text-text-muted mt-1 leading-tight">
                            {accName}
                          </span>
                          {tx.note && (
                            <span className="text-sm font-medium text-text-muted truncate mt-1 leading-tight">
                              <span className="opacity-60 font-normal mr-1">{t('transactions.note_prefix', 'Ket:')}</span>
                              {tx.note}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <AmountChip amountMinor={tx.amount_minor} kind={tx.kind} className="text-base" />
                        <span className="text-xs font-bold text-text-muted mt-1">
                          {new Date(tx.created_at).toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}
                        </span>
                        <span className="text-[10px] font-medium text-text-muted mt-0.5">
                          {tx.date.split('-').reverse().join('/')}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
