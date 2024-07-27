from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Load the model
model_path = 'model.pkl'  # Ensure this path is correct
model = joblib.load(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Extract data from the request
        pickup_lat = data.get('pickup_lat')
        pickup_lon = data.get('pickup_lon')
        dropoff_lat = data.get('dropoff_lat')
        dropoff_lon = data.get('dropoff_lon')
        time = data.get('t')

        # Validate the input data
        if not all([pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, time]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Create DataFrame for prediction
        input_df = pd.DataFrame([{
            'pickup_lat': pickup_lat,
            'pickup_lon': pickup_lon,
            'dropoff_lat': dropoff_lat,
            'dropoff_lon': dropoff_lon,
            'time': time
        }])

        # Predict fare
        predicted_fare = model.predict(input_df)
        return jsonify({'predicted_fare': predicted_fare[0]})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
