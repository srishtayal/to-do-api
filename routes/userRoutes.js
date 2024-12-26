const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, hashedPassword, username]);

        res.status(201).send('User registered');
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        console.log("Users found: ", users);

        if (users.length === 0) {
            return res.status(400).send('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, users[0].password);
        console.log("Password match: ", isValidPassword);

        if (!isValidPassword) {
            return res.status(400).send('Invalid credentials');
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        if (!process.env.JWT_SECRET) {
            return res.status(500).send('JWT secret not defined');
        }

        const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated token:", token);

        res.status(200).send({ token });

    } catch (err) {
        console.error("Login error: ", err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
