/* ============================================================
   AgriAgent – MarketChart Component
   Crop price trend area chart (Recharts)
   ============================================================ */

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface PricePoint { date: string; price: number; predicted?: number; }

interface MarketChartProps {
  data: PricePoint[];
  cropName?: string;
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, cropName = 'Crop' }) => (
  <div className="glass-card p-5 min-w-0 w-full">
    <h3 className="text-sm font-semibold text-slate-300 mb-4">
      📈 {cropName} Price Trend (₹/Quintal)
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#1a2a1a', border: '1px solid #2d4a2d', borderRadius: 12 }}
          formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="price"     stroke="#22c55e" fill="url(#priceGrad)" strokeWidth={2} name="Actual Price" />
        <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="url(#predGrad)"  strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
