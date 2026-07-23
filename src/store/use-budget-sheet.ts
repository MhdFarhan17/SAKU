import { create } from 'zustand'

interface BudgetSheetState {
  isOpen: boolean
  categoryId?: string
  currentAmountMinor?: number
  openSheet: (categoryId: string, currentAmountMinor?: number) => void
  closeSheet: () => void
}

export const useBudgetSheet = create<BudgetSheetState>((set) => ({
  isOpen: false,
  categoryId: undefined,
  currentAmountMinor: undefined,
  openSheet: (categoryId, currentAmountMinor) => set({ isOpen: true, categoryId, currentAmountMinor }),
  closeSheet: () => set({ isOpen: false, categoryId: undefined, currentAmountMinor: undefined }),
}))
