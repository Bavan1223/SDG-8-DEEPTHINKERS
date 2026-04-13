/* ============================================================
   AgriAgent – SummaryCard Component
   Generic stat card with icon, value, label, delta
   ============================================================ */

import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'green' | 'blue' | 'amber' | 'red' | 'purple';
  className?: string;
}

const COLORS = {
  green:  { border: 'border-primary-700/50', icon: 'bg-primary-900/60 text-primary-300', glow: 'shadow-primary-900/20' },
  blue:   { border: 'border-sky-700/50',     icon: 'bg-sky-900/60 text-sky-300',         glow: 'shadow-sky-900/20' },
  amber:  { border: 'border-accent-700/50',  icon: 'bg-accent-900/60 text-accent-300',   glow: 'shadow-accent-900/20' },
  red:    { border: 'border-red-700/50',     icon: 'bg-red-900/60 text-red-300',         glow: 'shadow-red-900/20' },
  purple: { border: 'border-purple-700/50',  icon: 'bg-purple-900/60 text-purple-300',   glow: 'shadow-purple-900/20' },
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'green',
  className = '',
}) => {
  const c = COLORS[color];

  return (
    <div
      className={[
        'glass-card p-5 border transition-all duration-300 hover:scale-[1.02]',
        `shadow-lg ${c.glow} ${c.border} animate-fade-in`,
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${c.icon}`}>
          {icon}
        </div>

        {/* Trend badge */}
        {trend && trendValue && (
          <span className={[
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend === 'up'   ? 'bg-green-900/50 text-green-400' :
            trend === 'down' ? 'bg-red-900/50 text-red-400' :
                               'bg-slate-800 text-slate-400',
          ].join(' ')}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-display font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-slate-300 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
