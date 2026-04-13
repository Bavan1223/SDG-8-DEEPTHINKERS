# ============================================================
# AgriAgent – ML Service (Flask)
# REST API for crop, yield, price, and irrigation predictions
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import numpy as np
from utils.preprocess import (
    encode_soil, encode_season, encode_crop,
    normalize_features, get_sample_features
)

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from backend/frontend

# ── Model loading ────────────────────────────────────────────

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

def load_model(filename: str):
    """Load a pickled model, return None if not found."""
    path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            return pickle.load(f)
    return None

# Attempt to load trained models (may be None if not yet trained)
crop_model      = load_model('crop_model.pkl')
yield_model     = load_model('yield_model.pkl')
price_model     = load_model('price_model.pkl')
irrigation_model = load_model('irrigation_model.pkl')


# ── Health check ─────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'models': {
            'crop':       crop_model      is not None,
            'yield':      yield_model     is not None,
            'price':      price_model     is not None,
            'irrigation': irrigation_model is not None,
        }
    })


# ── Crop Recommendation ──────────────────────────────────────

@app.route('/predict/crop', methods=['POST'])
def predict_crop():
    """
    Predict suitable crops based on soil, season, and location.
    Input:  { state, district, soilType, season, rainfall?, temperature? }
    Output: List of CropRecommendation objects
    """
    data = request.get_json(force=True)

    soil_type   = data.get('soilType', 'alluvial')
    season      = data.get('season', 'kharif')
    rainfall    = float(data.get('rainfall', 800))
    temperature = float(data.get('temperature', 28))
    humidity    = float(data.get('humidity', 60))

    if crop_model:
        # Build feature vector
        features = np.array([[
            encode_soil(soil_type),
            encode_season(season),
            rainfall,
            temperature,
            humidity,
        ]])
        features = normalize_features(features)

        try:
            proba = crop_model.predict_proba(features)[0]
            classes = crop_model.classes_
            top_indices = np.argsort(proba)[::-1][:3]
            recommendations = [
                {
                    'crop':             classes[i].capitalize(),
                    'confidence':       round(float(proba[i]) * 100, 1),
                    'reasons':          get_sample_features(classes[i], season, soil_type),
                    'waterRequirement': 'high' if classes[i] in ['rice','sugarcane'] else 'medium' if classes[i] in ['maize','cotton'] else 'low',
                    'growthPeriodDays': {'rice':120,'wheat':120,'maize':90,'sugarcane':300,'tomato':90}.get(classes[i], 100),
                    'expectedYield':    {'rice':28,'wheat':24,'maize':22,'sugarcane':350,'tomato':40}.get(classes[i], 20),
                    'marketDemand':     'high' if classes[i] in ['rice','wheat','tomato'] else 'medium',
                }
                for i in top_indices
            ]
            return jsonify({'success': True, 'data': recommendations})
        except Exception as e:
            print(f'Model prediction error: {e}')

    # ── Rule-based fallback when model not available ─────────
    rule_based = _rule_based_crop(soil_type, season, rainfall, temperature)
    return jsonify({'success': True, 'data': rule_based, 'source': 'rule-based'})


def _rule_based_crop(soil_type: str, season: str, rainfall: float, temperature: float):
    """Simple rule-based crop recommendation fallback."""
    recs = []

    if season == 'kharif':
        if rainfall > 600:
            recs.append({'crop': 'Rice',      'confidence': 91, 'reasons': ['High rainfall', f'{soil_type} soil suitable'], 'waterRequirement': 'high',   'growthPeriodDays': 120, 'expectedYield': 28, 'marketDemand': 'high'})
        recs.append(    {'crop': 'Maize',     'confidence': 75, 'reasons': ['Good kharif crop', 'Moderate water need'],     'waterRequirement': 'medium', 'growthPeriodDays': 90,  'expectedYield': 22, 'marketDemand': 'medium'})
        recs.append(    {'crop': 'Soybean',   'confidence': 62, 'reasons': ['Nitrogen fixer', 'Low input cost'],             'waterRequirement': 'low',    'growthPeriodDays': 100, 'expectedYield': 12, 'marketDemand': 'medium'})
    elif season == 'rabi':
        recs.append({'crop': 'Wheat',         'confidence': 88, 'reasons': ['Classic rabi crop', 'Cold weather suitable'],  'waterRequirement': 'medium', 'growthPeriodDays': 120, 'expectedYield': 24, 'marketDemand': 'high'})
        recs.append({'crop': 'Mustard',       'confidence': 72, 'reasons': ['Oil seed crop', 'Low water need'],              'waterRequirement': 'low',    'growthPeriodDays': 90,  'expectedYield': 10, 'marketDemand': 'medium'})
        recs.append({'crop': 'Chickpea',      'confidence': 65, 'reasons': ['Protein crop', 'Drought tolerant'],            'waterRequirement': 'low',    'growthPeriodDays': 110, 'expectedYield': 8,  'marketDemand': 'high'})
    else:  # summer/zaid
        recs.append({'crop': 'Tomato',        'confidence': 80, 'reasons': ['High value crop', 'Good summer yield'],        'waterRequirement': 'medium', 'growthPeriodDays': 90,  'expectedYield': 40, 'marketDemand': 'high'})
        recs.append({'crop': 'Cucumber',      'confidence': 68, 'reasons': ['Quick harvest', 'Market demand'],              'waterRequirement': 'medium', 'growthPeriodDays': 60,  'expectedYield': 35, 'marketDemand': 'medium'})

    if temperature > 38 and not any(r['crop'] == 'Groundnut' for r in recs):
        recs.append({'crop': 'Groundnut',     'confidence': 58, 'reasons': ['Heat tolerant', 'Good oil content'],          'waterRequirement': 'low',    'growthPeriodDays': 100, 'expectedYield': 14, 'marketDemand': 'medium'})

    return recs[:3]


# ── Yield Prediction ─────────────────────────────────────────

@app.route('/predict/yield', methods=['POST'])
def predict_yield():
    """
    Predict crop yield per acre.
    Input:  { cropType, landAreaAcres, state, season, rainfall?, temperature? }
    Output: { estimatedYieldPerAcre, totalYield, confidence, factors }
    """
    data        = request.get_json(force=True)
    crop_type   = data.get('cropType', 'rice')
    area_acres  = float(data.get('landAreaAcres', 1))
    rainfall    = float(data.get('rainfall', 800))
    temperature = float(data.get('temperature', 28))

    BASE_YIELD  = {'rice':28,'wheat':24,'maize':22,'sugarcane':350,'cotton':12,'groundnut':14,'tomato':40,'potato':80,'onion':60}
    base        = BASE_YIELD.get(crop_type, 20)

    if yield_model:
        try:
            features = np.array([[encode_crop(crop_type), area_acres, rainfall, temperature]])
            pred     = yield_model.predict(features)[0]
            per_acre = round(float(pred), 1)
        except Exception:
            per_acre = base
    else:
        # Simple formula: base ± rainfall/temperature adjustment
        rain_factor   = min(1.2, max(0.7, rainfall / 800))
        temp_factor   = 1.0 if 22 <= temperature <= 30 else 0.85
        per_acre      = round(base * rain_factor * temp_factor, 1)

    return jsonify({
        'success': True,
        'data': {
            'estimatedYieldPerAcre': per_acre,
            'totalYield':            round(per_acre * area_acres, 1),
            'confidence':            78,
            'factors':               ['Soil fertility', 'Rainfall pattern', 'Temperature range', 'Historical dataset'],
        }
    })


# ── Price Prediction ─────────────────────────────────────────

@app.route('/predict/price', methods=['POST'])
def predict_price():
    """
    Predict 30-day price trend for a crop.
    Input:  { cropType, district, state }
    Output: { currentPrice, predictedPrice30d, trend, bestSellWindow, confidence }
    """
    data      = request.get_json(force=True)
    crop_type = data.get('cropType', 'tomato')

    BASE_PRICES = {'tomato':2800,'onion':1500,'potato':1900,'rice':1800,'wheat':2100,'sugarcane':3200,'groundnut':5500}
    current     = BASE_PRICES.get(crop_type, 2000)

    if price_model:
        try:
            features   = np.array([[encode_crop(crop_type)]])
            predicted  = float(price_model.predict(features)[0])
        except Exception:
            predicted  = current * 1.08
    else:
        # Simple random walk with slight upward bias
        import random
        predicted = round(current * (1 + random.uniform(-0.05, 0.12)), 0)

    trend = 'up' if predicted > current else 'down' if predicted < current * 0.97 else 'stable'

    return jsonify({
        'success': True,
        'data': {
            'currentPrice':      current,
            'predictedPrice30d': int(predicted),
            'trend':             trend,
            'changePercent':     round((predicted - current) / current * 100, 1),
            'confidence':        72,
            'bestSellWindow':    '2–4 weeks from now' if trend == 'up' else 'Sell now',
        }
    })


# ── Irrigation Prediction ────────────────────────────────────

@app.route('/predict/irrigation', methods=['POST'])
def predict_irrigation():
    """
    Predict irrigation schedule using rules + optional model.
    Input:  { cropType, soilMoisture, forecastRainfall, temperature }
    Output: { status, reason, durationMinutes, waterUsageLiters }
    """
    data             = request.get_json(force=True)
    crop_type        = data.get('cropType', 'rice')
    soil_moisture    = float(data.get('soilMoisture', 50))
    forecast_rain    = float(data.get('forecastRainfall', 0))
    temperature      = float(data.get('temperature', 28))

    # Rule engine (same logic as backend)
    if forecast_rain > 5:
        status, reason, duration = 'OFF', f'Rain forecast ({forecast_rain}mm)', 0
    elif temperature > 36:
        status, reason, duration = 'ON', 'High temperature — increase irrigation', 60
    elif soil_moisture > 70:
        status, reason, duration = 'REDUCED', 'Soil already moist', 20
    elif crop_type in ['rice', 'sugarcane']:
        status, reason, duration = 'ON', f'{crop_type} needs high water', 55
    else:
        status, reason, duration = 'ON', 'Standard schedule', 45

    return jsonify({
        'success': True,
        'data': {
            'status':            status,
            'reason':            reason,
            'durationMinutes':   duration,
            'waterUsageLiters':  duration * 100,
            'scheduledTime':     '06:00' if status != 'OFF' else None,
        }
    })


# ── Run ──────────────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f'🌿 AgriAgent ML Service running on http://localhost:{port}')
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('DEBUG', 'false').lower() == 'true')
