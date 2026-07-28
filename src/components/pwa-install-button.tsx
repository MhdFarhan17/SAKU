'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function PwaInstallButton({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIos(isIosDevice)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true)
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Optional: listen to appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setIsInstallable(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
  }

  if (isInstalled) {
    return (
      <Button 
        disabled
        className={cn("bg-[#F6F8F5] text-[#0e0f0c] font-bold opacity-100 cursor-default", className)}
      >
        <Check className="w-5 h-5 mr-2 text-green-500" />
        {t('home.pwa_btn_installed', 'Saku Sudah Terinstal')}
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button 
        onClick={handleInstallClick}
        className={cn("bg-[#9fe870] hover:bg-[#cdffad] text-[#0e0f0c] font-black shadow-lg shadow-[#9fe870]/20 transition-all hover:scale-105 active:scale-95 border-none", className)}
      >
        <Download className="w-5 h-5 mr-2" />
        {t('home.pwa_btn_install', 'Install Aplikasi Saku')}
      </Button>
      {isIos && (
        <span className="text-[10px] text-gray-500 font-medium px-2 text-center md:text-left leading-tight">
          {t('home.pwa_ios_hint', "*Pengguna iOS: Safari membatasi instalasi otomatis. Ketuk tombol Share di bawah dan pilih 'Add to Home Screen' secara manual.")}
        </span>
      )}
    </div>
  )
}
