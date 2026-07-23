'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import idTranslations from '../locales/id.json';

// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    resources: {
      EN: { translation: enTranslations },
      ID: { translation: idTranslations }
    },
    lng: 'ID', // default language
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18next;
