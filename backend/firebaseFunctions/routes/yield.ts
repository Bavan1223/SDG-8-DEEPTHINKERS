/* ============================================================
   AgriAgent – Yield Route
   POST /api/yield/predict – ML yield estimation
   ============================================================ */

import { Router } from 'express';
import { requireBody } from '../utils/validators';
import { sendSuccess, sendError } from '../utils/response';
import { predictYield } from '../services/mlService';

const router = Router();

/** POST /api/yield/predict */
router.post(
  '/predict',
  requireBody(['cropType', 'landAreaAcres', 'state', 'season']),
  async (req, res) => {
    try {
      const result = await predictYield(req.body as {
        cropType: string; landAreaAcres: number; state: string; season: string;
      });
      sendSuccess(res, result.data);
    } catch (err) {
      sendError(res, 'Yield prediction failed', 500, err);
    }
  }
);

export default router;
