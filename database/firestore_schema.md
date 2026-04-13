# AgriAgent – Firestore Schema

## Collections Overview

```
agriagent/
├── users/              {uid}
├── farms/              {farmId}
├── alerts/             {alertId}
├── marketSnapshots/    {snapshotId}
└── droneData/          {droneId}
```

---

## `users/{uid}`

```json
{
  "uid":          "string (Firebase Auth UID)",
  "email":        "string",
  "displayName":  "string",
  "photoURL":     "string | null",
  "language":     "en | hi | kn | ta | te | ml | mr | pa | gu | or",
  "location": {
    "state":      "string",
    "district":   "string",
    "lat":        "number | null",
    "lng":        "number | null"
  },
  "createdAt":    "Timestamp",
  "lastLoginAt":  "Timestamp"
}
```

---

## `farms/{farmId}`

```json
{
  "userId":           "string (ref to users/{uid})",
  "name":             "string",
  "landAreaAcres":    "number",
  "cropType":         "rice | wheat | maize | sugarcane | ...",
  "soilType":         "alluvial | black | red | laterite | ...",
  "season":           "kharif | rabi | zaid | summer",
  "irrigationMethod": "drip | sprinkler | flood | manual",
  "waterSources": [
    {
      "sourceType":        "pond | borewell | rainwater | canal",
      "capacityLiters":    "number",
      "currentLevelLiters":"number",
      "fillRatePerDay":    "number"
    }
  ],
  "location": {
    "state":    "string",
    "district": "string",
    "lat":      "number | null",
    "lng":      "number | null"
  },
  "createdAt":  "Timestamp",
  "updatedAt":  "Timestamp"
}
```

**Indexes:**
- `userId ASC, createdAt DESC` (list user farms)
- `location.state ASC, location.district ASC` (location lookup)

---

## `alerts/{alertId}`

```json
{
  "type":           "flood | drought | storm | pest | frost | heat",
  "severity":       "low | medium | high | critical",
  "title":          "string",
  "description":    "string",
  "affectedState":  "string",
  "affectedDistrict":"string",
  "issuedAt":       "Timestamp",
  "expiresAt":      "Timestamp | null",
  "actionRequired": "string",
  "source":         "IMD | rule-engine | manual"
}
```

**Indexes:**
- `affectedState ASC, issuedAt DESC`
- `severity ASC, issuedAt DESC`

---

## `marketSnapshots/{snapshotId}`

```json
{
  "market":       "string",
  "district":     "string",
  "state":        "string",
  "crop":         "string",
  "price":        "number",
  "minPrice":     "number",
  "maxPrice":     "number",
  "unit":         "quintal | kg",
  "date":         "Timestamp",
  "trend":        "up | down | stable",
  "changePercent":"number"
}
```

**Indexes:**
- `state ASC, crop ASC, date DESC`
- `district ASC, date DESC`

---

## `droneData/{droneId}`

```json
{
  "name":          "string",
  "status":        "active | idle | charging | error",
  "batteryPercent":"number",
  "farmId":        "string (ref to farms)",
  "location": { "lat": "number", "lng": "number" },
  "altitude":      "number",
  "cropHealthIndex":"number  (0–100)",
  "coverageAreaHa":"number",
  "lastMission":   "Timestamp",
  "missionLog": [
    { "timestamp": "Timestamp", "action": "string", "healthIndex": "number" }
  ]
}
```

---

## Security Rules (Summary)

```
/users/{uid}           → read/write: auth.uid == uid
/farms/{farmId}        → read/write: auth.uid == resource.data.userId
/alerts/{alertId}      → read: any authenticated user; write: admin only
/marketSnapshots       → read: any authenticated user; write: backend service only
/droneData/{droneId}   → read/write: farm owner only
```
