const express = require('express');
const cors = require('cors');
const habitRoutes = require('./routes/habitRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.use('/habits', habitRoutes);
app.use('/suggest-habits', aiRoutes);

module.exports = app;
