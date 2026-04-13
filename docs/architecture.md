# AgriAgent – System Architecture

## Overview

AgriAgent is a three-tier full-stack application for precision agriculture in India.

```
┌────────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                          │
│   React + TypeScript + Tailwind CSS (Vite)                     │
│   i18next (10 Indian languages)  │  Firebase Auth              │
└───────────────┬────────────────────────────┬───────────────────┘
                │ REST /api/*                 │ Firebase SDK
                ▼                             ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   EXPRESS BACKEND        │    │   FIRESTORE / AUTH        │
│   Node.js + TypeScript   │    │   (Google Cloud)          │
│   Port 5000              │    └──────────────────────────┘
│                          │
│   Routes:                │    ┌──────────────────────────┐
│   /api/crop              │───▶│   PYTHON ML SERVICE       │
│   /api/yield             │    │   Flask + scikit-learn    │
│   /api/irrigation        │    │   Port 8000               │
│   /api/market            │◀───│                           │
│   /api/alerts            │    │   Models:                 │
│   /api/weather           │    │   • crop_model.pkl        │
│   /api/drones            │    │   • yield_model.pkl       │
│   /api/water/plan        │    │   • price_model.pkl       │
│   /api/chat              │    │   • irrigation_model.pkl  │
└──────────────────────────┘    └──────────────────────────┘
                                         │
                                         ▼
                               ┌──────────────────────────┐
                               │   DATA LAYER              │
                               │   ml-service/data/        │
                               │   • market_prices.csv     │
                               │   • rainfall.csv          │
                               │   • soil.csv              │
                               │   • crop_yield.csv        │
                               └──────────────────────────┘
```

---

## Frontend Architecture

```
src/
├── main.tsx              ← React entry + i18n init
├── App.tsx               ← Layout shell (Navbar + Sidebar + Router)
├── router/AppRouter.tsx  ← React Router v6 lazy routes
│
├── context/              ← Global state (Auth, Language/Location)
├── hooks/                ← useAuth, useLanguage, useFetch
├── services/             ← API client (axios), Firebase, Speech API
│
├── components/
│   ├── layout/           ← Navbar, Sidebar, DropdownMenu
│   ├── dashboard/        ← SummaryCard, WeatherCard, AlertCard, MarketCard
│   ├── charts/           ← WeatherChart, MarketChart, YieldChart (Recharts)
│   ├── ai/               ← ChatBot, VoiceAssistant, LanguageSelector
│   └── common/           ← Button, Input/Select, Loader/Skeleton
│
└── pages/ (10 pages)
    HomePage → Dashboard → DailySummary → CropInsights
    WeatherIrrigation → MarketIntelligence → Monitoring
    Alerts → Reports → Settings
```

---

## Key Design Decisions

| Concern | Decision | Reason |
|---|---|---|
| State management | React Context | Avoids Redux overhead for this scale |
| Language persistence | localStorage via i18next detector | Works offline, no backend needed |
| Location storage | localStorage (LanguageContext) | Instant access on every page |
| ML fallback | Rule-based when .pkl not found | App works fully without training step |
| Auth | Firebase Google OAuth | Secure, no password management |
| Styling | Tailwind CSS v3 + custom tokens | Rapid design, dark-mode ready |
| Charts | Recharts | Lightweight, React-native API |

---

## Irrigation Rule Engine

```
Priority order (top wins):
1. IF rain_forecast > 5mm        → OFF     (save water)
2. IF temperature > 36°C         → HIGH    (heat stress)
3. IF soil_moisture > 70%        → REDUCED (already wet)
4. IF crop_water_demand == HIGH  → ON      (rice/sugarcane)
5. Default                       → NORMAL  (45 min schedule)
```

---

## Water Resource Planner

```
Input:
  - Pond:      current level + daily fill rate
  - Borewell:  current level + daily recharge rate
  - Rainwater: current harvest + daily rain (forecast)
  - Crop type + land area

Calculation:
  daily_crop_usage = CROP_DAILY_L_PER_ACRE[crop] × area_acres
  net_daily_usage  = max(0, daily_usage - sum(fill_rates))
  days_remaining   = total_current_level ÷ net_daily_usage

Warning thresholds:
  ≥ 14 days → SAFE    (green)
   7–13 days → CAUTION (amber)
   < 7 days  → CRITICAL (red)
```

---

## Market Intelligence Flow

```
User selects State + District + Crop
    ↓
Backend queries market_prices.csv filtered by state
    ↓
Sorted: same district first, then neighbouring districts
    ↓
Best market = argmax(price)
    ↓
ML price model projects 30-day trend
    ↓
Frontend renders: comparison table + trend chart + recommendation banner
```
