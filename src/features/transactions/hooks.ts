import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTransactions, createTransaction, deleteTransaction, updateTransaction } from './api'

export const transactionsKeys = {
  all: ['transactions'] as const,
}

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useTransactions() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase.channel(`transactions-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        // Invalidate queries when any change happens to transactions
        queryClient.invalidateQueries({ queryKey: transactionsKeys.all })
        queryClient.invalidateQueries({ queryKey: ['accounts'] }) // Also refresh accounts to update balances
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: transactionsKeys.all,
    queryFn: getTransactions,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all })
      // Invalidating accounts to refresh balances
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
