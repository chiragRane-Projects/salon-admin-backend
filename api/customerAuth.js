const express = require('express');
const router = express.Router();
const customers = require('../models/customers');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('jsonwebtoken');
const passport = require('../utils/passport');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.get('/', async (req, res) => {
    try {
        const existingCustomers = await customers.find();

        if (existingCustomers.length === 0) return res.status(400).json({ message: "No customers found" });

        return res.status(200).json({ message: "Customers fetched", existingCustomers });
    } catch (error) {
        console.log("Internal Server Error: ", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.post('/email-auth', async (req, res) => {
    try {
        const { name, age, email, password } = req.body;

        const existEmail = await customers.findOne({ email });

        if (existEmail) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await hashPassword(password);

        const newCustomer = await customers.create({
            name,
            age,
            email,
            password: hashedPassword
        })

        return res.status(201).json({ message: "Customer created", customerId: newCustomer._id });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});


router.post("/email-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const c = await customers.findOne({ email });

        if (!c) return res.status(404).json({ message: "No customer found" });

        const isValid = await comparePassword(password, c.password);

        if (!isValid) return res.status(400).json({ message: "Invalid Credentials" });

        const accessToken = jwt.sign(
            { id: c.id, email: c.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: c.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        c.refreshToken = refreshToken;
        await c.save();

        res.json({
            accessToken,
            refreshToken,
            user: { name: c.name },
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.get('/auth/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        const user = req.user;

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "30d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken, user: { name: user.name, email: user.email } });
    }
)

router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'Refresh token not found' });
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const customer = await customers.findById(decoded.id);

        if (!customer) return res.status(401).json({ message: "Invalid refresh token" });

        if (customer.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Refresh token mismatch" });
        }

        const newAccessToken = jwt.sign(
            { id: customer.id, email: customer.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
})


router.post('/google-token-login', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        let user = await customers.findOne({ email });
        if (!user) {
            user = await customers.create({
                name,
                email,
                password: null
            });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        user.refreshToken = refreshToken;
        await user.save();


        res.json({
            accessToken,
            refreshToken,
            user: { name: user.name, email: user.email },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Invalid Google token', error });
    }
})

router.post('/logout', async (req, res) => {
    try {
        const { id } = req.body;

        await customers.findByIdAndUpdate(id, { $unset: { refreshToken: "" } });

        res.json({ message: "Logout success" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
})

module.exports = router; 