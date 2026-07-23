import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBudgets, upsertBudget, deleteBudget } from './api'

export const budgetsKeys = {
  all: ['budgets'] as const,
}

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useBudgets() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase.channel(`budgets-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, () => {
        queryClient.invalidateQueries({ queryKey: budgetsKeys.all })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: budgetsKeys.all,
    queryFn: getBudgets,
  })
}

export function useUpsertBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all })
    },
  })
}
