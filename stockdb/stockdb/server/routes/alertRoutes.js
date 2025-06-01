const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkResourceOwnership, checkCustomerAccess } = require('../middleware/resourceAccessMiddleware');

// Alert routes

// Create a new alert (Admin, Staff only)
router.post('/', authenticateToken, authorizeOperation('alert:create'), alertController.createAlert);

// Get all alerts (Admin, Staff only)
router.get('/', authenticateToken, authorizeOperation('alert:read'), alertController.getAllAlerts);

// Get a specific alert by ID (Admin, Staff can view any, Customer/Supplier can view their own)
router.get('/:id', authenticateToken, authorizeOperation('alert:read'), checkResourceOwnership('alert'), alertController.getAlertById);

// Update an alert (Admin, Staff only)
router.put('/:id', authenticateToken, authorizeOperation('alert:update'), alertController.updateAlert);

// Delete an alert (Admin, Staff only)
router.delete('/:id', authenticateToken, authorizeOperation('alert:delete'), alertController.deleteAlert);

// Get alerts for a specific user (Admin, Staff can view any, Customer/Supplier can view their own)
router.get('/user/:userId', authenticateToken, authorizeOperation('alert:read'), checkCustomerAccess, alertController.getAlertsByUser);

// Mark alert as read (Customer, Supplier)
router.patch('/:id/read', authenticateToken, authorizeOperation('alert:update'), checkResourceOwnership('alert'), alertController.markAlertAsRead);

// Note: More complex alert routes and logic can be added later.

module.exports = router; 