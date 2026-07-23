'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { completeOnboarding } from './actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet, ChevronRight, Sparkles } from 'lucide-react'
import React from 'react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState('')

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, '')
    if (num) {
      setBalance(parseInt(num, 10).toLocaleString('id-ID'))
    } else {
      setBalance('')
    }
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    
    try {
      const res = await completeOnboarding(data)
      if (res?.error) {
        alert(res.error)
        setLoading(false)
      }
    } catch (error) {
      // Next.js redirect() throws an error. 
      // We catch it to prevent immediate navigation so we can show the success screen.
      setLoading(false)
      nextStep()
    }
  }

  return (
    <div className="min-h-screen bg-[#e8ebe6] flex flex-col items-center justify-center p-4">
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-8 flex items-center justify-center space-x-2">
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step >= i ? 'w-8 bg-[#9fe870]' : 'w-2 bg-[#0e0f0c]/10'
              }`}
            />
          </React.Fragment>
        ))}
      </div>

      <div className="w-full max-w-md relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-surface rounded-[32px] border-none shadow-xl overflow-hidden p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 relative flex items-center justify-center bg-[#fbfcfb] rounded-full border border-[#e2e6eb]">
                  <Image
                    src="/logos/logo.png"
                    alt="Saku Logo"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-black text-[#0e0f0c]">
                    Selamat Datang di Saku!
                  </h1>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Aplikasi pencatat keuangan pintar untuk membantu Anda mengelola uang dengan lebih baik dan bijak.
                  </p>
                </div>
                <Button
                  onClick={nextStep}
                  className="w-full h-14 rounded-[12px] bg-[#9fe870] hover:bg-[#8bd45f] text-[#0e0f0c] font-black text-lg mt-4 group"
                >
                  Mulai
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-surface rounded-[32px] border-none shadow-xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-[#9fe870]/20 rounded-[16px] flex items-center justify-center text-[#9fe870]">
                    <Wallet className="w-6 h-6 text-[#0e0f0c]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#0e0f0c]">Buat Dompet</h2>
                    <p className="text-sm text-gray-500 font-medium">Langkah awal melacak keuangan</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0e0f0c]">Nama Dompet / Rekening</label>
                    <Input
                      type="text"
                      name="accountName"
                      required
                      placeholder="Contoh: BCA, GoPay, Tunai"
                      defaultValue="Dompet Tunai"
                      className="h-12 rounded-[12px] bg-[#fbfcfb] border-[#e2e6eb] focus-visible:ring-[#9fe870] font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0e0f0c]">Tipe</label>
                    <select
                      name="accountType"
                      className="flex h-12 w-full rounded-[12px] border border-[#e2e6eb] bg-[#fbfcfb] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fe870] focus-visible:ring-offset-2 font-medium"
                      defaultValue="cash"
                    >
                      <option value="cash">Tunai (Cash)</option>
                      <option value="bank">Rekening Bank</option>
                      <option value="ewallet">E-Wallet (GoPay, OVO, dll)</option>
                      <option value="card">Kartu Kredit/Debit</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0e0f0c]">Saldo Awal (Rp)</label>
                    <Input
                      type="text"
                      name="startingBalance"
                      required
                      placeholder="0"
                      value={balance}
                      onChange={handleBalanceChange}
                      className="h-12 rounded-[12px] bg-[#fbfcfb] border-[#e2e6eb] focus-visible:ring-[#9fe870] font-medium"
                    />
                  </div>

                  <div className="pt-2 flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="h-14 rounded-[12px] border-[#e2e6eb] text-[#0e0f0c] font-black w-1/3"
                      disabled={loading}
                    >
                      Kembali
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-14 rounded-[12px] bg-[#9fe870] hover:bg-[#8bd45f] text-[#0e0f0c] font-black flex-1"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Dompet'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <Card className="bg-surface rounded-[32px] border-none shadow-xl p-8 text-center flex flex-col items-center space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-[#9fe870]/20 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-[#0e0f0c]" />
                </motion.div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-[#0e0f0c]">Selesai!</h2>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Dompet pertama Anda telah berhasil dibuat. Mari mulai atur keuangan Anda dengan Saku.
                  </p>
                </div>

                <Button
                  onClick={() => router.push('/app')}
                  className="w-full h-14 rounded-[12px] bg-[#9fe870] hover:bg-[#8bd45f] text-[#0e0f0c] font-black text-lg mt-4 group"
                >
                  Masuk ke Dasbor
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
