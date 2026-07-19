import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import hi from './locales/hi.json'
import ml from './locales/ml.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ml: { translation: ml }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      // Remember the family's chosen language across visits (important:
      // they may not want to re-select every time on a shared phone).
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
