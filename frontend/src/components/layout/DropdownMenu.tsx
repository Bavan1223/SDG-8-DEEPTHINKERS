/* ============================================================
   AgriAgent – DropdownMenu Component
   Animated collapsible menu section for sidebar
   ============================================================ */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
}

interface DropdownMenuProps {
  label: string;
  icon: string;
  items: MenuItem[];
  onItemClick?: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  icon,
  items,
  onItemClick,
}) => {
  const { pathname } = useLocation();
  const isActive     = items.some((i) => pathname === i.href);
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      {/* Section header – toggles submenu */}
      <button
        onClick={() => setOpen(!open)}
        className={[
          'flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium',
          'transition-all duration-200 group',
          isActive ? 'text-primary-400' : 'text-slate-400 hover:text-slate-200 hover:bg-surface-border',
        ].join(' ')}
      >
        <span className="flex items-center gap-2.5">
          <span className="text-base">{icon}</span>
          {label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Animated dropdown */}
      <div
        className={[
          'overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="pl-4 mt-1 space-y-0.5 border-l border-surface-border ml-3">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onItemClick}
              className={[
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                pathname === item.href
                  ? 'bg-primary-900/40 text-primary-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-border',
              ].join(' ')}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
