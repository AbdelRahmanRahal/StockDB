const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkCustomerAccess } = require('../middleware/resourceAccessMiddleware');

// Register new user (Public route)
router.post('/register', userController.register);

// Login user (Public route)
router.post('/login', userController.login);

// Get user profile (Admin/Staff can view any, Customer their own)
router.get('/:id', authenticateToken, authorizeOperation('user:read'), checkCustomerAccess, userController.getUserProfile);

// Update user profile (Admin can update any, Staff/Customer their own)
router.put('/:id', authenticateToken, authorizeOperation('user:update'), checkCustomerAccess, userController.updateUserProfile);

module.exports = router;