import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import joblib
import os

# Function to calculate distance using Haversine formula
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c

# Path to your CSV file
csv_file_path = 'data.csv'  # Ensure this path is correct

# Read the CSV file into a DataFrame
df = pd.read_csv(csv_file_path)

# Calculate distance
df['distance'] = haversine(df['pickup_lat'], df['pickup_lon'], df['dropoff_lat'], df['dropoff_lon'])

# Apply fare rules
def apply_fare(distance):
    if distance <= 1:
        return 80
    elif distance <= 5:
        return 200
    else:
        return 300

df['fare'] = df['distance'].apply(apply_fare)

# Features and target
X = df[['pickup_lat', 'pickup_lon', 'dropoff_lat', 'dropoff_lon', 'time']]
y = df['fare']

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a model
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse}")

# Save the model
model_save_path = '../backend/model.pkl'  # Path relative to training directory
joblib.dump(model, model_save_path)
print(f"Model saved as {model_save_path}")
