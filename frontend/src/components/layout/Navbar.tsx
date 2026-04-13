/* ============================================================
   AgriAgent – Navbar Component
   Top navigation bar with user info, language switcher
   ============================================================ */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSelector } from '../ai/LanguageSelector';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { location } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-card/80 backdrop-blur-md border-b border-surface-border">
      <div className="h-full flex items-center justify-between px-4 md:px-6">

        {/* ── Left: Logo + hamburger ────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            id="sidebar-toggle"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-surface-border transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌾</span>
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">
              AgriAgent
            </span>
          </Link>
        </div>

        {/* ── Center: Location badge ────────────────────────── */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-border/50 text-sm text-slate-300">
          <span>📍</span>
          <span>{location.district}, {location.state}</span>
        </div>

        {/* ── Right: Actions ────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Language switcher trigger */}
          <button
            id="lang-switcher-btn"
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="p-2 rounded-lg hover:bg-surface-border transition-colors text-lg"
            title="Change language"
          >
            🌐
          </button>

          {/* Notification bell */}
          <Link to="/alerts" className="p-2 rounded-lg hover:bg-surface-border transition-colors relative" title="View Alerts">
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Unread dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-surface-card" />
          </Link>

          {/* User avatar / login */}
          {user ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-border transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-7 h-7 rounded-full ring-2 ring-primary-600" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-sm font-bold">
                    {user.displayName?.[0] ?? 'U'}
                  </div>
                )}
                <span className="hidden md:block text-sm text-slate-200 max-w-[120px] truncate">
                  {user.displayName}
                </span>
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-card shadow-xl p-1 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-surface-border mb-1">
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-surface-border rounded-lg"
                  >
                    ⚙️ {t('settings.title')}
                  </Link>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg"
                  >
                    🚪 Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/settings"
              className="text-sm px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Language picker dropdown */}
        {showLangPicker && (
          <div className="absolute top-16 right-4 z-50">
            <LanguageSelector onClose={() => setShowLangPicker(false)} />
          </div>
        )}
      </div>
    </header>
  );
};
