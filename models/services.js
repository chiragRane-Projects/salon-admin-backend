const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    gender: {type: String, enum:['male', 'female', 'all'], required: true}
}, {timestamps: true})

module.exports = mongoose.model("service", serviceSchema);