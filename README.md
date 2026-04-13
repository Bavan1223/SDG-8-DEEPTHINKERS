# 🌾 AgriAgent – Smart Farming Operating System

> AI-powered precision farming platform for Indian farmers — real-time crop recommendations, weather-driven irrigation, market intelligence, drone monitoring, and multilingual support.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

---

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/agriagent.git
cd agriagent

# Copy environment template
cp .env.example .env
# Edit .env with your Firebase and API keys
```

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

---

### 3. Backend

```bash
cd backend
npm install
npm run dev
# Runs at http://localhost:5000
```

---

### 4. ML Service

```bash
cd ml-service

# Install Python dependencies
pip install flask flask-cors numpy pandas scikit-learn

# (Optional) Train the models
python train/train_crop.py
python train/train_yield.py
python train/train_price.py
python train/train_irrigation.py

# Start the service
python app.py
# Runs at http://localhost:8000
```

---

## 🗂️ Project Structure

```
agriagent/
├── frontend/               # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # 10 application pages
│   │   ├── services/       # API, Firebase, Speech
│   │   ├── context/        # Auth + Language contexts
│   │   ├── hooks/          # useAuth, useLanguage, useFetch
│   │   ├── i18n/           # EN, HI, KN, TA + 6 more
│   │   └── utils/          # Constants, helpers
│   └── public/
│
├── backend/                # Express + TypeScript API
│   └── firebaseFunctions/
│       ├── routes/         # crop, yield, irrigation, market, alerts, location
│       ├── services/       # ML proxy, weather, market, alert engine
│       ├── utils/          # response helpers, validators
│       └── config/         # Firebase Admin
│
├── ml-service/             # Python Flask ML API
│   ├── app.py              # Flask entry point
│   ├── train/              # Training scripts (4 models)
│   ├── models/             # Trained .pkl files
│   ├── data/               # CSV datasets
│   └── utils/              # Preprocessing
│
├── database/               # Firestore schema + seed data
├── docs/                   # Architecture, API docs, user flow
├── .env.example
└── vercel.json
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📍 Location-based insights | State + District dropdown → personalised dashboard |
| 🌾 AI Crop Recommendation | Random Forest model with soil, season, weather inputs |
| 💧 Smart Irrigation | Rule engine (rain/temp/soil/crop) + water resource planner |
| 📊 Market Intelligence | Nearby mandi price table + best market recommendation |
| 🚁 Drone Monitoring | Simulated fleet with health index + dispatch controls |
| 🚨 Disaster Alerts | Flood, drought, storm, pest, frost detection + filtering |
| 🌐 10 Languages | EN, HI, KN, TA, TE, ML, MR, PA, GU, OR — instant switch |
| 🤖 AgriBot | AI chatbot with voice input (Web Speech API) |
| 💰 Price Prediction | Ridge regression 30-day price forecasting |
| 📋 Reports | Yield, water usage, and market analytics |

---

## 🌐 Language Support

| Code | Language   | Native Script |
|------|------------|--------------|
| en   | English    | English |
| hi   | Hindi      | हिन्दी |
| kn   | Kannada    | ಕನ್ನಡ |
| ta   | Tamil      | தமிழ் |
| te   | Telugu     | తెలుగు |
| ml   | Malayalam  | മലയാളം |
| mr   | Marathi    | मराठी |
| pa   | Punjabi    | ਪੰਜਾਬੀ |
| gu   | Gujarati   | ગુજરાતી |
| or   | Odia       | ଓଡ଼ିଆ |

---

## 💧 Irrigation Rule Engine

```
IF rain_forecast > 5mm    → Irrigation OFF   (save water)
IF temperature > 36°C     → Irrigation HIGH  (heat stress)
IF soil_moisture > 70%    → Irrigation REDUCED (already wet)
IF crop == rice/sugarcane → Irrigation ON    (high water need)
DEFAULT                   → Standard 45-min schedule
```

---

## 🛒 Market Intelligence Formula

```
1. Query market_prices.csv filtered by state
2. Sort by price (descending)
3. Best market = highest price mandi
4. Display: comparison table + trend chart + "Sell in X market" banner
5. ML model projects 30-day price trend
```

---

## 🌊 Water Resource Planner

```
net_daily_usage  = crop_daily_usage - sum(fill_rates)
days_remaining   = total_stored_water / net_daily_usage

≥ 14 days → ✅ Safe
 7–13 days → ⚠️ Caution
 < 7 days  → 🚨 Critical + action recommendations
```

---

## 📦 Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v3 |
| Charts   | Recharts |
| i18n     | i18next + react-i18next |
| Routing  | React Router v6 |
| Backend  | Express + TypeScript |
| Auth/DB  | Firebase Auth + Firestore |
| ML       | Python Flask + scikit-learn |
| Deploy   | Vercel (frontend) + Cloud Run (backend + ML) |

---

## 📄 Documentation

- [`docs/architecture.md`](./docs/architecture.md) – System design and diagrams
- [`docs/api_docs.md`](./docs/api_docs.md) – All API endpoints
- [`docs/user_flow.md`](./docs/user_flow.md) – User journeys
- [`database/firestore_schema.md`](./database/firestore_schema.md) – Data schema

---

## 🔐 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Google** sign-in method
3. Create a **Firestore** database (test mode for dev)
4. Copy web app config from Project Settings → Your apps
5. Paste into `.env`

---

## 📝 License

MIT – Free to use, modify, and distribute.

---

*Built with ❤️ for Indian farmers · AgriAgent v1.0*
