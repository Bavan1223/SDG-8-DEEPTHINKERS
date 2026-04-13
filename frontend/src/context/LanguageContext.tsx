/* ============================================================
   AgriAgent – LanguageContext
   Manages active language + location preference across app
   ============================================================ */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { LanguageCode, LocationPreference } from '../types/models.types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  location: LocationPreference;
  setLocation: (loc: LocationPreference) => void;
  preferredCrop: string;
  setPreferredCrop: (crop: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LOCATION_KEY = 'agriagent_location';
const LANG_KEY     = 'agriagent_lang';
const CROP_KEY     = 'agriagent_crop';

const DEFAULT_LOCATION: LocationPreference = { state: 'Karnataka', district: 'Mysuru' };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  // ── Language state ─────────────────────────────────────────
  const [language, setLangState] = useState<LanguageCode>(
    () => (localStorage.getItem(LANG_KEY) as LanguageCode) ?? 'en'
  );

  const setLanguage = (lang: LanguageCode) => {
    setLangState(lang);
    i18n.changeLanguage(lang);             // Update i18next
    localStorage.setItem(LANG_KEY, lang);  // Persist
  };

  // Sync language with i18n on mount
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  // ── Location state ─────────────────────────────────────────
  const [location, setLocationState] = useState<LocationPreference>(() => {
    const saved = localStorage.getItem(LOCATION_KEY);
    return saved ? (JSON.parse(saved) as LocationPreference) : DEFAULT_LOCATION;
  });

  const setLocation = (loc: LocationPreference) => {
    setLocationState(loc);
    localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
  };

  // ── Crop state ─────────────────────────────────────────────
  const [preferredCrop, setCropState] = useState<string>(
    () => localStorage.getItem(CROP_KEY) ?? 'tomato'
  );

  const setPreferredCrop = (crop: string) => {
    setCropState(crop);
    localStorage.setItem(CROP_KEY, crop);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, location, setLocation, preferredCrop, setPreferredCrop }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguageContext(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguageContext must be inside <LanguageProvider>');
  return ctx;
}
