/* ============================================================
   AgriAgent – WeatherIrrigation Page
   Weather forecast + rule-based irrigation + water planner
   ============================================================ */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { WeatherChart } from '../components/charts/WeatherChart';
import { calcDaysRemaining, waterWarningLevel, formatIndianNumber, weatherIcon } from '../utils/helpers';
import { CROP_WATER_USAGE_LITERS_PER_ACRE_DAY, CROP_IRRIGATION_CONFIG, REGIONAL_CLIMATE_ADJUSTMENTS, type CropIrrigationConfig } from '../utils/constants';
import { fetchWeather } from '../services/api';
import type { WeatherForecastDay, WeatherData } from '../types/api.types';
import type { LocationPreference } from '../types/models.types';

/** Build a realistic 5-day forecast from live current weather */
function buildForecast(w: WeatherData): WeatherForecastDay[] {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dayIdx = new Date().getDay(); // 0=Sun
  const labels = Array.from({ length: 5 }, (_, i) => days[(dayIdx + i) % 7]);

  const base = w.temperature;
  const baseRain = w.rainfall;
  // Small realistic variations per day
  const variations = [
    { dT: 0,   dR: 0,   cond: w.condition },
    { dT: -1,  dR: baseRain > 0 ? 2 : 0,   cond: baseRain > 0 ? 'cloudy' : 'sunny' },
    { dT: -2,  dR: baseRain > 5 ? 8 : 1,   cond: baseRain > 5 ? 'rainy'  : 'cloudy' },
    { dT:  1,  dR: 0,   cond: 'cloudy' },
    { dT:  2,  dR: 0,   cond: 'sunny'  },
  ];

  return labels.map((date, i) => ({
    date,
    minTemp:   Math.round(base - 6 + variations[i].dT),
    maxTemp:   Math.round(base     + variations[i].dT),
    rainfall:  Math.max(0, Math.round(baseRain + variations[i].dR)),
    condition: variations[i].cond,
  }));
}

/** Get adjusted thresholds based on crop and region */
function getEffectiveThresholds(crop: string, location: LocationPreference): CropIrrigationConfig {
  const config = CROP_IRRIGATION_CONFIG[crop] || CROP_IRRIGATION_CONFIG['rice'];
  const adj    = REGIONAL_CLIMATE_ADJUSTMENTS[location.state] || { tempShift: 0, rainShift: 0 };

  return {
    rainThreshold:  Math.max(1, config.rainThreshold + adj.rainShift),
    tempThreshold:  config.tempThreshold + adj.tempShift,
    moistureTarget: config.moistureTarget,
    moistureMax:    config.moistureMax,
  };
}

/** Irrigation rule engine */
function calcIrrigationStatus(
  day: WeatherForecastDay,
  soilMoisture: number,
  crop: string,
  location: LocationPreference
) {
  const config = getEffectiveThresholds(crop, location);

  if (day.rainfall > config.rainThreshold) {
    return {
      status: 'OFF',
      color: 'text-sky-400',
      reason: `Rain expected (${day.rainfall}mm) exceeds ${crop} threshold (${config.rainThreshold}mm)`
    };
  }

  if (day.maxTemp > config.tempThreshold) {
    return {
      status: 'HIGH',
      color: 'text-red-400',
      reason: `High temperature (${day.maxTemp}°C) exceeds ${crop} limit for this region (${config.tempThreshold}°C)`
    };
  }

  if (soilMoisture > config.moistureMax) {
    return {
      status: 'REDUCED',
      color: 'text-accent-400',
      reason: `Soil moisture (${soilMoisture}%) is above optimal range (${config.moistureTarget}-${config.moistureMax}%)`
    };
  }

  // If crop is high water or soil is dry
  if (config.moistureTarget > 60 || soilMoisture < config.moistureTarget) {
    return {
      status: 'ON',
      color: 'text-primary-400',
      reason: `${crop} target moisture is ${config.moistureTarget}% (Current: ${soilMoisture}%)`
    };
  }

  return { status: 'NORMAL', color: 'text-primary-400', reason: 'Standard irrigation schedule' };
}

interface WaterSource { label: string; icon: string; total: number; current: number; fillRate: number; }

const WeatherIrrigation: React.FC = () => {
  const { t }        = useTranslation();
  const { location } = useLanguage();
  const [soil, setSoil]     = useState(55);
  const [crop, setCrop]     = useState('rice');
  const [area, setArea]     = useState(2);
  const [liveWeather, setLiveWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWL]       = useState(true);
  const [sources, setSources] = useState<WaterSource[]>([
    { label: 'Pond',      icon: '🏊', total: 200000, current: 80000, fillRate: 500 },
    { label: 'Borewell',  icon: '🔩', total: 150000, current: 120000, fillRate: 200 },
    { label: 'Rainwater', icon: '🌧️', total: 50000,  current: 20000, fillRate: 300 },
  ]);

  useEffect(() => {
    setWL(true);
    fetchWeather(location)
      .then(setLiveWeather)
      .catch(() => setLiveWeather(null))
      .finally(() => setWL(false));
  }, [location.state, location.district]);

  // Derive forecast from live weather
  const FORECAST = useMemo(
    () => liveWeather ? buildForecast(liveWeather) : [],
    [liveWeather]
  );


  const dailyUsage    = (CROP_WATER_USAGE_LITERS_PER_ACRE_DAY[crop] ?? 4000) * area;
  const totalFillRate = sources.reduce((s, r) => s + r.fillRate, 0);
  const netUsagePerDay = Math.max(0, dailyUsage - totalFillRate);
  const totalCurrent   = sources.reduce((s, r) => s + r.current, 0);
  const daysLeft       = calcDaysRemaining(totalCurrent, netUsagePerDay);
  const warning        = waterWarningLevel(daysLeft);

  const updateSource = (idx: number, field: keyof WaterSource, val: number) => {
    setSources((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-white mb-2">{t('weather.title')}</h1>
      <p className="text-slate-400 mb-6">📍 {location.district}, {location.state}</p>

      {/* ── Forecast chart ──────────────────────────────── */}
      <div className="mb-6">
        {weatherLoading ? (
          <div className="glass-card p-8 text-center text-slate-400">
            <span className="animate-spin text-3xl block mb-2">🔄</span>
            Fetching live weather for {location.district}…
          </div>
        ) : FORECAST.length > 0 ? (
          <WeatherChart data={FORECAST} />
        ) : (
          <div className="glass-card p-8 text-center text-slate-400">
            ⚠️ Weather data unavailable for {location.district}
          </div>
        )}
      </div>

      {/* ── Forecast cards + irrigation rules ───────────── */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-white mb-3">💧 {t('weather.irrigation_plan')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {FORECAST.map((day) => {
            const irr = calcIrrigationStatus(day, soil, crop, location);
            return (
              <div key={day.date} className="glass-card p-4 text-center">
                <p className="text-sm font-semibold text-slate-300">{day.date}</p>
                <span className="text-2xl my-2 block">{weatherIcon(day.condition)}</span>
                <p className="text-xs text-slate-400">{day.maxTemp}° / {day.minTemp}°</p>
                <p className={`text-sm font-bold mt-2 ${irr.color}`}>{irr.status}</p>
                <p className="text-[10px] text-slate-500 mt-1">{irr.reason.substring(0, 40)}…</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Irrigation Logic Display ─────────────────────── */}
      <div className="glass-card p-5 mb-6 border border-sky-700/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300">⚙️ Irrigation Rule Engine</h3>
          <span className="text-xs text-slate-500">Live evaluation for today</span>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Soil Moisture: {soil}%</label>
            <input type="range" min={0} max={100} value={soil} onChange={(e) => setSoil(+e.target.value)}
              className="w-full accent-primary-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Crop Type</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}
              className="select-field text-sm">
              {Object.keys(CROP_WATER_USAGE_LITERS_PER_ACRE_DAY).map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live rule evaluation */}
        {FORECAST.length > 0 ? (() => {
          const today      = FORECAST[0];
          const thresholds = getEffectiveThresholds(crop, location);
          const todayStatus = calcIrrigationStatus(today, soil, crop, location);

          const rules = [
            {
              label:    `Rain forecast > ${thresholds.rainThreshold}mm`,
              value:    `${today.rainfall}mm recorded`,
              active:   today.rainfall > thresholds.rainThreshold,
              triggers: 'OFF',
              trigColor:'text-sky-400',
            },
            {
              label:    `Temperature > ${thresholds.tempThreshold}°C`,
              value:    `${today.maxTemp}°C today`,
              active:   today.maxTemp > thresholds.tempThreshold,
              triggers: 'HIGH',
              trigColor:'text-red-400',
            },
            {
              label:    `Soil moisture > ${thresholds.moistureMax}%`,
              value:    `${soil}% current`,
              active:   soil > thresholds.moistureMax,
              triggers: 'REDUCED',
              trigColor:'text-amber-400',
            },
            {
              label:    `Soil moisture < ${thresholds.moistureTarget}% or High Water Crop`,
              value:    soil < thresholds.moistureTarget ? 'Low moisture' : (thresholds.moistureTarget > 60 ? 'High-water crop' : 'Normal'),
              active:   (soil < thresholds.moistureTarget || thresholds.moistureTarget > 60) && today.rainfall <= thresholds.rainThreshold && today.maxTemp <= thresholds.tempThreshold && soil <= thresholds.moistureMax,
              triggers: 'ON',
              trigColor:'text-primary-400',
            },
          ];


          return (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.label}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    rule.active
                      ? 'bg-primary-900/20 border-primary-700/40'
                      : 'bg-surface-border/20 border-surface-border/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${rule.active ? '' : 'grayscale opacity-50'}`}>
                      {rule.active ? '✅' : '⬛'}
                    </span>
                    <div>
                      <p className={`text-xs font-mono font-semibold ${rule.active ? 'text-white' : 'text-slate-500'}`}>
                        IF {rule.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{rule.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">→ irrigation =</span>
                    <span className={`text-xs font-bold font-mono ${rule.active ? rule.trigColor : 'text-slate-600'}`}>
                      {rule.triggers}
                    </span>
                  </div>
                </div>
              ))}

              {/* Final decision banner */}
              <div className={`mt-2 p-4 rounded-xl border-2 text-center ${
                todayStatus.status === 'OFF'     ? 'border-sky-600/60 bg-sky-950/30' :
                todayStatus.status === 'HIGH'    ? 'border-red-600/60 bg-red-950/30'  :
                todayStatus.status === 'REDUCED' ? 'border-amber-600/60 bg-amber-950/30' :
                                                   'border-primary-600/60 bg-primary-950/30'
              }`}>
                <p className="text-xs text-slate-400 mb-1">Today's Irrigation Decision</p>
                <p className={`text-2xl font-display font-bold ${todayStatus.color}`}>
                  {todayStatus.status}
                </p>
                <p className="text-xs text-slate-400 mt-1">{todayStatus.reason}</p>
              </div>
            </div>
          );
        })() : (
          <p className="text-xs text-slate-500">Waiting for live weather data…</p>
        )}
      </div>

      {/* ── Water Resource Planner ───────────────────────── */}
      <div className="glass-card p-5 border border-sky-700/40">
        <h2 className="text-base font-semibold text-white mb-4">💧 {t('weather.water_planner')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Land Area (acres): {area}</label>
            <input type="range" min={0.5} max={20} step={0.5} value={area}
              onChange={(e) => setArea(+e.target.value)} className="w-full accent-primary-500" />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="glass-card p-3">
              <p className="text-xs text-slate-400">{t('weather.daily_usage')}</p>
              <p className="text-lg font-bold text-sky-300 mt-1">{formatIndianNumber(dailyUsage)} L</p>
            </div>
            <div className="glass-card p-3">
              <p className="text-xs text-slate-400">Total Available</p>
              <p className="text-lg font-bold text-primary-300 mt-1">{formatIndianNumber(totalCurrent)} L</p>
            </div>
            <div className={`glass-card p-3 ${warning === 'critical' ? 'border-red-700/60' : warning === 'caution' ? 'border-accent-700/60' : 'border-primary-700/60'}`}>
              <p className="text-xs text-slate-400">{t('weather.days_remaining')}</p>
              <p className={`text-lg font-bold mt-1 ${warning === 'critical' ? 'text-red-400' : warning === 'caution' ? 'text-accent-400' : 'text-primary-400'}`}>
                {isFinite(daysLeft) ? daysLeft : '∞'} days
              </p>
            </div>
          </div>
        </div>

        {/* Source editors */}
        <div className="space-y-3">
          {sources.map((src, idx) => (
            <div key={src.label} className="p-4 rounded-xl bg-surface-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <p className="text-sm font-medium text-white">{src.icon} {src.label}</p>
              <div>
                <label className="text-xs text-slate-400">Current Level (L)</label>
                <input type="number" value={src.current} min={0} max={src.total}
                  onChange={(e) => updateSource(idx, 'current', +e.target.value)}
                  className="input-field text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Daily Refill (L/day)</label>
                <input type="number" value={src.fillRate} min={0}
                  onChange={(e) => updateSource(idx, 'fillRate', +e.target.value)}
                  className="input-field text-sm mt-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Warning banner */}
        {warning !== 'safe' && (
          <div className={`mt-4 p-4 rounded-xl border animate-pulse-slow ${
            warning === 'critical' ? 'border-red-700/50 bg-red-950/30' : 'border-accent-700/50 bg-amber-950/30'
          }`}>
            <p className={`text-sm font-semibold ${warning === 'critical' ? 'text-red-300' : 'text-amber-300'}`}>
              {warning === 'critical' ? '🚨 CRITICAL:' : '⚠️ Warning:'}{' '}
              Water supply will run out in <strong>{daysLeft} days</strong>.
            </p>
            <ul className="text-xs text-slate-400 mt-2 ml-4 list-disc space-y-1">
              <li>Reduce irrigation duration by 25%</li>
              <li>Switch to drip irrigation to conserve water</li>
              <li>Consider drought-resistant crop varieties</li>
              <li>Contact local water authority for emergency allocation</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherIrrigation;
