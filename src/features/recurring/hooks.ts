import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecurringBills, createRecurringBill, updateRecurringBill, deleteRecurringBill } from './api'

export const recurringKeys = {
  all: ['recurring_bills'] as const,
}

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRecurringBills() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase.channel(`recurring-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recurring_bills' }, () => {
        queryClient.invalidateQueries({ queryKey: recurringKeys.all })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: recurringKeys.all,
    queryFn: getRecurringBills,
  })
}

export function useCreateRecurringBill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRecurringBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.all })
    },
  })
}

export function useUpdateRecurringBill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Parameters<typeof updateRecurringBill>[1] }) => 
      updateRecurringBill(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.all })
    },
  })
}

export function useDeleteRecurringBill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRecurringBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.all })
    },
  })
}
