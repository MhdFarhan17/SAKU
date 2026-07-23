import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useSavingsGoals() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['savings_goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

export function useSavingsTransactions(goalId: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['savings_transactions', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_transactions')
        .select('*')
        .eq('goal_id', goalId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!goalId
  })
}

export function useCreateSavingsGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (goalData: any) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{ ...goalData, user_id: user.id }])
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings_goals'] })
    }
  })
}

export function useUpdateSavingsGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings_goals'] })
    }
  })
}

export function useAddSavingsTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (txData: { goal_id: string, amount_minor: number, kind: 'deposit' | 'withdraw', date: string }) => {
      // First insert the transaction
      const { data: tx, error: txError } = await supabase
        .from('savings_transactions')
        .insert([txData])
        .select()
        .single()
        
      if (txError) throw txError
      
      // Then get the current goal to update its balance
      const { data: goal } = await supabase
        .from('savings_goals')
        .select('current_amount_minor')
        .eq('id', txData.goal_id)
        .single()
        
      if (goal) {
        let newBalance = goal.current_amount_minor
        if (txData.kind === 'deposit') newBalance += txData.amount_minor
        if (txData.kind === 'withdraw') newBalance -= txData.amount_minor
        
        await supabase
          .from('savings_goals')
          .update({ current_amount_minor: Math.max(0, newBalance) })
          .eq('id', txData.goal_id)
      }
      
      return tx
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['savings_transactions', variables.goal_id] })
      queryClient.invalidateQueries({ queryKey: ['savings_goals'] })
    }
  })
}
