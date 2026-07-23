import { create } from 'zustand'

interface RecurringSheetState {
  isOpen: boolean
  billId?: string
  openSheet: (billId?: string) => void
  closeSheet: () => void
}

export const useRecurringSheet = create<RecurringSheetState>((set) => ({
  isOpen: false,
  billId: undefined,
  openSheet: (billId) => set({ isOpen: true, billId }),
  closeSheet: () => set({ isOpen: false, billId: undefined }),
}))
