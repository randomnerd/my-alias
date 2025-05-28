import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Type for translation structure
type TranslationRecord = Record<string, unknown>;

// Dynamic translation loading function
const loadTranslations = async (language: string, namespace: string): Promise<TranslationRecord> => {
  try {
    const translation = await import(`./locales/${language}/${namespace}.json`);
    return translation.default;
  } catch (error) {
    console.warn(`Failed to load translation ${language}/${namespace}:`, error);
    return {};
  }
};

// Initialize i18n with lazy loading
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Start with empty resources - they'll be loaded dynamically
    resources: {},
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

// Load initial translations for detected language
const loadInitialTranslations = async () => {
  const currentLang = i18n.language || 'en';
  const namespaces = ['common', 'home', 'setup', 'game', 'summary'];
  
  // Load all namespaces for current language
  const translations: Record<string, TranslationRecord> = {};
  
  for (const ns of namespaces) {
    translations[ns] = await loadTranslations(currentLang, ns);
  }
  
  // Add resources to i18n
  i18n.addResourceBundle(currentLang, 'common', translations.common);
  i18n.addResourceBundle(currentLang, 'home', translations.home);
  i18n.addResourceBundle(currentLang, 'setup', translations.setup);
  i18n.addResourceBundle(currentLang, 'game', translations.game);
  i18n.addResourceBundle(currentLang, 'summary', translations.summary);
  
  // Load fallback language if different
  if (currentLang !== 'en') {
    const fallbackTranslations: Record<string, TranslationRecord> = {};
    for (const ns of namespaces) {
      fallbackTranslations[ns] = await loadTranslations('en', ns);
    }
    
    i18n.addResourceBundle('en', 'common', fallbackTranslations.common);
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
  if (!i18n.hasResourceBundle(language, 'common')) {
    const namespaces = ['common', 'home', 'setup', 'game', 'summary'];
    const translations: Record<string, TranslationRecord> = {};
    
    for (const ns of namespaces) {
      translations[ns] = await loadTranslations(language, ns);
    }
    
    i18n.addResourceBundle(language, 'common', translations.common);
    i18n.addResourceBundle(language, 'home', translations.home);
    i18n.addResourceBundle(language, 'setup', translations.setup);
    i18n.addResourceBundle(language, 'game', translations.game);
    i18n.addResourceBundle(language, 'summary', translations.summary);
  }
  
  return originalChangeLanguage(language);
};

// Load initial translations
loadInitialTranslations().catch(error => {
  console.error('Failed to load initial translations:', error);
});

export default i18n; 