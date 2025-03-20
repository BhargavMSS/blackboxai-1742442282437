require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import routes
const authRoutes = require('./routes/authRoutes');
const pawnRoutes = require('./routes/pawnRoutes');
const horticultureRoutes = require('./routes/horticultureRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/pawn', pawnRoutes);
app.use('/api/horticulture', horticultureRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Business Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
