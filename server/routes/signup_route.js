const express = require('express');
const router = express.Router();
const User = require('../models/user_model'); // Adjust path as needed

router.post('/', async (req, res) => {
    const {  email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.create({
            email,
            password, // Mongoose pre-save middleware will hash this
        });

        // Optionally, you can send back a JWT token here for immediate login
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;