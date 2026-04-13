/* ============================================================
   AgriAgent – i18next Configuration
   Supports EN, HI, KN, TA + auto-detection
   ============================================================ */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';
import ta from './ta.json';
import te from './te.json';
import ml from './ml.json';
import mr from './mr.json';
import pa from './pa.json';
import gu from './gu.json';
import or from './or.json';

i18n
  .use(LanguageDetector)          // Detect browser language
  .use(initReactI18next)          // Bind to React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kn: { translation: kn },
      ta: { translation: ta },
      te: { translation: te },
      ml: { translation: ml },
      mr: { translation: mr },
      pa: { translation: pa },
      gu: { translation: gu },
      or: { translation: or },
    },
    fallbackLng: 'en',            // Default to English
    debug: false,
    interpolation: {
      escapeValue: false,         // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],   // Persist preference
      lookupLocalStorage: 'agriagent_lang',
    },
  });

export default i18n;
