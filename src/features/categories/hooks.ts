import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory, updateCategory, deleteCategory, seedDefaultCategories } from './api'

export const categoriesKeys = {
  all: ['categories'] as const,
}

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useCategories() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase.channel(`categories-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: categoriesKeys.all,
    queryFn: getCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, category }: { id: string, category: Parameters<typeof updateCategory>[1] }) => updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })
}

export function useSeedCategories() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: seedDefaultCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })
}
