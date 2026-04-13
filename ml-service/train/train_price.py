# ============================================================
# AgriAgent – Train Price Prediction Model
# Linear Regression / Ridge on crop + time features
# ============================================================

import os
import sys
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.preprocess import encode_crop

DATA_DIR  = os.path.join(os.path.dirname(__file__), '..', 'data')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

BASE_PRICES = {'tomato':2800,'onion':1500,'potato':1900,'rice':1800,'wheat':2100,
               'sugarcane':3200,'groundnut':5500,'maize':1600,'cotton':6000}


def generate_price_data(n=3000):
    """Synthetic price time-series data."""
    crops   = list(BASE_PRICES.keys())
    records = []
    for _ in range(n):
        crop      = np.random.choice(crops)
        month     = np.random.randint(1, 13)
        rainfall  = np.random.uniform(0, 300)
        base      = BASE_PRICES[crop]

        # Price variation: seasonal + rainfall + noise
        seasonal  = 1 + 0.1 * np.sin(month * np.pi / 6)
        rain_drop  = 1 - min(0.15, rainfall * 0.0005)
        noise      = np.random.normal(1, 0.05)
        price      = base * seasonal * rain_drop * noise

        records.append({'crop': crop, 'month': month, 'rainfall': rainfall, 'price': price})

    return pd.DataFrame(records)


def train():
    df = generate_price_data()

    X = np.column_stack([
        df['crop'].apply(encode_crop),
        df['month'],
        df['rainfall'],
    ])
    y = df['price'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = Ridge(alpha=10.0)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print('── Price Model Evaluation ──')
    print(f'MAE:  ₹{mean_absolute_error(y_test, y_pred):.0f}/quintal')

    model_path = os.path.join(MODEL_DIR, 'price_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f'✅ Price model saved to {model_path}')


if __name__ == '__main__':
    train()
