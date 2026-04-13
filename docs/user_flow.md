# AgriAgent – User Flow

## Primary Flows

### 1. First-time Onboarding
```
Landing Page (HomePage)
  → Select State (dropdown)
  → Select District (dropdown)
  → Click "Get Farm Insights"
  → Redirected to Dashboard
  → Location saved to localStorage
```

### 2. Daily Farm Briefing
```
Dashboard
  → View weather card (temp, humidity, rainfall)
  → Check active alerts (storm/pest/flood badges)
  → Review market prices (top 3 mandis)
  → Check water supply bar (days remaining)
  → Click "Daily Summary" → task list for the day
```

### 3. Crop Recommendation Flow
```
Crop Insights page
  → Select Soil Type
  → Select Season
  → Click "Analyse & Recommend"
  → ML model returns top 3 crops
  → View confidence bars + reasons
  → Compare water requirement + expected yield
  → See market demand badge per crop
```

### 4. Market Intelligence Flow
```
Market Intelligence page
  → Select Crop (dropdown)
  → Click "Search"
  → View mandi price table (sorted by price)
  → Best market highlighted with ⭐ banner
  → "Sell in Mysore APMC for ₹2,800/quintal"
  → View 30-day price trend chart
  → See price prediction + best sell window
```

### 5. Weather + Irrigation Planning
```
Weather & Irrigation page
  → View 5-day forecast chart
  → Irrigation rule engine calculates per-day status
  → Adjust soil moisture slider → real-time update
  → Scroll to Water Resource Planner
  → Enter pond/borewell/rainwater levels
  → See "X days remaining" badge
  → If < 7 days: CRITICAL warning + recommendations
```

### 6. Drone Monitoring Flow
```
Drone Monitoring page
  → View fleet list (3 drones with status badges)
  → Click a drone → detail panel opens
  → View battery, health index, coverage area
  → See simulated field map with drone position
  → View crop health alerts per field
  → Click "Dispatch Drone" → status → ACTIVE
  → Click "Recall" → status → IDLE
```

### 7. Disaster Alerts
```
Alerts page
  → All active alerts listed
  → Filter by type: flood/drought/storm/pest/frost/heat
  → Filter by severity: critical/high/medium/low
  → Each card shows: title, description, affected area, action required
  → "Set reminder" and "Share" links per alert
```

### 8. Language Switching
```
Any page
  → Click 🌐 in Navbar
  → Language selector panel appears (10 languages)
  → Click e.g. ಕನ್ನಡ → instant UI translation
  → Preference saved to localStorage (persists on reload)
  → Voice assistant also switches to selected language
```

### 9. Settings & Preferences
```
Settings page
  → Account: Sign in with Google or view profile
  → Language: grid of 10 Indian language buttons
  → Location: State + District dropdowns
  → Farm Profile: Primary crop + land area
  → Notifications: toggle alerts/market/weather
  → Click Save → location persisted
```

### 10. AgriBot Chat
```
Any page
  → Click 🤖 floating button (bottom-right)
  → Chat panel slides up
  → Type question or click 🎤 for voice input
  → AgriBot responds with context-aware advice
  → Falls back to local rules if API offline
  → Language matches current UI language
```
