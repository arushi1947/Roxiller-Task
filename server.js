// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // your PG pool
const adminRoutes = require('./routes/adminRoutes'); 
const storeRoutes = require('./routes/storeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

// route imports
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- Global middleware (do this first) ---
app.use(cors());
app.use(express.json()); // parse application/json

// --- Health / DB test route (optional) ---
// Debug route to see connected tables
app.get('/', (req, res) => {
    res.status(200).json({ message: "API is working correctly!" });
});


// --- Mount routes (after middleware) ---
app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/stores', storeRoutes);

app.use('/api/owner', ownerRoutes);

// --- Optional generic error handler (last) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
