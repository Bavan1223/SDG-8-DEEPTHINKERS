/* ============================================================
   AgriAgent – Alert Service
   Rule-based disaster alert engine + Firestore integration
   ============================================================ */

interface AlertRecord {
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

interface WeatherSnapshot {
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

/**
 * Rule-based alert engine.
 * Evaluates weather snapshot + seasonal context → generates alerts.
 */
export function generateAlerts(
  state: string,
  district: string,
  weather: WeatherSnapshot
): AlertRecord[] {
  const alerts: AlertRecord[] = [];
  const now = new Date().toISOString();
  const area = `${district}, ${state}`;

  // ── Flood rule ──────────────────────────────────────────
  if (weather.rainfall > 150) {
    alerts.push({
      id:            `flood-${Date.now()}`,
      type:          'flood',
      severity:      weather.rainfall > 200 ? 'critical' : 'high',
      title:         'Flood Watch',
      description:   `Heavy rainfall (${weather.rainfall}mm) detected. River/canal overflow risk.`,
      affectedArea:  area,
      issuedAt:      now,
      expiresAt:     new Date(Date.now() + 2 * 86400000).toISOString(),
      actionRequired: 'Move equipment to high ground. Avoid entering flooded fields.',
    });
  }

  // ── Drought rule ────────────────────────────────────────
  if (weather.humidity < 25 && weather.rainfall === 0) {
    alerts.push({
      id:            `drought-${Date.now()}`,
      type:          'drought',
      severity:      'medium',
      title:         'Drought Advisory',
      description:   'Very low humidity and no rainfall detected. Soil moisture depletion risk.',
      affectedArea:  area,
      issuedAt:      now,
      actionRequired: 'Activate emergency irrigation. Switch to drought-resistant varieties.',
    });
  }

  // ── Heat wave rule ──────────────────────────────────────
  if (weather.temperature > 40) {
    alerts.push({
      id:            `heat-${Date.now()}`,
      type:          'heat',
      severity:      weather.temperature > 44 ? 'critical' : 'high',
      title:         'Heat Wave Warning',
      description:   `Temperature has reached ${weather.temperature}°C. Crop stress and water loss risk.`,
      affectedArea:  area,
      issuedAt:      now,
      actionRequired: 'Increase irrigation frequency. Apply mulching. Avoid midday activities.',
    });
  }

  // ── Storm rule ──────────────────────────────────────────
  if (weather.windSpeed > 60 || weather.condition === 'stormy') {
    alerts.push({
      id:            `storm-${Date.now()}`,
      type:          'storm',
      severity:      weather.windSpeed > 90 ? 'critical' : 'medium',
      title:         'Storm Advisory',
      description:   `Strong winds (${weather.windSpeed} km/h) and stormy conditions expected.`,
      affectedArea:  area,
      issuedAt:      now,
      expiresAt:     new Date(Date.now() + 86400000).toISOString(),
      actionRequired: 'Secure loose equipment. Apply anti-lodging support for tall crops.',
    });
  }

  // ── Frost rule (winter months) ──────────────────────────
  if (weather.temperature < 5) {
    alerts.push({
      id:            `frost-${Date.now()}`,
      type:          'frost',
      severity:      'high',
      title:         'Frost Alert',
      description:   `Temperature dropped to ${weather.temperature}°C. Frost damage risk for sensitive crops.`,
      affectedArea:  area,
      issuedAt:      now,
      actionRequired: 'Cover sensitive plants. Apply light irrigation at night to prevent freezing.',
    });
  }

  return alerts;
}

/** Get mock static alerts for a district (when no live weather data) */
export function getMockAlerts(state: string, district: string): AlertRecord[] {
  return [
    { id: '1', type: 'storm',   severity: 'medium',   title: 'Storm Advisory',    description: 'Strong westerly winds expected. Risk of crop lodging.',           affectedArea: `${district}, ${state}`, issuedAt: new Date().toISOString(), expiresAt: new Date(Date.now()+2*86400000).toISOString(), actionRequired: 'Secure farm equipment and apply anti-lodging spray' },
    { id: '2', type: 'pest',    severity: 'low',       title: 'Locust Watch',      description: 'Low-density locust movement observed in the region.',              affectedArea: state,                   issuedAt: new Date().toISOString(), actionRequired: 'Monitor crops daily. Apply chlorpyrifos if infestation detected' },
    { id: '3', type: 'heat',    severity: 'high',      title: 'Heat Wave Warning', description: 'Day temperatures expected to exceed 40°C for 3 consecutive days.', affectedArea: `${district}, ${state}`, issuedAt: new Date(Date.now()-86400000).toISOString(), actionRequired: 'Increase irrigation frequency. Apply mulching.' },
  ];
}
