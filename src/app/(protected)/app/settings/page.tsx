'use client'

import { useTheme } from '@/theme/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { logout, deleteAccount, updateProfile } from '@/app/(auth)/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Moon, Sun, Download, LogOut, Trash2, Tag, Target, Repeat, Trophy, Users, Globe, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  
  // States for delete confirmation
  const [deleteChecked, setDeleteChecked] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  
  useEffect(() => {
    // Only set mounted after initial render to avoid flash
    const timer = setTimeout(() => setMounted(true), 0)
    const fetchUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
    return () => clearTimeout(timer)
  }, [])

  const handleExport = () => {
    window.location.href = '/api/export'
  }

  const handleLangChange = (newLang: string) => {
    i18n.changeLanguage(newLang)
    localStorage.setItem('saku_lang', newLang)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteAccount()
      
      if (res?.error) {
        setIsDeleting(false)
        toast.error(t('settings.delete_error', 'Gagal Menghapus'), { description: res.error })
        return
      }

      setIsDeleteSuccess(true)
      toast.success(t('settings.account_deleted', 'Akun Dihapus'), { description: t('settings.account_deleted_desc', 'Data Anda telah dihapus secara permanen.') })
      
      // Tunggu 3 detik baru alihkan ke home
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)

    } catch (error) {
      console.error(error)
      setIsDeleting(false)
      toast.error(t('settings.delete_error', 'Gagal Menghapus'), { description: t('settings.delete_error_desc', 'Terjadi kesalahan saat menghapus data.') })
    }
  }

  if (!mounted) return null

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 md:space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-black text-text-main">{t('settings.title', 'Pengaturan')}</h1>
        <p className="text-text-muted mt-1">{t('settings.desc', 'Kelola preferensi dan data Anda.')}</p>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[24px] border-none shadow-sm bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">{t('settings.profile', 'Profil')}</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <form action={async (formData) => {
                const res = await updateProfile(formData)
                if (res?.error) {
                  toast.error(t('settings.save_error', 'Gagal Menyimpan'), { description: res.error })
                } else {
                  toast.info(t('settings.profile_updated', 'Profil Diperbarui'), { description: t('settings.profile_updated_desc', 'Data profil Anda berhasil disimpan.') })
                }
              }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t('settings.email', 'Email')}</label>
                  <Input type="email" value={user.email} disabled className="bg-canvas border-none rounded-[12px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t('settings.full_name', 'Nama Lengkap')}</label>
                  <Input type="text" name="full_name" defaultValue={user.user_metadata?.full_name || ''} placeholder={t('settings.full_name_placeholder', 'Contoh: Muhammad Farhan')} className="rounded-[12px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t('settings.display_name', 'Nama Tampilan')}</label>
                  <Input type="text" name="display_name" defaultValue={user.user_metadata?.display_name || ''} placeholder={t('settings.display_name_placeholder', 'Contoh: Farhan')} className="rounded-[12px]" />
                </div>
                <Button type="submit" size="sm" className="rounded-[16px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-bold px-6">
                  {t('settings.save_profile', 'Simpan Profil')}
                </Button>
              </form>
            ) : (
              <div className="text-sm text-text-muted">{t('settings.loading_profile', 'Memuat profil...')}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none shadow-sm bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">{t('settings.preferences', 'Preferensi')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-[16px] hover:bg-surface-subtle transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div className="bg-surface-subtle p-2 rounded-[12px] shrink-0">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-text-secondary" /> : <Sun className="w-5 h-5 text-text-secondary" />}
                </div>
                <div>
                  <div className="font-bold text-sm">{t('settings.appearance', 'Tampilan')}</div>
                  <div className="text-xs text-text-muted mt-0.5">{t('settings.appearance_desc', 'Pilih tema tampilan')}</div>
                </div>
              </div>
              <div className="flex bg-surface-subtle p-1 rounded-xl shrink-0 border border-border/50 w-full sm:w-auto">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-surface shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-surface shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  Dark
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${theme === 'system' ? 'bg-surface shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  System
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-[16px] hover:bg-surface-subtle transition-colors gap-4 sm:gap-0 mt-2">
              <div className="flex items-center gap-4">
                <div className="bg-surface-subtle p-2 rounded-[12px] shrink-0">
                  <Globe className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t('settings.language', 'Bahasa')}</div>
                  <div className="text-xs text-text-muted mt-0.5">{t('settings.language_desc', 'Pilih bahasa aplikasi')}</div>
                </div>
              </div>
              <div className="flex bg-surface-subtle p-1 rounded-xl shrink-0 border border-border/50 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={() => handleLangChange('ID')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${i18n.language === 'ID' ? 'bg-surface shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  Bahasa Indonesia
                </button>
                <button 
                  type="button"
                  onClick={() => handleLangChange('EN')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${i18n.language === 'EN' ? 'bg-surface shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  English
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-[16px] hover:bg-surface-subtle transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div className="bg-surface-subtle p-2 rounded-[12px]">
                  <Tag className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t('settings.categories', 'Kategori')}</div>
                  <div className="text-xs text-text-muted mt-0.5">{t('settings.categories_desc', 'Kelola kategori pemasukan dan pengeluaran')}</div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto rounded-[12px] font-bold transition-all duration-300 hover:scale-105 hover:bg-brand hover:text-[#0e0f0c] hover:border-brand hover:shadow-md active:scale-95">
                <Link href="/app/settings/categories">{t('settings.manage_categories', 'Kelola Kategori')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none shadow-sm bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">{t('settings.other_features', 'Fitur Lainnya')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/app/budgets" className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-surface-subtle hover:bg-brand/10 hover:text-brand transition-colors text-center group">
              <Target className="w-8 h-8 mb-2 text-text-secondary group-hover:text-brand transition-colors" />
              <span className="font-bold text-sm">{t('settings.budget', 'Anggaran')}</span>
            </Link>
            <Link href="/app/recurring" className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-surface-subtle hover:bg-brand/10 hover:text-brand transition-colors text-center group">
              <Repeat className="w-8 h-8 mb-2 text-text-secondary group-hover:text-brand transition-colors" />
              <span className="font-bold text-sm">{t('settings.recurring', 'Rutin')}</span>
            </Link>
            <Link href="/app/goals" className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-surface-subtle hover:bg-brand/10 hover:text-brand transition-colors text-center group">
              <Trophy className="w-8 h-8 mb-2 text-text-secondary group-hover:text-brand transition-colors" />
              <span className="font-bold text-sm">{t('settings.goals', 'Tabungan')}</span>
            </Link>
            <Link href="/app/debts" className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-surface-subtle hover:bg-brand/10 hover:text-brand transition-colors text-center group">
              <Users className="w-8 h-8 mb-2 text-text-secondary group-hover:text-brand transition-colors" />
              <span className="font-bold text-sm">{t('settings.debts', 'Hutang')}</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none shadow-sm bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-expense">{t('settings.account_access', 'Akses Akun')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" className="w-full flex items-center justify-center gap-2 p-3 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-[12px] font-bold transition-all duration-200 cursor-pointer active:scale-[0.98]">
                  <LogOut className="w-5 h-5" />
                  {t('dashboard.logout_btn', 'Keluar')}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[24px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black">{t('settings.logout_confirm_title', 'Keluar dari Saku?')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settings.logout_confirm_desc', 'Apakah Anda yakin ingin keluar dari sesi Anda saat ini? Anda harus masuk kembali untuk melihat catatan keuangan Anda.')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row items-center gap-3 mt-4 sm:mt-0">
                  <AlertDialogCancel className="mt-0 flex-1 rounded-[12px] font-bold">{t('settings.cancel', 'Batal')}</AlertDialogCancel>
                  <form action={logout} className="flex-1">
                    <button type="submit" className="w-full h-10 rounded-[12px] font-bold bg-expense text-white hover:bg-red-600 px-4 py-2 text-sm transition-colors cursor-pointer">
                      {t('settings.yes_logout', 'Ya, Keluar')}
                    </button>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>


        <Card className="rounded-[24px] border border-red-500/20 shadow-sm bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-expense">{t('settings.danger_zone', 'Zona Berbahaya')}</CardTitle>
            <CardDescription className="text-expense/80 font-medium leading-relaxed mt-1">
              {t('settings.danger_desc_1', 'Perhatian!!! Fitur hapus akun akan benar-benar menghapus ')}<strong>{t('settings.danger_desc_2', 'seluruh data Anda secara permanen')}</strong>{t('settings.danger_desc_3', '. Lakukan dengan sangat hati-hati karena tindakan ini tidak dapat dibatalkan.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-[16px] hover:bg-red-500/5 transition-colors gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-bold text-sm text-expense">{t('settings.delete_account', 'Hapus Akun')}</div>
                  <div className="text-xs text-text-muted mt-0.5">{t('settings.delete_account_desc', 'Hapus semua data Anda secara permanen')}</div>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-[12px] border-expense text-expense hover:bg-expense hover:text-white font-bold bg-transparent">{t('settings.delete_btn', 'Hapus')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[24px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-black">{t('settings.delete_confirm_title', 'Apakah Anda yakin?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('settings.delete_confirm_desc', 'Tindakan ini tidak dapat dibatalkan. Semua data keuangan Anda akan dihapus permanen dari server kami.')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-4 my-2">
                    <div className="flex items-start space-x-3 bg-red-50/50 p-3 rounded-[12px] border border-red-100">
                      <input 
                        type="checkbox" 
                        id="confirm-delete" 
                        checked={deleteChecked}
                        onChange={(e) => setDeleteChecked(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-red-300 text-expense focus:ring-expense cursor-pointer" 
                      />
                      <label htmlFor="confirm-delete" className="text-sm font-medium text-expense leading-tight cursor-pointer">
                        {t('settings.delete_checkbox', 'Saya mengerti bahwa akun saya dan seluruh datanya tidak dapat dipulihkan kembali.')}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-main">
                        {t('settings.delete_type_prompt', 'Ketik')} <span className="text-expense font-black select-none">"{i18n.language === 'EN' ? 'delete account' : 'hapus akun'}"</span> {t('settings.delete_type_suffix', 'untuk mengonfirmasi.')}
                      </label>
                      <Input 
                        type="text" 
                        placeholder={i18n.language === 'EN' ? 'delete account' : 'hapus akun'}
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value.toLowerCase())}
                        className="rounded-[12px] focus-visible:ring-expense border-border"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel 
                      className="rounded-[16px] font-bold"
                      onClick={() => {
                        setDeleteChecked(false)
                        setDeleteConfirmText('')
                      }}
                    >
                      {t('settings.cancel', 'Batal')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="rounded-[16px] font-bold bg-expense text-white hover:bg-red-600 disabled:opacity-80 transition-all flex items-center justify-center min-w-[140px]"
                      disabled={isDeleting || isDeleteSuccess || !deleteChecked || deleteConfirmText !== (i18n.language === 'EN' ? 'delete account' : 'hapus akun')}
                    >
                      {isDeleteSuccess ? (
                        t('settings.delete_success_btn', 'Berhasil! Mengalihkan...')
                      ) : isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('settings.deleting', 'Menghapus...')}
                        </>
                      ) : (
                        t('settings.yes_delete', 'Ya, hapus akun')
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
