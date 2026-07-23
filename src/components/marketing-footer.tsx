import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MarketingFooter() {
  const { t } = useTranslation()

  return (
    <footer className="bg-[#0B0D11] text-[#e8ebe6] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9fe870]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-4 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 border-b border-[#262C36] pb-12">
          
          {/* ZONA 1: Brand & Social */}
          <div className="col-span-1 md:col-span-6 space-y-8 pr-0 md:pr-12">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
              <Image 
                src="/logos/logo.png" 
                alt="Saku Logo" 
                width={40} 
                height={40}
                className="object-contain group-hover:rotate-12 transition-transform duration-500"
              />
              <span className="text-4xl font-black text-[#ffffff] tracking-[-0.04em]">Saku</span>
            </Link>
            <p className="text-xl font-bold text-gray-400 max-w-sm leading-relaxed">
              {t('footer.slogan', 'Catat uangmu, lihat ke mana perginya. Kendali penuh privasi di tangan Anda.')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              <a href="mailto:farhan@mdfarhan.site" className="w-12 h-12 rounded-full bg-[#1C212A] border border-[#262C36] flex items-center justify-center text-gray-400 hover:text-[#9fe870] hover:border-[#9fe870]/50 hover:bg-[#9fe870]/10 transition-all duration-300 group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://github.com/MhdFarhan17" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1C212A] border border-[#262C36] flex items-center justify-center text-gray-400 hover:text-[#9fe870] hover:border-[#9fe870]/50 hover:bg-[#9fe870]/10 transition-all duration-300 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </a>
              <a href="https://www.instagram.com/mhdfarhan.17" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1C212A] border border-[#262C36] flex items-center justify-center text-gray-400 hover:text-[#9fe870] hover:border-[#9fe870]/50 hover:bg-[#9fe870]/10 transition-all duration-300 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/mhd-farhan/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1C212A] border border-[#262C36] flex items-center justify-center text-gray-400 hover:text-[#9fe870] hover:border-[#9fe870]/50 hover:bg-[#9fe870]/10 transition-all duration-300 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* ZONA 2: Produk */}
          <div className="col-span-1 md:col-span-3 space-y-8">
            <h4 className="font-black text-[#ffffff] uppercase tracking-wider text-sm">{t('footer.product', 'Produk')}</h4>
            <ul className="space-y-5 text-base font-medium">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-[#9fe870] transition-colors relative group">
                  <span>{t('footer.features', 'Fitur')}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9fe870] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#9fe870] transition-colors relative group">
                  <span>{t('footer.about', 'Tentang')}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9fe870] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-[#9fe870] transition-colors relative group">
                  <span>{t('footer.signup_free', 'Daftar secara gratis')}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9fe870] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-[#9fe870] transition-colors relative group">
                  <span>{t('footer.login', 'Masuk')}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9fe870] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ZONA 3: Legal dan bantuan */}
          <div className="col-span-1 md:col-span-3 space-y-8">
            <h4 className="font-black text-[#ffffff] uppercase tracking-wider text-sm">{t('footer.support_legal', 'Bantuan & Legal')}</h4>
            <ul className="space-y-5 text-base font-medium">
              <li>
                <Link href="/support" className="text-gray-400 hover:text-[#9fe870] transition-colors relative group">
                  <span>{t('footer.help_center', 'Pusat Bantuan')}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9fe870] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#9fe870] transition-colors relative group">
                  <span>{t('footer.privacy', 'Kebijakan Privasi')}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9fe870] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#9fe870] transition-colors relative group">
                  <span>{t('footer.terms', 'Ketentuan Layanan')}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#9fe870] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ZONA 4: Baris bawah */}
        <div className="pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-8">
            <span>{t('footer.copyright', '© 2026 Saku. Hak Cipta Dilindungi.')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>{t('footer.made_with', 'Dibuat dengan ❤️ di Indonesia oleh ')}</span>
            <a href="https://mdfarhan.site" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#9fe870] transition-colors font-bold">
              M. Farhan
            </a>
          </div>
        </div>
        
      </div>


      
    </footer>
  )
}
