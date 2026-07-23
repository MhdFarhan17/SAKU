import { createClient } from '@/lib/supabase/client'
import { Database } from '@/db/types'

export type Account = Database['public']['Tables']['accounts']['Row']
export type AccountBalance = Database['public']['Views']['account_balances']['Row']

export type AccountWithBalance = Account & {
  balance_minor: number
}

export async function getAccounts(): Promise<AccountWithBalance[]> {
  const supabase = createClient()
  
  // We need to fetch accounts and their balances
  const { data: accounts, error: accountsError } = await (supabase
    .from('accounts')
    .select('*')
    .order('sort_order', { ascending: true }) as any)
    
  if (accountsError) throw accountsError

  const { data: balances, error: balancesError } = await (supabase
    .from('account_balances')
    .select('*') as any)

  if (balancesError) throw balancesError

  return accounts.map((account: any) => {
    const balance = balances.find((b: any) => b.account_id === account.id)
    return {
      ...account,
      balance_minor: balance?.balance_minor ?? account.starting_balance_minor,
    }
  })
}

export async function createAccount(
  account: Omit<Database['public']['Tables']['accounts']['Insert'], 'user_id'>
) {
  const supabase = createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')

  const { data, error } = await (supabase.from('accounts') as any)
    .insert({ ...account, user_id: user.user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAccount(
  id: string,
  account: Partial<Omit<Database['public']['Tables']['accounts']['Update'], 'id' | 'user_id'>>
) {
  const supabase = createClient()
  
  const { data, error } = await (supabase.from('accounts') as any)
    .update(account)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAccount(id: string) {
  const supabase = createClient()
  
  // 1. Delete all transactions involving this account (cascade)
  const { error: txError } = await (supabase.from('transactions') as any)
    .delete()
    .or(`account_id.eq.${id},to_account_id.eq.${id}`)

  if (txError) throw txError

  // 2. Delete the account itself
  const { error } = await (supabase.from('accounts') as any)
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
