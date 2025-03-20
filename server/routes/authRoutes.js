const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);

// Protected routes (only admin can register new users)
router.post('/register', protect, authorize('admin'), register);

module.exports = router;
