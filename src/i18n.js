import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enAudit from './locales/en/audit.json';
import enReport from './locales/en/report.json';
import enSettings from './locales/en/settings.json';
import enLegal from './locales/en/legal.json';

import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frAudit from './locales/fr/audit.json';
import frReport from './locales/fr/report.json';
import frSettings from './locales/fr/settings.json';
import frLegal from './locales/fr/legal.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    audit: enAudit,
    report: enReport,
    settings: enSettings,
    legal: enLegal
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    audit: frAudit,
    report: frReport,
    settings: frSettings,
    legal: frLegal
  }
};

// Get stored language or default to 'en'
const getInitialLanguage = () => {
  try {
    const stored = localStorage.getItem('detekta-settings');
    if (stored) {
      const { state } = JSON.parse(stored);
      return state?.language || 'en';
    }
  } catch (e) {
    // Ignore
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    ns: ['common', 'auth', 'audit', 'report', 'settings', 'legal'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
