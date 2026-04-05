const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- REPLACE THIS WITH YOUR NEW STRING FROM STEP 1 ---
const mongoURI = "mongodb+srv://Aryanpopalghat:aryan2308@urbanservice.w3smd8n.mongodb.net/?appName=urbanservice";

mongoose.connect(mongoURI, { 
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false // Forces an immediate error instead of "Buffering"
})
.then(() => console.log("✅ DATABASE CONNECTED"))
.catch(err => console.error("❌ DATABASE ERROR:", err.message));

// SCHEMAS
const workerSchema = new mongoose.Schema({
    name: String, service: String, phone: String, lat: Number, lng: Number,
    rating: { type: String, default: "⭐ 5.0" }
});
const Worker = mongoose.model('Worker', workerSchema);

const bookingSchema = new mongoose.Schema({
    name: String, service: String, phone: String, address: String, 
    date: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// ROUTES
app.post('/api/bookings', async (req, res) => {
    try {
        const b = new Booking(req.body);
        await b.save();
        res.status(201).json({ message: "Booking Confirmed!" });
    } catch (e) {
        console.error("Booking Fail:", e.message);
        res.status(500).json({ error: "DB Error: " + e.message });
    }
});

app.post('/api/apply', async (req, res) => {
    try {
        const w = new Worker(req.body);
        await w.save();
        res.status(201).json({ message: "Application Successful!" });
    } catch (e) {
        res.status(500).json({ error: "DB Error: " + e.message });
    }
});

app.get('/api/workers', async (req, res) => {
    try { res.json(await Worker.find()); } catch (e) { res.json([]); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
