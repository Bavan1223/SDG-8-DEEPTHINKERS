/* ============================================================
   AgriAgent – Market Route
   GET /api/market – Mandi prices by state/district/crop
   ============================================================ */

import { Router } from 'express';
import { requireQuery } from '../utils/validators';
import { sendSuccess, sendError } from '../utils/response';
import { getMarketPrices, getBestMarket } from '../services/marketService';

const router = Router();

/** GET /api/market?state=Karnataka&district=Mysuru&crop=tomato */
router.get(
  '/',
  requireQuery(['state']),
  (req, res) => {
    try {
      const { state, district = '', crop } = req.query as Record<string, string>;
      const prices = getMarketPrices(state, district, crop);
      const best   = getBestMarket(state, crop ?? 'tomato');

      sendSuccess(res, {
        prices,
        best,
        recommendation: best
          ? `Sell in ${best.market} for highest profit — ₹${best.price}/quintal`
          : 'No market data available for this region',
      });
    } catch (err) {
      sendError(res, 'Market data fetch failed', 500, err);
    }
  }
);

export default router;
