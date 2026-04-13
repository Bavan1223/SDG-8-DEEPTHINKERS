# ============================================================
# AgriAgent – Train Irrigation Model
# Decision Tree classifier for irrigation ON/OFF/REDUCED
# ============================================================

import os
import sys
import pickle
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.preprocess import encode_crop

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
os.makedirs(MODEL_DIR, exist_ok=True)


def _rule_label(forecast_rain, temp, soil_moist, crop_high_water):
    """Derive label using the rule engine."""
    if forecast_rain > 5:   return 'OFF'
    if temp > 36:           return 'ON_HIGH'
    if soil_moist > 70:     return 'REDUCED'
    if crop_high_water:     return 'ON'
    return 'ON'


def generate_irrigation_data(n=4000):
    """Synthetic irrigation training data."""
    X, y = [], []
    for _ in range(n):
        rain    = np.random.uniform(0, 50)
        temp    = np.random.uniform(18, 45)
        moisture = np.random.uniform(10, 100)
        crop_id = np.random.randint(0, 12)
        high_water = crop_id in [0, 3, 10]  # rice, sugarcane, banana

        X.append([rain, temp, moisture, crop_id])
        y.append(_rule_label(rain, temp, moisture, high_water))

    return np.array(X), np.array(y)


def train():
    X, y = generate_irrigation_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = DecisionTreeClassifier(max_depth=8, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print('── Irrigation Model Evaluation ──')
    print(classification_report(y_test, y_pred))

    model_path = os.path.join(MODEL_DIR, 'irrigation_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f'✅ Irrigation model saved to {model_path}')


if __name__ == '__main__':
    train()
