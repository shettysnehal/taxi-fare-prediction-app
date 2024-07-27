import React from 'react';

const PredictionDisplay = ({ prediction }) => (
    <div>
        {prediction ? <p>Predicted Fare: {prediction}</p> : <p>No prediction available</p>}
    </div>
);

export default PredictionDisplay;
