const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- 1. REPLACE THIS STRING WITH YOUR NEW ONE FROM STEP 1 ---
const mongoURI = "mongodb+srv://admin:Service123@cluster0.abcde.mongodb.net/urbanservice?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { 
    serverSelectionTimeoutMS: 5000,
    // This stops the "Buffering" and forces a real error message
    bufferCommands: false 
})
.then(() => console.log("✅ DATABASE CONNECTED"))
.catch(err => console.error("❌ DATABASE ERROR:", err.message));

// --- 2. SCHEMAS ---
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

// --- 3. ROUTES ---
app.post('/api/bookings', async (req, res) => {
    try {
        const b = new Booking(req.body);
        await b.save();
        res.status(201).json({ message: "Booking Confirmed!" });
    } catch (e) {
        console.error("Booking Fail:", e.message);
        res.status(500).json({ error: "Server Database Error: " + e.message });
    }
});

app.post('/api/apply', async (req, res) => {
    try {
        const w = new Worker(req.body);
        await w.save();
        res.status(201).json({ message: "Application Successful!" });
    } catch (e) {
        res.status(500).json({ error: "Application Error: " + e.message });
    }
});

app.post('/api/worker/update-location', async (req, res) => {
    try {
        const { phone, lat, lng } = req.body;
        await Worker.findOneAndUpdate({ phone }, { lat, lng });
        res.sendStatus(200);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/workers', async (req, res) => {
    try { res.json(await Worker.find()); } catch (e) { res.json([]); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
