const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: {type: mongoose.Schema.Types.ObjectId, ref:"Customer", required: true},
    age: {type: String, required: true},
    gender: {type: String, enum: ['male', 'female'], required: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref:"service"},
    discount: {type: mongoose.Schema.Types.ObjectId, ref:"discount"},
    date: {type: Date, default: Date.now},
    time: {type:String, required: true},
    totalAmount:{type: Number, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Booking", bookingSchema);