import Link from 'next/link'
import Image from 'next/image'
import { Wallet, LayoutDashboard, Settings, ArrowLeftRight, LogOut, Target, Repeat, TrendingUp, Trophy, Users } from 'lucide-react'
import { GlobalTransactionSheet } from '@/components/transaction-sheet'
import { GlobalBudgetSheet } from '@/components/budget-sheet'
import { GlobalRecurringSheet } from '@/components/recurring-sheet'
import { AddTransactionFab } from '@/components/add-transaction-fab'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { DashboardSidebar, MobileNavigation } from '@/components/dashboard-navigation'

import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dasbor',
  description: 'Dasbor pengelolaan keuangan pribadi Anda di SAKU.',
}
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.display_name || 'Pengguna'

  // Check Onboarding Status
  const { data: settings } = await (supabase
    .from('settings')
    .select('onboarding_complete')
    .eq('user_id', user?.id || '')
    .single() as any)
  
  // Protect onboarding redirect loop
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isOnboardingPage = pathname.startsWith('/app/onboarding')

  if (settings && !settings.onboarding_complete && !isOnboardingPage) {
    redirect('/app/onboarding')
  }

  // If on onboarding page, hide sidebar
  if (isOnboardingPage) {
    return <>{children}</>
  }

  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen bg-canvas flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DashboardSidebar 
        userInitial={userInitial} 
        displayName={displayName} 
        email={user?.email || 'user@example.com'} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-canvas pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <MobileNavigation />

      <GlobalTransactionSheet />
      <GlobalBudgetSheet />
      <GlobalRecurringSheet />
      <AddTransactionFab />
    </div>
  )
}
