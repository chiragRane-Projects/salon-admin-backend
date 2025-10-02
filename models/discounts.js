const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, enum: ['flat', 'conditional', 'percentage', 'bogo'], required: true},
    amount: {type: Number},
    minBill: {type: Number},
    percentage: {type: Number},
    buyQty: { type: Number },       
    getQty: { type: Number },       
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'service' },
    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date },
    active: { type: Boolean, default: true }
}, {timestamps: true});

discountSchema.index({ validTo: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Discount", discountSchema);