/* ============================================================
   AgriAgent – Location Route
   GET /api/location/states      – List all Indian states
   GET /api/location/districts   – Districts for a given state
   ============================================================ */

import { Router } from 'express';
import { sendSuccess, sendBadRequest } from '../utils/response';

const router = Router();

/** Complete state → districts map */
const STATES_DISTRICTS: Record<string, string[]> = {
  'Karnataka':    ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi', 'Davangere', 'Vijayapura', 'Tumakuru', 'Shivamogga', 'Hassan'],
  'Maharashtra':  ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
  'Uttar Pradesh':['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Gorakhpur'],
  'Punjab':       ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  'Rajasthan':    ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
  'Tamil Nadu':   ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Thanjavur'],
  'Gujarat':      ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Anand'],
  'Andhra Pradesh':['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
  'Madhya Pradesh':['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Bihar':        ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
};

/** GET /api/location/states */
router.get('/states', (_req, res) => {
  sendSuccess(res, Object.keys(STATES_DISTRICTS).sort());
});

/** GET /api/location/districts?state=Karnataka */
router.get('/districts', (req, res) => {
  const { state } = req.query as { state?: string };
  if (!state) return sendBadRequest(res, 'state query parameter required');
  const districts = STATES_DISTRICTS[state];
  if (!districts) return sendBadRequest(res, `Unknown state: ${state}`);
  sendSuccess(res, districts);
});

export default router;
