import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Static imports for common translations to ensure immediate availability
import enCommon from './locales/en/common.json';
import ruCommon from './locales/ru/common.json';

// Type for translation structure
type TranslationRecord = Record<string, unknown>;

// Dynamic translation loading function for non-common namespaces
const loadTranslations = async (language: string, namespace: string): Promise<TranslationRecord> => {
  try {
    const translation = await import(`./locales/${language}/${namespace}.json`);
    return translation.default;
  } catch (error) {
    console.warn(`Failed to load translation ${language}/${namespace}:`, error);
    return {};
  }
};

// Initialize i18n with common translations preloaded
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Preload common translations for immediate availability
    resources: {
      en: {
        common: enCommon,
      },
      ru: {
        common: ruCommon,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'setup', 'game', 'summary'],
    
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

// Load additional translations for detected language
const loadAdditionalTranslations = async () => {
  const currentLang = i18n.language || 'en';
  const additionalNamespaces = ['home', 'setup', 'game', 'summary'];
  
  // Load additional namespaces for current language
  const translations: Record<string, TranslationRecord> = {};
  
  for (const ns of additionalNamespaces) {
    translations[ns] = await loadTranslations(currentLang, ns);
  }
  
  // Add resources to i18n
  i18n.addResourceBundle(currentLang, 'home', translations.home);
  i18n.addResourceBundle(currentLang, 'setup', translations.setup);
  i18n.addResourceBundle(currentLang, 'game', translations.game);
  i18n.addResourceBundle(currentLang, 'summary', translations.summary);
  
  // Load fallback language if different
  if (currentLang !== 'en') {
    const fallbackTranslations: Record<string, TranslationRecord> = {};
    for (const ns of additionalNamespaces) {
      fallbackTranslations[ns] = await loadTranslations('en', ns);
    }
    
    i18n.addResourceBundle('en', 'home', fallbackTranslations.home);
    i18n.addResourceBundle('en', 'setup', fallbackTranslations.setup);
    i18n.addResourceBundle('en', 'game', fallbackTranslations.game);
    i18n.addResourceBundle('en', 'summary', fallbackTranslations.summary);
  }
};

// Enhanced language change handler for dynamic loading
const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (language: string) => {
  // Load translations for new language if not already loaded
  if (!i18n.hasResourceBundle(language, 'home')) {
    const namespaces = ['home', 'setup', 'game', 'summary'];
    const translations: Record<string, TranslationRecord> = {};
    
    for (const ns of namespaces) {
      translations[ns] = await loadTranslations(language, ns);
    }
    
    i18n.addResourceBundle(language, 'home', translations.home);
    i18n.addResourceBundle(language, 'setup', translations.setup);
    i18n.addResourceBundle(language, 'game', translations.game);
    i18n.addResourceBundle(language, 'summary', translations.summary);
  }
  
  return originalChangeLanguage(language);
};

// Load additional translations
loadAdditionalTranslations().catch(error => {
  console.error('Failed to load additional translations:', error);
});

export default i18n; 