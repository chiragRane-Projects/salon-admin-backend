require('dotenv').config()
const connectDB = require('./utils/db');
const express = require('express');
const cors = require('cors');



connectDB();
const app = express();

app.use(express.json());
app.use(cors());
