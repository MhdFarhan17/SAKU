import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAccounts, createAccount, updateAccount, deleteAccount } from './api'

export const accountsKeys = {
  all: ['accounts'] as const,
}

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAccounts() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase.channel(`accounts-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts' }, () => {
        queryClient.invalidateQueries({ queryKey: accountsKeys.all })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: accountsKeys.all,
    queryFn: getAccounts,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.all })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, account }: { id: string, account: any }) => updateAccount(id, account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.all })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.all })
    },
  })
}
