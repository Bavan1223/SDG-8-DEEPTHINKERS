/* ============================================================
   AgriAgent – useLanguage hook
   Convenience wrapper around LanguageContext
   ============================================================ */

import { useLanguageContext } from '../context/LanguageContext';

/**
 * Returns current language, setLanguage, location, setLocation.
 * Must be used within <LanguageProvider>.
 */
export function useLanguage() {
  return useLanguageContext();
}
