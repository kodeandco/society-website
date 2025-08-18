const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db');
const loginRoute = require('./routes/login_route');
const signupRoute = require('./routes/signup_route');
const tenderRoute = require('./routes/tenders_route');
const downloadRoute = require('./routes/download_route');
const cors = require('cors'); // Import the cors middleware

// Connect to the database
connectDB();

const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from http://localhost:5173
const corsOptions = {
    origin: 'http://localhost:5173', // Only allow this origin
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], // Specify the allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies - MUST BE BEFORE ROUTES
app.use(express.json());

// API Routes
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/tenders', tenderRoute);
app.use('/tenders/download', downloadRoute);

app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
