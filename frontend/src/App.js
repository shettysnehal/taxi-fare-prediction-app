import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure to create and import this CSS file

function App() {
    const [pickupLat, setPickupLat] = useState('');
    const [pickupLon, setPickupLon] = useState('');
    const [dropoffLat, setDropoffLat] = useState('');
    const [dropoffLon, setDropoffLon] = useState('');
    const [time, setTime] = useState('');
    const [result, setResult] = useState('');

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPickupLat(position.coords.latitude);
                    setPickupLon(position.coords.longitude);
                },
                (error) => {
                    alert("Error getting location: " + error.message);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/predict', {
                pickup_lat: pickupLat,
                pickup_lon: pickupLon,
                dropoff_lat: dropoffLat,
                dropoff_lon: dropoffLon,
                t: time
            });
            setResult(`Predicted fare: Rs.${response.data.predicted_fare}`);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data.");
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Taxi Fare Prediction</h1>
                <p>Enter your pickup and dropoff locations, along with the time, to get a fare estimate.</p>
                <p>
                    For latitude and longitude, visit this 
                    <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="link">
                        Google Maps link
                    </a>.
                </p>
            </header>
            <main className="App-main">
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label>Pickup Latitude:</label>
                        <input
                            type="text"
                            value={pickupLat}
                            onChange={(e) => setPickupLat(e.target.value)}
                            readOnly
                        />
                        <button type="button" onClick={getCurrentLocation} className="location-button">
                            Get Current Location
                        </button>
                    </div>
                    <div className="form-group">
                        <label>Pickup Longitude:</label>
                        <input
                            type="text"
                            value={pickupLon}
                            onChange={(e) => setPickupLon(e.target.value)}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Dropoff Latitude:</label>
                        <input
                            type="text"
                            value={dropoffLat}
                            onChange={(e) => setDropoffLat(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Dropoff Longitude:</label>
                        <input
                            type="text"
                            value={dropoffLon}
                            onChange={(e) => setDropoffLon(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time (minutes):</label>
                        <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    <button type="submit">Predict Fare</button>
                </form>
                {result && <h2 className="result">{result}</h2>}
            </main>
        </div>
    );
}

export default App;
