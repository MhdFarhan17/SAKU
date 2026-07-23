'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from localStorage if exists
    const storedLang = localStorage.getItem('saku_lang');
    if (storedLang && (storedLang === 'EN' || storedLang === 'ID')) {
      i18n.changeLanguage(storedLang);
    }
    setMounted(true);
  }, []);

  // To prevent hydration mismatch, you could wait for mounted, 
  // but it's often better to just render the default language and swap it.
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
