import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import merged translation files
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';

// Initialize i18n with merged translations
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Load all translations upfront since they're merged
    resources: {
      en: {
        translation: enTranslations,
      },
      ru: {
        translation: ruTranslations,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'translation',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    // Force immediate sync initialization
    initImmediate: true,
  });

export default i18n; 