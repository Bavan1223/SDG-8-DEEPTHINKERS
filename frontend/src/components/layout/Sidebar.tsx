/* ============================================================
   AgriAgent – Sidebar Component
   Responsive sidebar with all navigation links
   ============================================================ */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DropdownMenu } from './DropdownMenu';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { t }     = useTranslation();
  const { pathname } = useLocation();

  // Simple nav links (no sub-items)
  const simpleLinks = [
    { href: '/',           icon: '🏠', label: t('nav.home') },
    { href: '/dashboard',  icon: '📊', label: t('nav.dashboard') },
    { href: '/daily',      icon: '📅', label: t('nav.daily') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ── Mobile overlay ──────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar panel ───────────────────────────────────── */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-64 z-50 pt-16',
          'bg-surface-card border-r border-surface-border',
          'flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

          {/* ── Simple links ──────────────────────────────── */}
          {simpleLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={[
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(link.href)
                  ? 'bg-primary-900/50 text-primary-300 border border-primary-800/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-border',
              ].join(' ')}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}

          <div className="my-2 border-t border-surface-border" />

          {/* ── Dropdown groups ───────────────────────────── */}
          <DropdownMenu
            label="Farm Management"
            icon="🌱"
            onItemClick={onClose}
            items={[
              { href: '/crops',   icon: '🌾', label: t('nav.crops') },
              { href: '/weather', icon: '🌤️',  label: t('nav.weather') },
              { href: '/market',  icon: '🛒',  label: t('nav.market') },
            ]}
          />

          <DropdownMenu
            label="Monitoring & Alerts"
            icon="🔍"
            onItemClick={onClose}
            items={[
              { href: '/monitoring', icon: '🚁', label: t('nav.monitoring') },
              { href: '/alerts',     icon: '🚨', label: t('nav.alerts') },
            ]}
          />

          <DropdownMenu
            label="Analytics"
            icon="📈"
            onItemClick={onClose}
            items={[
              { href: '/reports', icon: '📋', label: t('nav.reports') },
            ]}
          />

          <div className="my-2 border-t border-surface-border" />

          {/* Settings */}
          <Link
            to="/settings"
            onClick={onClose}
            className={[
              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive('/settings')
                ? 'bg-primary-900/50 text-primary-300 border border-primary-800/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-border',
            ].join(' ')}
          >
            <span>⚙️</span>
            {t('nav.settings')}
          </Link>
        </nav>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="p-4 border-t border-surface-border">
          <p className="text-xs text-slate-500 text-center">
            AgriAgent v1.0 · Smart Farming OS
          </p>
        </div>
      </aside>
    </>
  );
};
