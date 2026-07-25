'use client'

import { useState } from 'react'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import { ArrowLeft, Wallet, TrendingUp, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

function LoginForm() {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const registered = searchParams.get('registered') === 'true'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await login(formData)
    
    if (res?.error) {
      setError(res.error)
      toast.error(t('auth_page.login_failed_title', 'Gagal Login'), { description: res.error })
      setLoading(false)
    } else if (res?.success) {
      toast.success(t('auth_page.login_success_title', 'Berhasil Login'), { description: t('auth_page.login_success_desc', 'Selamat Datang Kembali :)') })
      router.push('/app')
    }
  }

  return (
    <div className="min-h-screen flex bg-[#e8ebe6] font-sans selection:bg-[#9fe870] selection:text-[#0e0f0c]">
      
      {/* LEFT PANEL - BRANDING */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between bg-[#0e0f0c] text-[#ffffff] p-12 xl:p-16 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(#9fe870 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logos/logo.png" alt="Saku" width={36} height={36} className="object-contain" />
            <span className="text-2xl font-black tracking-[-0.04em]">Saku</span>
          </Link>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-8">
          <h1 className="text-[40px] xl:text-[48px] font-black leading-[1.1] tracking-[-0.03em]">
            {t('auth_page.login_welcome_title', 'Selamat datang kembali.')}
          </h1>
          <p className="text-lg text-[#a4a5a3] leading-relaxed max-w-sm">
            {t('auth_page.login_welcome_desc', 'Akses dasbor Anda dan lanjutkan pantau keuangan Anda.')}
          </p>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 space-y-5">
          {[
            { icon: Wallet, text: t('auth_page.auth_feat_1', 'Catat pemasukan & pengeluaran') },
            { icon: TrendingUp, text: t('auth_page.auth_feat_2', 'Laporan analitik otomatis') },
            { icon: Shield, text: t('auth_page.auth_feat_3', 'Data terenkripsi & privat') },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#1c1d1a] border border-[#333b35] flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-[#9fe870]" />
              </div>
              <span className="text-[15px] font-bold text-[#a4a5a3]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 md:p-8 shrink-0">
          <Link href="/" className="inline-flex lg:hidden items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logos/logo.png" alt="Saku" width={28} height={28} className="object-contain" />
            <span className="text-xl font-black tracking-[-0.04em] text-[#0e0f0c]">Saku</span>
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[#868685] hover:text-[#0e0f0c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth_page.auth_back', 'Kembali')}
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-12 pb-8">
          <div className="w-full max-w-[440px]">

            {/* Title */}
            <div className="mb-8">
              <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-black tracking-[-0.03em] text-[#0e0f0c] leading-tight">
                {t('auth_page.login_title', 'Masuk ke Akun')}
              </h2>
              <p className="text-[#868685] mt-1">
                {t('auth_page.login_no_account', 'Belum punya akun?')} {' '}
                <Link href="/signup" className="text-[#0e0f0c] font-bold hover:underline decoration-[#9fe870] decoration-2 underline-offset-4">
                  {t('auth_page.login_signup_link', 'Daftar')}
                </Link>
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-[#ffffff] rounded-[20px] border border-[#cfd5dd]/50 p-5 sm:p-6 md:p-8 shadow-sm">
              
              {registered && (
                <div className="mb-4 p-3 bg-[#e2f6d5] text-[#054d28] text-sm font-bold rounded-[12px] border border-[#9fe870]/30">
                  {t('auth_page.login_registered_msg', 'Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.')}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#454745] uppercase tracking-wider">{t('auth_page.auth_email', 'Email')}</label>
                  <Input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder={t('auth_page.auth_email_placeholder', 'nama@email.com')} 
                    className="h-12 px-4 rounded-[12px] bg-[#fbfcfb] border-[#e2e6eb] text-[#0e0f0c] placeholder:text-[#b4bcc7] focus-visible:ring-[#9fe870] focus-visible:border-[#9fe870] shadow-none transition-colors text-sm"
                  />
                </div>
                
                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#454745] uppercase tracking-wider">{t('auth_page.auth_password', 'Password')}</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-[#868685] hover:text-[#0e0f0c] transition-colors">{t('auth_page.login_forgot_password', 'Lupa password?')}</Link>
                  </div>
                  <Input 
                    type="password" 
                    name="password" 
                    required 
                    className="h-12 px-4 rounded-[12px] bg-[#fbfcfb] border-[#e2e6eb] text-[#0e0f0c] focus-visible:ring-[#9fe870] focus-visible:border-[#9fe870] shadow-none transition-colors text-sm"
                  />
                </div>
                
                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-[12px]">
                    <p className="text-sm font-bold text-red-600">{error}</p>
                  </div>
                )}
                
                {/* Submit */}
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-[12px] bg-[#9fe870] hover:bg-[#8bd45f] text-[#0e0f0c] font-black text-sm shadow-none disabled:opacity-40 transition-colors" 
                  disabled={loading}
                >
                  {loading ? t('auth_page.login_loading', 'Memeriksa...') : t('auth_page.login_btn_text', 'Masuk')}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#e8ebe6] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#9fe870] border-t-transparent animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
