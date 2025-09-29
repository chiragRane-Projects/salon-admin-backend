require('dotenv').config()
const connectDB = require('./utils/db');
const express = require('express');
const cors = require('cors');
const adminAuth = require('./api/adminAuth');
const serviceRoutes = require('./api/services')


connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/admin-auth', adminAuth);
app.use('/api/services', serviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));