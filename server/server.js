const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db');
const loginRoute = require('./routes/login_route');
const signupRoute = require('./routes/signup_route');
const tenderRoute = require('./routes/tenders_route');
const downloadRoute = require('./routes/download_route');
const galleryRoute=require('./routes/gallery_routes'); // Import the gallery routes
const cors = require('cors'); // Import the cors middleware

// Connect to the database
connectDB();

const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from http://localhost:5173
const corsOptions = {
    origin: ['http://localhost:5173', 'https://kolkv2.vercel.app'], // Only allow these origins
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], // Specify the allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
};
app.use(cors(corsOptions));
// Middleware to parse JSON bodies - MUST BE BEFORE ROUTES
// Increase the body limit to 50MB to handle large Base64 image strings.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



// API Routes
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/tenders', tenderRoute);
app.use('/tenders/download', downloadRoute);
app.use('/photogallery', galleryRoute);

app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
