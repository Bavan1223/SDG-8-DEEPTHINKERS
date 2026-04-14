/* ============================================================
   AgriAgent – API Types
   All types returned from backend / ML service endpoints
   ============================================================ */

/** Generic API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/** Weather data from weather service */
export interface WeatherData {
  location: string;
  temperature: number;         // °C
  humidity: number;            // %
  rainfall: number;            // mm expected today
  windSpeed: number;           // km/h
  condition: string;           // 'sunny' | 'cloudy' | 'rainy' | 'stormy'
  visibility: number;          // km
  forecast: WeatherForecastDay[];
  lastUpdated: string;         // ISO timestamp
}

export interface WeatherForecastDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  rainfall: number;
  condition: string;
}

/** Market price entry from dataset */
export interface MarketPrice {
  market: string;            // Mandi name
  district: string;
  state: string;
  crop: string;
  price: number;             // ₹ per quintal
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastUpdated: string;
}

/** ML-powered crop recommendation */
export interface CropRecommendation {
  crop: string;
  confidence: number;          // 0–100
  reasons: string[];
  waterRequirement: 'low' | 'medium' | 'high';
  growthPeriodDays: number;
  expectedYield: number;       // quintals/acre
  marketDemand: 'low' | 'medium' | 'high';
}

/** Irrigation plan returned by backend */
export interface IrrigationPlan {
  status: 'ON' | 'OFF' | 'REDUCED';
  reason: string;
  scheduledTime?: string;
  durationMinutes?: number;
  waterUsageLiters: number;
  nextReview: string;
}

/** Disaster / crop alert */
export interface Alert {
  id: string;
  type: 'flood' | 'drought' | 'storm' | 'pest' | 'frost' | 'heat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedArea: string;
  issuedAt: string;
  expiresAt?: string;
  actionRequired: string;
}

/** Simulated drone status */
export interface DroneStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'charging' | 'error';
  batteryPercent: number;
  location: { lat: number; lng: number };
  altitude: number;           // meters
  cropHealthIndex: number;    // 0–100
  lastMission: string;
  coverageAreaHa: number;
}

/** Water resource planning data */
export interface WaterResource {
  sourceType: 'pond' | 'borewell' | 'rainwater' | 'canal';
  capacityLiters: number;
  currentLevelLiters: number;
  fillRatePerDay: number;     // liters/day from rain/recharge
  label: string;
}

export interface WaterPlan {
  totalAvailableLiters: number;
  dailyCropConsumptionLiters: number;
  daysRemaining: number;
  warningLevel: 'safe' | 'caution' | 'critical';
  recommendations: string[];
  resources: WaterResource[];
}
