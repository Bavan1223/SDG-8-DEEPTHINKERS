/* ============================================================
   AgriAgent – WeatherCard Component
   Compact current weather display
   ============================================================ */

import React from 'react';
import type { WeatherData } from '../../types/api.types';
import { weatherIcon } from '../../utils/helpers';

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => (
  <div className="glass-card p-5 border border-sky-700/40 hover:border-sky-600/60 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm text-slate-400">📍 {data.location}</p>
        <p className="text-xs text-slate-500 mt-0.5">Updated just now</p>
      </div>
      <span className="text-4xl animate-float">{weatherIcon(data.condition)}</span>
    </div>

    {/* Main temp */}
    <div className="flex items-end gap-2 mb-4">
      <p className="text-5xl font-display font-bold text-white">{data.temperature}°</p>
      <p className="text-slate-400 pb-1 capitalize">{data.condition}</p>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: '💧', label: 'Humidity',  value: `${data.humidity}%` },
        { icon: '🌧️', label: 'Rainfall',  value: `${data.rainfall}mm` },
        { icon: '💨', label: 'Wind',       value: `${data.windSpeed}km/h` },
      ].map((stat) => (
        <div key={stat.label} className="bg-surface-border/40 rounded-xl p-2 text-center">
          <p className="text-base">{stat.icon}</p>
          <p className="text-sm font-semibold text-white mt-1">{stat.value}</p>
          <p className="text-[10px] text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
);
