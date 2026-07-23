import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useDebts() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debts')
        .select(`
          *,
          transactions (
            id,
            amount_minor,
            date,
            kind
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Calculate remaining amount based on transactions
      // For 'payable' (I owe money): payments are 'expense' transactions
      // For 'receivable' (Someone owes me): payments are 'income' transactions
      return data.map((debt: any) => {
        let paidAmount = 0
        if (debt.transactions) {
          paidAmount = debt.transactions.reduce((sum: number, tx: any) => sum + tx.amount_minor, 0)
        }
        return {
          ...debt,
          paid_amount_minor: paidAmount,
          remaining_amount_minor: Math.max(0, debt.amount_minor - paidAmount),
          is_fully_paid: paidAmount >= debt.amount_minor || debt.status === 'paid'
        }
      })
    }
  })
}

export function useCreateDebt() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (debtData: any) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('debts')
        .insert([{ ...debtData, user_id: user.id }])
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    }
  })
}

export function useUpdateDebtStatus() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'active' | 'paid' }) => {
      const { data, error } = await supabase
        .from('debts')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    }
  })
}
