'use client'

import { useState, useMemo } from 'react'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowLeft, Wallet, TrendingUp, Shield, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useTranslation, Trans } from 'react-i18next'
import { toast } from 'sonner'

export default function SignupPage() {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const reqs = useMemo(() => ({
    length: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password)
  }), [password])

  const strengthScore = useMemo(() => {
    if (password.length === 0) return 0
    let score = 0
    if (reqs.length) score++
    if (reqs.lower && reqs.upper) score++
    if (reqs.digit) score++
    if (reqs.symbol) score++
    return score
  }, [reqs, password])

  const strengthLabels = ['', t('auth_page.pwd_weak', 'Lemah'), t('auth_page.pwd_fair', 'Cukup'), t('auth_page.pwd_strong', 'Kuat'), t('auth_page.pwd_very_strong', 'Sangat Kuat')]
  const strengthBarColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-[#9fe870]', 'bg-[#2ead4b]']

  const isMatch = confirmPassword.length > 0 && password === confirmPassword
  const canSubmit = strengthScore >= 4 && isMatch

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const res = await signup(formData)
    if (res?.error) {
      setError(res.error)
      toast.error(t('auth_page.signup_failed_title', 'Gagal Daftar'), { description: res.error })
      setLoading(false)
    } else if (res?.success) {
      toast.success(t('auth_page.signup_success_title', 'Berhasil Daftar'))
      router.push('/login?registered=true')
    }
  }

  return (
    <div className="min-h-screen flex bg-[#e8ebe6] font-sans selection:bg-[#9fe870] selection:text-[#0e0f0c]">
      
      {/* LEFT PANEL - BRANDING & VISUAL */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between bg-[#0e0f0c] text-[#ffffff] p-12 xl:p-16 relative overflow-hidden shrink-0">
        {/* Subtle grid pattern */}
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
            {t('auth_page.signup_welcome_title', 'Langkah pertama menuju kendali finansial.')}
          </h1>
          <p className="text-lg text-[#a4a5a3] leading-relaxed max-w-sm">
            {t('auth_page.signup_welcome_desc', 'Bergabung dan mulai catat setiap rupiah yang masuk dan keluar dari kantong Anda.')}
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
        <div className="flex items-center justify-between p-6 md:p-8 shrink-0">
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
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 pb-8">
          <div className="w-full max-w-[440px]">

            {/* Title */}
            <div className="mb-8">
              <h2 className="text-[32px] md:text-[36px] font-black tracking-[-0.03em] text-[#0e0f0c] leading-tight">
                {t('auth_page.signup_title', 'Buat Akun Baru')}
              </h2>
              <p className="text-[#868685] mt-1">
                {t('auth_page.signup_has_account', 'Sudah punya akun?')} {' '}
                <Link href="/login" className="text-[#0e0f0c] font-bold hover:underline decoration-[#9fe870] decoration-2 underline-offset-4">
                  {t('auth_page.signup_login_link', 'Masuk')}
                </Link>
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-[#ffffff] rounded-[20px] border border-[#cfd5dd]/50 p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name & Email */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#454745] uppercase tracking-wider">{t('auth_page.auth_fullname', 'Nama Lengkap')}</label>
                    <Input 
                      type="text" 
                      name="full_name" 
                      required 
                      placeholder={t('auth_page.auth_fullname_placeholder', 'Budi Santoso')} 
                      className="h-12 px-4 rounded-[12px] bg-[#fbfcfb] border-[#e2e6eb] text-[#0e0f0c] placeholder:text-[#b4bcc7] focus-visible:ring-[#9fe870] focus-visible:border-[#9fe870] shadow-none transition-colors text-sm"
                    />
                  </div>
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
                </div>
                
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#454745] uppercase tracking-wider">{t('auth_page.auth_password', 'Password')}</label>
                  <Input 
                    type="password" 
                    name="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 px-4 rounded-[12px] bg-[#fbfcfb] border-[#e2e6eb] text-[#0e0f0c] focus-visible:ring-[#9fe870] focus-visible:border-[#9fe870] shadow-none transition-colors text-sm"
                  />
                  
                  {/* Strength bar + chips inline */}
                  {password.length > 0 && (
                    <div className="pt-1.5 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5 h-1 rounded-full overflow-hidden bg-[#e2e6eb] flex-1">
                          {[1, 2, 3, 4].map((level) => (
                            <motion.div
                              key={level}
                              className={`flex-1 rounded-full ${strengthBarColors[strengthScore]}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: strengthScore >= level ? 1 : 0 }}
                              transition={{ duration: 0.2, delay: level * 0.04 }}
                              style={{ originX: 0 }}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-[#868685] shrink-0 w-20 text-right">{strengthLabels[strengthScore]}</span>
                      </div>

                      {strengthScore < 4 && (
                        <div className="flex flex-wrap gap-1.5">
                          <ReqChip met={reqs.length} text={t('auth_page.pwd_req_length', '8+ karakter')} />
                          <ReqChip met={reqs.lower} text="a-z" />
                          <ReqChip met={reqs.upper} text="A-Z" />
                          <ReqChip met={reqs.digit} text="0-9" />
                          <ReqChip met={reqs.symbol} text="!@#$" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#454745] uppercase tracking-wider">{t('auth_page.auth_confirm_password', 'Konfirmasi Password')}</label>
                  <div className="relative">
                    <Input 
                      type="password" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-12 px-4 pr-12 rounded-[12px] bg-[#fbfcfb] shadow-none transition-colors text-sm ${
                        confirmPassword.length > 0 
                          ? isMatch 
                            ? 'border-[#2ead4b] focus-visible:ring-[#2ead4b]' 
                            : 'border-red-300 focus-visible:ring-red-300' 
                          : 'border-[#e2e6eb] focus-visible:ring-[#9fe870] focus-visible:border-[#9fe870]'
                      }`}
                    />
                    <AnimatePresence>
                      {confirmPassword.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        >
                          {isMatch ? (
                            <div className="w-5 h-5 rounded-full bg-[#2ead4b] flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#ffffff] stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                              <X className="w-3 h-3 text-red-500 stroke-[3]" />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                  className="w-full h-12 rounded-[12px] bg-[#9fe870] hover:bg-[#8bd45f] text-[#0e0f0c] font-black text-sm shadow-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors" 
                  disabled={loading || !canSubmit}
                >
                  {loading ? t('auth_page.auth_processing', 'Memproses...') : t('auth_page.signup_btn_text', 'Daftar Gratis')}
                </Button>
              </form>
            </div>

            <p className="text-[11px] text-center text-[#b4bcc7] mt-5">
              <Trans i18nKey="auth_page.signup_terms_msg">
                {t('auth_page.signup_terms_prefix', 'Dengan mendaftar, Anda setuju dengan ')} <Link href="/terms" className="text-[#868685] font-bold hover:underline">{t('auth_page.signup_terms', 'Ketentuan Layanan')}</Link> {t('auth_page.signup_terms_and', ' dan ')} <Link href="/privacy" className="text-[#868685] font-bold hover:underline">{t('auth_page.signup_privacy', 'Kebijakan Privasi')}</Link>{t('auth_page.signup_terms_suffix', '.')}
              </Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReqChip({ met, text }: { met: boolean; text: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
      met 
        ? 'bg-[#e2f6d5] text-[#054d28]' 
        : 'bg-[#ffffff] text-[#868685] border border-[#cfd5dd]'
    }`}>
      {met && <Check className="w-3 h-3 stroke-[3]" />}
      {text}
    </span>
  )
}
