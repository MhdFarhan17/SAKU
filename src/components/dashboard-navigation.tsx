'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Wallet, LayoutDashboard, Settings, ArrowLeftRight, Target, Repeat, Trophy, Users } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'
import { useTranslation } from 'react-i18next'

interface DashboardNavigationProps {
  userInitial: string
  displayName: string
  email: string
}

export function DashboardSidebar({ userInitial, displayName, email }: DashboardNavigationProps) {
  const { t } = useTranslation()

  return (
    <nav className="hidden md:flex w-72 bg-surface border-r border-border text-text-main flex-col p-6">
      <div className="flex items-center gap-3 mb-12">
        <Image src="/logos/logo.png" alt="Saku Logo" width={40} height={40} className="rounded-full" />
        <span className="font-black text-2xl tracking-tight text-text-main">Saku</span>
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        <Link href="/app" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-bold">{t('nav.dashboard', 'Dasbor')}</span>
        </Link>
        
        <Link href="/app/budgets" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-colors">
          <Target className="w-5 h-5" />
          <span className="font-bold">{t('nav.budgets', 'Anggaran')}</span>
        </Link>

        <Link href="/app/recurring" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-colors">
          <Repeat className="w-5 h-5" />
          <span className="font-bold">{t('nav.recurring', 'Rutin')}</span>
        </Link>

        <Link href="/app/goals" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-colors">
          <Trophy className="w-5 h-5" />
          <span className="font-bold">{t('nav.goals', 'Tabungan')}</span>
        </Link>

        <Link href="/app/debts" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-colors">
          <Users className="w-5 h-5" />
          <span className="font-bold">{t('nav.debts', 'Hutang')}</span>
        </Link>

        <Link href="/app/transactions" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-colors">
          <ArrowLeftRight className="w-5 h-5" />
          <span className="font-bold">{t('nav.transactions', 'Transaksi')}</span>
        </Link>

        <Link href="/app/accounts" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-colors">
          <Wallet className="w-5 h-5" />
          <span className="font-bold">{t('nav.accounts', 'Akun')}</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <Link href="/app/settings" className="flex items-center gap-3 text-text-main/80 hover:text-[#9fe870] p-3 rounded-[12px] hover:bg-surface-subtle transition-all duration-200 cursor-pointer active:scale-[0.98] mb-4">
          <Settings className="w-5 h-5" />
          <span className="font-bold">{t('nav.settings', 'Pengaturan')}</span>
        </Link>
        
        <div className="flex items-center gap-3 p-3 bg-surface-subtle rounded-[16px]">
          <div className="w-10 h-10 rounded-full bg-[#9fe870] text-[#0e0f0c] flex items-center justify-center font-black text-lg shrink-0">
            {userInitial}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm text-text-main truncate">{displayName}</span>
            <span className="text-xs text-text-main/60 truncate">{email}</span>
          </div>
        </div>

        <LogoutButton />
      </div>
    </nav>
  )
}

export function MobileNavigation() {
  const { t } = useTranslation()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex items-center justify-around p-4 pb-safe z-50 rounded-t-[24px]">
      <Link href="/app" className="flex flex-col items-center gap-1 text-text-main/80 hover:text-[#9fe870]">
        <LayoutDashboard className="w-6 h-6" />
        <span className="text-[10px] font-bold">{t('nav.dashboard', 'Dasbor')}</span>
      </Link>
      <Link href="/app/transactions" className="flex flex-col items-center gap-1 text-text-main/80 hover:text-[#9fe870]">
        <ArrowLeftRight className="w-6 h-6" />
        <span className="text-[10px] font-bold">{t('nav.transactions', 'Transaksi')}</span>
      </Link>
      <Link href="/app/accounts" className="flex flex-col items-center gap-1 text-text-main/80 hover:text-[#9fe870]">
        <Wallet className="w-6 h-6" />
        <span className="text-[10px] font-bold">{t('nav.accounts', 'Akun')}</span>
      </Link>
      <Link href="/app/settings" className="flex flex-col items-center gap-1 text-text-main/80 hover:text-[#9fe870]">
        <Settings className="w-6 h-6" />
        <span className="text-[10px] font-bold">{t('nav.settings', 'Pengaturan')}</span>
      </Link>
    </div>
  )
}
