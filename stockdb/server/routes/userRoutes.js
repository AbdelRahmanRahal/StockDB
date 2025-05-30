const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require JWT)
router.get('/:id', authenticateToken, userController.getUserProfile);
router.put('/:id', authenticateToken, userController.updateUserProfile);

module.exports = router;