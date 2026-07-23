'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { PieChart as PieChartIcon, BarChart3, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { useTransactions } from '@/features/transactions/hooks'
import { useTranslation } from 'react-i18next'
import { getTranslatedCategoryName } from '@/features/categories/utils'

type Transaction = {
  id: string
  kind: string
  amount_minor: number
  date: string
  note: string | null
  categories: { name: string, icon: string, color: string } | null
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

export function AdvancedCharts({ initialTransactions }: { initialTransactions: any[] }) {
  const { t } = useTranslation()
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1) // 1-12
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly') // Category analysis scope

  const transactions = initialTransactions as Transaction[]

  // List of available years from data
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    transactions.forEach(tx => years.add(new Date(tx.date).getFullYear()))
    if (years.size === 0) years.add(new Date().getFullYear())
    return Array.from(years).sort((a, b) => b - a)
  }, [transactions])

  // --- 1. ANNUAL CASHFLOW BAR CHART ---
  const annualBarData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthIdx: i + 1,
      label: new Date(0, i).toLocaleDateString('id-ID', { month: 'short' }),
      Pemasukan: 0,
      Pengeluaran: 0
    }))

    transactions.forEach(t => {
      const d = new Date(t.date)
      if (d.getFullYear() === selectedYear) {
        const monthIdx = d.getMonth()
        if (t.kind === 'income') months[monthIdx].Pemasukan += t.amount_minor
        if (t.kind === 'expense') months[monthIdx].Pengeluaran += t.amount_minor
      }
    })

    return months
  }, [transactions, selectedYear])

  // --- 2. CATEGORY DOUGHNUT CHART ---
  const categoryData = useMemo(() => {
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
          const icon = tx.categories?.icon || '🛒'
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


  return (
    <div className="space-y-8">
      
      {/* Top Filters */}
      <div className="flex items-center justify-between bg-surface p-2 sm:p-3 rounded-[20px] sm:rounded-[24px] shadow-sm border border-border/50">
        <div className="flex items-center gap-3 px-2 sm:px-3">
          <div className="p-2 bg-brand/10 rounded-full">
            <Calendar className="w-5 h-5 text-brand" />
          </div>
          <span className="font-bold text-sm text-text-main hidden sm:inline">Ringkasan Tahun</span>
        </div>
        <div className="flex items-center gap-1 bg-surface-subtle p-1.5 rounded-[16px] border border-border overflow-x-auto scrollbar-hide max-w-[60vw]">
          {availableYears.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-5 py-2 text-sm font-bold rounded-[12px] transition-all duration-200 whitespace-nowrap shrink-0 ${
                selectedYear === y 
                  ? 'bg-surface text-text-main shadow-sm border border-border' 
                  : 'text-text-muted hover:text-text-main hover:bg-black/5'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-income/10 border-none rounded-[24px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-income flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Pemasukan
              </p>
            </div>
            <p className="text-3xl font-black text-income mt-2">{formatMoney(summaryStats.totalIncome, 'IDR', 'id-ID')}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-expense/10 border-none rounded-[24px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-expense flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Pengeluaran
              </p>
            </div>
            <p className="text-3xl font-black text-expense mt-2">{formatMoney(summaryStats.totalExpense, 'IDR', 'id-ID')}</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border border rounded-[24px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-text-muted flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Arus Kas Bersih
              </p>
            </div>
            <p className={`text-3xl font-black mt-2 ${summaryStats.net >= 0 ? 'text-brand' : 'text-red-500'}`}>
              {summaryStats.net >= 0 ? '+' : ''}{formatMoney(summaryStats.net, 'IDR', 'id-ID')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BAR CHART - ANNUAL */}
        <Card className="lg:col-span-2 border-none rounded-[24px] shadow-sm bg-surface overflow-hidden">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <BarChart3 className="w-5 h-5 text-brand" /> Tren Arus Kas {selectedYear}
            </CardTitle>
            <CardDescription className="font-medium text-text-muted">Perbandingan Pemasukan & Pengeluaran bulanan</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualBarData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${(val / 1000000)}M`} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                  <Bar dataKey="Pemasukan" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* PIE CHART - CATEGORIES */}
        <Card className="lg:col-span-1 border-none rounded-[24px] shadow-sm bg-surface overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <PieChartIcon className="w-5 h-5 text-expense" /> Distribusi Kategori
                </CardTitle>
                <CardDescription className="font-medium text-text-muted">Pengeluaran berdasarkan kategori</CardDescription>
              </div>
              
              <div className="flex bg-surface-subtle p-1 rounded-[12px] border border-border">
                <button 
                  onClick={() => setActiveTab('monthly')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-[8px] transition-all ${activeTab === 'monthly' ? 'bg-surface shadow-sm border border-border text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  Bulan
                </button>
                <button 
                  onClick={() => setActiveTab('yearly')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-[8px] transition-all ${activeTab === 'yearly' ? 'bg-surface shadow-sm border border-border text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  Tahun {selectedYear}
                </button>
              </div>

              {activeTab === 'monthly' && (
                <select 
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                  className="h-9 w-full rounded-[10px] border border-border bg-surface px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleDateString('id-ID', { month: 'long' })}</option>
                  ))}
                </select>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            {categoryData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted py-12">
                <PieChartIcon className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-bold">Tidak ada data pengeluaran</p>
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
                    const percentage = ((entry.value / summaryStats.totalExpense) * 100).toFixed(1)
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-[16px] bg-surface-subtle border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm" style={{ backgroundColor: `${entry.color}15` }}>
                            {entry.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-text-main">{entry.name}</p>
                            <p className="text-xs font-medium text-text-muted">{percentage}%</p>
                          </div>
                        </div>
                        <p className="font-black text-sm text-text-main">
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
      </div>
    </div>
  )
}
