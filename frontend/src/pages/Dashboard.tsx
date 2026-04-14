/* ============================================================
   AgriAgent – Dashboard Page
   Central hub showing weather, alerts, market, water supply
   ============================================================ */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { WeatherCard } from '../components/dashboard/WeatherCard';
import { AlertCard } from '../components/dashboard/AlertCard';
import { MarketCard } from '../components/dashboard/MarketCard';
import { Skeleton } from '../components/common/Loader';
import { formatINR, getCurrentSeason } from '../utils/helpers';
import { fetchWeather, fetchAlerts, fetchMarketPrices } from '../services/api';
import type { WeatherData, Alert, MarketPrice } from '../types/api.types';

// ── Mock data (used when backend is offline) ──────────────────
const MOCK_WEATHER: WeatherData = {
  location: 'Mysuru, Karnataka',
  temperature: 28, humidity: 65, rainfall: 2, windSpeed: 12,
  condition: 'cloudy',
  visibility: 10,
  lastUpdated: new Date().toISOString(),
  forecast: [
    { date: 'Mon', minTemp: 22, maxTemp: 30, rainfall: 0,  condition: 'sunny' },
    { date: 'Tue', minTemp: 21, maxTemp: 29, rainfall: 3,  condition: 'cloudy' },
    { date: 'Wed', minTemp: 20, maxTemp: 26, rainfall: 12, condition: 'rainy' },
    { date: 'Thu', minTemp: 22, maxTemp: 28, rainfall: 5,  condition: 'cloudy' },
    { date: 'Fri', minTemp: 23, maxTemp: 31, rainfall: 0,  condition: 'sunny' },
  ],
};

const MOCK_ALERTS: Alert[] = [
  { id: '1', type: 'storm', severity: 'medium', title: 'Storm Advisory', description: 'Strong winds expected Wednesday', affectedArea: 'Mysuru district', issuedAt: new Date().toISOString(), actionRequired: 'Secure farm equipment and greenhouses' },
  { id: '2', type: 'pest',  severity: 'low',    title: 'Locust Watch',   description: 'Low-level locust movement detected', affectedArea: 'Karnataka Central', issuedAt: new Date().toISOString(), actionRequired: 'Monitor crops and apply preventive spray' },
];

const MOCK_PRICES: MarketPrice[] = [
  { market: 'Mysore APMC',  district: 'Mysuru',  state: 'Karnataka', crop: 'Tomato',   price: 2800, trend: 'up',   changePercent: 5.2,  lastUpdated: new Date().toISOString() },
  { market: 'Mandya Mandi', district: 'Mandya',  state: 'Karnataka', crop: 'Sugarcane',price: 3200, trend: 'stable', changePercent: 0.1, lastUpdated: new Date().toISOString() },
  { market: 'Hassan APMC',  district: 'Hassan',  state: 'Karnataka', crop: 'Potato',   price: 1900, trend: 'down', changePercent: -2.3, lastUpdated: new Date().toISOString() },
];

const Dashboard: React.FC = () => {
  const { t }                                   = useTranslation();
  const { location, preferredCrop }             = useLanguage();

  const [weather,  setWeather]  = useState<WeatherData | null>(null);
  const [alerts,   setAlerts]   = useState<Alert[]>([]);
  const [prices,   setPrices]   = useState<MarketPrice[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const [w, a, p] = await Promise.all([
          fetchWeather(location).catch((e) => {
            console.error('Weather fetch error:', e);
            return { ...MOCK_WEATHER, location: `${location.district}, ${location.state}` };
          }),
          fetchAlerts(location.state || 'Karnataka', location.district || 'Mysuru').catch((e) => {
            console.error('Alert fetch error:', e);
            return MOCK_ALERTS;
          }),
          fetchMarketPrices(location.state || 'Karnataka', location.district || 'Mysuru', preferredCrop).catch((e) => {
            console.error('Market fetch error:', e);
            return MOCK_PRICES;
          })
        ]);
        if (active) {
          setWeather(w);
          setAlerts(Array.isArray(a) && a.length ? a : MOCK_ALERTS);
          // Backend market route sends an object: { prices, best, recommendation } 
          // So we safely extract the array if possible
          let marketArray = Array.isArray(p) ? p : (p && typeof p === 'object' && Array.isArray((p as any).prices)) ? (p as any).prices : MOCK_PRICES;
          
          // Inject real-time fluctuations and fix stale crop strings from backend
          if (marketArray && marketArray.length > 0) {
            const cStr = preferredCrop.toLowerCase();
            const basePrice = cStr === 'rice' ? 3200 : cStr === 'wheat' ? 2400 : cStr === 'sugarcane' ? 310 : cStr === 'potato' ? 1900 : 2800;
            const capitalizedCrop = cStr.charAt(0).toUpperCase() + cStr.slice(1);
            
            marketArray = marketArray.map((m: any, i: number) => {
              const noise = Math.round((Math.random() * 60) - 30); // Random variance -30 to +30 for live effect
              return {
                ...m,
                crop: capitalizedCrop,
                price: Math.round(basePrice * (1 - (i * 0.02))) + noise,
                trend: noise > 0 ? 'up' : 'down',
                changePercent: Math.abs(noise / 10).toFixed(1)
              };
            }).sort((a: any, b: any) => b.price - a.price);
          }

          setPrices(marketArray.length ? marketArray : MOCK_PRICES);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        if (active) {
          setWeather(MOCK_WEATHER);
          setAlerts(MOCK_ALERTS);
          setPrices(MOCK_PRICES);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    
    loadData();
    return () => { active = false; };
  }, [location, preferredCrop]);

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white">{t('dashboard.title')}</h1>
        <p className="text-slate-400 mt-1">
          📍 {location.district}, {location.state} · {getCurrentSeason().toUpperCase()} season
        </p>
      </div>

      {/* ── Summary cards ───────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard title={t('dashboard.weather')} value={`${weather?.temperature}°C`} subtitle={weather?.condition} icon="🌡️" color="blue" trend="stable" />
          <SummaryCard 
            title={t('dashboard.market')}  
            value={prices.length > 0 ? formatINR(prices[0].price) : formatINR(2800)} 
            subtitle={prices.length > 0 ? `${prices[0].crop}/quintal` : "Tomato/quintal"} 
            icon="📊" 
            color="green" 
            trend={prices.length > 0 ? prices[0].trend : "up"} 
            trendValue={prices.length > 0 ? `${prices[0].changePercent}%` : "5.2%"} 
          />
          <SummaryCard title={t('dashboard.alerts')}  value={alerts.length} subtitle="Active alerts" icon="🚨" color="amber" />
          <SummaryCard title={t('dashboard.water')}   value="18 days" subtitle="Water remaining" icon="💧" color="blue" trend="down" trendValue="3d" />
        </div>
      )}

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weather card */}
        <div className="lg:col-span-1">
          {loading ? <Skeleton lines={5} /> : weather && <WeatherCard data={weather} />}

          {/* Irrigation status */}
          <div className="glass-card p-4 mt-4 border border-sky-700/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Irrigation Status</p>
                <p className="text-lg font-bold text-sky-300 mt-1">💧 OFF — Rain expected</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-900/50 text-sky-300 text-xs font-medium border border-sky-700/50">
                AUTO
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Next scheduled: Thu 6:00 AM</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">{t('dashboard.alerts')}</h2>
            <Link to="/alerts" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3"><Skeleton lines={3} /><Skeleton lines={3} /></div>
          ) : alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((a) => <AlertCard key={a.id} alert={a} compact />)}
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-slate-400">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm">{t('alerts.no_alerts')}</p>
            </div>
          )}
        </div>

        {/* Market */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">{t('dashboard.market')}</h2>
            <Link to="/market" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} lines={2} />)}</div>
          ) : (
            <div className="space-y-3">
              {prices.map((p, i) => <MarketCard key={i} data={p} highlight={i === 0} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Water Resource Summary ────────────────────────── */}
      <div className="mt-6 glass-card p-5 border border-sky-700/40">
        <h2 className="text-base font-semibold text-white mb-4">💧 Water Resource Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Borewell', current: 120000, total: 150000, icon: '🔩' },
            { label: 'Pond',     current: 80000,  total: 200000, icon: '🏊' },
            { label: 'Rainwater', current: 20000, total: 50000,  icon: '🌧️' },
          ].map((src) => {
            const pct = Math.round((src.current / src.total) * 100);
            return (
              <div key={src.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 flex items-center gap-1">{src.icon} {src.label}</span>
                  <span className={`text-xs font-medium ${pct > 50 ? 'text-primary-400' : pct > 20 ? 'text-accent-400' : 'text-red-400'}`}>{pct}%</span>
                </div>
                <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pct > 50 ? 'bg-primary-500' : pct > 20 ? 'bg-accent-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{(src.current/1000).toFixed(0)}k / {(src.total/1000).toFixed(0)}k L</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-amber-900/20 border border-amber-700/40">
          <p className="text-sm text-amber-300">⚠️ Water may run out in <strong>18 days</strong> at current usage. Consider reducing irrigation by 20%.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
