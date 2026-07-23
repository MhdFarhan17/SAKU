'use client'

import { MarketingNavbar } from '@/components/marketing-navbar'
import { MarketingFooter } from '@/components/marketing-footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Check, ShieldAlert, Eye, ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'

export default function AboutPage() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 150])

  return (
    <div className="min-h-screen bg-[#F6F8F5] text-[#0e0f0c] flex flex-col font-sans selection:bg-[#9fe870] selection:text-[#0e0f0c] overflow-hidden">
      <MarketingNavbar />
      
      <main className="flex-grow w-full">
        
        {/* HERO HEADER */}
        <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 overflow-hidden pt-32 pb-20">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#9fe870]/30 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#0e0f0c 2px, transparent 2px)', backgroundSize: '48px 48px' }} />
          
          <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e2e6eb] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#454745]">{t('about_page.about_badge', 'Tentang Kami')}</span>
              </div>
              
              <h1 className="text-[56px] md:text-[80px] lg:text-[96px] leading-[1.05] font-black tracking-[-0.04em] text-[#0e0f0c]">
                {t('about_page.about_title_1', 'Transparansi')} <br/>
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 pb-2">
                  {t('about_page.about_title_2', 'di atas segalanya.')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-[#454745] max-w-xl leading-relaxed font-medium">
                {t('about_page.about_subtitle', 'Saku lahir dengan misi sederhana yaitu memberikan Anda kemudahan dalam melacak arah uang, tanpa mengorbankan privasi sedikitpun.')}
              </p>
            </motion.div>
            
            {/* Logo Graphic */}
            <motion.div 
              style={{ y: yImage }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex-1 w-full flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[500px] aspect-square bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-[#e2e6eb] flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#9fe870]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Image 
                  src="/logos/logo.png" 
                  alt="Saku Logo Besar" 
                  width={375} 
                  height={375}
                  className="relative z-10 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out"
                  priority
                />
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#868685]"
          >
            <span className="text-sm font-bold tracking-widest uppercase">{t('about_page.about_scroll', 'Kisah Kami')}</span>
            <ArrowDown className="w-5 h-5 animate-bounce text-[#9fe870]" />
          </motion.div>
        </section>

        {/* STORY SECTION - STICKY SCROLL */}
        <section className="bg-white py-32 px-6 lg:px-12 relative border-t border-[#e2e6eb]">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
            
            {/* Sticky Left */}
            <div className="lg:w-1/2 lg:sticky lg:top-32 h-fit space-y-6">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-[48px] md:text-[64px] leading-[1.05] font-black tracking-[-0.03em] text-[#0e0f0c]"
              >
                {t('about_page.story_title', 'Berawal dari sebuah rasa frustrasi.')}
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              />
            </div>
            
            {/* Scrolling Right */}
            <div className="lg:w-1/2 space-y-12 text-xl md:text-2xl text-[#454745] leading-relaxed font-medium">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                {t('about_page.story_p1', 'Saku lahir dari pengalaman pribadi. Ketika kami mencoba mencari aplikasi pencatat keuangan yang gratis, kami dihadapkan pada dua pilihan buruk yaitu aplikasi yang dipenuhi iklan yang mengganggu, atau aplikasi "gratis" yang secara diam-diam menjual data perilaku konsumsi penggunanya.')}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="p-8 md:p-12 bg-[#0e0f0c] rounded-[32px] shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#9fe870]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#9fe870]/40 transition-colors duration-700" />
                <p className="font-black text-[#ffffff] text-2xl md:text-3xl leading-snug relative z-10 italic">
                  {t('about_page.story_quote', '"Data keuangan adalah hal yang paling privat. Kami menolak memperjualbelikannya demi profit sesaat."')}
                </p>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                {t('about_page.story_p2', 'Tidak seharusnya ada pihak ketiga yang membaca riwayat pembelian kopi Anda, tagihan rumah sakit Anda, atau ke mana sisa gaji bulanan Anda mengalir. Saku dibangun untuk mengembalikan kontrol privasi itu sepenuhnya ke tangan Anda.')}
              </motion.p>
            </div>
            
          </div>
        </section>

        {/* BENTO GRID VALUES SECTION */}
        <section className="bg-[#0B0D11] py-32 px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-[1400px] mx-auto space-y-20 relative z-10">
            
            <div className="text-center space-y-6">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[48px] md:text-[72px] leading-[1.05] font-black tracking-[-0.03em] text-[#ffffff]"
              >
                <Trans i18nKey="about_page.pillar_title" components={{ 1: <span className="text-[#9fe870]" /> }}>
                  Tiga pilar dasar <br className="md:hidden" /><span className="text-[#9fe870]">Saku.</span>
                </Trans>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
              >
                {t('about_page.pillar_subtitle', 'Prinsip operasional kami yang tidak bisa diganggu gugat. Dibangun untuk Anda, berpihak pada Anda.')}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#14171D] rounded-[32px] p-10 flex flex-col gap-8 group hover:-translate-y-2 transition-transform duration-500 border border-[#262C36] shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#9fe870]/5 rounded-full blur-2xl group-hover:bg-[#9fe870]/20 transition-colors duration-500" />
                <div className="w-16 h-16 rounded-[20px] bg-[#1C212A] group-hover:bg-[#9fe870] group-hover:text-[#0e0f0c] text-[#9fe870] flex items-center justify-center transition-colors duration-500 shadow-inner">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-4 text-[#ffffff]">{t('about_page.pillar_1_title', 'Independen')}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {t('about_page.pillar_1_desc', 'Saku berdiri sendiri. Kami tidak berafiliasi dengan bank, asuransi, atau pinjaman online. Algoritma kami bekerja 100% secara lokal untuk Anda.')}
                  </p>
                </div>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#14171D] rounded-[32px] p-10 flex flex-col gap-8 group hover:-translate-y-2 transition-transform duration-500 border border-[#262C36] shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#9fe870]/5 rounded-full blur-2xl group-hover:bg-[#9fe870]/20 transition-colors duration-500" />
                <div className="w-16 h-16 rounded-[20px] bg-[#1C212A] group-hover:bg-[#9fe870] group-hover:text-[#0e0f0c] text-[#9fe870] flex items-center justify-center transition-colors duration-500 shadow-inner">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-4 text-[#ffffff]">{t('about_page.pillar_2_title', '100% Gratis')}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {t('about_page.pillar_2_desc', 'Semua fitur tidak akan pernah dipungut biaya. Tidak ada jebakan langganan, tidak ada *paywall* mendadak di tengah jalan.')}
                  </p>
                </div>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#14171D] rounded-[32px] p-10 flex flex-col gap-8 group hover:-translate-y-2 transition-transform duration-500 border border-[#262C36] shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#9fe870]/5 rounded-full blur-2xl group-hover:bg-[#9fe870]/20 transition-colors duration-500" />
                <div className="w-16 h-16 rounded-[20px] bg-[#1C212A] group-hover:bg-[#9fe870] group-hover:text-[#0e0f0c] text-[#9fe870] flex items-center justify-center transition-colors duration-500 shadow-inner">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-4 text-[#ffffff]">{t('about_page.pillar_3_title', 'Transparan')}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {t('about_page.pillar_3_desc', 'Kode etik yang jelas. Anda memegang kendali penuh atas data Anda, termasuk hak untuk menghapus akun dan seluruh jejak riwayat selamanya.')}
                  </p>
                </div>
              </motion.div>
            </div>
            
          </div>
        </section>

      </main>

      <ScrollToTop />
      <MarketingFooter />
    </div>
  )
}
