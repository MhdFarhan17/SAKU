'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MarketingNavbar } from '@/components/marketing-navbar'
import { MarketingFooter } from '@/components/marketing-footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { PwaInstallButton } from '@/components/pwa-install-button'
import { ArrowRight, Check, Activity, Target, PieChart, Users, Repeat, Shield, Wallet, ChevronRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'

export default function MarketingPage() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const yImageDesktop = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacityTextDesktop = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  // Animation Variants
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }
  
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8F5] text-[#0e0f0c] flex flex-col font-sans selection:bg-[#9fe870] selection:text-[#0e0f0c] overflow-hidden">
      <MarketingNavbar />
      
      <main className="flex-1 w-full">
        
        {/* HERO SECTION */}
        <section ref={heroRef} className="relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full min-h-[70vh] md:min-h-[90vh] flex flex-col justify-center">
          {/* Decorative Gradient Blob */}
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#9fe870]/30 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-24 relative z-10">
            
            {/* Left Headline */}
            <motion.div 
              style={{ opacity: isMobile ? 1 : opacityTextDesktop }}
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer} 
              className="flex-1 space-y-5 md:space-y-8 w-full"
            >

              <motion.h1 variants={fadeInUp} className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[72px] xl:text-[84px] leading-[1.05] font-black tracking-[-0.04em] text-[#0e0f0c]">
                {t('home.hero_title_1', 'Cerdas kelola')} <br />
                <span className="relative inline-block">
                  <span className="relative z-10">{t('home.hero_title_2', 'uang Anda.')}</span>
                  <div className="absolute -bottom-2 left-0 w-full h-6 bg-[#9fe870]/40 -rotate-2 -z-0"></div>
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#454745] max-w-xl leading-relaxed font-medium">
                {t('home.hero_subtitle', 'Saku menggabungkan pencatatan, anggaran, target tabungan, dan pelacakan hutang dalam satu dasbor super cerdas.')}
              </motion.p>
              
              <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base md:text-lg rounded-[24px] bg-[#0e0f0c] hover:bg-[#2a2a2a] text-white font-bold shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95 group border-none">
                  <Link href="/signup">
                    {t('home.btn_start', 'Mulai Sekarang')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base md:text-lg rounded-[24px] bg-white border border-gray-200 shadow-sm text-[#0e0f0c] hover:bg-gray-50 hover:text-[#0e0f0c] font-bold transition-all hover:scale-105 active:scale-95">
                  <Link href="#features">{t('home.btn_features', 'Lihat Fitur')}</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Interactive Mockup */}
            <motion.div 
              style={{ y: isMobile ? 0 : yImageDesktop }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full max-w-[600px] lg:max-w-none relative perspective-1000 mt-6 md:mt-0"
            >
              <div className="relative bg-white/60 backdrop-blur-3xl rounded-[24px] md:rounded-[40px] p-2 sm:p-4 md:p-8 shadow-2xl shadow-black/10 border border-white flex items-center justify-center overflow-visible group transform-gpu md:rotate-y-[-10deg] md:rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700">
                
                {/* Main Dashboard UI Mockup */}
                <div className="w-full bg-[#fbfcfb] rounded-[24px] border border-[#e2e6eb] shadow-sm overflow-hidden flex flex-col relative z-10">
                  <div className="h-12 border-b border-[#e2e6eb] flex items-center px-6 justify-between bg-white">
                    <div className="font-black text-lg flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#9fe870] flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-[#0e0f0c]" />
                      </div>
                      Saku.
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-[#fbfcfb]">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#868685] mb-1">{t('home.mock_total_balance', 'Total Saldo')}</div>
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">Rp 24.500.000</div>
                      </div>
                      <div className="bg-[#9fe870] text-[#0e0f0c] text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">+12%</div>
                    </div>

                    <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
                      <div className="flex-1 bg-white border border-[#e2e6eb] p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] shadow-sm">
                        <div className="text-[10px] sm:text-xs font-bold text-[#868685] mb-1">{t('home.mock_income', 'Pemasukan')}</div>
                        <div className="text-sm sm:text-base md:text-lg font-black text-green-600">Rp 15.000.000</div>
                      </div>
                      <div className="flex-1 bg-white border border-[#e2e6eb] p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] shadow-sm">
                        <div className="text-[10px] sm:text-xs font-bold text-[#868685] mb-1">{t('home.mock_expense', 'Pengeluaran')}</div>
                        <div className="text-sm sm:text-base md:text-lg font-black text-red-500">Rp 4.200.000</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Component 1: Goal */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 md:-right-12 z-20 bg-white rounded-[24px] p-5 shadow-xl shadow-black/10 border border-[#e2e6eb] w-64 hidden sm:block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-blue-100 flex items-center justify-center text-xl">🏖️</div>
                      <div>
                        <p className="text-sm font-bold text-[#0e0f0c]">{t('home.mock_holiday', 'Liburan')}</p>
                        <p className="text-xs font-medium text-[#868685]">Rp 8Jt / Rp 10Jt</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[80%]" />
                  </div>
                </motion.div>

                {/* Floating Component 2: Alert */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-8 -left-8 md:-left-12 z-20 bg-[#0e0f0c] text-white rounded-[24px] p-4 shadow-2xl border border-white/10 flex items-center gap-4 w-60 hidden sm:flex"
                >
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#a4a5a3] uppercase tracking-wider">Anggaran F&B</p>
                    <p className="text-sm font-bold">{t('home.mock_limit', 'Mendekati limit!')}</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>
            
          </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section id="features" className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16 lg:mb-20"
          >
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] lg:text-[56px] leading-[1.05] font-black tracking-[-0.03em] mb-4 md:mb-6">
              {t('home.feat_title_1', 'Fitur yang Anda butuhkan,')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                {t('home.feat_title_2', 'tanpa kerumitan.')}
              </span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-[#454745] max-w-2xl mx-auto">
              {t('home.feat_subtitle', 'Dibangun dengan teknologi terbaru untuk memberikan pengalaman yang secepat kilat dan aman.')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(220px,_auto)] md:auto-rows-[minmax(300px,_auto)]">
            
            {/* Box 1: Visual Analytics (Wide) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 lg:p-12 border border-[#e2e6eb] shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#9fe870]/20 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 bg-[#0e0f0c] text-[#9fe870] rounded-[16px] flex items-center justify-center mb-6">
                  <PieChart className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3">{t('home.feat_1_title', 'Analitik Tajam')}</h3>
                <p className="text-base md:text-lg text-[#737e8d] font-medium leading-relaxed mb-4 md:mb-8">
                  {t('home.feat_1_desc', 'Pantau tren pengeluaran dengan grafik interaktif. Ketahui secara pasti ke mana uang Anda mengalir setiap bulannya.')}
                </p>
              </div>

              {/* Chart Mockup */}
              <div className="absolute right-[-20%] bottom-[-10%] md:right-8 md:bottom-8 w-[80%] md:w-[350px] bg-[#fbfcfb] border border-[#e2e6eb] rounded-[24px] p-6 shadow-xl transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500 hidden sm:block">
                <div className="flex items-end gap-3 h-32 w-full justify-between">
                  <div className="w-full bg-[#e2f6d5] rounded-t-lg h-[40%]" />
                  <div className="w-full bg-green-500 rounded-t-lg h-[80%]" />
                  <div className="w-full bg-[#e2f6d5] rounded-t-lg h-[60%]" />
                  <div className="w-full bg-green-500 rounded-t-lg h-[100%]" />
                  <div className="w-full bg-[#e2f6d5] rounded-t-lg h-[70%]" />
                </div>
                <div className="border-t border-[#e2e6eb] mt-4 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-[#868685]">Pertumbuhan</span>
                  <span className="text-sm font-black text-green-600">+24.5%</span>
                </div>
              </div>
            </motion.div>

            {/* Box 2: Savings Goals */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 lg:p-10 border border-[#e2e6eb] shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-3">{t('home.feat_2_title', 'Target Tabungan')}</h3>
                <p className="text-[#737e8d] font-medium leading-relaxed">
                  {t('home.feat_2_desc', 'Rencanakan impian Anda dan pantau progres tabungan secara visual.')}
                </p>
              </div>
              <div className="mt-8 bg-[#fbfcfb] border border-[#e2e6eb] p-4 rounded-[20px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">MacBook Pro</span>
                  <span className="text-xs font-bold text-blue-600">80%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[80%] rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Box 3: Debts Tracker */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#0e0f0c] text-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 text-white rounded-[16px] flex items-center justify-center mb-6 backdrop-blur-md">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-3">{t('home.feat_3_title', 'Catat Hutang')}</h3>
                <p className="text-[#a4a5a3] font-medium leading-relaxed">
                  {t('home.feat_3_desc', 'Tidak ada lagi uang yang lupa ditagih. Kelola hutang dan piutang transparan.')}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-[20px] relative z-10">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Piutang Budi</div>
                  <div className="text-xs text-[#a4a5a3]">Lunas Terbayar</div>
                </div>
              </div>
            </motion.div>

            {/* Box 4: Budgets & Recurring (Wide) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2 bg-[#9fe870] text-[#0e0f0c] rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 lg:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 group overflow-hidden"
            >
              <div className="flex-1 max-w-sm">
                <div className="flex gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#0e0f0c] text-white rounded-[16px] flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="w-12 h-12 bg-white/50 text-[#0e0f0c] rounded-[16px] flex items-center justify-center">
                    <Repeat className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3">{t('home.feat_4_title', 'Anggaran & Rutin')}</h3>
                <p className="text-[#0e0f0c]/70 font-medium leading-relaxed mb-6">
                  {t('home.feat_4_desc', 'Setel anggaran per kategori dan otomatisasi tagihan bulanan. Anti boncos, anti telat bayar.')}
                </p>
                <Button asChild variant="outline" className="rounded-[16px] border-[#0e0f0c] text-[#0e0f0c] hover:bg-[#0e0f0c] hover:text-white font-bold bg-transparent">
                  <Link href="/signup">{t('home.feat_btn', 'Coba Sekarang')}</Link>
                </Button>
              </div>
              
              <div className="flex-1 w-full flex flex-col gap-4">
                {/* Budget card mock */}
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-[20px] shadow-sm transform translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Anggaran Makan</span>
                    <span className="text-sm font-bold text-yellow-600">85% Terpakai</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[85%] rounded-full" />
                  </div>
                </div>
                
                {/* Recurring card mock */}
                <div className="bg-[#0e0f0c] text-white p-4 rounded-[20px] shadow-xl transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">N</div>
                      <div>
                        <div className="font-bold text-sm">Netflix Sub</div>
                        <div className="text-xs text-gray-400">Bulanan</div>
                      </div>
                    </div>
                    <div className="font-bold">- Rp 186.000</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* DARK MODE SHOWCASE */}
        <section className="py-16 my-10 md:py-24 md:my-20 bg-[#0B0D11] text-white overflow-hidden relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-white/70">{t('home.dark_badge', 'Tersedia Fitur Dark Mode')}</span>
              </div>
              <h2 className="text-[28px] sm:text-[36px] md:text-[40px] lg:text-[56px] leading-[1.05] font-black tracking-[-0.03em] mb-4 md:mb-6">
                {t('home.dark_title_1', 'Gelap, Elegan,')} <br/> {t('home.dark_title_2', 'Nyaman di Mata.')}
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-lg mb-6 md:mb-8 leading-relaxed">
                <Trans i18nKey="home.dark_desc" components={{ 1: <strong /> }}>
                  Saku hadir dengan dukungan <strong>Dark Mode</strong> yang terintegrasi secara otomatis. Tetap fokus mengatur keuangan di malam hari tanpa membuat mata lelah.
                </Trans>
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 w-full max-w-[500px]"
            >
              <div className="bg-[#14171D] rounded-[32px] p-6 border border-[#262C36] shadow-2xl relative">
                {/* Floating Elements mimicking dark mode UI */}
                <div className="bg-[#1C212A] rounded-[24px] p-5 mb-4 border border-[#262C36] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-[16px] flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-white font-bold">{t('home.mock_invest', 'Investasi')}</div>
                      <div className="text-gray-500 text-sm">Rp 10.000.000</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1C212A] rounded-[24px] p-5 border border-[#262C36]">
                    <div className="text-gray-500 text-xs font-bold mb-2">{t('home.mock_income_caps', 'PEMASUKAN')}</div>
                    <div className="text-green-400 font-black text-xl">Rp 5.2M</div>
                  </div>
                  <div className="bg-[#1C212A] rounded-[24px] p-5 border border-[#262C36]">
                    <div className="text-gray-500 text-xs font-bold mb-2">{t('home.mock_expense_caps', 'PENGELUARAN')}</div>
                    <div className="text-red-400 font-black text-xl">Rp 1.1M</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PWA SHOWCASE */}
        <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
          <div className="bg-[#9fe870]/10 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] p-6 sm:p-10 md:p-16 lg:p-20 border border-[#9fe870]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-20">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9fe870]/20 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0e0f0c]/5 rounded-full blur-[80px] pointer-events-none -z-10" />
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e2e6eb] shadow-sm mb-6">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0e0f0c] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9fe870] animate-pulse" />
                  {t('home.pwa_badge', 'Aplikasi PWA')}
                </span>
              </div>
              <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] leading-[1.05] font-black tracking-[-0.03em] mb-4 md:mb-6 text-[#0e0f0c]">
                {t('home.pwa_title_1', 'Pasang di')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5ea330] to-[#254611]">
                  {t('home.pwa_title_2', 'Layar Utama.')}
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#454745] font-medium leading-relaxed mb-8 md:mb-10 max-w-lg">
                {t('home.pwa_desc', 'Saku kini mendukung Progressive Web App (PWA). Install langsung ke HP atau laptop Anda untuk akses secepat kilat layaknya aplikasi native, tanpa memakan memori besar.')}
              </p>
              
              <div className="w-full sm:max-w-[280px]">
                <PwaInstallButton />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-[400px] lg:max-w-[500px] relative z-10 flex justify-center"
            >
              {/* Phone Mockup */}
              <div className="w-[260px] sm:w-[280px] md:w-[320px] h-[520px] sm:h-[580px] md:h-[650px] bg-[#0e0f0c] rounded-[36px] md:rounded-[48px] p-2 sm:p-3 md:p-4 shadow-2xl relative border-[3px] sm:border-4 border-[#e2e6eb]">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-4 sm:top-5 md:top-6 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-6 sm:h-7 bg-black rounded-full z-20 flex justify-end items-center pr-3 sm:pr-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#1a1a1a]" />
                </div>
                
                {/* Screen */}
                <div className="w-full h-full bg-[#fbfcfb] rounded-[28px] md:rounded-[36px] overflow-hidden relative flex flex-col">
                  {/* App Header Mockup */}
                  <div className="h-20 sm:h-24 bg-white border-b border-[#e2e6eb] flex items-end px-4 sm:px-6 pb-3 sm:pb-4">
                    <div className="font-black text-lg sm:text-xl flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#9fe870] flex items-center justify-center">
                        <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0e0f0c]" />
                      </div>
                      Saku.
                    </div>
                  </div>
                  {/* App Content Mockup */}
                  <div className="p-4 sm:p-5 flex-1 bg-[#fbfcfb] space-y-3 sm:space-y-4">
                    <div className="w-full h-20 sm:h-24 bg-gradient-to-r from-[#9fe870] to-[#7ac24f] rounded-[16px] sm:rounded-[20px] p-3 sm:p-4 flex flex-col justify-end shadow-sm">
                      <div className="text-white/80 text-[10px] sm:text-xs font-bold mb-1">{t('home.mock_total_balance', 'Total Saldo')}</div>
                      <div className="text-white font-black text-lg sm:text-xl">Rp 24.500.000</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-white border border-[#e2e6eb] rounded-[12px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-sm">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center mb-1.5 sm:mb-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500" />
                        </div>
                        <div className="h-1.5 sm:h-2 w-12 sm:w-16 bg-gray-200 rounded-full mb-1" />
                        <div className="h-2 sm:h-3 w-16 sm:w-20 bg-gray-300 rounded-full" />
                      </div>
                      <div className="bg-white border border-[#e2e6eb] rounded-[12px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-sm">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 flex items-center justify-center mb-1.5 sm:mb-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500" />
                        </div>
                        <div className="h-1.5 sm:h-2 w-12 sm:w-16 bg-gray-200 rounded-full mb-1" />
                        <div className="h-2 sm:h-3 w-16 sm:w-20 bg-gray-300 rounded-full" />
                      </div>
                    </div>

                    <div className="w-full h-24 sm:h-32 bg-white border border-[#e2e6eb] rounded-[12px] sm:rounded-[16px] shadow-sm mt-1 sm:mt-2 flex flex-col gap-1.5 sm:gap-2 p-2.5 sm:p-3">
                       <div className="h-2 sm:h-3 w-20 sm:w-24 bg-gray-200 rounded-full mb-1 sm:mb-2" />
                       <div className="flex gap-1 sm:gap-2 h-full items-end">
                         <div className="w-full bg-[#e2f6d5] rounded-t-sm h-[40%]" />
                         <div className="w-full bg-green-500 rounded-t-sm h-[80%]" />
                         <div className="w-full bg-[#e2f6d5] rounded-t-sm h-[60%]" />
                         <div className="w-full bg-green-500 rounded-t-sm h-[100%]" />
                       </div>
                    </div>
                  </div>
                  
                  {/* Bottom Navigation Mockup */}
                  <div className="h-14 sm:h-16 bg-white border-t border-[#e2e6eb] flex items-center justify-around px-1 sm:px-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#9fe870]/20 flex items-center justify-center text-[#254611]"><Wallet className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent flex items-center justify-center text-gray-400"><PieChart className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0e0f0c] flex items-center justify-center text-white -mt-4 sm:-mt-5 shadow-lg"><div className="text-lg sm:text-xl">+</div></div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent flex items-center justify-center text-gray-400"><Target className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent flex items-center justify-center text-gray-400"><Users className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA HERO BAND */}
        <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#F6F8F5]/50 -z-10" />
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8 md:space-y-12"
          >
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-[1.05] font-black tracking-[-0.04em] text-[#0e0f0c]">
              {t('home.cta_title_1', 'Mulai Kendalikan')} <br/> {t('home.cta_title_2', 'Uang Anda.')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#454745] font-medium">
              {t('home.cta_desc', 'Gratis selamanya. Tidak ada iklan. Tidak ada langganan.')}
            </p>
            <div className="pt-4 flex justify-center">
              <Button asChild className="h-14 sm:h-16 md:h-20 px-8 sm:px-10 md:px-16 text-base sm:text-lg md:text-xl lg:text-2xl rounded-full bg-[#0e0f0c] hover:bg-[#2a2a2a] text-white font-black shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all group border-none">
                <Link href="/signup">
                  {t('home.cta_btn', 'Buat Akun Saku')}
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

      </main>

      <ScrollToTop />
      <MarketingFooter />
    </div>
  )
}
