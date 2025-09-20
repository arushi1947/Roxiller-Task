 const express = require('express');
const { signup, login, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Normal user signup
router.post('/signup', signup);

// Login for all roles
router.post('/login', login);

// Change password (requires login)
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;

