const express = require('express');
const router = express.Router();
const discounts = require('../models/discounts');

router.get('/', async (req, res) => {
    try {
        const existingDiscounts = await discounts.find();

        if (existingDiscounts.length === 0) return res.status(400).json({ message: "No discounts" });

        return res.status(200).json({ message: 'Discounts fetched', existingDiscounts });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, type, amount, minBill, percentage, butQty, getQty, serviceId, validFrom, validTo, active } = req.body;

        const newDiscounts = await discounts.create({
            name,
            type,
            amount,
            minBill,
            percentage,
            butQty,
            getQty,
            serviceId,
            validFrom,
            validTo,
            active
        });

        return res.status(201).json({ message: "New discount created", discountId: newDiscounts._id });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updates = req.body;

        const updatedDiscount = await discounts.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedDiscount) return res.status(404).json({ message: "No discount found" });


        return res.status(200).json({ message: "Discount updated", updatedDiscount })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


module.exports = router;