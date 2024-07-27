import React, { useState } from 'react';
import axios from 'axios';

const InputForm = ({ setPrediction }) => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('/api/predict', { pickup, dropoff, time });
        setPrediction(response.data.prediction);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
            <input type="text" placeholder="Dropoff Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
            <button type="submit">Predict</button>
        </form>
    );
};

export default InputForm;
