'use client'

import { useState, useMemo } from 'react'
import { MarketingNavbar } from '@/components/marketing-navbar'
import { MarketingFooter } from '@/components/marketing-footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Button } from '@/components/ui/button'
import { Book, Wallet, Shield, Target, MessageCircle, ChevronRight, ArrowLeft, AlignLeft, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSupportArticles, Article } from '@/data/support-articles'
import { useTranslation, Trans } from 'react-i18next'

export default function SupportPage() {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const supportArticles = useMemo(() => getSupportArticles(i18n.language), [i18n.language])

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  }
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  // SEARCH LOGIC
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return supportArticles.filter(article => 
      article.title.toLowerCase().includes(q) || 
      article.content.some(para => para.toLowerCase().includes(q))
    )
  }, [searchQuery])

  // CATEGORY LOGIC
  const categoryArticles = useMemo(() => {
    if (!activeCategory) return []
    return supportArticles.filter(a => a.category === activeCategory)
  }, [activeCategory])

  const activeArticle = useMemo(() => {
    if (!activeArticleId) return null
    return supportArticles.find(a => a.id === activeArticleId)
  }, [activeArticleId])

  // Handlers
  const openCategory = (cat: string) => {
    setActiveCategory(cat)
    const firstArticle = supportArticles.find(a => a.category === cat)
    setActiveArticleId(firstArticle?.id || null)
    setSearchQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openArticle = (id: string) => {
    const article = supportArticles.find(a => a.id === id)
    if (article) {
      setActiveCategory(article.category)
      setActiveArticleId(id)
      setIsSidebarOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToHome = () => {
    setActiveCategory(null)
    setActiveArticleId(null)
    setSearchQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchTagClick = (tag: string) => {
    setSearchQuery(tag)
  }

  // RENDERER
  return (
    <div className="min-h-screen bg-[#F6F8F5] text-[#0e0f0c] flex flex-col font-sans selection:bg-[#9fe870] selection:text-[#0e0f0c] overflow-hidden">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-20">
        <AnimatePresence mode="wait">
          {/* ================= HOME VIEW ================= */}
          {!activeCategory && !searchQuery ? (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* HERO HEADER & SEARCH */}
              <section className="relative pt-20 pb-20 md:pt-28 md:pb-32 px-6 lg:px-12 flex flex-col items-center text-center">
                <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#9fe870]/30 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
                <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-10" />

                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-[1400px] mx-auto text-center space-y-8 relative z-10 w-full">
                  <motion.h1 variants={fadeInUp} className="text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] font-black tracking-[-0.04em] text-[#0e0f0c] max-w-5xl mx-auto">
                    {t('support_page.hero_title_1', 'Ada yang bisa ')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">{t('support_page.hero_title_2', 'kami bantu?')}</span><br className="hidden md:block"/>
                    {t('support_page.hero_title_3', 'atau ada yang ingin Anda ketahui?')}
                  </motion.h1>
                  
                  <motion.div variants={fadeInUp} className="max-w-2xl mx-auto mt-8 w-full">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-[#868685] group-focus-within:text-[#0e0f0c] transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('support_page.search_placeholder', 'Cari artikel, topik, atau fitur...')}
                        className="w-full h-20 pl-16 pr-8 rounded-full bg-white border-2 border-[#e2e6eb] text-lg font-medium text-[#0e0f0c] placeholder:text-[#868685] focus:outline-none focus:border-[#9fe870] focus:ring-4 focus:ring-[#9fe870]/20 transition-all shadow-xl shadow-black/5"
                      />
                    </div>
                    
                    {/* Search Recommendations */}
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6">
                      <span className="text-xs md:text-sm font-bold text-[#868685] uppercase tracking-wider mr-2">{t('support_page.frequently_searched', 'Sering Dicari:')}</span>
                      {['Edit Transaksi', 'Ekspor PDF', 'Target Tabungan', 'Hutang', 'Saldo Minus'].map((tag) => (
                        <button key={tag} onClick={() => handleSearchTagClick(tag)} className="px-4 py-1.5 rounded-full bg-white border border-[#e2e6eb] text-xs md:text-sm font-bold text-[#454745] hover:border-[#9fe870] hover:text-[#0e0f0c] hover:shadow-md transition-all cursor-pointer">
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              {/* TOPIC CATEGORIES (BENTO GRID) */}
              <section className="py-24 px-6 lg:px-12 relative z-10 -mt-12">
                <div className="max-w-[1400px] mx-auto">
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div onClick={() => openCategory('memulai')} className="bg-white p-8 rounded-[32px] border border-[#e2e6eb] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Book className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-black mb-3">{t('support_page.cat_1_title', 'Memulai Saku')}</h3>
                      <p className="text-[#868685] font-medium text-sm leading-relaxed mb-6">
                        {t('support_page.cat_1_desc', 'Panduan dasar, pembuatan profil, dan menghubungkan seluruh ekosistem dompet pertama Anda.')}
                      </p>
                      <span className="inline-flex items-center text-blue-600 font-bold text-sm group-hover:underline">
                        {t('support_page.articles_count', { count: 3, defaultValue: '3 Artikel' })} <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>

                    <div onClick={() => openCategory('transaksi')} className="bg-white p-8 rounded-[32px] border border-[#e2e6eb] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                      <div className="w-14 h-14 bg-green-100 text-green-600 rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Wallet className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-black mb-3">{t('support_page.cat_2_title', 'Transaksi & Anggaran')}</h3>
                      <p className="text-[#868685] font-medium text-sm leading-relaxed mb-6">
                        {t('support_page.cat_2_desc', 'Cara paling efektif dalam mencatat arus kas harian dan memasang limit peringatan.')}
                      </p>
                      <span className="inline-flex items-center text-green-600 font-bold text-sm group-hover:underline">
                        {t('support_page.articles_count', { count: 4, defaultValue: '4 Artikel' })} <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>

                    <div onClick={() => openCategory('target')} className="bg-white p-8 rounded-[32px] border border-[#e2e6eb] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                      <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Target className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-black mb-3">{t('support_page.cat_3_title', 'Target & Hutang')}</h3>
                      <p className="text-[#868685] font-medium text-sm leading-relaxed mb-6">
                        {t('support_page.cat_3_desc', 'Mewujudkan resolusi tabungan tanpa membuat rekening baru dan nagih teman tanpa canggung.')}
                      </p>
                      <span className="inline-flex items-center text-purple-600 font-bold text-sm group-hover:underline">
                        {t('support_page.articles_count', { count: 3, defaultValue: '3 Artikel' })} <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>

                    <div onClick={() => openCategory('akun')} className="bg-white p-8 rounded-[32px] border border-[#e2e6eb] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                      <div className="w-14 h-14 bg-red-100 text-red-600 rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Shield className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-black mb-3">{t('support_page.cat_4_title', 'Akun & Keamanan')}</h3>
                      <p className="text-[#868685] font-medium text-sm leading-relaxed mb-6">
                        {t('support_page.cat_4_desc', 'Ganti email, manajemen enkripsi data, hingga opsi untuk menghapus akun Saku permanen.')}
                      </p>
                      <span className="inline-flex items-center text-red-600 font-bold text-sm group-hover:underline">
                        {t('support_page.articles_count', { count: 3, defaultValue: '3 Artikel' })} <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </motion.div>
                </div>
              </section>
              
              {/* DIRECT SUPPORT CTA */}
              <section className="py-24 px-6 lg:px-12">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-[1400px] mx-auto bg-[#0e0f0c] text-white rounded-[40px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9fe870]/20 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
                  <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="w-16 h-16 bg-white/10 text-[#9fe870] rounded-[24px] flex items-center justify-center backdrop-blur-md">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-[40px] md:text-[56px] leading-[1.05] font-black tracking-[-0.03em]">{t('support_page.support_cta_title', 'Masih butuh panduan?')}</h2>
                    <p className="text-xl md:text-2xl text-[#a4a5a3] font-medium">{t('support_page.support_cta_desc', 'Jangan khawatir. Tim teknis ahli kami siap membantu setiap permasalahan Anda 24/7.')}</p>
                  </div>
                  <div className="relative z-10 shrink-0 w-full md:w-auto">
                    <Button asChild className="w-full md:w-auto h-20 px-16 text-2xl rounded-full bg-[#9fe870] hover:bg-[#cdffad] text-[#0e0f0c] font-black shadow-2xl shadow-[#9fe870]/20 hover:scale-105 active:scale-95 transition-all group border-none">
                      <a href="mailto:farhan@mdfarhan.site">{t('support_page.support_cta_btn', 'Tanya Langsung')} <ChevronRight className="w-8 h-8 ml-2 group-hover:translate-x-1 transition-transform" /></a>
                    </Button>
                  </div>
                </motion.div>
              </section>
            </motion.div>
          ) : 
          
          /* ================= SEARCH VIEW ================= */
          searchQuery && !activeCategory ? (
            <motion.div
              key="search-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1000px] mx-auto px-6 py-12"
            >
              <div className="mb-8 flex items-center gap-4">
                <button onClick={handleBackToHome} className="w-12 h-12 rounded-full bg-white border border-[#e2e6eb] flex items-center justify-center hover:bg-surface-subtle transition-colors shrink-0">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#868685]" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-full bg-white border border-[#e2e6eb] text-lg font-medium focus:border-[#9fe870] focus:ring-2 focus:ring-[#9fe870]/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <h2 className="text-2xl font-black mb-6">{t('support_page.search_results_for', 'Hasil pencarian untuk')} "{searchQuery}"</h2>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[24px] border border-[#e2e6eb]">
                  <p className="text-xl text-[#868685] font-medium">{t('support_page.search_no_results', 'Tidak ada artikel yang cocok.')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map(article => (
                    <div 
                      key={article.id} 
                      onClick={() => openArticle(article.id)}
                      className="bg-white p-6 rounded-[24px] border border-[#e2e6eb] hover:border-[#9fe870] hover:shadow-md transition-all cursor-pointer group"
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#9fe870] transition-colors">{article.title}</h3>
                      <p className="text-[#868685] line-clamp-2 leading-relaxed">{article.content[0]}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : 
          
          /* ================= READER VIEW ================= */
          (
            <motion.div
              key="reader-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-[1400px] mx-auto px-6 py-8 md:py-12"
            >
              {/* Back Navigation */}
              <div className="mb-8 flex items-center justify-between border-b border-[#e2e6eb] pb-6">
                <button onClick={handleBackToHome} className="flex items-center gap-2 text-[#868685] hover:text-[#0e0f0c] font-bold transition-colors">
                  <ArrowLeft className="w-5 h-5" /> {t('support_page.back_to_home', 'Kembali ke Pusat Bantuan')}
                </button>
                <div className="md:hidden">
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e6eb] rounded-full text-sm font-bold shadow-sm">
                    <AlignLeft className="w-4 h-4" /> {t('support_page.article_list', 'Daftar Artikel')}
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start relative">
                {/* Left Sidebar (Desktop + Mobile overlay) */}
                <aside className={`
                  ${isSidebarOpen ? 'block' : 'hidden'} 
                  md:block w-full md:w-[300px] shrink-0 
                  ${isSidebarOpen ? 'absolute top-0 left-0 right-0 z-50 bg-white p-6 rounded-[24px] shadow-2xl border border-[#e2e6eb]' : ''}
                `}>
                  <h3 className="font-black text-lg mb-4 uppercase tracking-wider text-[#868685] border-b border-[#e2e6eb] pb-4">
                    {t('support_page.topic_label', 'Topik: ')} {activeCategory === 'memulai' ? t('support_page.cat_1_title') : activeCategory === 'transaksi' ? t('support_page.cat_2_title') : activeCategory === 'target' ? t('support_page.cat_3_title') : t('support_page.cat_4_title')}
                  </h3>
                  <div className="space-y-2">
                    {categoryArticles.map(article => (
                      <button
                        key={article.id}
                        onClick={() => openArticle(article.id)}
                        className={`w-full text-left px-4 py-3 rounded-[12px] font-bold text-sm transition-all ${activeArticleId === article.id ? 'bg-[#9fe870]/20 text-[#0e0f0c]' : 'text-[#868685] hover:bg-surface-subtle hover:text-[#0e0f0c]'}`}
                      >
                        {article.title}
                      </button>
                    ))}
                  </div>
                </aside>

                {/* Right Content */}
                <article className="flex-1 min-w-0 bg-white p-8 md:p-12 rounded-[32px] border border-[#e2e6eb] shadow-sm">
                  {activeArticle ? (
                    <>
                      <h1 className="text-3xl md:text-[40px] font-black leading-tight mb-8 text-[#0e0f0c]">
                        {activeArticle.title}
                      </h1>
                      <div className="space-y-6 text-lg text-[#454745] leading-relaxed">
                        {activeArticle.content.map((paragraph, idx) => (
                          <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20 text-[#868685]">
                      {t('support_page.select_article_to_read', 'Pilih artikel di sebelah kiri untuk mulai membaca.')}
                    </div>
                  )}
                </article>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <ScrollToTop />
      <MarketingFooter />
    </div>
  )
}
