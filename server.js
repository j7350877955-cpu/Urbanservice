const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. DATABASE CONNECTION (Replace with your actual string!)
const mongoURI = "mongodb+srv://Aryanpopalghat:Aryanpopalghat23@urbanservice.w3smd8n.mongodb.net/?appName=urbanservice/urbanservice?retryWrites=true&w=majority"; 

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. SCHEMAS
const workerSchema = new mongoose.Schema({
    name: String, service: String, phone: String, lat: Number, lng: Number
});
const Worker = mongoose.model('Worker', workerSchema);

const bookingSchema = new mongoose.Schema({
    name: String, service: String, address: String, date: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// 3. ROUTES
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/api/workers', async (req, res) => {
    try {
        const workers = await Worker.find();
        res.json(workers);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/apply', async (req, res) => {
    try {
        const { workerName, workerService, workerPhone, workerLat, workerLng } = req.body;
        const newWorker = new Worker({
            name: workerName, service: workerService, phone: workerPhone,
            lat: parseFloat(workerLat) || 28.61, lng: parseFloat(workerLng) || 77.20
        });
        await newWorker.save();
        res.status(201).json({ message: "Success! You are live on the map." });
    } catch (err) { res.status(500).json({ error: "Database error. Check Connection." }); }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: "Booking Confirmed!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/bookings', async (req, res) => res.json(await Booking.find()));
app.get('/api/admin/applications', async (req, res) => res.json(await Worker.find()));

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
