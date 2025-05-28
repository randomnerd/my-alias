import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Static imports for common translations to ensure immediate availability
import enCommon from './locales/en/common.json';
import ruCommon from './locales/ru/common.json';

// Type for translation structure
type TranslationRecord = Record<string, unknown>;

// Translation loader map - clean, explicit, and avoids template literal warnings
const translationLoaders = {
  en: {
    home: () => import('./locales/en/home.json'),
    setup: () => import('./locales/en/setup.json'),
    game: () => import('./locales/en/game.json'),
    summary: () => import('./locales/en/summary.json'),
  },
  ru: {
    home: () => import('./locales/ru/home.json'),
    setup: () => import('./locales/ru/setup.json'),
    game: () => import('./locales/ru/game.json'),
    summary: () => import('./locales/ru/summary.json'),
  },
} as const;

// Supported languages and namespaces (derived from the loader map)
type SupportedLanguage = keyof typeof translationLoaders;
type SupportedNamespace = keyof typeof translationLoaders[SupportedLanguage];

// Dynamic translation loading function with clean loader map
const loadTranslations = async (language: string, namespace: string): Promise<TranslationRecord> => {
  // Ensure we never dynamically load common namespace (already statically imported)
  if (namespace === 'common') {
    return language === 'ru' ? ruCommon : enCommon;
  }
  
  try {
    // Type-safe access to translation loaders
    const languageLoaders = translationLoaders[language as SupportedLanguage];
    if (!languageLoaders) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    const namespaceLoader = languageLoaders[namespace as SupportedNamespace];
    if (!namespaceLoader) {
      throw new Error(`Unknown namespace: ${namespace} for language: ${language}`);
    }
    
    const translationModule = await namespaceLoader();
    return translationModule.default;
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

// Load additional translations for detected language (excluding common)
const loadAdditionalTranslations = async () => {
  const currentLang = i18n.language || 'en';
  const additionalNamespaces = ['home', 'setup', 'game', 'summary']; // Explicitly exclude 'common'
  
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
  
  // Load fallback language if different (excluding common)
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

// Enhanced language change handler for dynamic loading (excluding common)
const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (language: string) => {
  // Load translations for new language if not already loaded (excluding common)
  if (!i18n.hasResourceBundle(language, 'home')) {
    const namespaces = ['home', 'setup', 'game', 'summary']; // Explicitly exclude 'common'
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