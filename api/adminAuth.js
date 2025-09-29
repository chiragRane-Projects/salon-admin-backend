const express = require('express');
const router = express.Router();
const Admin = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    try {
        const users = await Admin.find();

        if (users.length === 0) {
            return res.status(400).json({ message: "There are no users" });
        }

        return res.status(200).json({ message: "Users found ", users });
    } catch (error) {
        console.log("Couldn't find users: " + error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
})

router.post('/register', async (req, res) => {
    try {
        const { name, phoneNum, username, password, role } = req.body;

        const adminExists = await Admin.findOne({ username });

        if (adminExists) {
            return res.json(400).json({ message: 'User exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await Admin.create({
            name,
            phoneNum,
            username,
            password: hashedPassword,
            role
        });

        return res.status(200).json({ message: 'User created', userId: newUser._id });

    } catch (error) {
        console.log("Registration Error " + error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const u = await Admin.findOne({ username })

        if (!u) {
            return res.status(404).json({ message: "User not found" });
        }

        const isValid = await comparePassword(password, u.password);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: u.id, username: u.username, role: u.role }, process.env.JWT_SECRET_KEY, {expiresIn: '9h'});

        res.json({ token, user: { id: u._id, name: u.name, username: u.username, role: u.role } });
    } catch (error) {
        console.log("Login Error " + error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

module.exports = router;