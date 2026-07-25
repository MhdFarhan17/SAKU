'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { normalizeIcon } from '@/lib/utils'
import { PieChart as PieChartIcon, BarChart3, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { useTransactions } from '@/features/transactions/hooks'
import { useTranslation } from 'react-i18next'
import { getTranslatedCategoryName } from '@/features/categories/utils'

const formatYAxis = (val: number) => {
  if (val >= 1000000000) return `Rp${val / 1000000000}M`
  if (val >= 1000000) return `Rp${val / 1000000}Jt`
  if (val >= 1000) return `Rp${val / 1000}rb`
  return `Rp${val}`
}

// TOOLTIP FOR RECHARTS
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface text-text-main p-3 rounded-[12px] shadow-xl border border-border text-sm z-50">
        <p className="font-bold mb-2">{label || payload[0].payload.name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color || entry.fill }} className="font-medium flex justify-between gap-4 mt-1">
            <span>{entry.name}:</span>
            <span>{formatMoney(entry.value, 'IDR', 'id-ID')}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DashboardCharts({ totalBalance }: { totalBalance?: number }) {
  const { t, i18n } = useTranslation()
  const { data: transactions, isLoading } = useTransactions()
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1) // 1-12
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly') // Category analysis scope

  // List of available years from data
  const availableYears = useMemo(() => {
    if (!transactions) return [new Date().getFullYear()]
    const years = new Set<number>()
    transactions.forEach(t => years.add(new Date(t.date).getFullYear()))
    if (years.size === 0) years.add(new Date().getFullYear())
    return Array.from(years).sort((a, b) => b - a)
  }, [transactions])

  const [barTimeFilter, setBarTimeFilter] = useState('1m')
  const [barCustomDays, setBarCustomDays] = useState('30')

  // --- 1. DYNAMIC CASHFLOW BAR CHART ---
  const dynamicBarData = useMemo(() => {
    if (!transactions) return []
    
    let barStartDate = new Date(0) // all time by default
    const now = new Date()
    
    if (barTimeFilter !== 'all') {
      barStartDate = new Date()
      barStartDate.setHours(0, 0, 0, 0)
      
      if (barTimeFilter === '1d') {
        // Today only
      } else if (barTimeFilter === '7d') {
        barStartDate.setDate(barStartDate.getDate() - 6) // -6 because today is 1st day
      } else if (barTimeFilter === '14d') {
        barStartDate.setDate(barStartDate.getDate() - 13)
      } else if (barTimeFilter === '1m') {
        barStartDate.setMonth(barStartDate.getMonth() - 1)
      } else if (barTimeFilter === '6m') {
        barStartDate.setMonth(barStartDate.getMonth() - 6)
      } else if (barTimeFilter === '1y') {
        barStartDate.setFullYear(barStartDate.getFullYear() - 1)
      } else if (barTimeFilter === 'custom') {
        barStartDate.setDate(barStartDate.getDate() - parseInt(barCustomDays || '0'))
      }
    }

    const filtered = transactions.filter(t => new Date(t.date) >= barStartDate)
    
    const isDaily = ['1d', '7d', '14d', '1m', 'custom'].includes(barTimeFilter) 
                    || (barTimeFilter === 'custom' && parseInt(barCustomDays) <= 31)

    const barDataMap: Record<string, { key: string, label: string, Pemasukan: number, Pengeluaran: number }> = {}

    // Pre-fill dates for continuous x-axis if it's daily
    if (isDaily && barTimeFilter !== 'all' && barTimeFilter !== 'custom') {
      const iterDate = new Date(barStartDate)
      while (iterDate <= now) {
        const key = iterDate.toISOString().split('T')[0]
        const label = iterDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        barDataMap[key] = { key, label, Pemasukan: 0, Pengeluaran: 0 }
        iterDate.setDate(iterDate.getDate() + 1)
      }
    } else if (!isDaily && barTimeFilter !== 'all' && barTimeFilter !== 'custom') {
      const iterDate = new Date(barStartDate)
      iterDate.setDate(1) // snap to 1st of month
      while (iterDate <= now) {
        const key = iterDate.toISOString().substring(0, 7)
        const label = iterDate.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
        barDataMap[key] = { key, label, Pemasukan: 0, Pengeluaran: 0 }
        iterDate.setMonth(iterDate.getMonth() + 1)
      }
    }

    filtered.forEach(t => {
      const d = new Date(t.date)
      const key = isDaily ? t.date : t.date.substring(0, 7) // YYYY-MM-DD or YYYY-MM
      const label = isDaily 
        ? d.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short' })
        : d.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { month: 'short', year: '2-digit' })

      if (!barDataMap[key]) {
        barDataMap[key] = { key, label, Pemasukan: 0, Pengeluaran: 0 }
      }
      
      if (t.kind === 'income') barDataMap[key].Pemasukan += t.amount_minor
      if (t.kind === 'expense') barDataMap[key].Pengeluaran += t.amount_minor
    })

    return Object.values(barDataMap).sort((a, b) => a.key.localeCompare(b.key))
  }, [transactions, barTimeFilter, barCustomDays])

  // --- 2. CATEGORY DOUGHNUT CHART ---
  const categoryData = useMemo(() => {
    if (!transactions) return []
    const expenseTotals: Record<string, { value: number, color: string, icon: string }> = {}
    
    transactions.forEach(tx => {
      if (tx.kind === 'expense') {
        const d = new Date(tx.date)
        const matchYear = d.getFullYear() === selectedYear
        const matchMonth = activeTab === 'monthly' ? (d.getMonth() + 1 === selectedMonth) : true

        if (matchYear && matchMonth) {
          const rawCatName = tx.categories?.name || 'Lain-lain'
          const catName = rawCatName === 'Lain-lain' ? t('transactions.other', 'Lainnya') : getTranslatedCategoryName(rawCatName, t)
          const color = tx.categories?.color || '#cbd5e1'
          const icon = normalizeIcon(tx.categories?.icon) || '🛒'
          if (!expenseTotals[catName]) expenseTotals[catName] = { value: 0, color, icon }
          expenseTotals[catName].value += tx.amount_minor
        }
      }
    })

    return Object.entries(expenseTotals)
      .map(([name, data]) => ({ name, value: data.value, color: data.color, icon: data.icon }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, selectedYear, selectedMonth, activeTab])

  // --- 3. SUMMARY STATS ---
  const summaryStats = useMemo(() => {
    let totalIncome = 0
    let totalExpense = 0
    if (!transactions) return { totalIncome, totalExpense, net: 0 }

    transactions.forEach(tx => {
      const d = new Date(tx.date)
      const matchYear = d.getFullYear() === selectedYear
      const matchMonth = activeTab === 'monthly' ? (d.getMonth() + 1 === selectedMonth) : true

      if (matchYear && matchMonth) {
        if (tx.kind === 'income') totalIncome += tx.amount_minor
        if (tx.kind === 'expense') totalExpense += tx.amount_minor
      }
    })

    return { totalIncome, totalExpense, net: totalIncome - totalExpense }
  }, [transactions, selectedYear, selectedMonth, activeTab])


  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-14 bg-surface rounded-[24px]"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-surface rounded-[24px]"></div>
          <div className="h-28 bg-surface rounded-[24px]"></div>
          <div className="h-28 bg-surface rounded-[24px]"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-96 lg:col-span-2 bg-surface rounded-[24px]"></div>
          <div className="h-96 lg:col-span-1 bg-surface rounded-[24px]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      
      {/* Total Saldo Card (Full Width) */}
      {totalBalance !== undefined && (
        <Card className="bg-surface border-border border rounded-[24px] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32 text-brand" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-text-muted">
              <Wallet className="w-5 h-5 text-brand" /> {t('dashboard.chart_total_balance', 'Total Saldo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl md:text-4xl lg:text-5xl font-black mt-2 tracking-tight truncate text-text-main">
              {formatMoney(totalBalance, 'IDR', 'id-ID')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Data Info */}
      <div>
        <p className="font-bold text-text-muted">
          {t('dashboard.chart_latest_data', 'Data Terbaru')} {activeTab === 'monthly' ? `${t('dashboard.chart_month', 'Bulan')} ${new Date(0, selectedMonth - 1).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { month: 'long' })}` : t('dashboard.chart_year', 'Tahun')} {selectedYear}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-income/10 border-none rounded-[24px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-income flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> {t('dashboard.chart_income', 'Pemasukan')}
              </p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-income mt-2 truncate">{formatMoney(summaryStats.totalIncome, 'IDR', 'id-ID')}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-expense/10 border-none rounded-[24px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-expense flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> {t('dashboard.chart_expense', 'Pengeluaran')}
              </p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-expense mt-2 truncate">{formatMoney(summaryStats.totalExpense, 'IDR', 'id-ID')}</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border border rounded-[24px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-text-muted flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> {t('dashboard.chart_net_cashflow', 'Arus Kas Bersih')}
              </p>
            </div>
            <p className={`text-2xl md:text-3xl font-black mt-2 truncate ${summaryStats.net >= 0 ? 'text-brand' : 'text-red-500'}`}>
              {summaryStats.net >= 0 ? '+' : ''}{formatMoney(summaryStats.net, 'IDR', 'id-ID')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PIE CHART - CATEGORIES */}
        <Card className="lg:col-span-1 border-none rounded-[24px] shadow-sm bg-surface overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <PieChartIcon className="w-5 h-5 text-expense" /> {t('dashboard.chart_category_distribution', 'Distribusi Kategori')}
                </CardTitle>
                <CardDescription className="font-medium text-text-muted">{t('dashboard.chart_category_expense_desc', 'Pengeluaran berdasarkan kategori')}</CardDescription>
              </div>
              
              <div className="flex bg-surface-subtle p-1 rounded-[12px] border border-border">
                <button 
                  onClick={() => setActiveTab('monthly')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-[8px] transition-all ${activeTab === 'monthly' ? 'bg-surface border border-border shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  {t('dashboard.chart_month', 'Bulan')}
                </button>
                <button 
                  onClick={() => setActiveTab('yearly')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-[8px] transition-all ${activeTab === 'yearly' ? 'bg-surface border border-border shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  {t('dashboard.chart_year', 'Tahun')} {selectedYear}
                </button>
              </div>

              {activeTab === 'monthly' && (
                <select 
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                  className="h-9 w-full rounded-[10px] border border-border bg-surface px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { month: 'long' })}</option>
                  ))}
                </select>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            {categoryData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted py-12">
                <PieChartIcon className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-bold">{t('dashboard.chart_no_expenses', 'Tidak ada data pengeluaran')}</p>
              </div>
            ) : (
              <>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 flex-1 overflow-y-auto max-h-[250px] pr-2 space-y-3 scrollbar-hide">
                  {categoryData.map((entry, index) => {
                    const percentage = summaryStats.totalExpense > 0 ? ((entry.value / summaryStats.totalExpense) * 100).toFixed(1) : "0"
                    return (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                          <p className="font-bold text-sm text-text-main truncate">
                            {entry.name}
                          </p>
                          <span className="text-xs font-medium text-text-muted shrink-0">({percentage}%)</span>
                        </div>
                        <p className="font-black text-sm text-text-main shrink-0">
                          {formatMoney(entry.value, 'IDR', 'id-ID')}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        {/* BAR CHART - DYNAMIC */}
        <Card className="lg:col-span-2 border-none rounded-[24px] shadow-sm bg-surface overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <BarChart3 className="w-5 h-5 text-brand" /> {t('dashboard.chart_cashflow_trend', 'Tren Arus Kas')}
              </CardTitle>
              <CardDescription className="font-medium text-text-muted">{t('dashboard.chart_cashflow_comparison', 'Perbandingan Pemasukan & Pengeluaran')}</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {barTimeFilter === 'custom' && (
                <div className="flex items-center gap-2 text-xs font-medium bg-surface-subtle px-2 py-1.5 rounded-[8px]">
                  <span>H-</span>
                  <input 
                    type="number" 
                    value={barCustomDays}
                    onChange={e => setBarCustomDays(e.target.value)}
                    className="w-12 rounded-[4px] border border-border bg-surface px-1 text-center focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              )}
              <select 
                value={barTimeFilter}
                onChange={e => setBarTimeFilter(e.target.value)}
                className="h-9 rounded-[10px] border border-border bg-surface px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
              >
                <option value="1d">{t('dashboard.chart_1d', '1 Hari Terakhir')}</option>
                <option value="7d">{t('dashboard.chart_7d', '7 Hari Terakhir')}</option>
                <option value="14d">{t('dashboard.chart_14d', '14 Hari Terakhir')}</option>
                <option value="1m">{t('dashboard.chart_1m', '1 Bulan Terakhir')}</option>
                <option value="6m">{t('dashboard.chart_6m', '6 Bulan Terakhir')}</option>
                <option value="1y">{t('dashboard.chart_1y', '1 Tahun Terakhir')}</option>
                <option value="all">{t('dashboard.chart_all', 'Semua Waktu')}</option>
                <option value="custom">{t('dashboard.chart_custom_days', 'Kustom (Hari)')}</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicBarData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} width={65} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                  <Bar dataKey="Pemasukan" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
