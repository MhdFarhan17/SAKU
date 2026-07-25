'use client'

import Link from 'next/link'
import { MarketingNavbar } from '@/components/marketing-navbar'
import { MarketingFooter } from '@/components/marketing-footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, PieChart, Target, Shield, Users, Lock, ChevronRight, Activity, Wallet, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function FeaturesPage() {
  const { t } = useTranslation()
  
  // Animation Variants
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
  
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8F5] text-[#0e0f0c] flex flex-col font-sans selection:bg-[#9fe870] selection:text-[#0e0f0c] overflow-hidden">
      <MarketingNavbar />
      
      <main className="flex-grow w-full">
        
        {/* HERO HEADER */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 md:px-6 lg:px-12 flex flex-col items-center text-center">
          {/* Decorative Gradient Blob */}
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#9fe870]/30 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-10" />

          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="max-w-[1400px] mx-auto text-center space-y-8 relative z-10"
          >

            <motion.h1 variants={fadeInUp} className="text-[40px] md:text-[64px] lg:text-[72px] leading-[1.05] font-black tracking-[-0.04em] text-[#0e0f0c] max-w-4xl mx-auto">
              {t('features_page.hero_title_1', 'Semua fitur,')} <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">{t('features_page.hero_title_2', 'nol kompleksitas.')}</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-[#454745] max-w-2xl mx-auto leading-relaxed">
              {t('features_page.hero_subtitle', 'Saku dirancang agar Anda bisa langsung menguasai arus kas Anda sejak detik pertama aplikasi dibuka.')}
            </motion.p>
          </motion.div>
        </section>

        {/* FEATURE SECTIONS */}
        
        {/* Feature 1: Fast Input & Central Dashboard */}
        <section className="py-16 md:py-24 px-4 md:px-6 lg:px-12 relative">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-8"
            >
              <div className="w-16 h-16 bg-[#0e0f0c] text-[#9fe870] rounded-[16px] flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8" />
              </div>
              <h2 className="text-[32px] md:text-[56px] leading-[1.05] font-black tracking-[-0.03em]">
                {t('features_page.feat_1_title_1', 'Satu layar.')} <br/> {t('features_page.feat_1_title_2', 'Input kilat.')}
              </h2>
              <p className="text-lg md:text-2xl text-[#454745] max-w-xl leading-relaxed">
                {t('features_page.feat_1_desc', 'Tidak ada form panjang. Cukup ketik nominal, pilih kategori, dan selesai dalam 3 detik. Semua saldo dari berbagai dompet atau bank Anda terangkum di satu Dasbor pusat.')}
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-lg font-bold"><Check className="text-green-500" /> {t('features_page.feat_1_list_1', 'Multi-rekening & E-Wallet')}</li>
                <li className="flex items-center gap-3 text-lg font-bold"><Check className="text-green-500" /> {t('features_page.feat_1_list_2', 'Kategori yang bisa dikustomisasi')}</li>
                <li className="flex items-center gap-3 text-lg font-bold"><Check className="text-green-500" /> {t('features_page.feat_1_list_3', 'Desain UI ramah jari (Mobile Friendly)')}</li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full flex justify-center relative perspective-1000"
            >
              <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[40px] p-8 w-full max-w-[500px] shadow-2xl shadow-black/5 transform-gpu rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500 group">
                <div className="bg-[#fbfcfb] rounded-[24px] p-6 shadow-sm border border-[#e2e6eb]">
                  <p className="text-sm font-bold text-[#868685] mb-2 uppercase tracking-wide">{t('features_page.mock_new_expense', 'Pengeluaran Baru')}</p>
                  <p className="text-[48px] font-black tracking-tighter mb-8 text-red-500">- Rp 45.000</p>
                  
                  <div className="flex flex-col gap-3">
                    <div className="bg-white border-2 border-green-500 rounded-[16px] p-4 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">🍔</div>
                        <span className="font-bold text-[#0e0f0c]">{t('features_page.mock_food', 'Makanan & Minuman')}</span>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="bg-white border border-[#e2e6eb] rounded-[16px] p-4 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">🚕</div>
                        <span className="font-bold text-[#0e0f0c]">{t('features_page.mock_transport', 'Transportasi')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature 2: Analytics (Alternating Layout) */}
        <section className="py-16 md:py-24 px-4 md:px-6 lg:px-12 bg-white/50">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-8"
            >
              <div className="w-16 h-16 bg-[#9fe870] text-[#0e0f0c] rounded-[16px] flex items-center justify-center shadow-lg">
                <PieChart className="w-8 h-8" />
              </div>
              <h2 className="text-[32px] md:text-[56px] leading-[1.05] font-black tracking-[-0.03em]">
                {t('features_page.feat_2_title_1', 'Laporan tajam.')} <br/> {t('features_page.feat_2_title_2', 'Mudah dicerna.')}
              </h2>
              <p className="text-lg md:text-2xl text-[#454745] max-w-xl leading-relaxed">
                {t('features_page.feat_2_desc', 'Pahami pola kebiasaan belanja Anda melalui visualisasi data interaktif. Pantau tren arus kas bulanan tanpa perlu membuat spreadsheet Excel yang membosankan.')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full flex justify-center"
            >
              <div className="bg-white border border-[#e2e6eb] rounded-[32px] p-8 w-full max-w-[500px] shadow-xl flex flex-col gap-8 group">
                <div className="flex justify-between items-end border-b border-[#e2e6eb] pb-6">
                  <div>
                    <p className="text-sm font-bold text-[#868685] mb-1">{t('features_page.mock_net_cashflow', 'Arus Kas Bersih')}</p>
                    <p className="text-[40px] font-black tracking-tighter text-[#0e0f0c]">Rp 14.5M</p>
                  </div>
                  <div className="bg-[#9fe870] text-[#0e0f0c] px-3 py-1.5 rounded-full font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                    {t('features_page.mock_up', 'Naik 24%')}
                  </div>
                </div>
                
                <div className="flex items-end gap-3 h-48 w-full">
                  <div className="flex-1 bg-green-100 rounded-t-lg h-[40%] group-hover:h-[45%] transition-all duration-500" />
                  <div className="flex-1 bg-green-200 rounded-t-lg h-[60%] group-hover:h-[65%] transition-all duration-500" />
                  <div className="flex-1 bg-green-500 rounded-t-lg h-[85%] group-hover:h-[95%] transition-all duration-500 shadow-lg shadow-green-500/30" />
                  <div className="flex-1 bg-green-100 rounded-t-lg h-[30%] group-hover:h-[35%] transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature 3: Target Tabungan & Manajemen Hutang (Grid Split) */}
        <section className="py-16 md:py-24 px-4 md:px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto text-center mb-16">
            <h2 className="text-[32px] md:text-[56px] leading-[1.05] font-black tracking-[-0.03em] mb-6">
              {t('features_page.feat_3_title', 'Mulai capai kebebasan finansial.')}
            </h2>
            <p className="text-lg md:text-xl text-[#454745] max-w-2xl mx-auto">
              {t('features_page.feat_3_desc', 'Fitur khusus untuk membantu Anda menabung demi impian, dan melunasi hutang tepat waktu.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
            {/* Savings Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-[#e2e6eb] p-10 rounded-[32px] shadow-sm flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-[16px] flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black mb-3">{t('features_page.feat_3_target_title', 'Target Tabungan')}</h3>
                <p className="text-lg text-[#737e8d] font-medium leading-relaxed mb-10">
                  {t('features_page.feat_3_target_desc', 'Rencanakan liburan, beli gadget, atau dana darurat. Buat banyak celengan digital secara terpisah tanpa perlu buka rekening baru.')}
                </p>
              </div>
              
              <div className="bg-[#fbfcfb] border border-[#e2e6eb] p-6 rounded-[24px] relative z-10 transform group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-[#e2e6eb]">✈️</div>
                  <div>
                    <div className="font-bold text-lg">{t('features_page.mock_japan', 'Liburan ke Jepang')}</div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t('features_page.mock_collected', 'Terkumpul Rp 15 Jt')}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm font-bold">
                  <span className="text-[#868685]">{t('features_page.mock_from', 'Dari Rp 20 Jt')}</span>
                  <span className="text-blue-600">75%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[75%] rounded-full shadow-sm" />
                </div>
              </div>
            </motion.div>

            {/* Debts Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#0e0f0c] text-white border border-[#262C36] p-10 rounded-[32px] shadow-xl flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-500/10 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 text-white rounded-[16px] flex items-center justify-center mb-6 backdrop-blur-md">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black mb-3">{t('features_page.feat_3_debt_title', 'Pencatat Hutang')}</h3>
                <p className="text-lg text-[#a4a5a3] font-medium leading-relaxed mb-10">
                  {t('features_page.feat_3_debt_desc', 'Hindari lupa atau sungkan menagih. Kelola riwayat utang dan piutang teman Anda secara transparan.')}
                </p>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <div className="bg-white/10 border border-white/10 p-4 rounded-[20px] flex items-center justify-between backdrop-blur-md transform group-hover:translate-x-2 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold">
                      <ArrowRight className="w-5 h-5 rotate-45" />
                    </div>
                    <div>
                      <div className="font-bold">{t('features_page.mock_debt_me', 'Saya Berhutang - Budi')}</div>
                      <div className="text-xs font-medium text-red-300">{t('features_page.mock_due_tomorrow', 'Jatuh Tempo: Besok')}</div>
                    </div>
                  </div>
                  <div className="font-black text-red-400">Rp 500k</div>
                </div>
                
                <div className="bg-white/10 border border-white/10 p-4 rounded-[20px] flex items-center justify-between backdrop-blur-md opacity-50 transform group-hover:-translate-x-2 transition-transform duration-300 delay-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">{t('features_page.mock_netflix', 'Berlangganan Netflix')}</div>
                      <div className="text-xs font-medium text-gray-500">{t('features_page.mock_next_month', 'Bulan Depan')}</div>
                    </div>
                  </div>
                  <div className="font-black text-green-400 line-through">Rp 200k</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature 4: Budget & Security (Bento Boxes) */}
        <section className="py-16 md:py-24 px-4 md:px-6 lg:px-12 bg-[#ffffff]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#F6F8F5] p-8 rounded-[32px] border border-[#e2e6eb]"
            >
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-3">{t('features_page.feat_4_budget_title', 'Anggaran Disiplin')}</h3>
              <p className="text-[#737e8d] font-medium leading-relaxed">
                {t('features_page.feat_4_budget_desc', 'Tetapkan limit pengeluaran per kategori. Indikator cerdas Saku akan berubah warna menjadi kuning saat mendekati batas, mencegah Anda boros.')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#F6F8F5] p-8 rounded-[32px] border border-[#e2e6eb]"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-3">{t('features_page.feat_4_privacy_title', 'Privasi & Keamanan')}</h3>
              <p className="text-[#737e8d] font-medium leading-relaxed">
                {t('features_page.feat_4_privacy_desc', 'Data Anda dienkripsi dengan standar industri (AES-256 via Supabase). Kami tidak menjual data ke pihak ketiga.')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#F6F8F5] p-8 rounded-[32px] border border-[#e2e6eb]"
            >
              <div className="w-12 h-12 bg-[#0e0f0c] text-white rounded-full flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-3">{t('features_page.feat_4_dark_title', 'Auto Dark Mode')}</h3>
              <p className="text-[#454745] font-medium leading-relaxed">
                {t('features_page.feat_4_dark_desc', 'Sensitif terhadap cahaya di malam hari? Sistem tema cerdas otomatis beradaptasi dengan preferensi OS Anda, memberikan nuansa elegan bebas silau.')}
              </p>
            </motion.div>
            
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 md:py-32 px-4 md:px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-[1200px] mx-auto bg-[#0e0f0c] text-white rounded-[32px] md:rounded-[40px] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9fe870]/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-[36px] md:text-[64px] lg:text-[80px] leading-[1.05] font-black tracking-[-0.04em] text-white">
              {t('features_page.cta_title_1', 'Kendali penuh,')} <br/> {t('features_page.cta_title_2', 'mulai dari sekarang.')}
            </h2>
            <p className="text-lg md:text-2xl text-gray-400 font-medium">
              {t('features_page.cta_desc', 'Berhenti menebak-nebak ke mana uang Anda pergi. Ratusan pengguna telah beralih ke Saku.')}
            </p>
              <div className="pt-8">
                <Button asChild className="h-20 px-16 text-2xl rounded-full bg-[#9fe870] hover:bg-[#cdffad] text-[#0e0f0c] font-black shadow-2xl shadow-[#9fe870]/20 hover:scale-105 active:scale-95 transition-all group border-none">
                  <Link href="/signup">
                  {t('cta_btn', 'Buat Akun Saku')}
                  <ChevronRight className="w-8 h-8 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
      
      <ScrollToTop />
      <MarketingFooter />
    </div>
  )
}
