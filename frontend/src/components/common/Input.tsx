/* ============================================================
   AgriAgent – Common Input Component
   ============================================================ */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Left icon */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'bg-surface-card border text-white placeholder-slate-500 rounded-xl',
            'px-4 py-2.5 w-full outline-none transition-all duration-200',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            error ? 'border-red-500' : 'border-surface-border',
            icon ? 'pl-10' : '',
            className,
          ].join(' ')}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

/* ── Select Input ──────────────────────────────────────────── */

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...rest
}) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={[
            'bg-surface-card border text-white rounded-xl appearance-none',
            'px-4 py-2.5 w-full outline-none transition-all duration-200 cursor-pointer',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            error ? 'border-red-500' : 'border-surface-border',
            className,
          ].join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" className="bg-surface-card">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-card">
              {opt.label}
            </option>
          ))}
        </select>
        {/* Dropdown arrow */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          ▾
        </span>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
