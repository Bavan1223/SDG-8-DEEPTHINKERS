/* ============================================================
   AgriAgent – Crop Route
   POST /api/crop/recommend  – ML-powered crop recommendation
   GET  /api/crop/list       – List all supported crops
   ============================================================ */

import { Router } from 'express';
import { requireBody } from '../utils/validators';
import { sendSuccess, sendError } from '../utils/response';
import { predictCrop } from '../services/mlService';

const router = Router();

/** POST /api/crop/recommend */
router.post(
  '/recommend',
  requireBody(['state', 'district', 'soilType', 'season']),
  async (req, res) => {
    try {
      const result = await predictCrop(req.body as {
        state: string; district: string; soilType: string; season: string;
      });
      sendSuccess(res, result.data);
    } catch (err) {
      sendError(res, 'Crop recommendation failed', 500, err);
    }
  }
);

/** GET /api/crop/list */
router.get('/list', (_req, res) => {
  const crops = [
    { id: 'rice',      name: 'Rice',       season: ['kharif'],         waterReq: 'high' },
    { id: 'wheat',     name: 'Wheat',      season: ['rabi'],           waterReq: 'medium' },
    { id: 'maize',     name: 'Maize',      season: ['kharif', 'zaid'], waterReq: 'medium' },
    { id: 'sugarcane', name: 'Sugarcane',  season: ['kharif', 'rabi'], waterReq: 'high' },
    { id: 'cotton',    name: 'Cotton',     season: ['kharif'],         waterReq: 'medium' },
    { id: 'groundnut', name: 'Groundnut',  season: ['kharif', 'rabi'], waterReq: 'low' },
    { id: 'tomato',    name: 'Tomato',     season: ['rabi', 'summer'], waterReq: 'medium' },
  ];
  sendSuccess(res, crops);
});

export default router;
