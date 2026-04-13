/* ============================================================
   AgriAgent – Common Loader Component
   Skeleton loader + spinner variants
   ============================================================ */

import React from 'react';

/* ── Spinner ──────────────────────────────────────────────── */
interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; color?: string; }

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-primary-500',
}) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <svg className={`animate-spin ${sizes[size]} ${color}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

/* ── Full-page loader ─────────────────────────────────────── */
export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-slate-400 text-sm animate-pulse">Loading AgriAgent…</p>
    </div>
  </div>
);

/* ── Skeleton card ────────────────────────────────────────── */
interface SkeletonProps { lines?: number; className?: string; }

export const Skeleton: React.FC<SkeletonProps> = ({ lines = 3, className = '' }) => (
  <div className={`glass-card p-5 animate-pulse ${className}`}>
    <div className="skeleton h-4 w-2/3 mb-3 rounded" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`skeleton h-3 mb-2 rounded ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
    ))}
  </div>
);

/* ── Inline loader ────────────────────────────────────────── */
export const Loader: React.FC<{ text?: string }> = ({ text = 'Loading…' }) => (
  <div className="flex items-center gap-3 py-8 justify-center">
    <Spinner size="md" />
    <span className="text-slate-400">{text}</span>
  </div>
);
