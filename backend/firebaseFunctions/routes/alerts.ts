/* ============================================================
   AgriAgent – Alerts Route
   GET /api/alerts – Disaster alert list by location
   ============================================================ */

import { Router } from 'express';
import { requireQuery } from '../utils/validators';
import { sendSuccess, sendError } from '../utils/response';
import { generateAlerts, getMockAlerts } from '../services/alertService';
import { fetchWeatherForLocation } from '../services/weatherService';

const router = Router();

/** GET /api/alerts?state=Karnataka&district=Mysuru */
router.get(
  '/',
  requireQuery(['state']),
  async (req, res) => {
    try {
      const { state, district = '' } = req.query as Record<string, string>;
      
      // Fetch real-time weather
      const weather = await fetchWeatherForLocation(district, state);
      
      // Generate alerts dynamically using the rule engine
      const alerts = generateAlerts(state, district, weather);
      
      // Fallback to mock alerts if the rule engine generated nothing, just to show UI
      // In a real production system, you'd just return the empty array `alerts`
      const finalAlerts = alerts.length > 0 ? alerts : getMockAlerts(state, district);
      
      sendSuccess(res, finalAlerts);
    } catch (err) {
      sendError(res, 'Alert fetch failed', 500, err);
    }
  }
);

export default router;
