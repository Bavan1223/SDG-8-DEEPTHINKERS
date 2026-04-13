/* ============================================================
   AgriAgent – DailySummary Page
   Live weather + interactive farm task to-do manager
   ============================================================ */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { formatDate } from '../utils/helpers';
import { fetchWeather } from '../services/api';
import type { WeatherData } from '../types/api.types';

/* ── Types ──────────────────────────────────────────────── */
interface Task {
  id:     string;
  time:   string;
  text:   string;
  icon:   string;
  done:   boolean;
  date:   string; // YYYY-MM-DD — tasks belong to a specific day
}

const ICONS = ['💧','🌿','🚁','🌱','📊','🌾','🐄','🔧','🧪','🚜','📋','⚠️'];
const TODAY = () => new Date().toISOString().slice(0, 10);
const STORAGE_KEY = 'agriagent_tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ── Weather icon helper ──────────────────────────────── */
function weatherIcon(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
  if (c.includes('cloud'))  return '⛅';
  if (c.includes('storm'))  return '⛈️';
  if (c.includes('snow'))   return '❄️';
  if (c.includes('fog') || c.includes('mist')) return '🌫️';
  if (c.includes('clear') || c.includes('sun')) return '☀️';
  return '🌤️';
}

const DailySummary: React.FC = () => {
  const { t }        = useTranslation();
  const { location } = useLanguage();
  const today        = new Date().toISOString();

  /* ── Live weather ───────────────────────────────────── */
  const [weather, setWeather]       = useState<WeatherData | null>(null);
  const [weatherLoading, setWL]     = useState(true);

  useEffect(() => {
    setWL(true);
    fetchWeather(location)
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setWL(false));
  }, [location.state, location.district]);

  /* ── Tasks (localStorage-backed) ────────────────────── */
  const [tasks, setTasks]         = useState<Task[]>(loadTasks);
  const [showAdd, setShowAdd]     = useState(false);
  const [newText, setNewText]     = useState('');
  const [newTime, setNewTime]     = useState('08:00');
  const [newIcon, setNewIcon]     = useState('🌿');
  const [editId,  setEditId]      = useState<string | null>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const todayStr = TODAY();
  const todayTasks = tasks
    .filter(t => t.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  function persist(next: Task[]) { setTasks(next); saveTasks(next); }

  function addTask() {
    if (!newText.trim()) return;
    const task: Task = {
      id:   `${Date.now()}`,
      time:  newTime,
      text:  newText.trim(),
      icon:  newIcon,
      done:  false,
      date:  todayStr,
    };
    persist([...tasks, task]);
    setNewText(''); setNewTime('08:00'); setNewIcon('🌿'); setShowAdd(false);
  }

  function toggleDone(id: string) {
    persist(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id: string) {
    persist(tasks.filter(t => t.id !== id));
  }

  function startEdit(task: Task) {
    setEditId(task.id);
    setNewText(task.text);
    setNewTime(task.time);
    setNewIcon(task.icon);
    setShowAdd(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function saveEdit() {
    persist(tasks.map(t => t.id === editId ? { ...t, text: newText.trim(), time: newTime, icon: newIcon } : t));
    setEditId(null); setNewText(''); setNewTime('08:00'); setNewIcon('🌿'); setShowAdd(false);
  }

  const doneCount    = todayTasks.filter(t => t.done).length;
  const pendingCount = todayTasks.length - doneCount;

  /* ── Snapshot cards (right column) ───────────────────── */
  const snapCards = [
    { icon: '🌾', title: 'Crop Advisory',   text: 'Rice (Field A) is in flowering stage. Apply DAP fertiliser this week.', border: 'border-primary-700/40' },
    { icon: '💧', title: 'Irrigation',       text: 'Auto-irrigation is OFF. Rain detected. Manual schedule: Thu 6AM.', border: 'border-sky-700/40' },
    { icon: '📊', title: 'Market Highlight', text: 'Tomato prices up 5.2% today. Best price at nearest APMC – ₹2,800/q.', border: 'border-accent-700/40' },
    { icon: '🚨', title: 'Active Alerts',    text: '2 alerts: Storm advisory (medium), Locust watch (low).', border: 'border-red-700/40' },
    { icon: '💧', title: 'Water Supply',     text: '18 days of water remaining. Borewell: 80% | Pond: 40%.', border: 'border-sky-700/40' },
  ];

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white">{t('nav.daily')}</h1>
        <p className="text-slate-400 mt-1">{formatDate(today)} · {location.district}, {location.state}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Live Weather card */}
          <div className="glass-card p-5 border border-sky-700/40">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">☀️ Today's Weather</h2>
            {weatherLoading ? (
              <div className="flex items-center gap-3 text-slate-400">
                <span className="animate-spin text-2xl">🔄</span>
                <span className="text-sm">Fetching live weather…</span>
              </div>
            ) : weather ? (
              <div className="flex items-center gap-5">
                <span className="text-5xl animate-float">{weatherIcon(weather.condition)}</span>
                <div>
                  <p className="text-3xl font-display font-bold text-white">{Math.round(weather.temperature)}°C</p>
                  <p className="text-slate-400">{weather.condition} · {weather.humidity}% humidity</p>
                  <p className="text-sm text-slate-400 mt-0.5">💨 Wind: {weather.windSpeed} km/h · 👁️ Visibility: {weather.visibility ?? 'N/A'} km</p>
                  {weather.rainfall > 0 && (
                    <p className="text-sm text-sky-400 mt-1">🌧️ {weather.rainfall}mm rainfall recorded</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <span className="text-5xl">⛅</span>
                <div>
                  <p className="text-3xl font-display font-bold text-white">—</p>
                  <p className="text-slate-400">Weather data unavailable for {location.district}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Interactive Task Manager ───────────────── */}
          <div className="glass-card p-5">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">📋 Today's Farm Tasks</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {doneCount} done · {pendingCount} pending
                </p>
              </div>
              <button
                id="add-task-btn"
                onClick={() => { setEditId(null); setNewText(''); setNewTime('08:00'); setNewIcon('🌿'); setShowAdd(v => !v); }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary-700 text-white font-semibold hover:bg-primary-600 transition-colors"
              >
                {showAdd && !editId ? '✕ Cancel' : '+ Add Task'}
              </button>
            </div>

            {/* Add / Edit form */}
            {showAdd && (
              <div className="mb-4 p-4 rounded-xl bg-surface-border/40 border border-primary-700/30 space-y-3">
                {/* Icon picker */}
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(ic => (
                    <button
                      key={ic}
                      onClick={() => setNewIcon(ic)}
                      className={`text-xl p-1.5 rounded-lg transition-all ${newIcon === ic ? 'bg-primary-700 ring-2 ring-primary-400' : 'hover:bg-surface-border'}`}
                    >{ic}</button>
                  ))}
                </div>
                {/* Time + text */}
                <div className="flex gap-3">
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white w-28 focus:outline-none focus:border-primary-500"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Task description…"
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (editId ? saveEdit() : addTask())}
                    className="flex-1 bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <button
                  onClick={editId ? saveEdit : addTask}
                  className="w-full py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors"
                >
                  {editId ? '💾 Save Changes' : '✅ Add Task'}
                </button>
              </div>
            )}

            {/* Task list */}
            {todayTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🌱</p>
                <p className="text-slate-400 text-sm font-medium">No tasks for today yet.</p>
                <p className="text-slate-500 text-xs mt-1">Click "+ Add Task" to plan your day!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map(task => (
                  <div
                    key={task.id}
                    className={[
                      'flex items-center gap-3 p-3 rounded-xl transition-all group',
                      task.done ? 'bg-primary-900/20' : 'hover:bg-surface-border/40',
                    ].join(' ')}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleDone(task.id)}
                      className={[
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                        task.done
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'border-slate-600 hover:border-primary-400',
                      ].join(' ')}
                    >
                      {task.done && <span className="text-[10px] font-bold">✓</span>}
                    </button>

                    <span className="text-xl flex-shrink-0">{task.icon}</span>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.text}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.time}</p>
                    </div>

                    {/* Status badge */}
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      task.done
                        ? 'bg-primary-900/60 text-primary-300'
                        : 'bg-surface-border text-slate-400'
                    }`}>
                      {task.done ? '✓ Done' : 'Pending'}
                    </span>

                    {/* Action buttons (show on hover) */}
                    <div className="hidden group-hover:flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(task)}
                        className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-surface-border transition-colors"
                        title="Edit"
                      >✎</button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-xs text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-colors"
                        title="Delete"
                      >✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {todayTasks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-surface-border">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Daily Progress</span>
                  <span>{doneCount}/{todayTasks.length} tasks</span>
                </div>
                <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${todayTasks.length ? (doneCount / todayTasks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Snapshot cards (right column) ────────────── */}
        <div className="space-y-4">
          {snapCards.map(card => (
            <div key={card.title} className={`glass-card p-4 border ${card.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{card.icon}</span>
                <p className="text-sm font-semibold text-slate-200">{card.title}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
