'use client'

import { useState } from 'react'
import { resetPassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Suspense } from 'react'
import Image from 'next/image'
import { ArrowLeft, Wallet, TrendingUp, Shield, MailCheck, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

function ForgotPasswordForm() {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    // Pass the current origin to the server action for the redirect URL
    const origin = window.location.origin
    const res = await resetPassword(formData, origin)
    
    if (res?.error) {
      setError(res.error)
      toast.error(t('auth_page.forgot_failed_title', 'Gagal Mengirim'), { description: res.error })
    } else if (res?.success) {
      setSuccess(true)
      toast.success(t('auth_page.forgot_success_title', 'Tautan Terkirim'), { description: t('auth_page.forgot_success_desc', 'Silakan cek kotak masuk atau folder spam email Anda.') })
    }
    setLoading(false)
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
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[#868685] hover:text-[#0e0f0c] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('auth_page.auth_back', 'Kembali')}
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-12 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[440px]"
          >
            {/* Title */}
            <div className="mb-8">
              <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-black tracking-[-0.03em] text-[#0e0f0c] leading-tight">
                {t('auth_page.forgot_title', 'Lupa Password?')}
              </h2>
              <p className="text-[#868685] mt-2 leading-relaxed">
                {t('auth_page.forgot_desc', 'Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password.')}
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-[#ffffff] rounded-[24px] border border-[#cfd5dd]/50 p-5 sm:p-6 md:p-8 shadow-sm overflow-hidden relative">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center text-center space-y-6 py-4"
                  >
                    <div className="w-20 h-20 bg-[#e2f6d5] rounded-full flex items-center justify-center mb-2 border-4 border-[#ffffff] shadow-[0_0_0_1px_rgba(159,232,112,0.3)]">
                      <MailCheck className="w-10 h-10 text-[#054d28]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#0e0f0c] mb-2">{t('auth_page.forgot_success_title', 'Tautan Terkirim')}</h3>
                      <p className="text-[#868685] text-sm leading-relaxed">{t('auth_page.forgot_success_desc', 'Silakan cek kotak masuk atau folder spam email Anda.')}</p>
                    </div>
                    <Button asChild className="w-full h-12 rounded-[16px] bg-[#0e0f0c] hover:bg-[#1a1b19] text-white font-bold text-sm shadow-none transition-all duration-300 hover:scale-[1.02] active:scale-95">
                      <Link href="/login">{t('auth_page.auth_back', 'Kembali ke Login')}</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-5"
                  >
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#454745] uppercase tracking-wider">{t('auth_page.auth_email', 'Email')}</label>
                      <Input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder={t('auth_page.auth_email_placeholder', 'nama@email.com')} 
                        className="h-14 px-4 rounded-[16px] bg-[#fbfcfb] border-[#e2e6eb] text-[#0e0f0c] placeholder:text-[#b4bcc7] focus-visible:ring-2 focus-visible:ring-[#9fe870]/50 focus-visible:border-[#9fe870] shadow-none transition-all duration-300 text-[15px]"
                      />
                    </div>
                    
                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3.5 bg-red-50/80 border border-red-200/60 rounded-[16px] flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[13.5px] font-bold text-red-600 leading-relaxed">{error}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Submit */}
                    <Button 
                      type="submit" 
                      className="w-full h-14 mt-2 rounded-[16px] bg-[#9fe870] hover:bg-[#8bd45f] text-[#0e0f0c] font-black text-[15px] shadow-none disabled:opacity-50 transition-all duration-300 active:scale-[0.98]" 
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#0e0f0c]/30 border-t-[#0e0f0c] rounded-full animate-spin" />
                          {t('auth_page.forgot_loading', 'Mengirim...')}
                        </span>
                      ) : t('auth_page.forgot_btn', 'Kirim Tautan')}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#e8ebe6] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#9fe870] border-t-transparent animate-spin" /></div>}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
