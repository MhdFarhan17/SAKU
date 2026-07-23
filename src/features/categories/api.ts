import { createClient } from '@/lib/supabase/client'
import { Database } from '@/db/types'

export type Category = Database['public']['Tables']['categories']['Row']

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()
  
  const { data, error } = await (supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true }) as any)
    
  if (error) throw error
  return data
}

export async function createCategory(
  category: Omit<Database['public']['Tables']['categories']['Insert'], 'user_id'>
) {
  const supabase = createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')

  const { data, error } = await (supabase.from('categories') as any)
    .insert({ ...category, user_id: user.user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCategory(
  id: string,
  category: Partial<Omit<Database['public']['Tables']['categories']['Update'], 'id' | 'user_id'>>
) {
  const supabase = createClient()
  
  const { data, error } = await (supabase.from('categories') as any)
    .update(category)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: string) {
  const supabase = createClient()
  
  const { error } = await (supabase.from('categories') as any)
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export async function seedDefaultCategories() {
  const supabase = createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')

  const defaultCategories = [
    { name: 'Makanan & Minuman', kind: 'expense', color: '#f87171', icon: '🍔' },
    { name: 'Transportasi', kind: 'expense', color: '#fb923c', icon: '🚗' },
    { name: 'Belanja', kind: 'expense', color: '#facc15', icon: '🛍️' },
    { name: 'Tagihan', kind: 'expense', color: '#a3e635', icon: '🧾' },
    { name: 'Hiburan', kind: 'expense', color: '#34d399', icon: '🎮' },
    { name: 'Gaji', kind: 'income', color: '#4ade80', icon: '💰' },
    { name: 'Investasi', kind: 'income', color: '#60a5fa', icon: '📈' },
    { name: 'Bonus', kind: 'income', color: '#c084fc', icon: '🎁' },
  ]

  const categoriesToInsert = defaultCategories.map(cat => ({
    ...cat,
    user_id: user.user.id
  }))

  const { data, error } = await (supabase.from('categories') as any)
    .insert(categoriesToInsert)
    .select()

  if (error) throw error
  return data
}
