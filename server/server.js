const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db');

// Connect to the database
connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));