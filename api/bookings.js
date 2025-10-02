const express = require('express');
const router = express.Router();
const bookings = require('../models/bookings');

router.get('/', async(req, res) => {
    try {
        const existingBookings = await bookings.find();

        if(existingBookings.length === 0) return res.status(400).json({message:"No bookings"});

        return res.status(200).json({message: "Bookings fetched", existingBookings});
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

// router.post('/', async(req, res) => {
//     try {
//         const{customerName, age, gender, service, discount, date, time, totalAmount} = req.body;

//         let totalBill = 0;
//     } catch (error) {
        
//     }
// })

module.exports = router;