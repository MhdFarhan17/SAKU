'use client'

import { useBudgetSheet } from '@/store/use-budget-sheet'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpsertBudget, useDeleteBudget, useBudgets } from '@/features/budgets/hooks'
import { useCategories } from '@/features/categories/hooks'
import { getTranslatedCategoryName } from '@/features/categories/utils'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function GlobalBudgetSheet() {
  const { t } = useTranslation()
  const { isOpen, closeSheet, categoryId, currentAmountMinor } = useBudgetSheet()
  const { mutateAsync: upsertBudget } = useUpsertBudget()
  const { mutateAsync: deleteBudget } = useDeleteBudget()
  const { data: categories } = useCategories()
  const { data: budgets } = useBudgets()

  const [amountStr, setAmountStr] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (currentAmountMinor) {
          setAmountStr(currentAmountMinor.toLocaleString('id-ID'))
        } else {
          setAmountStr('')
        }
      }, 0)
    }
  }, [isOpen, currentAmountMinor])

  const category = categories?.find(c => c.id === categoryId)
  
  const now = new Date()
  const currentMonthPrefix = now.toISOString().substring(0, 7) // YYYY-MM

  const existingBudget = budgets?.find(b => b.category_id === categoryId && b.start_month === currentMonthPrefix)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, '')
    setAmountStr(num ? parseInt(num, 10).toLocaleString('id-ID') : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amountStr || !categoryId) return

    setIsSubmitting(true)
    try {
      const amountMinor = parseInt(amountStr.replace(/\D/g, ''), 10)
      
      await upsertBudget({
        category_id: categoryId,
        amount_minor: amountMinor,
        start_month: currentMonthPrefix,
      })
      
      closeSheet()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!existingBudget || !confirm(t('budgets.delete_confirm', 'Hapus batas anggaran untuk kategori ini?'))) return
    
    setIsSubmitting(true)
    try {
      await deleteBudget(existingBudget.id)
      closeSheet()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent side="bottom" className="max-h-[96vh] h-auto sm:max-w-md mx-auto rounded-t-[24px] sm:rounded-[24px] sm:mb-8 z-[100] flex flex-col">
        <SheetHeader className="mb-6 pt-2 sm:pt-0">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-border/80 mb-4 sm:hidden" />
          <SheetTitle className="text-2xl font-black">{t('budgets.set_budget', 'Atur Anggaran')}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full flex-1">
          <div className="space-y-4 flex-1">
            {category && (
              <div className="flex items-center gap-3 p-4 bg-surface-subtle rounded-[16px]">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: category.color || '#cbd5e1' }}
                >
                  {category.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-text-main">{getTranslatedCategoryName(category.name, t)}</div>
                  <div className="text-xs text-text-muted font-medium">{t('budgets.monthly_limit', 'Batas pengeluaran bulanan')}</div>
                </div>
              </div>
            )}

            <div className="space-y-2 mt-6">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('budgets.budget_limit_label', 'Batas Anggaran')} (Rp)</label>
              <Input 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                value={amountStr}
                onChange={handleAmountChange}
                className="text-3xl h-16 font-mono font-black rounded-[16px]"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            {existingBudget && (
              <Button type="button" variant="outline" size="lg" className="rounded-[12px] font-black border-red-500/20 text-red-500 hover:bg-red-500/10" disabled={isSubmitting} onClick={handleDelete}>
                {t('budgets.delete', 'Hapus')}
              </Button>
            )}
            <Button type="submit" size="lg" className="w-full rounded-[12px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-black" disabled={isSubmitting}>
              {isSubmitting ? t('budgets.saving', 'Menyimpan...') : t('budgets.save_budget', 'Simpan Anggaran')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
