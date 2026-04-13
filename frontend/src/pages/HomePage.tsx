/* ============================================================
   AgriAgent – HomePage
   Hero section + State/District selector + quick actions
   ============================================================ */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { INDIA_STATES_DISTRICTS } from '../utils/constants';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Input';

const QUICK_ACTIONS = [
  { icon: '🌾', labelKey: 'home.crop_advisory',    href: '/crops',    color: 'from-primary-700 to-primary-900' },
  { icon: '💧', labelKey: 'home.irrigation_plan',   href: '/weather',  color: 'from-sky-700 to-sky-900' },
  { icon: '🛒', labelKey: 'home.market_prices',     href: '/market',   color: 'from-accent-700 to-amber-900' },
  { icon: '⚠️', labelKey: 'home.weather_alert',     href: '/alerts',   color: 'from-red-700 to-red-900' },
];



const HomePage: React.FC = () => {
  const { t }                         = useTranslation();
  const navigate                      = useNavigate();
  const { location, setLocation }     = useLanguage();
  const [selectedState, setSelectedState]       = useState(location.state);
  const [selectedDistrict, setSelectedDistrict] = useState(location.district);

  const stateOptions   = Object.keys(INDIA_STATES_DISTRICTS).map((s) => ({ value: s, label: s }));
  const districtOptions = (INDIA_STATES_DISTRICTS[selectedState] ?? []).map((d) => ({ value: d, label: d }));

  const handleGetInsights = () => {
    setLocation({ state: selectedState, district: selectedDistrict });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-16 pb-10 px-4 md:px-12 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-sky-600/10  rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center pt-12 pb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/60 border border-primary-700/50 text-primary-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            AI-Powered Smart Farming Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-4">
            <span className="gradient-text">{t('home.hero_title')}</span>
            <br />
            <span className="text-white">{t('home.hero_subtitle')}</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {t('home.hero_desc')}
          </p>

          {/* ── Location Selector ──────────────────────────── */}
          <div className="glass-card max-w-2xl mx-auto p-6 animate-slide-up">
            <p className="text-sm font-semibold text-slate-300 mb-4 text-left">📍 Select Your Location</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <Select
                id="state-select"
                label={t('home.select_state')}
                value={selectedState}
                placeholder="-- Select State --"
                options={stateOptions}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict(''); // Reset district when state changes
                }}
              />
              <Select
                id="district-select"
                label={t('home.select_district')}
                value={selectedDistrict}
                placeholder="-- Select District --"
                options={districtOptions}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
              />
            </div>
            <Button
              id="get-insights-btn"
              fullWidth
              size="lg"
              onClick={handleGetInsights}
              disabled={!selectedState || !selectedDistrict}
              icon={<span>🚀</span>}
            >
              {t('home.get_insights')}
            </Button>
          </div>
        </div>
      </section>



      {/* ── Quick Actions ─────────────────────────────────── */}
      <section className="px-4 md:px-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-display font-bold text-white mb-5">{t('home.quick_actions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.href}
                id={`quick-${action.href.replace('/', '')}`}
                onClick={() => navigate(action.href)}
                className={[
                  'glass-card p-5 flex flex-col items-center gap-3 cursor-pointer',
                  'hover:scale-105 transition-all duration-200 active:scale-95',
                  'bg-gradient-to-br', action.color,
                ].join(' ')}
              >
                <span className="text-3xl animate-float">{action.icon}</span>
                <p className="text-sm font-medium text-white text-center">{t(action.labelKey)}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature highlights ────────────────────────────── */}
      <section className="px-4 md:px-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-display font-bold text-white mb-5">🌟 Everything your farm needs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🤖', title: 'AI Crop Advisory',    desc: 'ML-powered recommendations based on soil, weather, and season data.' },
              { icon: '🌡️', title: 'Smart Irrigation',   desc: 'Automatic irrigation control driven by live weather and soil moisture.' },
              { icon: '📊', title: 'Market Intelligence', desc: 'Real-time mandi prices with best-market recommendations across districts.' },
              { icon: '🚁', title: 'Drone Monitoring',   desc: 'Simulated drone control panel with crop health index and coverage maps.' },
              { icon: '🚨', title: 'Disaster Alerts',    desc: 'Flood, drought, storm, pest alerts with actionable guidance.' },
              { icon: '💬', title: 'Multilingual Bot',   desc: 'AgriBot speaks 10 Indian languages with voice input support.' },
            ].map((feat) => (
              <div key={feat.title} className="glass-card p-5 hover:border-primary-600/50 transition-all duration-200">
                <p className="text-3xl mb-3">{feat.icon}</p>
                <p className="text-base font-semibold text-white mb-1">{feat.title}</p>
                <p className="text-sm text-slate-400">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
