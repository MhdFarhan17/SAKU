import { createClient } from '@/lib/supabase/client'
import { Database } from '@/db/types'

export type Budget = Database['public']['Tables']['budgets']['Row']

export async function getBudgets(): Promise<Budget[]> {
  const supabase = createClient()
  
  const { data, error } = await (supabase
    .from('budgets')
    .select('*') as any)
    
  if (error) throw error
  return data
}

export async function upsertBudget({
  category_id,
  amount_minor,
  start_month,
  period = 'monthly'
}: {
  category_id: string
  amount_minor: number
  start_month: string
  period?: string
}) {
  const supabase = createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')

  const { data: existing } = await (supabase
    .from('budgets')
    .select('id')
    .eq('category_id', category_id)
    .eq('start_month', start_month)
    .maybeSingle() as any)

  if (existing) {
    const { data, error } = await (supabase.from('budgets') as any)
      .update({ amount_minor, period })
      .eq('id', existing.id)
      .select()
      .single()
      
    if (error) throw error
    return data
  } else {
    const { data, error } = await (supabase.from('budgets') as any)
      .insert({
        user_id: user.user.id,
        category_id,
        amount_minor,
        start_month,
        period,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function deleteBudget(id: string) {
  const supabase = createClient()

  const { error } = await (supabase.from('budgets') as any)
    .delete()
    .eq('id', id)

  if (error) throw error
}
