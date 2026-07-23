'use client'

import { useCategories } from '@/features/categories/hooks'
import { useBudgets } from '@/features/budgets/hooks'
import { useTransactions } from '@/features/transactions/hooks'
import { useBudgetSheet } from '@/store/use-budget-sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Target, AlertCircle, Plus } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function BudgetsPage() {
  const { t, i18n } = useTranslation()
  const { data: categories, isLoading: isCatLoading } = useCategories()
  const { data: budgets, isLoading: isBudLoading } = useBudgets()
  const { data: transactions, isLoading: isTxLoading } = useTransactions()
  const openSheet = useBudgetSheet(s => s.openSheet)

  const isLoading = isCatLoading || isBudLoading || isTxLoading

  if (isLoading) {
    return <div className="p-6 font-medium animate-pulse">{t('budgets.loading', 'Memuat data anggaran...')}</div>
  }

  const now = new Date()
  const currentMonthPrefix = now.toISOString().substring(0, 7) // YYYY-MM
  const currentMonthName = now.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { month: 'long', year: 'numeric' })

  // 1. Get current month expenses
  const currentMonthExpenses = transactions?.filter(t => 
    t.kind === 'expense' && t.date.startsWith(currentMonthPrefix)
  ) || []

  // 2. Compute spent per category
  const spentPerCategory: Record<string, number> = {}
  currentMonthExpenses.forEach(t => {
    if (t.category_id) {
      if (!spentPerCategory[t.category_id]) spentPerCategory[t.category_id] = 0
      spentPerCategory[t.category_id] += t.amount_minor
    }
  })

  // 3. Get expense categories
  const expenseCategories = categories?.filter(c => c.kind === 'expense') || []

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">{t('budgets.title', 'Anggaran')}</h1>
          <p className="text-text-muted font-medium mt-1">{t('budgets.desc', 'Kelola batas pengeluaran bulan {{month}}.', { month: currentMonthName })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenseCategories.map(cat => {
          const budget = budgets?.find(b => b.category_id === cat.id && b.start_month === currentMonthPrefix)
          const spent = spentPerCategory[cat.id] || 0
          const budgetAmount = budget?.amount_minor || 0
          
          let percentage = 0
          if (budgetAmount > 0) {
            percentage = Math.min((spent / budgetAmount) * 100, 100)
          }

          const isOverbudget = spent > budgetAmount && budgetAmount > 0
          const isWarning = percentage >= 80 && !isOverbudget
          const isSafe = percentage < 80 && budgetAmount > 0

          let progressColor = 'bg-slate-200'
          if (isOverbudget) progressColor = 'bg-red-500'
          else if (isWarning) progressColor = 'bg-yellow-500'
          else if (isSafe) progressColor = 'bg-green-500'

          return (
            <Card 
              key={cat.id} 
              onClick={() => openSheet(cat.id, budgetAmount > 0 ? budgetAmount : undefined)}
              className="border border-border/50 rounded-[24px] shadow-sm bg-surface overflow-hidden hover:border-brand transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center text-white font-bold text-2xl shadow-sm"
                      style={{ backgroundColor: cat.color || '#cbd5e1' }}
                    >
                      {(cat as any).icon || cat.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-lg leading-tight">{cat.name}</h3>
                      <p className="text-xs font-medium text-text-muted mt-0.5">
                        {budgetAmount > 0 ? t('budgets.limit', 'Batas: {{amount}}', { amount: formatMoney(budgetAmount, 'IDR', 'id-ID') }) : t('budgets.not_set', 'Belum diatur')}
                      </p>
                    </div>
                  </div>
                  {budgetAmount === 0 && (
                    <Button variant="ghost" size="icon" className="rounded-full bg-surface-subtle hover:bg-surface text-text-muted">
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  {isOverbudget && (
                    <div className="text-red-500 bg-red-500/10 p-2 rounded-full">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {budgetAmount > 0 ? (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span className={isOverbudget ? 'text-red-600' : 'text-text-main'}>
                        {formatMoney(spent, 'IDR', 'id-ID')}
                      </span>
                      <span className="text-text-muted text-xs font-medium mt-0.5">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-subtle rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {isOverbudget && (
                      <p className="text-xs font-bold text-red-500">
                        {t('budgets.over_limit', 'Melebihi batas sebesar {{amount}}', { amount: formatMoney(spent - budgetAmount, 'IDR', 'id-ID') })}
                      </p>
                    )}
                    {isWarning && (
                      <p className="text-xs font-bold text-yellow-600">
                        {t('budgets.warning', 'Hati-hati, sudah mendekati batas!')}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 text-sm font-medium text-text-muted flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t('budgets.click_to_set', 'Klik untuk mengatur anggaran')}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
