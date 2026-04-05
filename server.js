const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- REPLACE THIS WITH YOUR NEW CLEAN PASSWORD ---
const mongoURI = "mongodb+srv://admin:ServicePro123@cluster0.xxxxx.mongodb.net/urbanservice?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { 
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000 
})
.then(() => console.log("✅ SYSTEM ONLINE: MongoDB Connected"))
.catch(err => console.error("❌ SYSTEM OFFLINE: Database Error ->", err.message));

// SCHEMAS
const Worker = mongoose.model('Worker', new mongoose.Schema({
    name: String, service: String, phone: String, lat: Number, lng: Number,
    rating: { type: String, default: "⭐ 5.0" } 
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
    name: String, service: String, phone: String, address: String, date: { type: Date, default: Date.now }
}));

// ROUTES
app.post('/api/worker/update-location', async (req, res) => {
    try {
        const { phone, lat, lng } = req.body;
        await Worker.findOneAndUpdate({ phone }, { lat, lng });
        res.sendStatus(200);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const b = new Booking(req.body);
        await b.save();
        res.status(201).json({ message: "Success! Appointment Booked." });
    } catch (e) { res.status(500).json({ error: "Database Lock: " + e.message }); }
});

app.post('/api/apply', async (req, res) => {
    try {
        const w = new Worker(req.body);
        await w.save();
        res.status(201).json({ message: "Success! Application Received." });
    } catch (e) { res.status(500).json({ error: "Database Lock: " + e.message }); }
});

app.get('/api/workers', async (req, res) => {
    try { res.json(await Worker.find()); } catch (e) { res.json([]); }
});

app.get('/api/admin/data', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: -1 });
        const apps = await Worker.find();
        res.json({ bookings, apps });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));
