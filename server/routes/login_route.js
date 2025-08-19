const express = require('express');
const router = express.Router();
const User = require('../models/user_model'); // Adjust path as needed

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Compare passwords
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. If credentials are valid, send success response
    //    You would typically generate and send a JWT token here
    res.status(200).json({ message: 'Login successful' });
});

module.exports = router;