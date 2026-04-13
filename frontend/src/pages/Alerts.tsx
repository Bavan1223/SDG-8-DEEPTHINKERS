/* ============================================================
   AgriAgent – Alerts Page
   Flood, drought, storm, pest, frost alerts with filtering
   ============================================================ */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { AlertCard } from '../components/dashboard/AlertCard';
import { Skeleton } from '../components/common/Loader';
import type { Alert } from '../types/api.types';
import { formatDate } from '../utils/helpers';
import { fetchAlerts } from '../services/api';

type FilterType = 'all' | Alert['type'];
type FilterSev  = 'all' | Alert['severity'];

const Alerts: React.FC = () => {
  const { t }        = useTranslation();
  const { location } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [sevFilter,  setSevFilter]  = useState<FilterSev>('all');
  const [alerts, setAlerts]         = useState<Alert[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAlerts(location.state, location.district)
      .then((data) => {
        if (active) setAlerts(data);
      })
      .catch((err) => {
        console.error('Failed to load alerts:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [location.state, location.district]);

  const filtered = alerts.filter((a) => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (sevFilter  !== 'all' && a.severity !== sevFilter) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">{t('alerts.title')}</h1>
          <p className="text-slate-400 mt-1">📍 {location.district}, {location.state}</p>
        </div>
        {criticalCount > 0 && (
          <div className="px-4 py-2 rounded-xl bg-red-900/40 border border-red-700/50 animate-pulse-slow">
            <p className="text-red-300 text-sm font-semibold">🚨 {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Type filters */}
        {(['all', 'flood', 'drought', 'storm', 'pest', 'frost', 'heat'] as FilterType[]).map((type) => (
          <button
            key={type}
            id={`filter-type-${type}`}
            onClick={() => setTypeFilter(type)}
            className={[
              'text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150',
              typeFilter === type
                ? 'bg-primary-700 text-white'
                : 'bg-surface-border text-slate-400 hover:text-slate-200',
            ].join(' ')}
          >
            {type === 'all' ? '📋 All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}

        <div className="w-px bg-surface-border mx-1" />

        {/* Severity filters */}
        {(['all', 'critical', 'high', 'medium', 'low'] as FilterSev[]).map((sev) => (
          <button
            key={sev}
            id={`filter-sev-${sev}`}
            onClick={() => setSevFilter(sev)}
            className={[
              'text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150',
              sevFilter === sev
                ? 'bg-accent-700 text-white'
                : 'bg-surface-border text-slate-400 hover:text-slate-200',
            ].join(' ')}
          >
            {sev === 'all' ? '⚡ All Severities' : sev.charAt(0).toUpperCase() + sev.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Alert list ─────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton lines={4} />
          <Skeleton lines={4} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-slate-300 font-semibold">{t('alerts.no_alerts')}</p>
          <p className="text-slate-500 text-sm mt-2">All clear for your region right now!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((alert) => (
            <div key={alert.id} className="animate-slide-up">
              <AlertCard alert={alert} />
              <div className="flex gap-3 mt-2 ml-4 text-xs text-slate-500 flex-wrap">
                {alert.expiresAt && (
                  <span>{t('alerts.expires')}: {formatDate(alert.expiresAt)}</span>
                )}
                <span className="cursor-pointer text-primary-400 hover:text-primary-300">
                  🔔 Set reminder
                </span>
                <span className="cursor-pointer text-slate-400 hover:text-slate-200">
                  📤 Share
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
