 // routes/storeRoutes.js
const express = require('express');
const router = express.Router();

const {
  getStores,
  getStoreById,
  submitRating,
  modifyRating
} = require('../controllers/storeController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Listing and details require authentication (so we can include user's rating)
router.get('/', authMiddleware, getStores);
router.get('/:id', authMiddleware, getStoreById);

// Rating endpoints - only for Normal Users
router.post('/:id/rating', authMiddleware, roleMiddleware(['user']), submitRating);
router.put('/:id/rating', authMiddleware, roleMiddleware(['user']), modifyRating);

module.exports = router;

