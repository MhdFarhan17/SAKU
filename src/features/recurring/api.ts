import { createClient } from '@/lib/supabase/client'
import { Database } from '@/db/types'

export type RecurringBill = Database['public']['Tables']['recurring_bills']['Row'] & {
  categories?: { name: string, color: string | null, icon: string | null } | null
  accounts?: { name: string, color: string | null, icon: string | null } | null
}

export async function getRecurringBills(): Promise<RecurringBill[]> {
  const supabase = createClient()
  
  const { data, error } = await (supabase
    .from('recurring_bills')
    .select(`
      *,
      categories (name, color, icon),
      accounts (name, color, icon)
    `)
    .order('next_due_date', { ascending: true }) as any)
    
  if (error) throw error
  return data
}

export async function createRecurringBill(
  bill: Omit<Database['public']['Tables']['recurring_bills']['Insert'], 'user_id'>
) {
  const supabase = createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')

  const { data, error } = await (supabase
    .from('recurring_bills')
    .insert({
      ...bill,
      user_id: user.user.id,
    })
    .select()
    .single() as any)

  if (error) throw error
  return data
}

export async function updateRecurringBill(
  id: string,
  updates: Partial<Database['public']['Tables']['recurring_bills']['Update']>
) {
  const supabase = createClient()

  const { data, error } = await (supabase
    .from('recurring_bills')
    .update(updates)
    .eq('id', id)
    .select()
    .single() as any)

  if (error) throw error
  return data
}

export async function deleteRecurringBill(id: string) {
  const supabase = createClient()

  const { error } = await (supabase
    .from('recurring_bills')
    .delete()
    .eq('id', id) as any)

  if (error) throw error
}
