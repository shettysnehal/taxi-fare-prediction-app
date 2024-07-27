const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const port = 3000;

// Middleware to parse JSON request bodies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors)


// Define the endpoint to receive data and forward to Python script
app.post('/predict', async (req, res) => {
    const { pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, t} = req.body;
     console.log( pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, t);
    // Validate the input data
    if (!pickup_lat || !pickup_lon || !dropoff_lat || !dropoff_lon || !t) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Send data to the Python script via Flask server
        const response = await axios.post('http://localhost:5000/predict', {
            pickup_lat,
            pickup_lon,
            dropoff_lat,
            dropoff_lon,
            t
        });

        // Return the Python script response
        res.json(response.data);
    } catch (error) {
        console.error('Error connecting to Python script:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
