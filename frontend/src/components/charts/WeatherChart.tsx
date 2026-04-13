/* ============================================================
   AgriAgent – WeatherChart Component
   5-day temperature + rainfall forecast chart (Recharts)
   ============================================================ */

import React from 'react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { WeatherForecastDay } from '../../types/api.types';

interface WeatherChartProps {
  data: WeatherForecastDay[];
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => (
  <div className="glass-card p-5">
    <h3 className="text-sm font-semibold text-slate-300 mb-4">📅 5-Day Weather Forecast</h3>
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="temp" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#1a2a1a', border: '1px solid #2d4a2d', borderRadius: 12 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {/* Temperature lines */}
        <Line yAxisId="temp" type="monotone" dataKey="maxTemp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Max °C" />
        <Line yAxisId="temp" type="monotone" dataKey="minTemp" stroke="#38bdf8" strokeWidth={2} dot={false} name="Min °C" />
        {/* Rainfall bars */}
        <Bar yAxisId="rain" dataKey="rainfall" fill="#22c55e" opacity={0.6} radius={[4,4,0,0]} name="Rain mm" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);
