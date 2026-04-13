/* ============================================================
   AgriAgent – Monitoring Page
   Simulated drone fleet UI with health index + controls
   ============================================================ */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Drone {
  id: string; name: string;
  status: 'active' | 'idle' | 'charging' | 'error';
  battery: number; healthIndex: number;
  coverage: number; lastMission: string;
  lat: number; lng: number; altitude: number;
}

const MOCK_DRONES: Drone[] = [
  { id: 'd1', name: 'DJI Agras T40 #1', status: 'active',   battery: 78, healthIndex: 85, coverage: 3.2, lastMission: '2 hours ago',  lat: 12.295, lng: 76.639, altitude: 25 },
  { id: 'd2', name: 'DJI Agras T40 #2', status: 'idle',     battery: 95, healthIndex: 92, coverage: 5.1, lastMission: '4 hours ago',  lat: 12.310, lng: 76.655, altitude: 0  },
  { id: 'd3', name: 'DJI Phantom #1',   status: 'charging', battery: 23, healthIndex: 78, coverage: 1.8, lastMission: '6 hours ago',  lat: 12.285, lng: 76.620, altitude: 0  },
];

const STATUS_COLORS = {
  active:   { badge: 'bg-primary-900/60 text-primary-300 border-primary-700/40', dot: 'bg-primary-400 animate-pulse' },
  idle:     { badge: 'bg-slate-800 text-slate-300 border-slate-700',             dot: 'bg-slate-400' },
  charging: { badge: 'bg-accent-900/60 text-accent-300 border-accent-700/40',   dot: 'bg-accent-400 animate-pulse' },
  error:    { badge: 'bg-red-900/60 text-red-300 border-red-700/40',             dot: 'bg-red-400 animate-pulse' },
};

const Monitoring: React.FC = () => {
  const { t }                   = useTranslation();
  const [drones, setDrones]     = useState<Drone[]>(MOCK_DRONES);
  const [selected, setSelected] = useState<Drone | null>(drones[0]);

  const dispatch = (id: string) => {
    setDrones((prev) => prev.map((d) => d.id === id ? { ...d, status: 'active', altitude: 25 } : d));
  };
  const recall = (id: string) => {
    setDrones((prev) => prev.map((d) => d.id === id ? { ...d, status: 'idle', altitude: 0 } : d));
  };

  const healthColor = (idx: number) =>
    idx >= 80 ? 'text-primary-400' : idx >= 60 ? 'text-accent-400' : 'text-red-400';

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-white mb-6">{t('monitoring.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Drone list ─────────────────────────────── */}
        <div className="lg:col-span-1 space-y-3">
          {drones.map((drone) => {
            const colors = STATUS_COLORS[drone.status];
            return (
              <div
                key={drone.id}
                onClick={() => setSelected(drone)}
                className={[
                  'glass-card p-4 cursor-pointer transition-all duration-200 hover:border-primary-600/50',
                  selected?.id === drone.id ? 'border-primary-600/60 bg-primary-900/10' : '',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-white">{drone.name}</p>
                  <span className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${colors.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {t(`monitoring.${drone.status}`)}
                  </span>
                </div>

                {/* Battery */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-400">🔋 {t('monitoring.battery')}</span>
                  <div className="flex-1 h-1.5 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${drone.battery > 50 ? 'bg-primary-500' : drone.battery > 20 ? 'bg-accent-500' : 'bg-red-500'}`}
                      style={{ width: `${drone.battery}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{drone.battery}%</span>
                </div>

                <div className="flex gap-3 text-xs text-slate-400">
                  <span>🌿 Health: <span className={`font-semibold ${healthColor(drone.healthIndex)}`}>{drone.healthIndex}%</span></span>
                  <span>📡 {drone.coverage} ha</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Details + controls ─────────────────────── */}
        {selected && (
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            {/* Stats */}
            <div className="glass-card p-5">
              <h2 className="text-base font-semibold text-white mb-4">{selected.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t('monitoring.battery'),      value: `${selected.battery}%`,       icon: '🔋' },
                  { label: t('monitoring.health_index'), value: `${selected.healthIndex}%`,   icon: '🌿' },
                  { label: t('monitoring.coverage'),     value: `${selected.coverage} ha`,     icon: '📡' },
                  { label: 'Altitude',                   value: `${selected.altitude}m`,       icon: '✈️' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-border/40 p-3 rounded-xl text-center">
                    <p className="text-xl mb-1">{stat.icon}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated map view */}
            <div className="glass-card p-5 border border-primary-700/40">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">📍 Live Position (Simulated)</h3>
              <div className="relative h-48 bg-surface-border/30 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Field grid overlay */}
                    <div className="w-64 h-36 border-2 border-primary-600/40 rounded-lg relative">
                      {[...Array(4)].map((_, r) => [...Array(4)].map((_, c) => (
                        <div key={`${r}-${c}`} className="absolute border border-primary-800/20"
                          style={{ top: `${r*25}%`, left: `${c*25}%`, width: '25%', height: '25%' }} />
                      )))}
                      {/* Drone marker */}
                      {selected.status === 'active' && (
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs animate-pulse shadow-lg shadow-primary-500/50">
                            🚁
                          </div>
                          {/* Coverage circle */}
                          <div className="absolute -inset-4 border border-primary-500/30 rounded-full animate-ping" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-slate-500">
                  {selected.lat.toFixed(3)}°N, {selected.lng.toFixed(3)}°E
                </div>
              </div>
            </div>

            {/* Crop health alerts */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">🌿 Crop Health Alerts</h3>
              <div className="space-y-2">
                {[
                  { area: 'Field A – Row 3', issue: 'Yellowing detected (possible nitrogen deficiency)', severity: 'medium' },
                  { area: 'Field B – North',  issue: 'Healthy — optimal NDVI 0.82', severity: 'ok' },
                  { area: 'Field C – Row 7', issue: 'Pest activity detected — recommend inspection', severity: 'high' },
                ].map((alert) => (
                  <div key={alert.area} className={`flex items-start gap-3 p-3 rounded-xl ${
                    alert.severity === 'ok' ? 'bg-primary-900/20' :
                    alert.severity === 'medium' ? 'bg-amber-900/20' : 'bg-red-900/20'
                  }`}>
                    <span>{alert.severity === 'ok' ? '✅' : alert.severity === 'medium' ? '⚠️' : '🚨'}</span>
                    <div>
                      <p className="text-xs font-semibold text-white">{alert.area}</p>
                      <p className="text-xs text-slate-400">{alert.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                id={`dispatch-${selected.id}`}
                onClick={() => dispatch(selected.id)}
                disabled={selected.status === 'active' || selected.battery < 20}
                className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🚁 {t('monitoring.dispatch')}
              </button>
              <button
                id={`recall-${selected.id}`}
                onClick={() => recall(selected.id)}
                disabled={selected.status !== 'active'}
                className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ⬇️ {t('monitoring.recall')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitoring;
