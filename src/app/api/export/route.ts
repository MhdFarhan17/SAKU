import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Fetch all transactions for this user
  const { data: tx, error: exportError } = await supabase

  if (exportError) {
    return NextResponse.json({ error: exportError.message }, { status: 500 })
  }

  // Generate CSV
  const header = ['ID', 'Date', 'Type', 'Amount', 'Account', 'Category', 'Note', 'Created At']
  const rows = tx?.map((t: any) => [
    t.id,
    t.date,
    t.kind,
    t.amount_minor,
    t.account_id,
    t.category_id || '',
    `"${(t.note || '').replace(/"/g, '""')}"`, // escape quotes for CSV
    t.created_at
  ])

  const csv = [
    header.join(','),
    ...(rows?.map((r: any[]) => r.join(',')) || [])
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="saku-export-${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}
