const express = require('express');
const router = express.Router();
const services = require('../models/services');

router.get('/', async (req, res) => {
    try {
        const s = await services.find();

        if (s.length === 0) {
            return res.status(400).json({ message: "No services found" });
        }

        return res.status(200).json({ message: "Services found", s });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, price, gender } = req.body;

        const serviceExists = await services.findOne({ name });

        if (serviceExists) {
            return res.status(400).json({ message: "Service already exists" });
        }

        const newService = await services.create({
            name,
            price,
            gender
        });

        return res.status(201).json({ message: "Service created", serviceId: newService._id });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updates = req.body;

        const updatedService = await services.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        return res.status(200).json({ message: "Service updated successfully", updatedService });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleteService = await services.findByIdAndDelete(id);

        if (!deleteService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;