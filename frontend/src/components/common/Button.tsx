/* ============================================================
   AgriAgent – Common Button Component
   ============================================================ */

import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:   'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30',
  secondary: 'bg-surface-card border border-surface-border hover:border-primary-500 text-white',
  accent:    'bg-accent-500 hover:bg-accent-400 text-white shadow-lg shadow-accent-900/20',
  danger:    'bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-900/30',
  ghost:     'bg-transparent hover:bg-surface-card text-slate-300 hover:text-white',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
        'transition-all duration-200 active:scale-95 outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed active:scale-100' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {/* Loading spinner */}
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
