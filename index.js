require('dotenv').config()
const connectDB = require('./utils/db');
const express = require('express');
const cors = require('cors');
const adminAuth = require('./api/adminAuth');
const serviceRoutes = require('./api/services')
const customerAuth = require('./api/customerAuth');
const discountRoutes = require('./api/discounts');
const bookingRoutes = require('./api/bookings');

connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/admin-auth', adminAuth);
app.use('/api/services', serviceRoutes);
app.use('/api/customers', customerAuth);
app.use('/api/discounts', discountRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));