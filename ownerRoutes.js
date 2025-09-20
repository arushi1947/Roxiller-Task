// routes/ownerRoutes.js
const express = require('express');
const router = express.Router();

const { getOwnerDashboard } = require('../controllers/ownerController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Only logged-in Store Owners can access
router.get('/dashboard', authMiddleware, roleMiddleware(['owner']), getOwnerDashboard);

module.exports = router;
