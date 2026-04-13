/* ============================================================
   AgriAgent – MarketCard Component
   Shows price for a single crop/market entry
   ============================================================ */

import React from 'react';
import type { MarketPrice } from '../../types/api.types';
import { formatINR, trendColor, trendArrow } from '../../utils/helpers';

interface MarketCardProps {
  data: MarketPrice;
  highlight?: boolean;
}

export const MarketCard: React.FC<MarketCardProps> = ({ data, highlight = false }) => (
  <div
    className={[
      'glass-card p-4 flex items-center justify-between gap-4',
      'hover:border-primary-600/50 transition-all duration-200',
      highlight ? 'border-primary-600/60 bg-primary-900/20' : '',
    ].join(' ')}
  >
    <div className="flex items-center gap-3">
      {highlight && <span className="text-accent-400 text-lg">⭐</span>}
      <div>
        <p className="text-sm font-semibold text-white">{data.market}</p>
        <p className="text-xs text-slate-500">{data.district}, {data.state}</p>
        <p className="text-xs text-slate-400 mt-0.5 capitalize">{data.crop}</p>
      </div>
    </div>

    <div className="text-right flex-shrink-0">
      <p className="text-lg font-bold font-display text-white">{formatINR(data.price)}</p>
      <p className="text-xs text-slate-400">/quintal</p>
      <p className={`text-xs font-medium mt-0.5 ${trendColor(data.trend)}`}>
        {trendArrow(data.trend)} {Math.abs(data.changePercent).toFixed(1)}%
      </p>
    </div>
  </div>
);
