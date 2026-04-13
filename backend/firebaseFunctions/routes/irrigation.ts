/* ============================================================
   AgriAgent – Irrigation Route
   POST /api/irrigation – Rule-based irrigation plan
   ============================================================ */

import { Router } from 'express';
import { requireBody } from '../utils/validators';
import { sendSuccess } from '../utils/response';

const router = Router();

/** POST /api/irrigation */
router.post(
  '/',
  requireBody(['state', 'district', 'cropType']),
  (req, res) => {
    const {
      cropType,
      soilMoisture = 50,
      forecastRainfall = 0,
      temperature = 28,
    } = req.body as {
      cropType: string;
      soilMoisture?: number;
      forecastRainfall?: number;
      temperature?: number;
    };

    // ── Irrigation Rule Engine ──────────────────────────
    let status:          'ON' | 'OFF' | 'REDUCED' = 'ON';
    let reason           = 'Standard irrigation schedule';
    let durationMinutes  = 45;
    let waterUsageLiters = 4500;

    const highWaterCrops = ['rice', 'sugarcane', 'banana'];

    if (forecastRainfall > 5) {
      status = 'OFF'; reason = `Rain forecast (${forecastRainfall}mm) — skipping irrigation`; durationMinutes = 0; waterUsageLiters = 0;
    } else if (temperature > 36) {
      status = 'ON'; reason = 'High temperature detected — increase irrigation duration'; durationMinutes = 60; waterUsageLiters = 6000;
    } else if (soilMoisture > 70) {
      status = 'REDUCED'; reason = 'Soil is already moist — reduced irrigation'; durationMinutes = 20; waterUsageLiters = 2000;
    } else if (highWaterCrops.includes(cropType)) {
      status = 'ON'; reason = `${cropType} requires higher water — medium-high schedule`; durationMinutes = 55; waterUsageLiters = 5500;
    }

    sendSuccess(res, {
      status,
      reason,
      scheduledTime:   status !== 'OFF' ? '06:00' : undefined,
      durationMinutes,
      waterUsageLiters,
      nextReview:      new Date(Date.now() + 24 * 3600000).toISOString(),
    });
  }
);

export default router;
