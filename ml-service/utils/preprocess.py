# ============================================================
# AgriAgent – Preprocessing Utilities
# Feature encoding and normalization for ML models
# ============================================================

from typing import List

# ── Encoding maps ────────────────────────────────────────────

SOIL_ENCODING = {
    'alluvial': 0, 'black': 1, 'red': 2, 'laterite': 3,
    'arid': 4, 'saline': 5, 'peaty': 6,
}

SEASON_ENCODING = {
    'kharif': 0, 'rabi': 1, 'zaid': 2, 'summer': 3, 'winter': 4,
}

CROP_ENCODING = {
    'rice': 0, 'wheat': 1, 'maize': 2, 'sugarcane': 3, 'cotton': 4,
    'soybean': 5, 'groundnut': 6, 'tomato': 7, 'onion': 8, 'potato': 9,
    'banana': 10, 'mango': 11,
}

# Feature min/max for normalization
FEATURE_RANGES = {
    'soil_type':   (0, 6),
    'season':      (0, 4),
    'rainfall':    (0, 3000),
    'temperature': (5, 50),
    'humidity':    (10, 100),
}


def encode_soil(soil_type: str) -> int:
    """Encode soil type string to integer."""
    return SOIL_ENCODING.get(soil_type.lower(), 0)


def encode_season(season: str) -> int:
    """Encode season string to integer."""
    return SEASON_ENCODING.get(season.lower(), 0)


def encode_crop(crop: str) -> int:
    """Encode crop name to integer."""
    return CROP_ENCODING.get(crop.lower(), 0)


def normalize_features(features):
    """
    Min-max normalize a 2D numpy array based on FEATURE_RANGES.
    Assumes columns: [soil_type, season, rainfall, temperature, humidity]
    """
    import numpy as np
    ranges = list(FEATURE_RANGES.values())
    mins  = [r[0] for r in ranges]
    maxes = [r[1] for r in ranges]

    normalized = (features - mins) / (maxes - mins + 1e-8)
    return np.clip(normalized, 0.0, 1.0)


def get_sample_features(crop: str, season: str, soil_type: str) -> List[str]:
    """
    Return human-readable explanation strings for a crop recommendation.
    Used as 'reasons' in the recommendation payload.
    """
    reasons = []

    crop_reason = {
        'rice':       'Thrives in high-rainfall Kharif season',
        'wheat':      'Classic Rabi crop, ideal for cool weather',
        'maize':      'Versatile crop with moderate water needs',
        'sugarcane':  'High revenue, suitable for irrigated land',
        'cotton':     'Good market demand in dryland farming',
        'groundnut':  'Heat tolerant, nitrogen-fixing legume',
        'tomato':     'High-value vegetable with strong market',
        'soybean':    'Protein-rich, soil improvement benefits',
        'onion':      'Year-round demand, drought tolerant',
        'potato':     'Starchy crop, high yield potential',
    }
    soil_reason = {
        'alluvial':  f'Alluvial soil provides excellent nutrient retention for {crop}',
        'black':     f'Black soil retains moisture well — beneficial for {crop}',
        'red':       f'Red soil is well-drained, suitable for {crop}',
        'laterite':  f'Laterite soil works for drought-hardy crops like {crop}',
    }
    season_reason = {
        'kharif': f'{season.capitalize()} season aligns with {crop} growth cycle',
        'rabi':   f'Rabi season offers ideal cool temperatures for {crop}',
        'zaid':   f'Zaid season enables quick cash crops like {crop}',
        'summer': f'Summer planting takes advantage of long days for {crop}',
    }

    if crop in crop_reason:   reasons.append(crop_reason[crop])
    if soil_type in soil_reason:  reasons.append(soil_reason[soil_type])
    if season in season_reason:   reasons.append(season_reason[season])
    reasons.append('Based on historical yield data from your region')

    return reasons[:3]
