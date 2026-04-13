# ============================================================
# AgriAgent – Train Yield Prediction Model
# Gradient Boosting regression on crop/area/rainfall/temp
# ============================================================

import os
import sys
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.preprocess import encode_crop

DATA_DIR  = os.path.join(os.path.dirname(__file__), '..', 'data')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# Known base yields per crop (quintals/acre)
BASE_YIELDS = {'rice':28,'wheat':24,'maize':22,'sugarcane':350,'cotton':12,
               'groundnut':14,'tomato':40,'soybean':12,'onion':60,'potato':80}


def generate_yield_data(n=3000):
    """Generate synthetic yield training data."""
    crops = list(BASE_YIELDS.keys())
    records = []
    for _ in range(n):
        crop      = np.random.choice(crops)
        area      = np.random.uniform(0.5, 20)
        rainfall  = np.random.uniform(300, 2500)
        temp      = np.random.uniform(15, 45)
        base      = BASE_YIELDS[crop]

        # Yield influenced by rainfall and temperature
        rain_adj  = min(1.2, max(0.6, rainfall / 900))
        temp_adj  = 1.0 if 20 <= temp <= 34 else 0.8
        noise     = np.random.normal(1, 0.08)
        yield_val = base * rain_adj * temp_adj * noise

        records.append({'crop': crop, 'area': area, 'rainfall': rainfall, 'temperature': temp, 'yield_per_acre': yield_val})

    return pd.DataFrame(records)


def train():
    df = generate_yield_data()

    X = np.column_stack([
        df['crop'].apply(encode_crop),
        df['area'],
        df['rainfall'],
        df['temperature'],
    ])
    y = df['yield_per_acre'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print('── Yield Model Evaluation ──')
    print(f'MAE:  {mean_absolute_error(y_test, y_pred):.2f} quintals/acre')
    print(f'R²:   {r2_score(y_test, y_pred):.3f}')

    model_path = os.path.join(MODEL_DIR, 'yield_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f'✅ Yield model saved to {model_path}')


if __name__ == '__main__':
    train()
