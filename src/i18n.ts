import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enSetup from './locales/en/setup.json';
import enGame from './locales/en/game.json';
import enSummary from './locales/en/summary.json';

import ruCommon from './locales/ru/common.json';
import ruHome from './locales/ru/home.json';
import ruSetup from './locales/ru/setup.json';
import ruGame from './locales/ru/game.json';
import ruSummary from './locales/ru/summary.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    setup: enSetup,
    game: enGame,
    summary: enSummary,
  },
  ru: {
    common: ruCommon,
    home: ruHome,
    setup: ruSetup,
    game: ruGame,
    summary: ruSummary,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'setup', 'game', 'summary'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n; 