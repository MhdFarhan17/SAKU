import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'

export default async function AppDashboardRoot() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.display_name || 'Pengguna'

  // 1. Fetch Total Balance (sum of all account balances)
  const { data: balances } = await (supabase.from('account_balances').select('balance_minor') as any)
  const totalBalance = balances?.reduce((sum: number, b: any) => sum + b.balance_minor, 0) || 0

  // 2. Fetch Cashflow this month
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

  const { data: monthTx } = await (supabase
    .from('transactions')
    .select('kind, amount_minor')
    .gte('date', firstDay)
    .lte('date', lastDay) as any)

  const incomeThisMonth = monthTx?.filter((t: any) => t.kind === 'income').reduce((s: number, t: any) => s + t.amount_minor, 0) || 0
  const expenseThisMonth = monthTx?.filter((t: any) => t.kind === 'expense').reduce((s: number, t: any) => s + t.amount_minor, 0) || 0

  // 3. Fetch Recent Transactions
  const { data: recentTx } = await (supabase
    .from('transactions')
    .select(`
      id, kind, amount_minor, date, note, created_at,
      categories ( name, icon, color ),
      accounts!account_id ( name )
    `)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5) as any)

  return (
    <DashboardClient 
      displayName={displayName}
      totalBalance={totalBalance}
      recentTx={recentTx || []}
    />
  )
}
