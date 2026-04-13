/* ============================================================
   AgriAgent – API Service
   Axios instance + typed API call helpers
   ============================================================ */

import axios from 'axios';
import { API_BASE_URL, ML_BASE_URL } from '../utils/constants';
import type {
  ApiResponse, WeatherData, MarketPrice, CropRecommendation,
  IrrigationPlan, Alert, DroneStatus, WaterPlan,
} from '../types/api.types';
import type { LocationPreference } from '../types/models.types';

/* ── Axios instances ─────────────────────────────────────── */

/** Backend API client */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/** ML service client */
export const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every backend request
apiClient.interceptors.request.use(async (config) => {
  try {
    const { auth } = await import('./firebase');
    const token = await auth.currentUser?.getIdToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {/* Unauthenticated requests allowed */}
  return config;
});

/* ── Weather ─────────────────────────────────────────────── */

export async function fetchWeather(loc: LocationPreference): Promise<WeatherData> {
  const res = await apiClient.get<ApiResponse<WeatherData>>(
    `/weather?state=${loc.state}&district=${loc.district}`
  );
  return res.data.data;
}

/* ── Crop Recommendation ─────────────────────────────────── */

export async function fetchCropRecommendation(
  params: { state: string; district: string; soilType: string; season: string }
): Promise<CropRecommendation[]> {
  const res = await mlClient.post<ApiResponse<CropRecommendation[]>>('/predict/crop', params);
  return res.data.data;
}

/* ── Market ──────────────────────────────────────────────── */

export async function fetchMarketPrices(
  state: string, district: string, crop?: string
): Promise<MarketPrice[]> {
  const params = new URLSearchParams({ state, district });
  if (crop) params.append('crop', crop);
  const res = await apiClient.get<ApiResponse<MarketPrice[]>>(`/market?${params}`);
  return res.data.data;
}

/* ── Irrigation ──────────────────────────────────────────── */

export async function fetchIrrigationPlan(
  params: { state: string; district: string; cropType: string; soilMoisture: number }
): Promise<IrrigationPlan> {
  const res = await apiClient.post<ApiResponse<IrrigationPlan>>('/irrigation', params);
  return res.data.data;
}

/* ── Alerts ──────────────────────────────────────────────── */

export async function fetchAlerts(state: string, district: string): Promise<Alert[]> {
  const res = await apiClient.get<ApiResponse<Alert[]>>(
    `/alerts?state=${state}&district=${district}`
  );
  return res.data.data;
}

/* ── Drone ───────────────────────────────────────────────── */

export async function fetchDroneStatus(): Promise<DroneStatus[]> {
  const res = await apiClient.get<ApiResponse<DroneStatus[]>>('/drones');
  return res.data.data;
}

export async function dispatchDrone(droneId: string): Promise<void> {
  await apiClient.post(`/drones/${droneId}/dispatch`);
}

export async function recallDrone(droneId: string): Promise<void> {
  await apiClient.post(`/drones/${droneId}/recall`);
}

/* ── Water Resource ──────────────────────────────────────── */

export async function calculateWaterPlan(
  params: {
    cropType: string;
    landAreaAcres: number;
    season: string;
    resources: { sourceType: string; capacityLiters: number; currentLevelLiters: number; fillRatePerDay: number }[];
  }
): Promise<WaterPlan> {
  const res = await apiClient.post<ApiResponse<WaterPlan>>('/water/plan', params);
  return res.data.data;
}

/* ── Chatbot ─────────────────────────────────────────────── */

export async function sendChatMessage(
  message: string, lang: string, location: LocationPreference
): Promise<string> {
  const res = await apiClient.post<ApiResponse<{ reply: string }>>('/chat', {
    message, lang, location,
  });
  return res.data.data.reply;
}
