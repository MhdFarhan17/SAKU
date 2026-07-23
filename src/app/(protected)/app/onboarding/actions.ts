'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeOnboarding(formData: FormData) {
  const accountName = formData.get('accountName') as string
  const accountType = formData.get('accountType') as string
  const startingBalanceStr = formData.get('startingBalance') as string

  const startingBalanceMinor = parseInt(startingBalanceStr.replace(/\D/g, ''), 10) || 0

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // 1. Create the first account
  const { error: accountError } = await (supabase.from('accounts') as any)
    .insert({
      user_id: user.id,
      name: accountName,
      type: accountType,
      currency: 'IDR',
      starting_balance_minor: startingBalanceMinor,
    })

  if (accountError) {
    return { error: 'Failed to create account: ' + accountError.message }
  }

  // 2. Mark onboarding as complete
  const { error: settingsError } = await (supabase.from('settings') as any)
    .update({ onboarding_complete: true })
    .eq('user_id', user.id)

  if (settingsError) {
    return { error: 'Failed to update settings: ' + settingsError.message }
  }

  // 3. Return success
  return { success: true }
}
