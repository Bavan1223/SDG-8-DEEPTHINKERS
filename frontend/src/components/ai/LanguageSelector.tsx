/* ============================================================
   AgriAgent – LanguageSelector Component
   Floating panel to pick from all supported Indian languages
   ============================================================ */

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { SUPPORTED_LANGUAGES } from '../../utils/constants';
import type { LanguageCode } from '../../types/models.types';

interface LanguageSelectorProps {
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="glass-card shadow-2xl w-64 p-3 animate-slide-up">
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm font-semibold text-slate-200">Select Language</p>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none">×</button>
      </div>

      <div className="grid grid-cols-2 gap-1">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            id={`lang-${lang.code}`}
            onClick={() => handleSelect(lang.code as LanguageCode)}
            className={[
              'flex flex-col items-center px-3 py-2.5 rounded-xl transition-all duration-150 text-left',
              language === lang.code
                ? 'bg-primary-900/60 border border-primary-600 text-primary-300'
                : 'hover:bg-surface-border text-slate-300 hover:text-white',
            ].join(' ')}
          >
            <span className="text-xs font-medium">{lang.native}</span>
            <span className="text-[10px] text-slate-500">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
