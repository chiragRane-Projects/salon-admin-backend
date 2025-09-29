const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function hashPassword(password){
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error) {
       throw new Error('Error in password hashing ' + error)
    }
}

async function comparePassword(password, hashPassword){
    try {
        return await bcrypt.compare(password, hashPassword)
    } catch (error) {
        throw new Error('Error comparing password ' + error)
    }
}

module.exports = {hashPassword, comparePassword}