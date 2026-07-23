'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, ChevronRight, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isLangOpen, setIsLangOpen] = React.useState(false)
  const pathname = usePathname()
  
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'EN' ? 'EN' : 'ID'

  const handleLangChange = (newLang: string) => {
    i18n.changeLanguage(newLang)
    localStorage.setItem('saku_lang', newLang)
    setIsLangOpen(false)
  }

  // Define navLinks dynamically so they translate
  const navLinks = [
    { name: t('navbar.home', 'Beranda'), href: '/' },
    { name: t('navbar.features', 'Fitur'), href: '/features' },
    { name: t('navbar.about', 'Tentang'), href: '/about' },
  ]

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-[#F6F8F5]/90 backdrop-blur-xl border-b border-[#0e0f0c]/10" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image 
            src="/logos/logo.png" 
            alt="Saku Logo" 
            width={36} 
            height={36}
            className="object-contain"
            priority
          />
          <span className="text-[28px] font-black text-[#0e0f0c] tracking-[-0.04em]">Saku</span>
        </Link>

        {/* Desktop Nav with Animated Pill */}
        <nav className="hidden md:flex items-center gap-2 bg-[#ffffff] p-1.5 rounded-full shadow-sm border border-[#0e0f0c]/10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={cn(
                  "relative px-6 py-2.5 text-sm font-bold rounded-full transition-colors",
                  isActive ? "text-[#0e0f0c]" : "text-[#737e8d] hover:text-[#0e0f0c]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-[#F6F8F5] rounded-full -z-10 border border-[#e2e6eb]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#F6F8F5] transition-colors text-sm font-bold text-[#454745] mr-2"
            >
              <Globe className="w-4 h-4" />
              <span>{lang}</span>
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-36 bg-white rounded-[16px] shadow-xl border border-[#e2e6eb] py-2 z-50 overflow-hidden"
                  >
                    <button 
                      onClick={() => handleLangChange('ID')}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-[#F6F8F5] transition-colors flex items-center justify-between"
                    >
                      <span className={lang === 'ID' ? "text-[#0e0f0c]" : "text-[#737e8d]"}>{t('navbar.lang_id', 'Indonesia')}</span>
                      {lang === 'ID' && <div className="w-1.5 h-1.5 rounded-full bg-[#9fe870]" />}
                    </button>
                    <button 
                      onClick={() => handleLangChange('EN')}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-[#F6F8F5] transition-colors flex items-center justify-between"
                    >
                      <span className={lang === 'EN' ? "text-[#0e0f0c]" : "text-[#737e8d]"}>{t('navbar.lang_en', 'English')}</span>
                      {lang === 'EN' && <div className="w-1.5 h-1.5 rounded-full bg-[#9fe870]" />}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Link href="/login" className="text-base font-bold text-[#0e0f0c] hover:text-[#454745] transition-colors px-4 border-l border-[#e2e6eb]">
            {t('navbar.login', 'Masuk')}
          </Link>
          <Button asChild className="rounded-full px-6 h-12 text-base bg-[#9fe870] hover:bg-[#cdffad] text-[#0e0f0c] font-black shadow-lg shadow-[#9fe870]/20 border-none transition-all hover:scale-105 active:scale-95 group">
            <Link href="/signup">
              {t('navbar.signup_free', 'Daftar Gratis')}
              <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-12 h-12 flex items-center justify-center text-[#0e0f0c] rounded-full hover:bg-[#ffffff]"
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 bg-[#ffffff] border border-[#0e0f0c]/10 rounded-[24px] shadow-2xl p-8 flex flex-col gap-8 animate-in slide-in-from-top-4 fade-in-0">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={cn(
                    "text-2xl font-black transition-colors flex items-center gap-3",
                    isActive ? "text-[#0e0f0c]" : "text-[#868685] hover:text-[#0e0f0c]"
                  )}
                >
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#9fe870]" />}
                  {link.name}
                </Link>
              )
            })}
          </div>
          
          <div className="h-px w-full bg-[#F6F8F5]" />
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#868685]">{t('navbar.language', 'Bahasa')}</span>
            <div className="flex bg-[#F6F8F5] p-1 rounded-full border border-[#e2e6eb]">
              <button 
                onClick={() => handleLangChange('ID')} 
                className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all", lang === 'ID' ? "bg-white shadow-sm text-[#0e0f0c]" : "text-[#868685] hover:text-[#0e0f0c]")}
              >
                ID
              </button>
              <button 
                onClick={() => handleLangChange('EN')} 
                className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all", lang === 'EN' ? "bg-white shadow-sm text-[#0e0f0c]" : "text-[#868685] hover:text-[#0e0f0c]")}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button asChild variant="outline" className="w-full justify-center rounded-full h-14 text-lg border-gray-200 text-[#0e0f0c] font-bold">
              <Link href="/login">{t('navbar.login', 'Masuk')}</Link>
            </Button>
            <Button asChild className="w-full justify-center rounded-full h-14 text-lg bg-[#9fe870] hover:bg-[#cdffad] text-[#0e0f0c] font-black shadow-lg shadow-[#9fe870]/20 border-none group transition-all">
              <Link href="/signup">
                {t('navbar.signup_free', 'Daftar Gratis')}
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
