const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// REPLACE with your actual URI and Password
const mongoURI = "mongodb+srv://Aryanpopalghat:aryan2308@urbanservice.w3smd8n.mongodb.net/?appName=urbanservice";

// --- THE FIX: WAIT FOR CONNECTION ---
async function connectDB() {
    try {
        await mongoose.connect(mongoURI, { 
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false 
        });
        console.log("✅ DATABASE CONNECTED & READY");
    } catch (err) {
        console.error("❌ DATABASE ERROR:", err.message);
    }
}
connectDB();

// SCHEMAS
const Worker = mongoose.model('Worker', new mongoose.Schema({
    name: String, service: String, phone: String, lat: Number, lng: Number,
    rating: { type: String, default: "⭐ 5.0" }
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
    name: String, service: String, phone: String, address: String, 
    date: { type: Date, default: Date.now }
}));

// --- MIDDLEWARE TO PREVENT ERRORS IF DB IS DISCONNECTED ---
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: "Database is still connecting. Please wait 5 seconds and try again." });
    }
    next();
});

// ROUTES
app.post('/api/bookings', async (req, res) => {
    try {
        const b = new Booking(req.body);
        await b.save();
        res.status(201).json({ message: "Booking Confirmed!" });
    } catch (e) {
        res.status(500).json({ error: "Booking Failed: " + e.message });
    }
});

app.post('/api/apply', async (req, res) => {
    try {
        const w = new Worker(req.body);
        await w.save();
        res.status(201).json({ message: "Application Successful!" });
    } catch (e) {
        res.status(500).json({ error: "Application Failed: " + e.message });
    }
});

app.get('/api/workers', async (req, res) => {
    try { res.json(await Worker.find()); } catch (e) { res.json([]); }
});

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
