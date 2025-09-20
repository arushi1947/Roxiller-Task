// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const {
  addUser,
  addStore,
  getDashboard,
  getUsers,
  getUserById,
  getStores
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All admin routes require auth and admin role
router.post('/add-user', authMiddleware, roleMiddleware(['admin']), addUser);
router.post('/add-store', authMiddleware, roleMiddleware(['admin']), addStore);

router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), getDashboard);
router.get('/users', authMiddleware, roleMiddleware(['admin']), getUsers);
router.get('/users/:id', authMiddleware, roleMiddleware(['admin']), getUserById);

router.get('/stores', authMiddleware, roleMiddleware(['admin']), getStores);
router.get('/test', (req, res) => {
  res.send('Admin routes loaded!');
});

module.exports = router;
