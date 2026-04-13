/* ============================================================
   AgriAgent – Constants
   Indian states/districts, crop data, app-wide constants
   ============================================================ */
/// <reference types="vite/client" />

/** All Indian states with their major districts */
export const INDIA_STATES_DISTRICTS: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Anantapur', 'Kadapa', 'Eluru', 'Rajahmundry'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon', 'Barpeta', 'Kamrup'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Nalanda', 'Vaishali', 'Saran'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Anand', 'Mehsana', 'Junagadh'],
  'Haryana': ['Chandigarh', 'Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Rohtak', 'Karnal', 'Panipat'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamsala', 'Solan', 'Mandi', 'Kullu', 'Bilaspur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Giridih', 'Dumka'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi', 'Davangere', 'Vijayapura', 'Tumakuru', 'Shivamogga', 'Hassan'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Malappuram', 'Kannur', 'Palakkad', 'Kollam'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Ahmednagar'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Puri', 'Koraput', 'Balasore'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Pathankot', 'Hoshiarpur', 'Gurdaspur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bharatpur'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Tiruppur', 'Thanjavur'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Nalgonda'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Kailasahar', 'Belonia', 'Ambassa'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Gorakhpur', 'Bareilly', 'Aligarh', 'Mathura'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Haldwani', 'Rudrapur', 'Rishikesh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Asansol', 'Durgapur', 'Malda', 'Murshidabad'],
  'Goa': ['North Goa', 'South Goa'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur'],
  'Ladakh': ['Leh', 'Kargil'],
};

/** Supported languages with native names */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English',    native: 'English' },
  { code: 'hi', name: 'Hindi',      native: 'हिन्दी' },
  { code: 'kn', name: 'Kannada',    native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil',      native: 'தமிழ்' },
  { code: 'te', name: 'Telugu',     native: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam',  native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi',    native: 'मराठी' },
  { code: 'pa', name: 'Punjabi',    native: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati',   native: 'ગુજરાતી' },
  { code: 'or', name: 'Odia',       native: 'ଓଡ଼ିଆ' },
] as const;

/** Crop metadata */
export const CROPS = [
  { id: 'rice',       name: 'Rice',       icon: '🌾', waterReq: 'high',   season: ['kharif'] },
  { id: 'wheat',      name: 'Wheat',      icon: '🌿', waterReq: 'medium', season: ['rabi'] },
  { id: 'maize',      name: 'Maize',      icon: '🌽', waterReq: 'medium', season: ['kharif', 'zaid'] },
  { id: 'sugarcane',  name: 'Sugarcane',  icon: '🎋', waterReq: 'high',   season: ['kharif', 'rabi'] },
  { id: 'cotton',     name: 'Cotton',     icon: '☁️',  waterReq: 'medium', season: ['kharif'] },
  { id: 'soybean',    name: 'Soybean',    icon: '🫘', waterReq: 'medium', season: ['kharif'] },
  { id: 'groundnut',  name: 'Groundnut',  icon: '🥜', waterReq: 'low',    season: ['kharif', 'rabi'] },
  { id: 'tomato',     name: 'Tomato',     icon: '🍅', waterReq: 'medium', season: ['rabi', 'summer'] },
  { id: 'onion',      name: 'Onion',      icon: '🧅', waterReq: 'low',    season: ['rabi'] },
  { id: 'potato',     name: 'Potato',     icon: '🥔', waterReq: 'medium', season: ['rabi'] },
  { id: 'banana',     name: 'Banana',     icon: '🍌', waterReq: 'high',   season: ['kharif', 'rabi'] },
  { id: 'mango',      name: 'Mango',      icon: '🥭', waterReq: 'low',    season: ['summer'] },
] as const;

/** Average water requirement per crop per acre per day (liters) */
export const CROP_WATER_USAGE_LITERS_PER_ACRE_DAY: Record<string, number> = {
  rice:       8000,
  wheat:      4000,
  maize:      5000,
  sugarcane:  12000,
  cotton:     5000,
  soybean:    4500,
  groundnut:  3000,
  tomato:     4500,
  onion:      3500,
  potato:     4000,
  banana:     7000,
  mango:      2500,
};

/** Crop-specific irrigation thresholds */
export interface CropIrrigationConfig {
  rainThreshold: number;   // mm to skip irrigation
  tempThreshold: number;   // °C to boost irrigation
  moistureTarget: number;  // ideal soil %
  moistureMax: number;     // % to reduce irrigation
}

export const CROP_IRRIGATION_CONFIG: Record<string, CropIrrigationConfig> = {
  rice:       { rainThreshold: 10, tempThreshold: 38, moistureTarget: 70, moistureMax: 85 },
  wheat:      { rainThreshold: 5,  tempThreshold: 30, moistureTarget: 50, moistureMax: 65 },
  maize:      { rainThreshold: 6,  tempThreshold: 35, moistureTarget: 55, moistureMax: 70 },
  sugarcane:  { rainThreshold: 12, tempThreshold: 40, moistureTarget: 65, moistureMax: 80 },
  cotton:     { rainThreshold: 4,  tempThreshold: 42, moistureTarget: 45, moistureMax: 60 },
  soybean:    { rainThreshold: 6,  tempThreshold: 35, moistureTarget: 55, moistureMax: 70 },
  groundnut:  { rainThreshold: 3,  tempThreshold: 38, moistureTarget: 40, moistureMax: 55 },
  tomato:     { rainThreshold: 4,  tempThreshold: 32, moistureTarget: 60, moistureMax: 75 },
  onion:      { rainThreshold: 3,  tempThreshold: 34, moistureTarget: 50, moistureMax: 65 },
  potato:     { rainThreshold: 4,  tempThreshold: 30, moistureTarget: 60, moistureMax: 70 },
  banana:     { rainThreshold: 10, tempThreshold: 38, moistureTarget: 70, moistureMax: 85 },
  mango:      { rainThreshold: 4,  tempThreshold: 40, moistureTarget: 40, moistureMax: 60 },
};

/** Regional climate zones for Indian states to adjust thresholds */
export const REGIONAL_CLIMATE_ADJUSTMENTS: Record<string, { tempShift: number; rainShift: number }> = {
  'Rajasthan':       { tempShift: 4,  rainShift: -2 },
  'Gujarat':         { tempShift: 3,  rainShift: -1 },
  'Jammu & Kashmir': { tempShift: -8, rainShift: 2 },
  'Himachal Pradesh':{ tempShift: -6, rainShift: 2 },
  'Uttarakhand':     { tempShift: -4, rainShift: 1 },
  'Kerala':          { tempShift: -2, rainShift: 5 },
  'Tamil Nadu':      { tempShift: 2,  rainShift: 2 },
  'Andhra Pradesh':  { tempShift: 2,  rainShift: 1 },
};

/** Backend API base URL (overridden by env) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

/** ML service base URL */
export const ML_BASE_URL = import.meta.env.VITE_ML_BASE_URL ?? 'http://localhost:8000';

/** Alert severity colors */
export const ALERT_COLORS = {
  low:      { bg: 'bg-blue-900/30',   border: 'border-blue-500',   text: 'text-blue-300' },
  medium:   { bg: 'bg-yellow-900/30', border: 'border-yellow-500', text: 'text-yellow-300' },
  high:     { bg: 'bg-orange-900/30', border: 'border-orange-500', text: 'text-orange-300' },
  critical: { bg: 'bg-red-900/30',    border: 'border-red-500',    text: 'text-red-300' },
} as const;
