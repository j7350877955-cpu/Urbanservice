const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// --- MongoDB Connection ---
// Hardcoded URI as requested
const mongoURI = "mongodb+srv://Aryanpopalghat:aryan2308@urbanservice.w3smd8n.mongodb.net/urbanservice?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.log("❌ MongoDB connection error:", err));

// --- Database Schemas ---

// 1. Service Schema (For browsing available services)
const serviceSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    rating: Number,
    image: String
});

const Service = mongoose.model('Service', serviceSchema);

// 2. Booking Schema (For when a user clicks 'Book Now')
const bookingSchema = new mongoose.Schema({
    serviceName: String,
    customerName: String,
    address: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- API Routes ---

// Welcome Route
app.get('/', (req, res) => {
    res.send('Service Marketplace API is running...');
});

// GET: Fetch all services from the database
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch services" });
    }
});

// POST: Create a new booking
app.post('/api/book', async (req, res) => {
    try {
        const newBooking = new Booking({
            serviceName: req.body.serviceName,
            customerName: req.body.customerName || "Guest User",
            address: req.body.address || "No address provided"
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ message: "Booking successful!", data: savedBooking });
    } catch (err) {
        res.status(400).json({ error: "Booking failed", details: err.message });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is live at http://localhost:${PORT}`);
});
