/* ============================================================
   AgriAgent – Model Types
   Domain models: User, Location, Crop, Soil, Season, etc.
   ============================================================ */

/** Supported language codes */
export type LanguageCode = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'mr' | 'pa' | 'gu' | 'or';

/** User profile stored in Firestore */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language: LanguageCode;
  location: LocationPreference;
  createdAt: string;
  lastLoginAt: string;
}

/** User's saved location preference */
export interface LocationPreference {
  state: string;
  district: string;
  lat?: number;
  lng?: number;
}

/** Crop type options */
export type CropType =
  | 'rice'
  | 'wheat'
  | 'maize'
  | 'sugarcane'
  | 'cotton'
  | 'soybean'
  | 'groundnut'
  | 'tomato'
  | 'onion'
  | 'potato'
  | 'pulses'
  | 'millets'
  | 'banana'
  | 'mango';

/** Soil type enumeration */
export type SoilType =
  | 'alluvial'
  | 'black'
  | 'red'
  | 'laterite'
  | 'arid'
  | 'saline'
  | 'peaty';

/** Water source for irrigation planning */
export type WaterSource = 'pond' | 'borewell' | 'rainwater' | 'canal' | 'river';

/** Season classification */
export type SeasonType = 'kharif' | 'rabi' | 'zaid' | 'summer' | 'winter';

/** Farm profile data */
export interface FarmProfile {
  id: string;
  userId: string;
  landAreaAcres: number;
  cropType: CropType;
  soilType: SoilType;
  season: SeasonType;
  waterSources: WaterSource[];
  irrigationMethod: 'drip' | 'sprinkler' | 'flood' | 'manual';
  location: LocationPreference;
}

/** Daily summary data model */
export interface DailySummaryData {
  date: string;
  weatherSummary: string;
  cropTask: string;
  irrigationStatus: string;
  marketHighlight: string;
  activeAlerts: number;
  waterDaysRemaining: number;
}

/** Market intelligence recommendation */
export interface MarketRecommendation {
  bestMarket: string;
  bestPrice: number;
  distance: string;
  reason: string;
  alternativeMarkets: {
    market: string;
    price: number;
    distance: string;
  }[];
}
