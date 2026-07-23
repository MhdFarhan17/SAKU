'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Plus, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { useDebts, useCreateDebt, useUpdateDebtStatus } from '@/features/debts/hooks'
import { formatDistanceToNow, isPast } from 'date-fns'
import { id, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

export default function DebtsPage() {
  const { t, i18n } = useTranslation()
  const { data: debts, isLoading } = useDebts()
  const [activeTab, setActiveTab] = useState<'payable' | 'receivable'>('payable')
  const [showAddForm, setShowAddForm] = useState(false)

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6 pb-24">
        <div className="h-10 w-48 bg-surface animate-pulse rounded-[12px]"></div>
        <div className="h-14 w-full bg-surface animate-pulse rounded-[16px]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-surface animate-pulse rounded-[24px]"></div>
        </div>
      </div>
    )
  }

  const filteredDebts = debts?.filter((d: any) => d.kind === activeTab) || []
  const totalRemaining = filteredDebts.reduce((sum: number, d: any) => sum + (d.status === 'active' ? d.remaining_amount_minor : 0), 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" /> {t('debts.title', 'Hutang & Piutang')}
          </h1>
          <p className="text-text-muted font-medium mt-1">{t('debts.desc', 'Kelola janji finansial Anda dengan tenang.')}</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-brand text-text-main font-bold px-4 py-2.5 rounded-[16px] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" /> <span className="hidden sm:inline">{t('debts.add_new', 'Tambah Baru')}</span>
        </button>
      </div>

      <div className="flex bg-surface-subtle p-1.5 rounded-[20px]">
        <button
          onClick={() => setActiveTab('payable')}
          className={`flex-1 py-3 text-sm font-black rounded-[16px] transition-all duration-300 ${activeTab === 'payable' ? 'bg-surface shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
        >
          {t('debts.payable_tab', 'Hutang Saya (Payable)')}
        </button>
        <button
          onClick={() => setActiveTab('receivable')}
          className={`flex-1 py-3 text-sm font-black rounded-[16px] transition-all duration-300 ${activeTab === 'receivable' ? 'bg-surface shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
        >
          {t('debts.receivable_tab', 'Piutang Orang (Receivable)')}
        </button>
      </div>

      {showAddForm && (
        <AddDebtForm defaultKind={activeTab} onClose={() => setShowAddForm(false)} />
      )}

      <div className="bg-surface rounded-[24px] p-6 flex items-center justify-between shadow-sm border border-border/50">
        <div>
          <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">
            {activeTab === 'payable' ? t('debts.total_payable', 'Total Hutang Belum Dibayar') : t('debts.total_receivable', 'Total Piutang Belum Ditagih')}
          </p>
          <p className="font-black text-3xl text-text-main">{formatMoney(totalRemaining, 'IDR', 'id-ID')}</p>
        </div>
      </div>

      {filteredDebts.length === 0 && !showAddForm ? (
        <div className="text-center py-20 bg-surface rounded-[24px] border border-border border-dashed">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-text-main">{t('debts.empty_clean', 'Bersih!')}</h3>
          <p className="text-text-muted mb-6 mt-2">{activeTab === 'payable' ? t('debts.empty_payable', 'Tidak ada hutang yang tercatat saat ini.') : t('debts.empty_receivable', 'Tidak ada piutang yang tercatat saat ini.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDebts.map((debt: any) => (
            <DebtCard key={debt.id} debt={debt} />
          ))}
        </div>
      )}
    </div>
  )
}

function DebtCard({ debt }: { debt: any }) {
  const { t, i18n } = useTranslation()
  const percentage = Math.min(100, (debt.paid_amount_minor / debt.amount_minor) * 100)
  const isOverdue = debt.status === 'active' && debt.due_date && isPast(new Date(debt.due_date))
  const { mutate: updateStatus } = useUpdateDebtStatus()

  return (
    <Card className={`border-none rounded-[24px] shadow-sm relative overflow-hidden ${debt.status === 'paid' ? 'bg-surface-subtle opacity-70' : 'bg-surface'}`}>
      <CardContent className="p-6 relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-xl text-text-main">{debt.contact_name}</h3>
            {debt.due_date && (
              <p className={`text-xs font-bold flex items-center gap-1 mt-1 ${isOverdue ? 'text-red-500' : 'text-text-muted'}`}>
                {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                {t('debts.due_date', 'Jatuh Tempo:')} {new Date(debt.due_date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                <span className="ml-1 opacity-70">
                  ({formatDistanceToNow(new Date(debt.due_date), { locale: i18n.language === 'en' ? enUS : id, addSuffix: true })})
                </span>
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            {debt.status === 'paid' ? (
              <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-[8px] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t('debts.paid', 'Lunas')}
              </div>
            ) : (
              <button
                onClick={() => updateStatus({ id: debt.id, status: 'paid' })}
                className="bg-surface-subtle hover:bg-green-50 hover:text-green-600 text-text-muted text-xs font-bold px-3 py-1 rounded-[8px] transition-colors border border-border"
                title={t('debts.mark_paid_tooltip', 'Tandai sebagai Lunas')}
              >
                {t('debts.mark_paid', 'Tandai Lunas')}
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{t('debts.remaining_payment', 'Sisa Pembayaran')}</p>
              <p className="font-black text-2xl text-text-main leading-none">{formatMoney(debt.remaining_amount_minor, 'IDR', 'id-ID')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{debt.kind === 'payable' ? t('debts.total_debt', 'Total Hutang') : t('debts.total_credit', 'Total Piutang')}</p>
              <p className="font-bold text-sm text-text-main leading-none">{formatMoney(debt.amount_minor, 'IDR', 'id-ID')}</p>
            </div>
          </div>
          
          <div className="h-3 w-full bg-surface-subtle rounded-full overflow-hidden relative">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: debt.status === 'paid' ? '#22c55e' : (debt.kind === 'payable' ? '#ef4444' : '#3b82f6')
              }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-bold text-text-muted">{percentage.toFixed(1)}% Terbayar</p>
            <p className="text-xs font-medium text-text-muted">
              {formatMoney(debt.paid_amount_minor, 'IDR', 'id-ID')}
            </p>
          </div>
        </div>

        {debt.status === 'active' && (
          <div className="mt-5 pt-4 border-t border-border/50 text-center">
            <p className="text-xs font-bold text-text-muted leading-relaxed">
              {debt.kind === 'payable' ? t('debts.payment_instruction_payable', '*Untuk membayar hutang ini, catat Transaksi baru dan pilih hutang ini pada menu pilihan form.') : t('debts.payment_instruction_receivable', '*Untuk membayar cicilan piutang ini, catat Transaksi baru dan pilih piutang ini pada menu pilihan form.')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AddDebtForm({ defaultKind, onClose }: { defaultKind: 'payable' | 'receivable', onClose: () => void }) {
  const { t } = useTranslation()
  const { mutate: createDebt, isPending } = useCreateDebt()
  const [contactName, setContactName] = useState('')
  const [amountStr, setAmountStr] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [kind, setKind] = useState<'payable' | 'receivable'>(defaultKind)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(amountStr.replace(/\D/g, '')) || 0
    if (amount <= 0 || !contactName) return
    
    createDebt({
      contact_name: contactName,
      amount_minor: amount,
      due_date: dueDate || null,
      kind
    }, {
      onSuccess: onClose
    })
  }

  const formatInput = (val: string) => {
    const num = parseInt(val.replace(/\D/g, '')) || 0
    return num === 0 ? '' : num.toLocaleString('id-ID')
  }

  return (
    <Card className="bg-surface border-2 border-brand/20 rounded-[24px] shadow-sm mb-8 overflow-hidden">
      <div className="bg-brand/10 p-4 border-b border-brand/20 flex items-center justify-between">
        <h3 className="font-black text-lg text-text-main flex items-center gap-2">
          <Users className="w-5 h-5 text-brand" /> {kind === 'payable' ? t('debts.add_payable', 'Catat Hutang Baru') : t('debts.add_receivable', 'Catat Piutang Baru')}
        </h3>
      </div>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="flex bg-surface-subtle p-1 rounded-[16px] w-full md:w-1/2">
            <button
              type="button"
              onClick={() => setKind('payable')}
              className={`flex-1 py-2 text-sm font-bold rounded-[12px] transition-all ${kind === 'payable' ? 'bg-red-500 text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
            >
              {t('debts.i_owe', 'Saya Berhutang')}
            </button>
            <button
              type="button"
              onClick={() => setKind('receivable')}
              className={`flex-1 py-2 text-sm font-bold rounded-[12px] transition-all ${kind === 'receivable' ? 'bg-blue-500 text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
            >
              {t('debts.they_owe', 'Orang Berhutang')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('debts.contact_name', 'Nama Kontak')}</label>
              <input 
                type="text" 
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder={t('debts.contact_placeholder', 'Mis: Budi / Bank BCA')}
                className="w-full h-11 px-4 rounded-[12px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-brand font-bold"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('debts.total_amount', 'Nominal Total')}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">Rp</span>
                <input 
                  type="text" 
                  required
                  value={amountStr}
                  onChange={e => setAmountStr(formatInput(e.target.value))}
                  placeholder="1.000.000"
                  className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-brand font-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('debts.due_date_label', 'Jatuh Tempo (Opsional)')}</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full h-11 px-4 rounded-[12px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-brand font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/50 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="border border-red-500/20 text-red-500 font-black px-8 py-3 rounded-[16px] hover:bg-red-500/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
            >
              {t('debts.cancel', 'Batal')}
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-brand text-text-main font-black px-8 py-3 rounded-[16px] hover:bg-brand/90 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isPending ? t('debts.saving', 'Menyimpan...') : t('debts.save_data', 'Simpan Data')}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
