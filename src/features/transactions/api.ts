import { createClient } from '@/lib/supabase/client'
import { Database } from '@/db/types'

export type Transaction = Database['public']['Tables']['transactions']['Row']

export type TransactionWithRelations = Transaction & {
  categories?: { name: string; color?: string | null; icon?: string | null } | null;
  accounts?: { name: string; color?: string | null; icon?: string | null; type?: string | null } | null;
}

export async function getTransactions(): Promise<TransactionWithRelations[]> {
  const supabase = createClient()
  
  const { data, error } = await (supabase
    .from('transactions')
    .select(`
      *,
      categories ( name, color, icon ),
      accounts!account_id ( name, color, icon, type )
    `)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false }) as any)
    
  if (error) throw error
  return data
}

export async function createTransaction(
  transaction: Omit<Database['public']['Tables']['transactions']['Insert'], 'user_id'>
) {
  const supabase = createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')

  const { data, error } = await (supabase.from('transactions') as any)
    .insert({ ...transaction, user_id: user.user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTransaction(id: string) {
  const supabase = createClient()

  const { error } = await (supabase.from('transactions') as any)
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateTransaction({ id, ...transaction }: Partial<Database['public']['Tables']['transactions']['Update']> & { id: string }) {
  const supabase = createClient()
  
  const { data, error } = await (supabase.from('transactions') as any)
    .update(transaction)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
