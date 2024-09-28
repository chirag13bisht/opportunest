const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./router/auth"); // Ensure auth.js is in the router directory
require('./db/conn'); // Import the DB connection
const cors = require("cors");
const cookieparser = require("cookie-parser");
require('dotenv').config({ path: './config.env' });
const multer = require('multer');
const path = require('path')
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));

// Middleware to parse JSON requests
app.use(cookieparser());

app.use(cors({
    origin: 'http://localhost:3000',  // Only allow this origin
    credentials: true,                // Allow credentials (cookies, headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],    // Allowed headers
    optionsSuccessStatus: 200  // For legacy browsers support
}));

// Middleware to handle preflight OPTIONS requests
app.options('*', cors());

  
app.use(express.json());


// Use the router for authentication
app.use("/api/auth", router);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});