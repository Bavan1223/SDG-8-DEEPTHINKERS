# ============================================================
# AgriAgent – Train Crop Recommendation Model
# Random Forest classifier on soil/season/weather features
# ============================================================

import os
import sys
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.preprocess import encode_soil, encode_season, encode_crop, normalize_features

DATA_DIR  = os.path.join(os.path.dirname(__file__), '..', 'data')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

os.makedirs(MODEL_DIR, exist_ok=True)


def load_or_generate_data():
    """Load crop_yield.csv or generate synthetic training data."""
    csv_path = os.path.join(DATA_DIR, 'crop_yield.csv')
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        print(f'✅ Loaded {len(df)} records from crop_yield.csv')
        return df

    # Generate synthetic data for 8 crops × varied conditions
    print('ℹ️  Generating synthetic training data...')
    records = []
    crops      = ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'groundnut', 'tomato', 'soybean']
    soils      = ['alluvial', 'black', 'red', 'laterite', 'arid']
    seasons    = ['kharif', 'rabi', 'zaid', 'summer']

    for _ in range(2000):
        crop   = np.random.choice(crops)
        soil   = np.random.choice(soils)
        season = np.random.choice(seasons)
        rain   = np.random.uniform(200, 2500)
        temp   = np.random.uniform(15, 42)
        hum    = np.random.uniform(30, 95)

        # Add label noise only 5% of the time
        label = crop
        if np.random.random() < 0.05:
            label = np.random.choice(crops)

        records.append({
            'soil_type': soil, 'season': season,
            'rainfall': rain, 'temperature': temp, 'humidity': hum,
            'crop': label,
        })

    return pd.DataFrame(records)


def train():
    df = load_or_generate_data()

    # Encode features
    X = np.column_stack([
        df['soil_type'].apply(encode_soil),
        df['season'].apply(encode_season),
        df['rainfall'].astype(float),
        df['temperature'].astype(float),
        df['humidity'].astype(float),
    ])
    y = df['crop'].values

    X = normalize_features(X)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        random_state=42,
        class_weight='balanced',
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    print('\n── Crop Model Evaluation ──')
    print(classification_report(y_test, y_pred))
    print(f'Accuracy: {(y_pred == y_test).mean():.3f}')

    # Save model
    model_path = os.path.join(MODEL_DIR, 'crop_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f'✅ Model saved to {model_path}')


if __name__ == '__main__':
    train()
