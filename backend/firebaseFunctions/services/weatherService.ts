/* ============================================================
   AgriAgent – Weather Service
   Fetches weather data from OpenWeatherMap or returns mock
   ============================================================ */

import axios from 'axios';

const OWM_KEY = process.env.OPENWEATHER_API_KEY;
const OWM_URL = 'https://api.openweathermap.org/data/2.5';

interface OWMResponse {
  main:   { temp: number; humidity: number };
  wind:   { speed: number };
  weather: { main: string; description: string }[];
  rain?:  { '1h': number };
}

/** Fetch current weather for a city using OpenWeatherMap */
export async function fetchWeatherForLocation(district: string, state: string) {
  if (OWM_KEY) {
    try {
      const city = `${district},${state},IN`;
      const [current, forecast] = await Promise.all([
        axios.get<OWMResponse>(`${OWM_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OWM_KEY}`),
        axios.get(`${OWM_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&cnt=5&appid=${OWM_KEY}`),
      ]);

      const c = current.data;
      return {
        location:    `${district}, ${state}`,
        temperature: Math.round(c.main.temp),
        humidity:    c.main.humidity,
        rainfall:    c.rain?.['1h'] ?? 0,
        windSpeed:   Math.round(c.wind.speed * 3.6), // m/s → km/h
        condition:   c.weather[0]?.main?.toLowerCase() ?? 'cloudy',
        lastUpdated: new Date().toISOString(),
        forecast:    (forecast.data as { list: { dt_txt: string; main: { temp_min: number; temp_max: number }; rain?: { '3h': number }; weather: { main: string }[] }[] }).list.map((f) => ({
          date:      f.dt_txt.split(' ')[0],
          minTemp:   Math.round(f.main.temp_min),
          maxTemp:   Math.round(f.main.temp_max),
          rainfall:  f.rain?.['3h'] ?? 0,
          condition: f.weather[0]?.main?.toLowerCase() ?? 'cloudy',
        })),
      };
    } catch (err) {
      console.error('OpenWeatherMap error, using mock:', err);
    }
  }

  // Fallback mock data
  const base = 26 + Math.floor(Math.random() * 8);
  return {
    location:    `${district}, ${state}`,
    temperature: base,
    humidity:    55 + Math.floor(Math.random() * 25),
    rainfall:    Math.floor(Math.random() * 8),
    windSpeed:   10 + Math.floor(Math.random() * 20),
    condition:   base > 34 ? 'sunny' : 'cloudy',
    lastUpdated: new Date().toISOString(),
    forecast:    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => ({
      date:      d,
      minTemp:   base - 5,
      maxTemp:   base + i,
      rainfall:  i === 2 ? 12 : i === 3 ? 4 : 0,
      condition: i === 2 ? 'rainy' : 'cloudy',
    })),
  };
}
