'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Plus, Target, Calendar, Minus, Trash2 } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { useSavingsGoals, useCreateSavingsGoal, useAddSavingsTransaction } from '@/features/goals/hooks'
import { formatDistanceToNow } from 'date-fns'
import { id, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

export default function GoalsPage() {
  const { t } = useTranslation()
  const { data: goals, isLoading } = useSavingsGoals()
  
  const [showAddForm, setShowAddForm] = useState(false)

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6 pb-24">
        <div className="h-10 w-48 bg-surface animate-pulse rounded-[12px]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-surface animate-pulse rounded-[24px]"></div>
          <div className="h-48 bg-surface animate-pulse rounded-[24px]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" /> {t('goals.title', 'Target Tabungan')}
          </h1>
          <p className="text-text-muted font-medium mt-1">{t('goals.desc', 'Capai impian finansial Anda satu per satu.')}</p>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(true)}
          className="rounded-[16px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-bold hidden md:flex h-11"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('goals.new_goal', 'Target Baru')}
        </Button>
      </div>

      {showAddForm && (
        <AddGoalForm onClose={() => setShowAddForm(false)} />
      )}

      {goals && goals.length === 0 && !showAddForm && (
        <div className="text-center py-20 bg-surface rounded-[24px] border border-border border-dashed">
          <Target className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-text-main">{t('goals.empty_title', 'Belum Ada Target')}</h3>
          <p className="text-text-muted mb-6 mt-2">{t('goals.empty_desc', 'Mulai wujudkan impian Anda dengan menabung secara konsisten.')}</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-brand text-text-main font-bold px-6 py-3 rounded-[16px] hover:bg-brand/90 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" /> {t('goals.create_first_goal', 'Buat Target Pertama')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals?.map((goal: any) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Mobile FAB */}
      {goals && goals.length > 0 && !showAddForm && (
        <Button 
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-24 right-6 h-14 px-5 rounded-full shadow-lg md:hidden bg-brand text-[#0e0f0c] hover:bg-brand/90 z-[90] font-bold flex items-center gap-2"
        >
          <Plus className="w-6 h-6 shrink-0" />
          {t('goals.savings', 'Tabungan')}
        </Button>
      )}
    </div>
  )
}

function GoalCard({ goal }: { goal: any }) {
  const { t, i18n } = useTranslation()
  const percentage = Math.min(100, (goal.current_amount_minor / goal.target_amount_minor) * 100)
  const [showTransactionForm, setShowTransactionForm] = useState<'deposit' | 'withdraw' | null>(null)
  
  return (
    <Card className="bg-surface border-none rounded-[24px] shadow-sm relative overflow-hidden">
      {percentage >= 100 && (
        <div className="absolute inset-0 bg-green-500/5 pointer-events-none z-0" />
      )}
      <CardContent className="p-6 relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl shadow-sm border border-border" style={{ backgroundColor: `${goal.color}15` }}>
              {goal.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-text-main">{goal.name}</h3>
              {goal.target_date && (
                <p className="text-xs font-medium text-text-muted flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" /> 
                  {t('goals.target_label', 'Target:')} {new Date(goal.target_date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { month: 'short', year: 'numeric' })}
                  <span className="ml-1 opacity-70">
                    ({formatDistanceToNow(new Date(goal.target_date), { locale: i18n.language === 'en' ? enUS : id, addSuffix: true })})
                  </span>
                </p>
              )}
            </div>
          </div>
          
          {percentage >= 100 && (
            <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-[8px] flex items-center gap-1">
              <Trophy className="w-3 h-3" /> {t('goals.achieved', 'Tercapai')}
            </div>
          )}
        </div>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{t('goals.collected', 'Terkumpul')}</p>
              <p className="font-black text-xl text-text-main leading-none">{formatMoney(goal.current_amount_minor, 'IDR', 'id-ID')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{t('goals.target_amount_label', 'Target')}</p>
              <p className="font-bold text-sm text-text-main leading-none">{formatMoney(goal.target_amount_minor, 'IDR', 'id-ID')}</p>
            </div>
          </div>
          
          <div className="h-3 w-full bg-surface-subtle rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: percentage >= 100 ? '#22c55e' : (goal.color || '#9fe870')
              }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-bold text-text-muted">{percentage.toFixed(1)}%</p>
            <p className="text-xs font-medium text-text-muted">
              {t('goals.remaining', 'Sisa')} {formatMoney(Math.max(0, goal.target_amount_minor - goal.current_amount_minor), 'IDR', 'id-ID')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {!showTransactionForm ? (
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border/50">
            <button 
              onClick={() => setShowTransactionForm('deposit')}
              className="flex-1 bg-surface-subtle hover:bg-[#9fe870]/20 text-text-main font-bold py-2 rounded-[12px] transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> {t('goals.deposit', 'Nabung')}
            </button>
            <button 
              onClick={() => setShowTransactionForm('withdraw')}
              disabled={goal.current_amount_minor === 0}
              className="flex-1 bg-surface-subtle hover:bg-red-500/10 hover:text-red-500 text-text-main disabled:opacity-50 disabled:hover:bg-surface-subtle disabled:hover:scale-100 disabled:cursor-not-allowed font-bold py-2 rounded-[12px] transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Minus className="w-4 h-4" /> {t('goals.withdraw', 'Tarik')}
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-border/50">
            <TransactionForm goal={goal} kind={showTransactionForm} onClose={() => setShowTransactionForm(null)} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TransactionForm({ goal, kind, onClose }: { goal: any, kind: 'deposit' | 'withdraw', onClose: () => void }) {
  const { t } = useTranslation()
  const [amountStr, setAmountStr] = useState('')
  const { mutate: addTx, isPending } = useAddSavingsTransaction()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(amountStr.replace(/\D/g, '')) || 0
    if (amount <= 0) return
    
    addTx({
      goal_id: goal.id,
      amount_minor: amount,
      kind,
      date: new Date().toISOString().split('T')[0]
    }, {
      onSuccess: () => {
        onClose()
        setAmountStr('')
      }
    })
  }

  const formatInput = (val: string) => {
    const num = parseInt(val.replace(/\D/g, '')) || 0
    return num === 0 ? '' : num.toLocaleString('id-ID')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm font-bold text-text-main mb-2 flex items-center gap-2">
        {kind === 'deposit' ? <Plus className="w-4 h-4 text-green-500" /> : <Minus className="w-4 h-4 text-red-500" />}
        {kind === 'deposit' ? t('goals.add_savings', 'Tambah Tabungan') : t('goals.withdraw_savings', 'Tarik Tabungan')}
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">Rp</span>
          <input
            type="text"
            required
            autoFocus
            value={amountStr}
            onChange={e => setAmountStr(formatInput(e.target.value))}
            className="w-full h-10 pl-9 pr-3 rounded-[12px] border border-border bg-surface text-sm font-black focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="0"
          />
        </div>
        <button 
          type="button" 
          onClick={onClose}
          className="px-4 h-10 rounded-[12px] border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {t('goals.cancel', 'Batal')}
        </button>
        <button 
          type="submit" 
          disabled={isPending || !amountStr}
          className="px-4 h-10 rounded-[12px] bg-brand text-text-main font-bold text-sm hover:bg-brand/90 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
        >
          {isPending ? '...' : t('goals.save', 'Simpan')}
        </button>
      </div>
    </form>
  )
}

function AddGoalForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const { mutate: createGoal, isPending } = useCreateSavingsGoal()
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [icon, setIcon] = useState('🏖️')
  const [color, setColor] = useState('#3b82f6')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(targetAmount.replace(/\D/g, '')) || 0
    if (amount <= 0 || !name) return
    
    createGoal({
      name,
      target_amount_minor: amount,
      target_date: targetDate || null,
      icon,
      color
    }, {
      onSuccess: onClose
    })
  }

  const formatInput = (val: string) => {
    const num = parseInt(val.replace(/\D/g, '')) || 0
    return num === 0 ? '' : num.toLocaleString('id-ID')
  }

  const emojiList = ['🏖️', '🏠', '🚗', '💻', '🎓', '💍', '👶', '📱', '🎮', '🏍️']
  const colorList = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']

  return (
    <Card className="bg-surface border-2 border-brand/20 rounded-[24px] shadow-sm mb-8 overflow-hidden">
      <div className="bg-brand/10 p-4 border-b border-brand/20 flex items-center justify-between">
        <h3 className="font-black text-lg text-text-main flex items-center gap-2">
          <Target className="w-5 h-5 text-brand" /> {t('goals.new_goal', 'Buat Target Baru')}
        </h3>
        <button onClick={onClose} className="text-text-muted hover:text-text-main font-bold text-sm">{t('goals.close', 'Tutup')}</button>
      </div>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('goals.goal_name_label', 'Nama Impian')}</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('goals.goal_name_placeholder', 'Mis: Beli MacBook Pro')}
                className="w-full h-11 px-4 rounded-[12px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-brand font-bold"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('goals.target_money_label', 'Target Uang')}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">Rp</span>
                <input 
                  type="text" 
                  required
                  value={targetAmount}
                  onChange={e => setTargetAmount(formatInput(e.target.value))}
                  placeholder="25.000.000"
                  className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-brand font-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('goals.deadline_label', 'Tenggat Waktu (Opsional)')}</label>
              <input 
                type="date" 
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full h-11 px-4 rounded-[12px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-brand font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('goals.icon_label', 'Ikon')}</label>
              <div className="flex flex-wrap gap-2">
                {emojiList.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setIcon(e)}
                    className={`w-10 h-10 rounded-[12px] text-xl flex items-center justify-center transition-all ${icon === e ? 'bg-surface border-2 border-brand shadow-sm scale-110' : 'bg-surface-subtle hover:bg-surface border border-transparent'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50 mt-4 pt-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('goals.color_label', 'Warna Tema')}</label>
            <div className="flex flex-wrap gap-3">
              {colorList.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-[14px] transition-all flex items-center justify-center ${color === c ? 'scale-110 ring-4 ring-offset-2 ring-brand shadow-md' : 'opacity-80 hover:opacity-100 hover:scale-105 shadow-sm'}`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="border border-red-500/20 text-red-500 font-black px-8 py-3 rounded-[16px] hover:bg-red-500/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
            >
              {t('goals.cancel', 'Batal')}
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-brand text-text-main font-black px-8 py-3 rounded-[16px] hover:bg-brand/90 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isPending ? t('goals.saving_progress', 'Menyimpan...') : t('goals.save_goal', 'Simpan Target')}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
