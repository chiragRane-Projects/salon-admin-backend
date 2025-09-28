const mongoose = require('mongoose');

const DATABASE_URL = process.env.MONGODB_URL;

async function connectDB(){
    await mongoose.connect(DATABASE_URL)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log(error))
    .finally(() => console.log("Database connection attempted"));
}

module.exports = connectDB;