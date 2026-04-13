# AgriAgent – API Documentation

## Base URLs

| Service       | Local Dev URL              |
|---------------|---------------------------|
| Backend API   | `http://localhost:5000`    |
| ML Service    | `http://localhost:8000`    |
| Frontend      | `http://localhost:3000`    |

---

## Backend API Endpoints

### Health
```
GET /health
Response: { status: "ok", timestamp: "..." }
```

---

### Weather
```
GET /api/weather?state=Karnataka&district=Mysuru

Response:
{
  "success": true,
  "data": {
    "location": "Mysuru, Karnataka",
    "temperature": 28,
    "humidity": 65,
    "rainfall": 2,
    "windSpeed": 12,
    "condition": "cloudy",
    "lastUpdated": "...",
    "forecast": [{ "date":"Mon","minTemp":22,"maxTemp":30,"rainfall":0,"condition":"sunny" }]
  }
}
```

---

### Crop Recommendation
```
POST /api/crop/recommend
Body: { "state":"Karnataka","district":"Mysuru","soilType":"alluvial","season":"kharif" }

Response:
{
  "success": true,
  "data": [
    { "crop":"Rice","confidence":91,"reasons":[...],"waterRequirement":"high","growthPeriodDays":120,"expectedYield":28,"marketDemand":"high" },
    ...
  ]
}
```

```
GET /api/crop/list
Response: [{ "id":"rice","name":"Rice","season":["kharif"],"waterReq":"high" }, ...]
```

---

### Yield Prediction
```
POST /api/yield/predict
Body: { "cropType":"rice","landAreaAcres":5,"state":"Karnataka","season":"kharif" }

Response:
{
  "success": true,
  "data": { "estimatedYieldPerAcre":28,"totalYield":140,"confidence":78,"factors":["Soil fertility",...] }
}
```

---

### Irrigation Plan
```
POST /api/irrigation
Body: { "state":"Karnataka","district":"Mysuru","cropType":"rice","soilMoisture":55,"forecastRainfall":0,"temperature":31 }

Response:
{
  "success": true,
  "data": { "status":"ON","reason":"...","scheduledTime":"06:00","durationMinutes":55,"waterUsageLiters":5500,"nextReview":"..." }
}
```

---

### Market Prices
```
GET /api/market?state=Karnataka&district=Mysuru&crop=tomato

Response:
{
  "success": true,
  "data": {
    "prices": [{ "market":"Mysore APMC","district":"Mysuru","price":2800,"trend":"up","changePercent":"5.2" }, ...],
    "best": { "market":"Mysore APMC","price":2800 },
    "recommendation": "Sell in Mysore APMC for highest profit — ₹2,800/quintal"
  }
}
```

---

### Alerts
```
GET /api/alerts?state=Karnataka&district=Mysuru

Response:
{
  "success": true,
  "data": [{ "id":"1","type":"storm","severity":"medium","title":"Storm Advisory",...}]
}
```

---

### Location
```
GET /api/location/states
Response: { "success": true, "data": ["Andhra Pradesh", "Assam", ...] }

GET /api/location/districts?state=Karnataka
Response: { "success": true, "data": ["Bengaluru", "Mysuru", ...] }
```

---

### Drones
```
GET /api/drones
Response: { "success": true, "data": [{ "id":"d1","name":"DJI Agras T40 #1","status":"active","batteryPercent":78, ... }] }

POST /api/drones/{droneId}/dispatch
POST /api/drones/{droneId}/recall
Response: { "success": true, "message": "Drone d1 dispatched" }
```

---

### Water Resource Plan
```
POST /api/water/plan
Body:
{
  "cropType": "rice",
  "landAreaAcres": 5,
  "season": "kharif",
  "resources": [
    { "sourceType":"borewell",  "capacityLiters":150000, "currentLevelLiters":120000, "fillRatePerDay":200 },
    { "sourceType":"pond",      "capacityLiters":200000, "currentLevelLiters":80000,  "fillRatePerDay":500 }
  ]
}

Response:
{
  "success": true,
  "data": { "totalAvailableLiters":200000,"dailyCropConsumptionLiters":40000,"daysRemaining":5,"warningLevel":"critical","recommendations":["Reduce irrigation by 20%",...] }
}
```

---

### Chatbot
```
POST /api/chat
Body: { "message":"What crop should I grow?","lang":"hi","location":{"state":"Karnataka","district":"Mysuru"} }

Response: { "success": true, "data": { "reply": "🌾 Based on current soil..." } }
```

---

## ML Service Endpoints (Python Flask — Port 8000)

| Endpoint              | Method | Description              |
|-----------------------|--------|--------------------------|
| `/health`             | GET    | Service health + models  |
| `/predict/crop`       | POST   | Crop recommendation      |
| `/predict/yield`      | POST   | Yield estimation         |
| `/predict/price`      | POST   | 30-day price prediction  |
| `/predict/irrigation` | POST   | Irrigation schedule      |
