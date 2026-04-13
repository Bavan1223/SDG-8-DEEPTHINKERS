/* ============================================================
   AgriAgent – YieldChart Component
   Monthly/seasonal yield bar chart (Recharts)
   ============================================================ */

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface YieldPoint { month: string; yield: number; target: number; }

interface YieldChartProps {
  data: YieldPoint[];
}

export const YieldChart: React.FC<YieldChartProps> = ({ data }) => (
  <div className="glass-card p-5 min-w-0 w-full">
    <h3 className="text-sm font-semibold text-slate-300 mb-4">🌾 Yield Analysis (Quintals/Acre)</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#1a2a1a', border: '1px solid #2d4a2d', borderRadius: 12 }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Bar dataKey="yield" name="Actual Yield" radius={[6,6,0,0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.yield >= entry.target ? '#22c55e' : '#f59e0b'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
        <Bar dataKey="target" name="Target" fill="#334155" fillOpacity={0.5} radius={[6,6,0,0]} />
      </BarChart>
    </ResponsiveContainer>
    <div className="flex items-center gap-4 mt-2 justify-center text-xs text-slate-400">
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary-500 inline-block"/> Above target</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent-500 inline-block"/> Below target</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-600 inline-block"/> Target</span>
    </div>
  </div>
);
