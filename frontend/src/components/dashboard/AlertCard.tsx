/* ============================================================
   AgriAgent – AlertCard Component
   Displays a single disaster/crop alert
   ============================================================ */

import React from 'react';
import type { Alert } from '../../types/api.types';
import { ALERT_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const ALERT_ICONS: Record<Alert['type'], string> = {
  flood:   '🌊',
  drought: '🏜️',
  storm:   '⛈️',
  pest:    '🦗',
  frost:   '❄️',
  heat:    '🌡️',
};

interface AlertCardProps {
  alert: Alert;
  compact?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, compact = false }) => {
  const colors = ALERT_COLORS[alert.severity];

  return (
    <div
      className={[
        `${colors.bg} border-l-4 rounded-r-xl p-4 transition-all duration-200 hover:opacity-90`,
        alert.severity === 'critical' ? 'border-red-500' :
        alert.severity === 'high'     ? 'border-orange-500' :
        alert.severity === 'medium'   ? 'border-yellow-500' : 'border-blue-500',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{ALERT_ICONS[alert.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-semibold ${colors.text}`}>{alert.title}</p>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {alert.severity}
            </span>
          </div>
          {!compact && (
            <>
              <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
              <p className="text-xs text-slate-300 mt-2 font-medium">⚡ {alert.actionRequired}</p>
              <p className="text-[10px] text-slate-500 mt-2">
                {alert.affectedArea} · Issued {formatDate(alert.issuedAt)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
