/* ============================================================
   AgriAgent – Helpers
   Utility functions for formatting, calculations, etc.
   ============================================================ */

/** Format a number as Indian currency (₹) */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a number with Indian comma notation (e.g. 1,00,000) */
export function formatIndianNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

/** Format date to readable string */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format timestamp to time string */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Returns today's ISO date string (YYYY-MM-DD) */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Returns current season based on month */
export function getCurrentSeason(): 'kharif' | 'rabi' | 'zaid' | 'summer' {
  const month = new Date().getMonth() + 1; // 1–12
  if (month >= 6 && month <= 10) return 'kharif';   // Jun–Oct
  if (month >= 11 || month <= 2) return 'rabi';     // Nov–Feb
  if (month >= 3 && month <= 5)  return 'zaid';     // Mar–May
  return 'summer';
}

/** Calculate days remaining before water runs out */
export function calcDaysRemaining(totalLiters: number, dailyUsage: number): number {
  if (dailyUsage <= 0) return Infinity;
  return Math.floor(totalLiters / dailyUsage);
}

/** Return warning level for days remaining */
export function waterWarningLevel(days: number): 'safe' | 'caution' | 'critical' {
  if (days >= 14) return 'safe';
  if (days >= 7)  return 'caution';
  return 'critical';
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Get color class for trend direction */
export function trendColor(trend: 'up' | 'down' | 'stable'): string {
  const map = { up: 'text-green-400', down: 'text-red-400', stable: 'text-yellow-400' };
  return map[trend];
}

/** Get trend arrow symbol */
export function trendArrow(trend: 'up' | 'down' | 'stable'): string {
  return { up: '↑', down: '↓', stable: '→' }[trend];
}

/** Sleep utility (for simulated loading) */
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLen = 80): string {
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

/** Percentage helper */
export function pct(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/** Get condition icon emoji */
export function weatherIcon(condition: string): string {
  const map: Record<string, string> = {
    sunny:    '☀️',
    cloudy:   '⛅',
    rainy:    '🌧️',
    stormy:   '⛈️',
    foggy:    '🌫️',
    windy:    '💨',
    hail:     '🌨️',
    clear:    '🌙',
  };
  return map[condition.toLowerCase()] ?? '🌤️';
}
