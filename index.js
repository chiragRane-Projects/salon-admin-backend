require('dotenv').config()
const connectDB = require('./utils/db');
const express = require('express');
const cors = require('cors');
const adminAuth = require('./api/adminAuth');


connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/admin-auth', adminAuth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));