'use client'

import { LogOut } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { logout } from '@/app/(auth)/actions'
import { useTranslation } from 'react-i18next'

export function LogoutButton() {
  const { t } = useTranslation()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className="w-full flex items-center justify-center gap-2 p-3 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-[12px] font-bold transition-all duration-200 cursor-pointer active:scale-[0.98] mt-2">
          <LogOut className="w-5 h-5" />
          {t('dashboard.logout_btn', 'Keluar')}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[24px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black">{t('dashboard.logout_confirm_title', 'Keluar dari Saku?')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('dashboard.logout_confirm_desc', 'Apakah Anda yakin ingin keluar dari sesi Anda saat ini? Anda harus masuk kembali untuk melihat catatan keuangan Anda.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center gap-3 mt-4 sm:mt-0">
          <AlertDialogCancel className="mt-0 flex-1 rounded-[12px] font-bold">{t('dashboard.cancel', 'Batal')}</AlertDialogCancel>
          <form action={logout} className="flex-1">
            <button type="submit" className="w-full h-10 rounded-[12px] font-bold bg-expense text-white hover:bg-red-600 px-4 py-2 text-sm transition-colors cursor-pointer">
              {t('dashboard.yes_logout', 'Ya, Keluar')}
            </button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
