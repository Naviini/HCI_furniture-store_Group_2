const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  getAllUsers,
  deleteUser,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Admin-only routes
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;