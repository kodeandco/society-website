const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db');
const loginRoute= require('./routes/login_route');
const signupRoute = require('./routes/signup_route');
const tenderRoute=require('./routes/tenders_route');
const downloadRoute = require('./routes/download_route');
// Connect to the database
connectDB();

const PORT = process.env.PORT || 5000;

app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/tenders', tenderRoute);
app.use('/tenders/download', downloadRoute);
app.get('/', (req, res) => {
    res.send('API running');
});
app.use(express.json()); // Middleware to parse JSON bodies

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));