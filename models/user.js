const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phoneNum: {type: String, required: true},
    username: {type: String, unique: true,required: true},
    password: {type: String, required: true},
    role: {type: String, enum:['owner', 'stylist'], default: 'owner', required: true}
}, {timestamps: true});

module.exports = mongoose.model("Admin", adminSchema);