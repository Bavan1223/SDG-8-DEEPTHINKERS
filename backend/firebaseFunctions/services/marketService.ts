/* ============================================================
   AgriAgent – Market Service
   Loads CSV dataset and queries mandi prices by location/crop
   ============================================================ */

import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

interface MandiRecord {
  state: string;
  district: string;
  market: string;
  crop: string;
  price: string;
  date: string;
}

let _cache: MandiRecord[] | null = null;

/** Load market_prices.csv into memory (cached) */
function loadDataset(): MandiRecord[] {
  if (_cache) return _cache;

  // Resolve based on the firebase emulator process.cwd() ('backend/firebaseFunctions')
  const csvPath = path.resolve(process.cwd(), '../../ml-service/data/market_prices.csv');

  if (!fs.existsSync(csvPath)) {
    console.warn('market_prices.csv not found, returning empty dataset to trigger generative fallback');
    return [];
  }

  const raw = fs.readFileSync(csvPath, 'utf-8');
  _cache = parse(raw, { columns: true, skip_empty_lines: true }) as MandiRecord[];
  return _cache;
}

export function getMarketPrices(state: string, district: string, crop?: string) {
  // Resolve based on the firebase emulator process.cwd() ('backend/firebaseFunctions')
  const csvPath = path.resolve(process.cwd(), '../../ml-service/data/market_prices.csv');

  if (!fs.existsSync(csvPath)) {
    console.warn('market_prices.csv not found, returning dynamic mock data');
    const selectedCrop = crop ? crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase() : 'Tomato';
    const baseCropsPrices: Record<string, number> = { Tomato: 2800, Potato: 1900, Onion: 1600, Rice: 3200, Wheat: 2400, Sugarcane: 310 };
    const basePrice = baseCropsPrices[selectedCrop] || 2500;
    
    // Create base mandis using actual arguments so locations always match the user query!
    const d = district || 'Local';
    const s = state || 'IN';
    const mockData = [
      { market: `${d} Main APMC`,  district: d,     state: s, crop: selectedCrop, price: Math.round(basePrice * 1.05), trend: 'up', changePercent: 1.9, lastUpdated: new Date().toISOString() },
      { market: `${d} North Mandi`, district: d,    state: s, crop: selectedCrop, price: Math.round(basePrice * 0.95), trend: 'down', changePercent: -0.6, lastUpdated: new Date().toISOString() },
      { market: `Nearby Farmers Market`, district: 'Regional', state: s, crop: selectedCrop, price: Math.round(basePrice * 1.01), trend: 'stable', changePercent: 2.0, lastUpdated: new Date().toISOString() },
      { market: `${d} South APMC`,  district: d,    state: s, crop: selectedCrop, price: Math.round(basePrice * 1.00), trend: 'up', changePercent: 0.2, lastUpdated: new Date().toISOString() },
    ];
    return mockData.sort((a, b) => b.price - a.price);
  }

  const data = loadDataset();

  let filtered = data.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  if (crop) filtered = filtered.filter((r) => r.crop.toLowerCase() === crop.toLowerCase());

  filtered.sort((a, b) => {
    if (a.district.toLowerCase() === district.toLowerCase()) return -1;
    if (b.district.toLowerCase() === district.toLowerCase()) return 1;
    return 0;
  });

  if (filtered.length > 0) {
    return filtered.slice(0, 10).map((r, i) => ({
      market:        r.market,
      district:      r.district,
      state:         r.state,
      crop:          r.crop,
      price:         Number(r.price),
      trend:         i % 3 === 0 ? 'up' : i % 3 === 1 ? 'down' : 'stable',
      changePercent: Number((Math.random() * 6 - 2).toFixed(1)),
      lastUpdated:   new Date().toISOString(),
    }));
  }

  return [];
}

/** Find the best market (highest price) for a given crop */
export function getBestMarket(state: string, crop: string) {
  const prices = getMarketPrices(state, '', crop);
  if (!prices.length) return null;
  return prices.reduce((best, p) => p.price > best.price ? p : best, prices[0]);
}

function getMockPrices() {
  return [
    { state: 'Karnataka', district: 'Mysuru',   market: 'Mysore APMC',   crop: 'Tomato',    price: '2800', date: '2025-04-11' },
    { state: 'Karnataka', district: 'Mandya',   market: 'Mandya Mandi',  crop: 'Tomato',    price: '2650', date: '2025-04-11' },
    { state: 'Karnataka', district: 'Hassan',   market: 'Hassan APMC',   crop: 'Tomato',    price: '2720', date: '2025-04-11' },
    { state: 'Karnataka', district: 'Tumakuru', market: 'Tumkur APMC',   crop: 'Tomato',    price: '2700', date: '2025-04-11' },
    { state: 'Karnataka', district: 'Mysuru',   market: 'Mysore APMC',   crop: 'Rice',      price: '1900', date: '2025-04-11' },
    { state: 'Karnataka', district: 'Mandya',   market: 'Mandya Mandi',  crop: 'Sugarcane', price: '3200', date: '2025-04-11' },
    { state: 'Maharashtra', district: 'Pune',   market: 'Pune APMC',     crop: 'Onion',     price: '1500', date: '2025-04-11' },
    { state: 'Maharashtra', district: 'Nashik', market: 'Nashik Mandi',  crop: 'Onion',     price: '1600', date: '2025-04-11' },
  ] as MandiRecord[];
}
