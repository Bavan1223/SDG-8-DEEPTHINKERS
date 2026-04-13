/* ============================================================
   AgriAgent – Backend Entry Point
   Express server with all API routes mounted
   ============================================================ */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Route imports
import cropRouter       from './routes/crop';
import yieldRouter      from './routes/yield';
import irrigationRouter from './routes/irrigation';
import marketRouter     from './routes/market';
import alertsRouter     from './routes/alerts';
import locationRouter   from './routes/location';

import { fetchWeatherForLocation } from './services/weatherService';

const app  = express();
const PORT = process.env.PORT ?? 5000;

/* ── Middleware ─────────────────────────────────────────── */
app.use(helmet());          // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));     // Request logging
app.use(express.json());   // JSON body parser

/* ── Health check ───────────────────────────────────────── */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── API Routes ─────────────────────────────────────────── */
app.use('/api/crop',       cropRouter);
app.use('/api/yield',      yieldRouter);
app.use('/api/irrigation', irrigationRouter);
app.use('/api/market',     marketRouter);
app.use('/api/alerts',     alertsRouter);
app.use('/api/location',   locationRouter);

/* ── Weather Endpoint (Live or Fallback) ────────────────── */
app.get('/api/weather', async (req, res) => {
  const { state = 'Karnataka', district = 'Mysuru' } = req.query as Record<string, string>;
  
  try {
    const data = await fetchWeatherForLocation(district, state);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
  }
});

/* ── Chatbot endpoint (Gemini Powered) ──────────────────── */
app.post('/api/chat', async (req, res) => {
  const { message = '', lang = 'en', location } = req.body as { message: string; lang: string; location: any };
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_')) {
    // Graceful fallback to deterministic engine if user hasn't set their key yet
    const m = message.toLowerCase();
    let reply = 'I am the AgriBot assistant! I can help you with your farming needs. (Note: Please add your GEMINI_API_KEY to the backend .env file to unlock my full AI conversational abilities!)';
    if (m.includes('crop') || m.includes('recommend')) reply = '🌾 Based on current soil and weather data, Rice or Maize is recommended for this season. (Add Gemini API key for dynamic responses).';
    else if (m.includes('market') || m.includes('price')) reply = '📊 Best market today: Mysore APMC — Tomato ₹2,800/quintal. (Add Gemini API key for dynamic responses).';
    else if (m.includes('water') || m.includes('irrigat')) reply = '💧 Irrigation is currently OFF (rain expected). (Add Gemini API key for dynamic responses).';
    return res.json({ success: true, data: { reply } });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const context = `You are AgriBot, an expert AI agricultural assistant helping farmers in ${location?.district ?? 'India'}, ${location?.state ?? ''}. Keep your responses concise (2-3 sentences max), helpful, friendly, and directly address the farmer's question. Add 1 relevant emoji.`;
    const prompt = `${context}\n\nFarmer asks: "${message}"\nPlease respond in the language code: ${lang}.`;
    
    // Automatically iterate through API versions in case the model is deprecated, unavailable, or quota hit
    const availableModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-flash-latest', 'gemini-pro-latest'];
    let reply = null;
    let lastError: any = null;
    
    for (const modelName of availableModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        reply = await result.response.text();
        break;
      } catch (e: any) {
        console.warn(`Model ${modelName} failed:`, e.message || e);
        lastError = e;
        continue;
      }
    }
    
    if (!reply) throw lastError || new Error('All models failed.');
    
    res.json({ success: true, data: { reply } });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Smart rule-based farming assistant as fallback
    const m = message.toLowerCase();
    const dist = location?.district ?? 'your region';
    let reply: string;

    if (m.includes('rice')) {
      reply = `🌾 Rice is a staple cereal crop that grows best in flooded paddies. In ${dist}, the ideal planting season is June–July (Kharif) with waterlogged soil. Recommended varieties: IR-36, Swarna, BPT-5204. It needs 1200–2000mm of water during its growing period.`;
    } else if (m.includes('wheat')) {
      reply = `🌾 Wheat is a Rabi crop best sown in October–November in ${dist}. It prefers loamy soil with good drainage. Recommended varieties: HD-2967, PBW-343. Ensure 5–6 irrigations during its 120-day growth cycle.`;
    } else if (m.includes('tomato')) {
      reply = `🍅 Tomatoes grow year-round in ${dist}. Plant seedlings 45cm apart. Irrigate every 3–4 days. Watch out for early blight (use Mancozeb). Best market price months: Jan–Mar. Current avg: ₹2,800/quintal at Mysore APMC.`;
    } else if (m.includes('potato')) {
      reply = `🥔 Potato is best planted in October–December in ${dist}. Use certified seed tubers, 45×20cm spacing. Organic manure improves yield significantly. Harvest in 80–100 days. Current market: ₹1,900/quintal.`;
    } else if (m.includes('onion')) {
      reply = `🧅 Onions grow well in ${dist} between Oct–Jan. They need sandy loam soil and 6–8 irrigations. Transplant seedlings at 15×10cm spacing. Post-harvest curing for 10 days improves shelf life. Market avg: ₹1,600/quintal.`;
    } else if (m.includes('pest') || m.includes('insect') || m.includes('disease')) {
      reply = `🐛 Common pests in ${dist}: Aphids (use Imidacloprid), Stem borers (use Carbofuran), Whitefly (use neem oil). For fungal diseases, apply Mancozeb 75WP at 2g/litre. Always spray in early morning or evening, never in full sun.`;
    } else if (m.includes('fertilizer') || m.includes('nutrient') || m.includes('npk')) {
      reply = `🌿 For most crops in ${dist}, apply NPK 120:60:40 kg/ha as base dose. Split nitrogen into 3 parts — at planting, 30 days, and 60 days. Add zinc sulphate (25kg/ha) if soil pH > 7.5. Compost improves water retention by 30%.`;
    } else if (m.includes('water') || m.includes('irrigat')) {
      reply = `💧 In ${dist}, drip irrigation is best for vegetables — saves 40% water. For rice, maintain 5cm standing water during vegetative phase. For wheat, critical irrigation stages are CRI (21 days), tillering (45 days), and grain filling (90 days).`;
    } else if (m.includes('weather') || m.includes('rain') || m.includes('monsoon')) {
      reply = `🌦️ Monsoon in ${dist} typically arrives in June and retreats by September. Average annual rainfall: 800–1200mm. Heavy rains above 100mm/day risk waterlogging — ensure field drainage channels are open. Check IMD website for real-time alerts.`;
    } else if (m.includes('market') || m.includes('price') || m.includes('sell')) {
      reply = `📊 Best market in ${dist}: Check your nearest APMC. Top prices today — Tomato: ₹2,800/q, Rice: ₹3,200/q, Wheat: ₹2,400/q, Potato: ₹1,900/q. Sell in the morning auctions for the best rates. Register on eNAM portal for online trading.`;
    } else if (m.includes('soil') || m.includes('ph') || m.includes('loam')) {
      reply = `🌱 Soil health tip for ${dist}: Test your soil every 2 years. Ideal pH for most crops is 6.0–7.5. For acidic soil, apply lime at 2 tons/ha. Organic matter improves water holding capacity. Soil test kits available at your local KVK.`;
    } else if (m.includes('hello') || m.includes('hi') || m.includes('help')) {
      reply = `👋 Hello! I'm AgriBot, your farming AI assistant for ${dist}. You can ask me about crop recommendations, pest control, irrigation schedules, fertilizers, market prices, weather advice, and much more. How can I help you today?`;
    } else {
      reply = `🌾 Great question about "${message}"! For ${dist}, my best advice is to consult your local Krishi Vigyan Kendra (KVK) or the state agricultural department for region-specific guidance. I can help with crops, pests, irrigation, fertilizers, and market prices — just ask!`;
    }
    
    return res.json({ success: true, data: { reply } });
  }
});

/* ── Drone endpoints ────────────────────────────────────── */
app.get('/api/drones', (_req, res) => {
  res.json({ success: true, data: [
    { id: 'd1', name: 'DJI Agras T40 #1', status: 'active',   batteryPercent: 78, cropHealthIndex: 85, coverageAreaHa: 3.2, lastMission: '2 hours ago', location: { lat: 12.295, lng: 76.639 }, altitude: 25 },
    { id: 'd2', name: 'DJI Agras T40 #2', status: 'idle',     batteryPercent: 95, cropHealthIndex: 92, coverageAreaHa: 5.1, lastMission: '4 hours ago', location: { lat: 12.310, lng: 76.655 }, altitude: 0  },
    { id: 'd3', name: 'DJI Phantom #1',   status: 'charging', batteryPercent: 23, cropHealthIndex: 78, coverageAreaHa: 1.8, lastMission: '6 hours ago', location: { lat: 12.285, lng: 76.620 }, altitude: 0  },
  ]});
});
app.post('/api/drones/:id/dispatch', (req, res) => { res.json({ success: true, message: `Drone ${req.params.id} dispatched` }); });
app.post('/api/drones/:id/recall',   (req, res) => { res.json({ success: true, message: `Drone ${req.params.id} recalled` }); });

/* ── Water plan endpoint ────────────────────────────────── */
app.post('/api/water/plan', (req, res) => {
  const { cropType = 'rice', landAreaAcres = 2, resources = [] } = req.body as {
    cropType: string; landAreaAcres: number;
    resources: { currentLevelLiters: number; fillRatePerDay: number }[];
  };
  const USAGE: Record<string,number> = { rice:8000,wheat:4000,maize:5000,sugarcane:12000,tomato:4500,potato:4000 };
  const daily   = (USAGE[cropType] ?? 4000) * landAreaAcres;
  const totalFill = resources.reduce((s, r) => s + r.fillRatePerDay, 0);
  const netUsage  = Math.max(0, daily - totalFill);
  const totalCur  = resources.reduce((s, r) => s + r.currentLevelLiters, 0);
  const daysLeft  = netUsage > 0 ? Math.floor(totalCur / netUsage) : 999;
  const level     = daysLeft >= 14 ? 'safe' : daysLeft >= 7 ? 'caution' : 'critical';
  res.json({ success: true, data: {
    totalAvailableLiters: totalCur, dailyCropConsumptionLiters: daily,
    daysRemaining: daysLeft, warningLevel: level,
    recommendations: level === 'safe' ? ['Continue current usage'] : ['Reduce irrigation by 20%', 'Switch to drip irrigation', 'Consider drought-resistant varieties'],
    resources,
  }});
});

/* ── Error handler ──────────────────────────────────────── */
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

/* ── Start server ───────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🌾 AgriAgent Backend running on http://localhost:${PORT}`);
});

export default app;
