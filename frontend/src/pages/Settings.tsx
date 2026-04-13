/* ============================================================
   AgriAgent – Settings Page
   Language, location, notifications, farm profile
   ============================================================ */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { INDIA_STATES_DISTRICTS, SUPPORTED_LANGUAGES, CROPS } from '../utils/constants';
import { Select } from '../components/common/Input';
import { Button } from '../components/common/Button';

const Settings: React.FC = () => {
  const { t }                             = useTranslation();
  const { language, setLanguage, location, setLocation } = useLanguage();
  const { user, signInWithGoogle, logout }               = useAuth();

  const [state, setState]     = useState(location.state);
  const [district, setDistrict] = useState(location.district);
  const [saved, setSaved]     = useState(false);
  const [cropPref, setCropPref] = useState('rice');
  const [areaAcres, setAreaAcres] = useState('2');
  const [notifs, setNotifs]   = useState({ alerts: true, market: true, weather: false });

  const stateOpts    = Object.keys(INDIA_STATES_DISTRICTS).map((s) => ({ value: s, label: s }));
  const districtOpts = (INDIA_STATES_DISTRICTS[state] ?? []).map((d) => ({ value: d, label: d }));

  const handleSave = () => {
    setLocation({ state, district });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-white mb-8">{t('settings.title')}</h1>

      {/* ── Account ─────────────────────────────────────── */}
      <section className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">👤 Account</h2>
        {user ? (
          <div className="flex items-center gap-4">
            {user.photoURL && (
              <img src={user.photoURL} alt="avatar" className="w-14 h-14 rounded-full ring-2 ring-primary-600" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-white">{user.displayName}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
            <Button variant="danger" size="sm" onClick={logout}>Sign out</Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-400 flex-1">Sign in to sync preferences across devices.</p>
            <Button id="google-signin-btn" onClick={signInWithGoogle} icon={<span>🔐</span>}>
              Sign in with Google
            </Button>
          </div>
        )}
      </section>

      {/* ── Language ─────────────────────────────────────── */}
      <section className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">🌐 {t('settings.language')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              id={`settings-lang-${lang.code}`}
              onClick={() => setLanguage(lang.code as typeof language)}
              className={[
                'flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-150',
                language === lang.code
                  ? 'bg-primary-900/60 border border-primary-600 text-primary-200'
                  : 'bg-surface-border hover:bg-surface-border/70 text-slate-300',
              ].join(' ')}
            >
              <span className="text-sm font-semibold">{lang.native}</span>
              <span className="text-xs text-slate-500">{lang.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Location ─────────────────────────────────────── */}
      <section className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">📍 {t('settings.location')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="settings-state"
            label="State"
            value={state}
            options={stateOpts}
            onChange={(e) => { setState(e.target.value); setDistrict(''); }}
          />
          <Select
            id="settings-district"
            label="District"
            value={district}
            options={districtOpts}
            placeholder="-- Select District --"
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!state}
          />
        </div>
      </section>

      {/* ── Farm Profile ─────────────────────────────────── */}
      <section className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">🌾 {t('settings.farm_profile')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="settings-crop"
            label="Primary Crop"
            value={cropPref}
            options={CROPS.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
            onChange={(e) => setCropPref(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Land Area (acres)</label>
            <input
              id="settings-area"
              type="number"
              min={0.5}
              step={0.5}
              value={areaAcres}
              onChange={(e) => setAreaAcres(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </section>

      {/* ── Notifications ────────────────────────────────── */}
      <section className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">🔔 {t('settings.notifications')}</h2>
        <div className="space-y-3">
          {[
            { key: 'alerts',  label: 'Disaster & crop alerts',  icon: '🚨' },
            { key: 'market',  label: 'Market price updates',     icon: '📊' },
            { key: 'weather', label: 'Daily weather briefing',   icon: '🌤️' },
          ].map(({ key, label, icon }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{icon} {label}</span>
              <button
                id={`notif-${key}`}
                onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                className={[
                  'relative w-11 h-6 rounded-full transition-colors duration-200',
                  notifs[key as keyof typeof notifs] ? 'bg-primary-600' : 'bg-surface-border',
                ].join(' ')}
              >
                <span className={[
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200',
                  notifs[key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0.5',
                ].join(' ')} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Save Button ──────────────────────────────────── */}
      <Button
        id="save-settings-btn"
        fullWidth
        size="lg"
        onClick={handleSave}
        icon={saved ? <span>✅</span> : <span>💾</span>}
        variant={saved ? 'secondary' : 'primary'}
      >
        {saved ? t('settings.saved') : t('settings.save')}
      </Button>
    </div>
  );
};

export default Settings;
