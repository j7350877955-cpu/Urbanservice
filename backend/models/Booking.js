const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    serviceType: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: Date, required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'On the way', 'Completed'], 
        default: 'Pending' 
    },
    workerLocation: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
