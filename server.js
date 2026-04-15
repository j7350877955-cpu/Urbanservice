// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { Booking, Application, WorkerLocation } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your frontend to communicate with the backend
app.use(express.json()); // Parses incoming JSON requests

// MongoDB Connection
// Replace process.env.MONGO_URI with your actual MongoDB connection string in a .env file
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbanservice')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- API ROUTES ---

// 1. Create a New Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: 'Booking confirmed successfully!', booking: newBooking });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create booking', details: error.message });
    }
});

// 2. Submit a Job Application
app.post('/api/applications', async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to submit application', details: error.message });
    }
});

// 3. Update Worker Location (Simulated by a worker app)
app.post('/api/tracking/update', async (req, res) => {
    const { workerId, latitude, longitude } = req.body;
    try {
        const location = await WorkerLocation.findOneAndUpdate(
            { workerId },
            { latitude, longitude, lastUpdated: Date.now() },
            { new: true, upsert: true } // Creates a new record if one doesn't exist
        );
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update location' });
    }
});

// 4. Get Worker Location (Polled by the customer frontend)
app.get('/api/tracking/:workerId', async (req, res) => {
    try {
        const location = await WorkerLocation.findOne({ workerId: req.params.workerId });
        if (!location) return res.status(404).json({ error: 'Worker not found' });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`URBANSERVICE Backend running on http://localhost:${PORT}`);
});
