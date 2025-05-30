const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeOperation } = require('../middleware/authorizeMiddleware');
const { checkResourceOwnership, checkCustomerAccess, checkOrderAccess } = require('../middleware/resourceAccessMiddleware');

// Order routes

// Create a new order (Admin, Staff, Customer)
router.post('/', authenticateToken, authorizeOperation('order:create'), orderController.createOrder);

// Get all orders (Admin, Staff only)
router.get('/', authenticateToken, authorizeOperation('order:read'), orderController.getAllOrders);

// Get a specific order by ID (Admin, Staff can view any, Customer can view their own)
router.get('/:id', authenticateToken, authorizeOperation('order:read'), checkResourceOwnership('order'), orderController.getOrderById);

// Update an order (Admin, Staff only)
router.put('/:id', authenticateToken, authorizeOperation('order:update'), orderController.updateOrder);

// Delete an order (Admin, Staff only)
router.delete('/:id', authenticateToken, authorizeOperation('order:delete'), orderController.deleteOrder);

// Cancel an order (Admin, Staff, Customer - Customer can only cancel their own)
router.patch('/:id/cancel', authenticateToken, authorizeOperation('order:cancel'), checkResourceOwnership('order'), orderController.cancelOrder);

// Get orders for a specific customer (Admin, Staff can view any, Customer can view their own)
router.get('/customer/:customerId', authenticateToken, authorizeOperation('order:read'), checkCustomerAccess, orderController.getOrdersByCustomer);

module.exports = router; 