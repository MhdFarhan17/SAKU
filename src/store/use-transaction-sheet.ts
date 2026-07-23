import { create } from 'zustand'

export type TransactionType = 'income' | 'expense' | 'transfer'

interface TransactionSheetState {
  isOpen: boolean
  defaultType: TransactionType
  transactionId?: string // if editing
  openSheet: (type?: TransactionType, id?: string) => void
  closeSheet: () => void
}

export const useTransactionSheet = create<TransactionSheetState>((set) => ({
  isOpen: false,
  defaultType: 'expense',
  transactionId: undefined,
  openSheet: (type = 'expense', id) => set({ isOpen: true, defaultType: type, transactionId: id }),
  closeSheet: () => set({ isOpen: false, transactionId: undefined }),
}))
