const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
// Import new authorization middleware functions
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkCustomerAccess } = require('../middleware/resourceAccessMiddleware');

// Register new user (Public route)
router.post('/register', userController.registerUser);

// Login user (Public route)
router.post('/login', userController.loginUser);

// Get all users (Admin/Staff only)
router.get('/', authenticateToken, authorizeOperation('user:read'), userController.getAllUsers);

// Get a specific user by ID (Admin/Staff can view any, Customer their own)
router.get('/:id', authenticateToken, authorizeOperation('user:read'), checkCustomerAccess, userController.getUserById);

// Update a user (Admin can update any, Staff/Customer their own)
router.put('/:id', authenticateToken, authorizeOperation('user:update'), checkCustomerAccess, userController.updateUser);

// Delete a user (Admin only)
router.delete('/:id', authenticateToken, authorizeOperation('user:delete'), userController.deleteUser);

// Additional user-related routes could be added here (e.g., password reset, profile updates)

module.exports = router;